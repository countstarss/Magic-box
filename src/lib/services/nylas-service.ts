import { EmailAccount, EmailMessage } from "../types/nylas-types";

// 环境变量
const NYLAS_API_KEY = process.env.NYLAS_API_KEY || "";
const NYLAS_CLIENT_ID = process.env.NYLAS_CLIENT_ID || "";
const NYLAS_API_URI = process.env.NYLAS_API_URI || "https://api.us.nylas.com";
const NYLAS_CALLBACK_URI =
  process.env.NYLAS_CALLBACK_URI || "http://localhost:3000/onboarding/callback";

class NylasService {
  // 获取授权URL
  public getAuthUrl(emailHint?: string): string {
    const params = new URLSearchParams({
      client_id: NYLAS_CLIENT_ID,
      redirect_uri: NYLAS_CALLBACK_URI,
      response_type: "code",
      provider: "google", // 默认使用Google，也可以让用户选择其他提供商
      access_type: "offline",
      state: Math.random().toString(36).substring(2, 15), // 随机状态值防止CSRF攻击
    });

    // 如果提供了邮箱提示，则添加到参数中
    if (emailHint) {
      params.append("login_hint", emailHint);
    }

    return `${NYLAS_API_URI}/v3/connect/auth?${params.toString()}`;
  }

  // 使用授权码获取访问令牌
  public async exchangeCodeForToken(
    code: string
  ): Promise<{ grantId: string; emailAccount: EmailAccount }> {
    try {
      const response = await fetch(`${NYLAS_API_URI}/v3/connect/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${NYLAS_API_KEY}`,
        },
        body: JSON.stringify({
          client_id: NYLAS_CLIENT_ID,
          client_secret: NYLAS_API_KEY,
          redirect_uri: NYLAS_CALLBACK_URI,
          code,
          grant_type: "authorization_code",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Nylas API error: ${errorData.message || response.statusText}`
        );
      }

      const data = await response.json();

      // 使用grantId获取邮箱账户信息
      const accountInfo = await this.getEmailAccountInfo(data.grant_id);

      return {
        grantId: data.grant_id,
        emailAccount: accountInfo,
      };
    } catch (error) {
      console.error("Error exchanging code for token:", error);
      throw error;
    }
  }

  // 获取邮箱账户信息
  public async getEmailAccountInfo(grantId: string): Promise<EmailAccount> {
    try {
      const response = await fetch(
        `${NYLAS_API_URI}/v3/grants/${grantId}/account`,
        {
          headers: {
            Authorization: `Bearer ${NYLAS_API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Nylas API error: ${errorData.message || response.statusText}`
        );
      }

      const data = await response.json();

      return {
        id: data.id,
        grantId,
        email: data.email,
        name: data.name,
        provider: data.provider,
        organizationName: data.organization_name,
        profilePicture: data.picture_url,
      };
    } catch (error) {
      console.error("Error getting email account info:", error);
      throw error;
    }
  }

  // 获取邮件列表
  public async getEmails(
    grantId: string,
    options: { limit?: number; offset?: number } = {}
  ): Promise<EmailMessage[]> {
    const limit = options.limit || 20;
    const offset = options.offset || 0;

    try {
      const response = await fetch(
        `${NYLAS_API_URI}/v3/grants/${grantId}/messages?limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${NYLAS_API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Nylas API error: ${errorData.message || response.statusText}`
        );
      }

      const data = await response.json();
      return data.data.map((message: any) => ({
        id: message.id,
        subject: message.subject || "(No Subject)",
        snippet: message.snippet,
        sender: {
          name: message.from[0]?.name || "Unknown",
          email: message.from[0]?.email || "unknown@email.com",
        },
        recipients: message.to.map((to: any) => ({
          name: to.name || "Unknown",
          email: to.email,
        })),
        date: new Date(message.date * 1000),
        unread: message.unread,
        hasAttachments: message.hasAttachments,
      }));
    } catch (error) {
      console.error("Error getting emails:", error);
      throw error;
    }
  }

  // 获取单个邮件详情
  public async getEmail(
    grantId: string,
    messageId: string
  ): Promise<EmailMessage> {
    try {
      const response = await fetch(
        `${NYLAS_API_URI}/v3/grants/${grantId}/messages/${messageId}`,
        {
          headers: {
            Authorization: `Bearer ${NYLAS_API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Nylas API error: ${errorData.message || response.statusText}`
        );
      }

      const message = await response.json();
      return {
        id: message.id,
        subject: message.subject || "(No Subject)",
        snippet: message.snippet,
        body: message.body,
        sender: {
          name: message.from[0]?.name || "Unknown",
          email: message.from[0]?.email || "unknown@email.com",
        },
        recipients: message.to.map((to: any) => ({
          name: to.name || "Unknown",
          email: to.email,
        })),
        date: new Date(message.date * 1000),
        unread: message.unread,
        hasAttachments: message.hasAttachments,
      };
    } catch (error) {
      console.error("Error getting email details:", error);
      throw error;
    }
  }
}

// 创建单例
const nylasService = new NylasService();
export default nylasService;
