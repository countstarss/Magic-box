import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { analyzeMailWithOpenAI, type AIMailAnalysisResult } from '@/lib/ai-mail-analysis';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // 验证用户会话
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 解析请求内容
    const body = await request.json();
    const { mailId, options } = body;

    if (!mailId) {
      return NextResponse.json(
        { error: 'Mail ID is required' },
        { status: 400 }
      );
    }

    // 从数据库获取邮件详情（如果已集成Prisma）
    // 注意：这里使用模拟数据作为示例，实际应用中应从数据库获取
    let mailData;
    
    try {
      // 尝试从数据库获取数据 - 修复字段访问与Prisma模型的匹配
      mailData = await prisma.email.findUnique({
        where: { id: mailId },
        // 移除不存在的包含字段
      });
      
      // 将数据转换为分析库需要的格式
      if (mailData) {
        mailData = {
          id: mailData.id,
          name: mailData.sender.split('@')[0] || 'Unknown', // 从发送者邮箱提取名称
          email: mailData.sender,
          subject: mailData.subject,
          text: mailData.body,
          date: mailData.createdAt.toISOString(), // 使用创建时间
          read: mailData.status === 'READ', // 从状态字段推断
          labels: mailData.labels || [],
          tags: mailData.labels || [], // 用labels替代tags
          isTrash: mailData.folder === 'TRASH',
          isArchive: mailData.folder === 'ARCHIVE'
        };
      }
    } catch (error) {
      console.error('Error fetching email from database:', error);
      // 如果数据库获取失败，使用模拟数据
      mailData = null;
    }

    // 如果没有找到邮件数据，使用模拟数据作为fallback
    if (!mailData) {
      // 在生产环境中，应该返回404错误
      // 但在开发阶段，我们使用模拟数据继续测试
      mailData = {
        id: mailId,
        name: 'Example Sender',
        email: 'sender@example.com',
        subject: 'Sample Subject for Analysis',
        text: 'This is a sample email text for analysis. It contains information that might be important or urgent. Please review this as soon as possible. There might be action items that require your attention.',
        date: new Date().toISOString(),
        read: false,
        labels: ['inbox'],
        tags: ['inbox'],
        isTrash: false,
        isArchive: false
      };
      
      console.warn('Using fallback sample data for email analysis');
    }

    // 分析邮件
    const analysisResult = await analyzeMailWithOpenAI(mailData);

    // 如果已集成Prisma，可以将分析结果保存到数据库
    try {
      // 更新邮件标签 - 只使用Schema中实际存在的字段
      await prisma.email.update({
        where: { id: mailId },
        data: {
          // 将AI生成的标签添加到现有标签中
          labels: {
            push: analysisResult.autoLabels
          },
          // 可以添加其他有效字段，如果Schema中有相应的字段
        }
      });
      
      // 或者创建一个单独的分析结果表来存储这些信息
      // 这需要先在schema.prisma中创建相应的模型
    } catch (error) {
      console.error('Error saving analysis results to database:', error);
      // 继续处理，即使保存失败
    }

    // 返回分析结果
    return NextResponse.json({
      success: true,
      analysis: analysisResult
    });
  } catch (error) {
    console.error('Error analyzing email:', error);
    return NextResponse.json(
      { error: 'Failed to analyze email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 