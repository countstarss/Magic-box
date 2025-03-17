import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/emails/search - Search for emails
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
    const query = url.searchParams.get('q') || '';
    const folder = url.searchParams.get('folder');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const accountId = url.searchParams.get('accountId');
    
    // If no query, return empty results
    if (!query.trim()) {
      return NextResponse.json({
        emails: [],
        pagination: {
          total: 0,
          limit,
          offset,
        },
      });
    }

    // Build search conditions
    const where: any = {
      OR: [
        { subject: { contains: query, mode: 'insensitive' } },
        { body: { contains: query, mode: 'insensitive' } },
      ],
      account: {
        userId: user.id,
      }
    };
    
    // Add folder filter if specified
    if (folder) {
      where.folder = folder;
    }
    
    // Add account filter if specified
    if (accountId) {
      where.accountId = accountId;
    }

    // Get total count
    const total = await prisma.email.count({
      where,
    });

    // Get search results
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
    console.error('Error searching emails:', error);
    return NextResponse.json(
      { error: 'Failed to search emails' },
      { status: 500 }
    );
  }
} 