import { NextRequest, NextResponse } from "next/server";

// Resend API KEY
const RESEND_API_KEY = process.env.RESEND_API_KEY;

// 生成HTML邮件模板的函数
function generateEmailHtml(content: string, senderName: string = "WizMail") {
  // 将换行符转换为<br>标签
  const formattedContent = content.replace(/\n/g, "<br>");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
        <div style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
          <h1 style="color: #333; font-size: 24px; margin: 0 0 10px;">WizMail</h1>
        </div>
        
        <div style="color: #333; font-size: 16px; line-height: 1.5;">
          ${formattedContent}
        </div>
        
        <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; color: #777; font-size: 14px;">
          <p>发自 ${senderName}</p>
        </div>
      </div>
    </div>
  `;
}

export async function POST(req: NextRequest) {
  try {
    // 从请求体中获取邮件信息
    const { to, cc, bcc, subject, content } = await req.json();

    // 验证必填字段
    if (!to || !subject || !content) {
      return NextResponse.json(
        { error: "收件人、主题和内容为必填项" },
        { status: 400 }
      );
    }

    // 处理收件人格式
    const toList = Array.isArray(to) ? to : [to];
    const ccList = cc ? (Array.isArray(cc) ? cc : [cc]) : [];
    const bccList = bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : [];

    // 生成HTML内容
    const htmlContent = generateEmailHtml(content);

    // 准备要发送到Resend API的数据
    const emailData = {
      from: "WizMail <onboarding@resend.dev>",
      to: toList,
      cc: ccList.length > 0 ? ccList : undefined,
      bcc: bccList.length > 0 ? bccList : undefined,
      subject: subject,
      html: htmlContent,
    };

    // MARK: 调用Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send email");
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "发送邮件时出错" },
      { status: 500 }
    );
  }
}
