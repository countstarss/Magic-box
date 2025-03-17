import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/tasks/[id] - Get a specific task
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const task = await prisma.task.findUnique({
      where: {
        id: params.id,
        userId: user.id,
      },
      include: {
        relatedEmail: {
          select: {
            id: true,
            subject: true,
            sender: true,
            createdAt: true,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

// PATCH /api/tasks/[id] - Update a task
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check task ownership
    const task = await prisma.task.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!task || task.userId !== user.id) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const data = await req.json();
    const { title, description, status, priority, dueDate } = data;

    const updatedTask = await prisma.task.update({
      where: {
        id: params.id,
      },
      data: {
        title: title || undefined,
        description: description !== undefined ? description : undefined,
        status: status || undefined,
        priority: priority || undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
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

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check task ownership
    const task = await prisma.task.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!task || task.userId !== user.id) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    await prisma.task.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
} 