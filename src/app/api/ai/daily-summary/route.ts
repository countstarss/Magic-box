import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/ai/daily-summary - Get a daily summary of emails
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

    // Get date range (default to last 24 hours)
    const url = new URL(req.url);
    const startDateParam = url.searchParams.get('startDate');
    const endDateParam = url.searchParams.get('endDate');
    
    const endDate = endDateParam ? new Date(endDateParam) : new Date();
    const startDate = startDateParam 
      ? new Date(startDateParam) 
      : new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
    
    // Get emails for the time period
    const emails = await prisma.email.findMany({
      where: {
        account: {
          userId: user.id,
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // In a real implementation, this would use AI to analyze and summarize emails
    // For demonstration, we'll create a simple summary
    
    // Group by sender
    const senderGroups: Record<string, any[]> = {};
    emails.forEach(email => {
      if (!senderGroups[email.sender]) {
        senderGroups[email.sender] = [];
      }
      senderGroups[email.sender].push(email);
    });

    // Create summary
    const summary = {
      period: {
        startDate,
        endDate,
      },
      totalEmails: emails.length,
      categories: {
        important: emails.filter(e => e.labels.includes('important')).length,
        unread: emails.filter(e => e.status === 'UNREAD').length,
        sentByMe: emails.filter(e => e.folder === 'SENT').length,
      },
      topSenders: Object.entries(senderGroups)
        .map(([sender, emails]) => ({
          sender,
          count: emails.length,
          subjects: emails.map(e => e.subject).slice(0, 3), // Just include first 3 subjects
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      actionItems: emails
        .filter(e => e.status === 'UNREAD' && e.folder === 'INBOX')
        .slice(0, 5)
        .map(e => ({
          id: e.id,
          subject: e.subject,
          sender: e.sender,
          receivedAt: e.createdAt,
        })),
    };

    return NextResponse.json({
      summary,
      dateRange: {
        startDate,
        endDate,
      },
    });
  } catch (error) {
    console.error('Error generating daily summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate daily summary' },
      { status: 500 }
    );
  }
} 