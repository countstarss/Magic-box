import { NextRequest } from "next/server";

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

    // 服务器端不支持IndexedDB，返回错误提示HTML
    const errorHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>预览错误</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            padding: 20px;
            text-align: center;
            background-color: #f5f5f5;
          }
          .error-container {
            max-width: 600px;
            background-color: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          h2 {
            color: #e11d48;
            margin-top: 0;
          }
          p {
            margin: 20px 0;
            line-height: 1.5;
            color: #333;
          }
          .code {
            background: #f1f1f1;
            padding: 10px 15px;
            border-radius: 4px;
            font-family: monospace;
            margin: 15px 0;
            overflow-x: auto;
          }
          button {
            background-color: #f43f5e;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.2s;
          }
          button:hover {
            background-color: #e11d48;
          }
        </style>
      </head>
      <body>
        <div class="error-container">
          <h2>无法预览模板</h2>
          <p>服务器端不支持IndexedDB API，因此无法获取模板内容。请在客户端应用中使用预览功能。</p>
          <div class="code">
            Error: MissingAPIError IndexedDB API missing on server side
          </div>
          <p>解决方法：请使用模板列表中的"预览"按钮查看模板，而不是直接访问此URL。</p>
          <button onclick="window.close()">关闭窗口</button>
        </div>
      </body>
      </html>
    `;

    return new Response(errorHtml, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("预览模板失败:", error);
    return new Response("预览模板失败", { status: 500 });
  }
}
