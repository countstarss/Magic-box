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
    const { labelsToAdd, labelsToRemove } = await req.json();

    const modifyRequest: any = {};
    if (labelsToAdd && labelsToAdd.length > 0) {
      modifyRequest.addLabelIds = labelsToAdd;
    }
    if (labelsToRemove && labelsToRemove.length > 0) {
      modifyRequest.removeLabelIds = labelsToRemove;
    }

    const response = await gmail.users.messages.modify({
      userId: 'me',
      id: emailId,
      requestBody: modifyRequest,
    });

    return NextResponse.json({ message: 'Labels modified successfully', data: response.data }, { status: 200 });
  } catch (error: any) {
    console.error('Error modifying labels:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 