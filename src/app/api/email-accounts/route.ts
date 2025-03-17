import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/email-accounts - Get all email accounts for the current user
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

    const emailAccounts = await prisma.emailAccount.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(emailAccounts);
  } catch (error) {
    console.error('Error fetching email accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email accounts' },
      { status: 500 }
    );
  }
}

// POST /api/email-accounts - Create a new email account connection
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
    const { provider, providerAccountId, accessToken, refreshToken, expiresAt } = data;

    if (!provider || !providerAccountId || !accessToken) {
      return NextResponse.json(
        { error: 'Provider, providerAccountId, and accessToken are required' },
        { status: 400 }
      );
    }

    // Check if this is the first account for the user (should be default)
    const existingAccounts = await prisma.emailAccount.count({
      where: { userId: user.id },
    });

    const isDefault = existingAccounts === 0;

    const emailAccount = await prisma.emailAccount.create({
      data: {
        provider,
        providerAccountId,
        accessToken,
        refreshToken,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        userId: user.id,
        isDefault,
      },
    });

    return NextResponse.json(emailAccount, { status: 201 });
  } catch (error) {
    console.error('Error creating email account:', error);
    return NextResponse.json(
      { error: 'Failed to create email account' },
      { status: 500 }
    );
  }
} 