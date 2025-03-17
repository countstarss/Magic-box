import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, TemplateCategory } from '@prisma/client';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/templates - Get email templates
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
    const category = url.searchParams.get('category') as TemplateCategory | null;
    const includePublic = url.searchParams.get('includePublic') === 'true';
    
    // Build where clause
    const where: any = {
      OR: [
        { userId: user.id }, // User's own templates
      ],
    };
    
    // Include public templates if requested
    if (includePublic) {
      where.OR.push({ isPublic: true });
    }
    
    // Filter by category if specified
    if (category) {
      where.category = category;
    }

    const templates = await prisma.emailTemplate.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email templates' },
      { status: 500 }
    );
  }
}

// POST /api/templates - Create a new email template
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
    const { name, subject, body, category, isPublic } = data;

    if (!name || !subject || !body || !category) {
      return NextResponse.json(
        { error: 'Name, subject, body, and category are required' },
        { status: 400 }
      );
    }

    // Validate category
    if (!Object.values(TemplateCategory).includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    const template = await prisma.emailTemplate.create({
      data: {
        name,
        subject,
        body,
        category,
        isPublic: isPublic || false,
        userId: user.id,
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Error creating email template:', error);
    return NextResponse.json(
      { error: 'Failed to create email template' },
      { status: 500 }
    );
  }
} 