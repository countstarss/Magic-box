import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  // 如果没有授权码，返回错误
  if (!code) {
    console.error('No code in callback');
    return NextResponse.redirect(
      `${requestUrl.origin}/auth?error=无法完成认证，请重试`
    );
  }

  try {
    // 创建一个supabase客户端用于处理授权
    const supabase = createRouteHandlerClient({ cookies });

    // 确认OAuth身份验证，将授权码交换为会话
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Error exchanging code for session:', error);
      return NextResponse.redirect(
        `${requestUrl.origin}/auth?error=${encodeURIComponent(error.message)}`
      );
    }

    // 获取当前会话
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      console.log('User authenticated:', session.user.id);
      
      // 检查用户是否有 Gmail 相关的令牌信息
      const hasGmailAccess = session.provider_token && session.provider_refresh_token;
      
      if (hasGmailAccess) {
        console.log('User has Gmail access');
        
        // 可以保存Gmail访问令牌到email_accounts表
        try {
          const { error: accountError } = await supabase
            .from('email_accounts')
            .upsert({
              user_id: session.user.id,
              provider: 'gmail',
              access_token: session.provider_token,
              refresh_token: session.provider_refresh_token,
              // Supabase OAuth 不会直接提供过期时间，设置一个默认值
              expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
              is_default: true,
            });
            
          if (accountError) {
            console.error('Error saving email account:', accountError);
          }
        } catch (e) {
          console.error('Error processing Gmail tokens:', e);
        }
      }
    }

    // 重定向到成功页面（通常是应用的邮件页面）
    return NextResponse.redirect(`${requestUrl.origin}/mail?auth=success`);
  } catch (error: any) {
    console.error('Error in auth callback:', error);
    return NextResponse.redirect(
      `${requestUrl.origin}/auth?error=${encodeURIComponent(error.message || '认证过程中出错，请重试')}`
    );
  }
} 