import { NextResponse } from "next/server";
import { enhancedMailService } from "@/lib/server/mail-service-enhanced";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");
  const unread = searchParams.get("unread") === "true";

  try {
    console.log(
      `[API] 获取邮件: limit=${limit}, offset=${offset}, unread=${unread}`
    );

    // 使用增强版邮件服务
    const data = await enhancedMailService.getEmails({
      limit,
      offset,
      unread,
    });

    console.log(`[API] 成功获取邮件: ${data.data?.length || 0}封`);

    // 直接返回API的响应，保持数据结构与前端期望的一致
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API] 获取邮件出错:", error);
    return NextResponse.json(
      {
        error: "获取邮件失败",
        message: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 }
    );
  }
}
