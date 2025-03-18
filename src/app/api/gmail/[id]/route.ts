import { google } from 'googleapis';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

interface RequestContext {
  params: { id: string };
}

export async function GET(req: Request, context: RequestContext) {
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
    const email = await gmail.users.messages.get({
      userId: 'me',
      id: emailId,
      format: 'full', // You can adjust the format as needed (raw, metadata, minimal, full)
    });

    return NextResponse.json({ email: email.data }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching email details:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 