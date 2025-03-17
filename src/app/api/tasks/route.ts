import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/tasks - Get tasks for the current user
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
    const status = url.searchParams.get('status');
    const priority = url.searchParams.get('priority');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    
    // Build where clause
    const where: any = {
      userId: user.id,
    };
    
    // Add filters if specified
    if (status) {
      where.status = status;
    }
    
    if (priority) {
      where.priority = priority;
    }

    // Get total count
    const total = await prisma.task.count({
      where,
    });

    // Get tasks
    const tasks = await prisma.task.findMany({
      where,
      include: {
        relatedEmail: {
          select: {
            id: true,
            subject: true,
          },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
      skip: offset,
      take: limit,
    });

    return NextResponse.json({
      tasks,
      pagination: {
        total,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create a new task
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
    const { title, description, emailId, priority, dueDate } = data;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // If emailId is provided, verify it belongs to user
    if (emailId) {
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
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        emailId,
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: user.id,
      },
      include: {
        relatedEmail: {
          select: {
            id: true,
            subject: true,
          },
        },
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
} 