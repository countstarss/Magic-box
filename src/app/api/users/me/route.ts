import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/users/me - Get current user
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database or create if doesn't exist
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        emailAccounts: {
          select: {
            id: true,
            provider: true,
            isDefault: true,
          }
        },
        emailAliases: true,
      }
    });

    // If user doesn't exist, create
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || null,
        },
        include: {
          emailAccounts: true,
          emailAliases: true,
        }
      });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      emailAccounts: user.emailAccounts,
      emailAliases: user.emailAliases,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}

// PATCH /api/users/me - Update current user
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { name } = data;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { name },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
} 