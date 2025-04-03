import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import { google } from "googleapis";

export async function GET(request: Request) {
  // 从URL获取授权码和state
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // 调试信息
  console.log("Gmail callback received:", { 
    hasCode: !!code, 
    hasState: !!state, 
    error 
  });

  // 处理授权错误
  if (error) {
    console.error("Google授权错误:", error);
    return NextResponse.redirect(new URL("/auth?error=google_auth_failed&details=" + encodeURIComponent(error), request.url));
  }

  // 缺少授权码
  if (!code) {
    console.error("未收到授权码");
    return NextResponse.redirect(new URL("/auth?error=no_code", request.url));
  }

  try {
    // 获取Google OAuth配置
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    
    // 确保回调URI与授权请求中使用的完全相同
    const redirectUri = new URL("/api/auth/gmail/callback", request.url).toString();

    // 调试日志
    console.log("Token Exchange Params:", {
      clientIdExists: !!clientId,
      clientSecretPartial: clientSecret ? clientSecret.substring(0, 5) + "..." : null,
      redirectUri: redirectUri,
      codePartial: code ? code.substring(0, 10) + "..." : null
    });

    if (!clientId || !clientSecret) {
      console.error("缺少OAuth配置:", { clientId: !!clientId, clientSecret: !!clientSecret });
      return NextResponse.redirect(new URL("/auth?error=missing_oauth_config", request.url));
    }

    // 与Google交换授权码获取访问令牌
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("获取访问令牌失败:", errorText);
      return NextResponse.redirect(
        new URL(`/auth?error=token_exchange_failed&details=${encodeURIComponent(errorText)}`, 
        request.url)
      );
    }

    // 解析令牌响应
    const tokenData = await tokenResponse.json();
    console.log("Token obtained successfully:", { 
      hasAccessToken: !!tokenData.access_token,
      hasRefreshToken: !!tokenData.refresh_token,
      expiresIn: tokenData.expires_in
    });
    
    // 获取当前登录用户
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      console.error("未登录用户无法保存Gmail授权");
      return NextResponse.redirect(new URL("/auth?error=not_authenticated", request.url));
    }

    // 测试获取一些邮件以验证令牌工作正常
    try {
      const gmail = google.gmail({ 
        version: 'v1', 
        auth: tokenData.access_token 
      });
      
      const mailResponse = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 5,
      });
      
      console.log("Successfully fetched emails:", { 
        hasMessages: !!mailResponse.data.messages,
        messageCount: mailResponse.data.messages?.length || 0
      });
    } catch (mailError) {
      console.error("测试Gmail API失败:", mailError);
      // 不中断授权流程，继续保存令牌
    }
    
    // 将Gmail令牌保存到数据库
    const { error: saveError } = await supabase
      .from("email_accounts")
      .upsert({
        user_id: session.user.id,
        provider: "gmail",
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token || null,
        expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
        is_default: true,
      });
      
    if (saveError) {
      console.error("保存Gmail授权信息失败:", saveError);
      return NextResponse.redirect(new URL("/auth?error=save_tokens_failed", request.url));
    }

    // 设置cookie以便客户端脚本知道刚刚完成了Gmail授权
    const cookieStore = cookies();
    cookieStore.set("gmail_authorized", "true", { 
      path: "/",
      maxAge: 30, // 30秒足够用于客户端检测
      httpOnly: false // 允许客户端脚本读取
    });

    // 授权成功，重定向到邮件应用页面
    return NextResponse.redirect(new URL("/mail?success=gmail_connected", request.url));
    
  } catch (error: any) {
    console.error("Gmail授权过程中出错:", error);
    const errorMessage = error?.message || "Unknown error";
    return NextResponse.redirect(
      new URL(`/auth?error=oauth_process_failed&details=${encodeURIComponent(errorMessage)}`, 
      request.url)
    );
  }
} 