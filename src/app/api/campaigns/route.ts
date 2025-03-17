import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, CampaignStatus } from '@prisma/client';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/campaigns - Get email campaigns
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
    const status = url.searchParams.get('status') as CampaignStatus | null;
    
    // Build where clause
    const where: any = {
      userId: user.id,
    };
    
    // Filter by status if specified
    if (status) {
      where.status = status;
    }

    const campaigns = await prisma.emailCampaign.findMany({
      where,
      include: {
        template: {
          select: {
            id: true,
            name: true,
            subject: true,
          },
        },
        analyticsData: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Error fetching email campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email campaigns' },
      { status: 500 }
    );
  }
}

// POST /api/campaigns - Create a new email campaign
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
    const { name, description, templateId, recipients, scheduledTime } = data;

    if (!name || !templateId || !recipients || !recipients.length) {
      return NextResponse.json(
        { error: 'Name, templateId, and recipients are required' },
        { status: 400 }
      );
    }

    // Verify template belongs to user
    const template = await prisma.emailTemplate.findUnique({
      where: {
        id: templateId,
        OR: [
          { userId: user.id },
          { isPublic: true },
        ],
      },
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // If scheduledTime is provided, validate that it's in the future
    if (scheduledTime) {
      const scheduledDate = new Date(scheduledTime);
      const now = new Date();
      if (scheduledDate <= now) {
        return NextResponse.json(
          { error: 'Scheduled time must be in the future' },
          { status: 400 }
        );
      }
    }

    // Create campaign
    const campaign = await prisma.emailCampaign.create({
      data: {
        name,
        description,
        templateId,
        recipients,
        scheduledTime: scheduledTime ? new Date(scheduledTime) : null,
        status: scheduledTime ? CampaignStatus.SCHEDULED : CampaignStatus.DRAFT,
        userId: user.id,
        analyticsData: {
          create: {},
        },
      },
      include: {
        template: {
          select: {
            id: true,
            name: true,
            subject: true,
          },
        },
        analyticsData: true,
      },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error('Error creating email campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create email campaign' },
      { status: 500 }
    );
  }
} 