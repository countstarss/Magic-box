import { NextResponse } from "next/server";
import { getEmail } from "@/lib/mail";

// 请求计数器，用于在开发模式下检测重复请求
const requestCounts: Record<string, number> = {};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 确保params是可用的
  if (!params || typeof params.id !== "string") {
    return NextResponse.json({ error: "邮件ID无效" }, { status: 400 });
  }

  const emailId = await params.id;

  // 在开发模式下记录请求
  if (process.env.NODE_ENV === "development") {
    requestCounts[emailId] = (requestCounts[emailId] || 0) + 1;
    console.log(`[API] 邮件详情请求 #${requestCounts[emailId]}: ${emailId}`);
  }

  try {
    console.log(`[API] 获取邮件详情: id=${emailId}`);

    // 使用新的邮件服务
    const message = await getEmail(emailId);

    if (!message) {
      return NextResponse.json({ error: "邮件不存在" }, { status: 404 });
    }

    console.log(`[API] 成功获取邮件详情: id=${emailId}`);

    // 创建响应对象
    const response = NextResponse.json(message);

    // 添加缓存控制头 - 缓存10分钟
    response.headers.set("Cache-Control", "public, max-age=600");
    response.headers.set("X-Email-Id", emailId);

    // 返回响应
    return response;
  } catch (error) {
    console.error("[API] 获取邮件详情出错:", error);
    return NextResponse.json(
      {
        error: "获取邮件详情失败",
        message: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 }
    );
  }
}
