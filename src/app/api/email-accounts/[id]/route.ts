import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/email-accounts/[id] - Get a specific email account
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

    const emailAccount = await prisma.emailAccount.findUnique({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!emailAccount) {
      return NextResponse.json({ error: 'Email account not found' }, { status: 404 });
    }

    return NextResponse.json(emailAccount);
  } catch (error) {
    console.error('Error fetching email account:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email account' },
      { status: 500 }
    );
  }
}

// PATCH /api/email-accounts/[id] - Update an email account
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

    const data = await req.json();
    const { accessToken, refreshToken, expiresAt, isDefault } = data;

    // Get account and verify ownership
    const emailAccount = await prisma.emailAccount.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!emailAccount || emailAccount.userId !== user.id) {
      return NextResponse.json({ error: 'Email account not found' }, { status: 404 });
    }

    // If setting this account as default, unset others
    if (isDefault) {
      await prisma.emailAccount.updateMany({
        where: {
          userId: user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const updatedEmailAccount = await prisma.emailAccount.update({
      where: {
        id: params.id,
      },
      data: {
        accessToken: accessToken || undefined,
        refreshToken: refreshToken || undefined,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        isDefault: isDefault || undefined,
      },
    });

    return NextResponse.json(updatedEmailAccount);
  } catch (error) {
    console.error('Error updating email account:', error);
    return NextResponse.json(
      { error: 'Failed to update email account' },
      { status: 500 }
    );
  }
}

// DELETE /api/email-accounts/[id] - Delete an email account
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

    // Get account and verify ownership
    const emailAccount = await prisma.emailAccount.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!emailAccount || emailAccount.userId !== user.id) {
      return NextResponse.json({ error: 'Email account not found' }, { status: 404 });
    }

    // Delete the account
    await prisma.emailAccount.delete({
      where: {
        id: params.id,
      },
    });

    // If this was the default account, set another one as default if available
    if (emailAccount.isDefault) {
      const nextAccount = await prisma.emailAccount.findFirst({
        where: {
          userId: user.id,
        },
      });

      if (nextAccount) {
        await prisma.emailAccount.update({
          where: {
            id: nextAccount.id,
          },
          data: {
            isDefault: true,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting email account:', error);
    return NextResponse.json(
      { error: 'Failed to delete email account' },
      { status: 500 }
    );
  }
} 