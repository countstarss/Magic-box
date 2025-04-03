import { NextRequest, NextResponse } from "next/server";
import { mails } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    // First check the session
    const session = await supabase.auth.getSession()
    
    if (!session?.data?.session?.user?.email) {
      // If no authenticated user, return mocks for demo purposes
      const mockMail = mails.find(mail => mail.id === id);
      
      if (!mockMail) {
        return NextResponse.json({ error: 'Email not found' }, { status: 404 });
      }
      
      return NextResponse.json(mockMail);
    }
    
    // If authenticated, try to get the real email from the database
    const user = await prisma.user.findUnique({
      where: { email: session.data.session.user.email },
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Find the email in the database
    const email = await prisma.email.findUnique({
      where: {
        id,
      },
      include: {
        attachments: true,
        analyticsData: true,
      },
    });
    
    if (!email) {
      // If not found in database, fallback to mocks for demo
      const mockMail = mails.find(mail => mail.id === id);
      
      if (!mockMail) {
        return NextResponse.json({ error: 'Email not found' }, { status: 404 });
      }
      
      return NextResponse.json(mockMail);
    }
    
    // Format the email data
    const formattedEmail = {
      id: email.id,
      subject: email.subject,
      body: email.body,
      htmlBody: email.htmlBody,
      sender: email.sender,
      recipients: email.recipients,
      ccRecipients: email.ccRecipients,
      bccRecipients: email.bccRecipients,
      date: email.createdAt.toISOString(),
      read: email.status !== 'UNREAD',
      folder: email.folder.toLowerCase(),
      labels: email.labels,
      attachments: email.attachments.map((attachment: any) => ({
        id: attachment.id,
        filename: attachment.filename,
        mimeType: attachment.mimeType,
        size: attachment.size,
        url: attachment.url,
      })),
      analytics: email.analyticsData ? {
        openCount: email.analyticsData.openCount,
        clickCount: email.analyticsData.clickCount,
        firstOpenedAt: email.analyticsData.firstOpenedAt,
        lastOpenedAt: email.analyticsData.lastOpenedAt,
      } : null,
    };
    
    return NextResponse.json(formattedEmail);
  } catch (error) {
    console.error('Error fetching email:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email' },
      { status: 500 }
    );
  }
} 