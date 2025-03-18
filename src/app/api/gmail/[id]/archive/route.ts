import { google } from 'googleapis';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

interface RequestContext {
  params: { id: string };
}

export async function POST(req: Request, context: RequestContext) {
  const session = await auth();
  const emailId = context.params.id;

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const accessToken = (session.user as any).accessToken;

  if (!accessToken) {
    return NextResponse.json({ error: 'No access token' }, { status: 401 });
  }

  const gmail = google.gmail({ version: 'v1', auth: accessToken });

  try {
    await gmail.users.messages.modify({
      userId: 'me',
      id: emailId,
      requestBody: {
        removeLabelIds: ['INBOX'],
      },
    });

    return NextResponse.json({ message: 'Email archived successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error archiving email:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 