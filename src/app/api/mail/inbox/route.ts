import { NextResponse } from "next/server";
import { getEmails } from "@/lib/mail";

// 为请求创建一个简单的缓存标识
const generateCacheKey = (limit: number, offset: number, unread: boolean) => {
  return `emails:${limit}:${offset}:${unread}`;
};

// 请求计数器，用于在开发模式下检测多次请求
const requestCounts: Record<string, number> = {};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");
  const unread = searchParams.get("unread") === "true";

  // 创建缓存键
  const cacheKey = generateCacheKey(limit, offset, unread);

  // 开发模式下记录请求次数
  if (process.env.NODE_ENV === "development") {
    requestCounts[cacheKey] = (requestCounts[cacheKey] || 0) + 1;
    console.log(`[API] 邮件请求 #${requestCounts[cacheKey]}: ${cacheKey}`);
  }

  try {
    console.log(
      `[API] 获取邮件: limit=${limit}, offset=${offset}, unread=${unread}`
    );

    // 使用新的邮件服务
    const data = await getEmails({
      limit,
      offset,
      unread,
    });

    console.log(`[API] 成功获取邮件: ${data.length || 0}封`);

    // 创建响应对象
    const response = NextResponse.json(data);

    // 添加缓存控制头
    response.headers.set("Cache-Control", "public, max-age=300"); // 缓存5分钟
    response.headers.set("X-Cache-Key", cacheKey);

    // 返回响应
    return response;
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
