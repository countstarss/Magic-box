import { NextRequest, NextResponse } from "next/server";

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

    // 服务器端不支持IndexedDB，返回错误信息
    return NextResponse.json(
      {
        error: "服务器端不支持IndexedDB API，请在客户端直接访问模板数据",
        statusCode: 500,
        serverSideProcessing: false,
      },
      { status: 500 }
    );
  } catch (error) {
    console.error("获取模板详情失败:", error);
    return NextResponse.json({ error: "获取模板详情失败" }, { status: 500 });
  }
}
