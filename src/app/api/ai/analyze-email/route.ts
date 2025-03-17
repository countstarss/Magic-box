import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, TaskPriority } from '@prisma/client';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

// POST /api/ai/analyze-email - Analyze an email and generate tasks
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
    const { emailId } = data;

    if (!emailId) {
      return NextResponse.json(
        { error: 'Email ID is required' },
        { status: 400 }
      );
    }

    // Get the email
    const email = await prisma.email.findUnique({
      where: {
        id: emailId,
        account: {
          userId: user.id,
        },
      },
    });

    if (!email) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    // In a real implementation, this would call an AI service to analyze the email
    // For demonstration, we'll create a simple task based on the email subject
    const analysisResult = {
      summary: `This is an email about "${email.subject}"`,
      actionItems: [
        {
          title: `Respond to: ${email.subject}`,
          priority: TaskPriority.HIGH,
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Due in 24 hours
        },
      ],
      sentiment: 'neutral',
      categories: ['work', 'needs-response'],
    };

    // Create a task based on the analysis
    const tasks = await Promise.all(
      analysisResult.actionItems.map(async (item) => {
        return prisma.task.create({
          data: {
            title: item.title,
            description: `Auto-generated from email analysis: ${analysisResult.summary}`,
            priority: item.priority,
            dueDate: item.dueDate,
            userId: user.id,
            emailId: email.id,
          },
        });
      })
    );

    return NextResponse.json({
      analysis: analysisResult,
      tasksCreated: tasks,
    });
  } catch (error) {
    console.error('Error analyzing email:', error);
    return NextResponse.json(
      { error: 'Failed to analyze email' },
      { status: 500 }
    );
  }
} 