import { NextRequest, NextResponse } from "next/server";
import { templateDb } from "@/lib/db/template-db";
import { headers } from "next/headers";

// GET /api/templates/preview/[id] - 直接预览模板HTML内容
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return new Response("无效的模板ID", { status: 400 });
    }

    // 从数据库中获取模板
    const template = await templateDb.getTemplate(id);

    if (!template) {
      return new Response("未找到模板", { status: 404 });
    }

    // 如果没有HTML内容，返回一个简单的占位符
    if (!template.htmlContent) {
      const placeholderHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${template.name} - 预览</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              flex-direction: column;
              text-align: center;
              color: #666;
            }
            h3 {
              margin-bottom: 10px;
            }
            p {
              margin-top: 0;
            }
          </style>
        </head>
        <body>
          <h3>${template.name}</h3>
          <p>此模板暂无预览内容</p>
          <p style="font-size: 14px; margin-top: 10px;">${template.description || ""}</p>
        </body>
        </html>
      `;

      return new Response(placeholderHtml, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      });
    }

    // 包装unlayer的HTML内容以确保正确渲染
    const enhancedHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${template.name} - 预览</title>
        <style>
          /* 确保内容适应窗口 */
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          }
          /* 修复unlayer编辑器生成的内容在某些邮件客户端的显示问题 */
          .email-body {
            margin: 0 auto;
            max-width: 100%;
          }
          table {
            border-spacing: 0;
          }
          td {
            padding: 0;
          }
          img {
            border: 0;
            max-width: 100%;
          }
          @media only screen and (max-width: 600px) {
            .email-body {
              width: 100% !important;
            }
          }
        </style>
      </head>
      <body>
        ${template.htmlContent}
      </body>
      </html>
    `;

    // 返回模板的HTML内容
    return new Response(enhancedHtml, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("预览模板失败:", error);
    return new Response("预览模板失败", { status: 500 });
  }
}
