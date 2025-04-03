import { google } from 'googleapis';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  // 从请求头中获取访问令牌
  const authHeader = req.headers.get('authorization');
  let accessToken: string | undefined;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    accessToken = authHeader.substring(7);
  }
  
  // 如果没有提供令牌，则从当前会话中获取
  if (!accessToken) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }
    
    // 从数据库获取当前用户的Gmail访问令牌
    const { data: account, error } = await supabase
      .from('email_accounts')
      .select('access_token')
      .eq('user_id', session.user.id)
      .eq('provider', 'gmail')
      .single();
      
    if (error || !account) {
      return NextResponse.json({ error: '未找到Gmail授权信息' }, { status: 404 });
    }
    
    accessToken = account.access_token;
  }

  // 使用令牌访问Gmail API
  const gmail = google.gmail({ 
    version: 'v1', 
    auth: accessToken 
  });

  try {
    // 获取查询参数
    const url = new URL(req.url);
    const maxResults = parseInt(url.searchParams.get('maxResults') || '10');
    const labelIds = url.searchParams.get('labelIds')?.split(',') || ['INBOX'];
    const q = url.searchParams.get('q') || '';
    
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: maxResults,
      labelIds: labelIds,
      q: q
    });

    const messages = response.data.messages || [];

    if (messages.length === 0) {
      return NextResponse.json({ emails: [] }, { status: 200 });
    }

    // 获取邮件详情（批量请求以提高性能）
    const emailList = await Promise.all(
      messages.map(async (message) => {
        const email = await gmail.users.messages.get({
          userId: 'me',
          id: message.id!,
          format: 'full',
        });
        return email.data;
      })
    );

    return NextResponse.json({ 
      emails: emailList,
      nextPageToken: response.data.nextPageToken 
    }, { status: 200 });
  } catch (error: any) {
    console.error('获取Gmail邮件失败:', error);
    
    // 检查是否是授权错误
    if (error.code === 401 || error.message?.includes('invalid_token')) {
      return NextResponse.json({ error: '授权已过期，请重新授权Gmail' }, { status: 401 });
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 