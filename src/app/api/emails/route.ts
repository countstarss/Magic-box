import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/emails - Get emails for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get query parameters
    const url = new URL(req.url);
    const folder = url.searchParams.get('folder') || 'INBOX';
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const accountId = url.searchParams.get('accountId');
    
    // Build where clause
    const where: any = {
      folder: folder,
      account: {
        userId: user.id,
      }
    };
    
    // Add account filter if specified
    if (accountId) {
      where.accountId = accountId;
    }

    // Get total count
    const total = await prisma.email.count({
      where,
    });

    // Get emails
    const emails = await prisma.email.findMany({
      where,
      include: {
        attachments: true,
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        analyticsData: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: offset,
      take: limit,
    });

    return NextResponse.json({
      emails,
      pagination: {
        total,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}

// POST /api/emails - Send a new email
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const data = await req.json();
    const { 
      subject, 
      body, 
      htmlBody, 
      recipients, 
      ccRecipients, 
      bccRecipients, 
      accountId,
      attachments,
      parentEmailId,
      threadId,
      scheduledSendTime,
    } = data;

    // Validation
    if (!subject || !body || !recipients || !recipients.length || !accountId) {
      return NextResponse.json(
        { error: 'Subject, body, recipients, and accountId are required' },
        { status: 400 }
      );
    }

    // Verify account belongs to user
    const account = await prisma.emailAccount.findUnique({
      where: {
        id: accountId,
        userId: user.id,
      },
    });

    if (!account) {
      return NextResponse.json({ error: 'Email account not found' }, { status: 404 });
    }

    // If scheduledSendTime is provided, validate that it's in the future
    if (scheduledSendTime) {
      const scheduledDate = new Date(scheduledSendTime);
      const now = new Date();
      if (scheduledDate <= now) {
        return NextResponse.json(
          { error: 'Scheduled send time must be in the future' },
          { status: 400 }
        );
      }
    }

    // In a real implementation, this would integrate with Nylas API to send the email
    // For now, we'll just create the email record
    const email = await prisma.email.create({
      data: {
        subject,
        body,
        htmlBody,
        sender: user.email,
        recipients,
        ccRecipients: ccRecipients || [],
        bccRecipients: bccRecipients || [],
        threadId,
        parentEmailId,
        folder: 'SENT',
        accountId,
        // Create attachments if provided
        attachments: attachments ? {
          createMany: {
            data: attachments.map((attachment: any) => ({
              filename: attachment.filename,
              mimeType: attachment.mimeType,
              size: attachment.size,
              url: attachment.url,
            })),
          },
        } : undefined,
      },
      include: {
        attachments: true,
      },
    });

    // Create email analytics record
    await prisma.emailAnalytics.create({
      data: {
        emailId: email.id,
      },
    });

    return NextResponse.json(email, { status: 201 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 