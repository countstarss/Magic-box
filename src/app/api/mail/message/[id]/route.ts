import { NextResponse } from "next/server";
import { enhancedMailService } from "@/lib/server/mail-service-enhanced";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const emailId = params.id;

  if (!emailId) {
    return NextResponse.json({ error: "邮件ID缺失" }, { status: 400 });
  }

  try {
    console.log(`[API] 获取邮件详情: id=${emailId}`);

    // 使用增强版邮件服务
    const message = await enhancedMailService.getEmail(emailId);

    console.log(`[API] 成功获取邮件详情: id=${emailId}`);

    // 直接返回API的响应，保持数据结构与前端期望的一致
    return NextResponse.json(message);
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
