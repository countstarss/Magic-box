import { google } from 'googleapis';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

interface RequestContext {
  params: { id: string };
}

export async function POST(req: Request, context: RequestContext) {
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
    
    // 从数据库获取Gmail账户信息
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

  const emailId = context.params.id;
  const gmail = google.gmail({ version: 'v1', auth: accessToken });

  try {
    await gmail.users.messages.modify({
      userId: 'me',
      id: emailId,
      requestBody: {
        removeLabelIds: ['UNREAD'],
      },
    });

    return NextResponse.json({ message: 'Email marked as read successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error marking email as read:', error);
    
    // 检查是否是授权错误
    if (error.code === 401 || error.message?.includes('invalid_token')) {
      return NextResponse.json({ error: '授权已过期，请重新授权Gmail' }, { status: 401 });
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 