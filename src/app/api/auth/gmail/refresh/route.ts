import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    // 获取当前用户
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      );
    }
    
    // 从数据库获取Gmail账户信息
    const { data: accounts, error: fetchError } = await supabase
      .from("email_accounts")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("provider", "gmail")
      .single();
      
    if (fetchError || !accounts) {
      return NextResponse.json(
        { error: "未找到Gmail账户信息" },
        { status: 404 }
      );
    }
    
    // 检查是否有刷新令牌
    if (!accounts.refresh_token) {
      return NextResponse.json(
        { error: "缺少刷新令牌，请重新授权Gmail" },
        { status: 400 }
      );
    }
    
    // 获取环境变量
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    
    // 使用刷新令牌获取新的访问令牌
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId!,
        client_secret: clientSecret!,
        refresh_token: accounts.refresh_token,
        grant_type: "refresh_token",
      }),
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("刷新访问令牌失败:", errorText);
      return NextResponse.json(
        { error: "刷新访问令牌失败" },
        { status: 500 }
      );
    }
    
    // 解析响应
    const tokenData = await tokenResponse.json();
    
    // 更新数据库中的令牌信息
    const { error: updateError } = await supabase
      .from("email_accounts")
      .update({
        access_token: tokenData.access_token,
        expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
        // 如果响应中包含新的刷新令牌，则更新它
        ...(tokenData.refresh_token && { refresh_token: tokenData.refresh_token }),
      })
      .eq("id", accounts.id);
      
    if (updateError) {
      console.error("更新访问令牌失败:", updateError);
      return NextResponse.json(
        { error: "更新访问令牌失败" },
        { status: 500 }
      );
    }
    
    // 返回新的令牌信息
    return NextResponse.json({
      message: "访问令牌已刷新",
      expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
    });
    
  } catch (error) {
    console.error("刷新Gmail令牌过程中出错:", error);
    return NextResponse.json(
      { error: "刷新Gmail令牌过程中出错" },
      { status: 500 }
    );
  }
} 