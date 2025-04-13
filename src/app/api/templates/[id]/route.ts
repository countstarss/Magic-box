import { NextRequest, NextResponse } from "next/server";
import { templateDb } from "@/lib/db/template-db";

// GET /api/templates/[id] - 获取单个模板的详细信息
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const realParams = await params;
    const id = parseInt(realParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "无效的模板ID" }, { status: 400 });
    }

    // 从数据库中获取模板
    const template = await templateDb.getTemplate(id);

    if (!template) {
      return NextResponse.json({ error: "未找到模板" }, { status: 404 });
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error("获取模板详情失败:", error);
    return NextResponse.json({ error: "获取模板详情失败" }, { status: 500 });
  }
}
