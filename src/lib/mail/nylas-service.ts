import { toast } from "@/hooks/use-toast";
import {
  EmailAccount,
  EmailMessage,
  NylasApiResponse,
} from "./types/mail-types";

// 环境变量
const NYLAS_API_KEY =
  process.env.NEXT_PUBLIC_NYLAS_API_KEY ||
  "nyk_v0_xeZH9pWZZxlRdL4GBLivGNYMKaAGduLzhJO1u91CTIU57bV0YDpFuqPnP7v7uRtp";
const NYLAS_CLIENT_ID =
  process.env.NEXT_PUBLIC_NYLAS_CLIENT_ID ||
  "4840e5ea-1270-4a62-a396-18177499f8dd";
const NYLAS_API_URI =
  process.env.NEXT_PUBLIC_NYLAS_API_URI || "https://api.us.nylas.com";
const NYLAS_CALLBACK_URI =
  process.env.NEXT_PUBLIC_NYLAS_CALLBACK_URI ||
  "http://localhost:3000/onboarding/callback";

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
      console.log("[NylasService] 交换授权码获取令牌:", code);

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
        console.error("[NylasService] 令牌交换错误:", errorData);
        throw new Error(
          `Nylas API error: ${errorData.message || response.statusText}`
        );
      }

      const data = await response.json();
      console.log("[NylasService] 令牌交换成功, grant_id:", data.grant_id);

      // 使用grantId获取邮箱账户信息
      const accountInfo = await this.getEmailAccountInfo(data.grant_id);

      return {
        grantId: data.grant_id,
        emailAccount: accountInfo,
      };
    } catch (error) {
      console.error("[NylasService] 交换授权码获取令牌出错:", error);
      throw error;
    }
  }

  // 获取邮箱账户信息
  public async getEmailAccountInfo(grantId: string): Promise<EmailAccount> {
    try {
      console.log("[NylasService] 获取账户信息, grantId:", grantId);

      const response = await fetch(
        `${NYLAS_API_URI}/v3/grants/${grantId}/account`,
        {
          headers: {
            Authorization: `Bearer ${NYLAS_API_KEY}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("[NylasService] 获取账户信息错误:", errorData);
      }

      const data = await response.json();
      console.log("[NylasService] 账户信息获取成功");

      return {
        id: data.id,
        grantId,
        email: data.email,
        name: data.name,
        provider: data.provider,
        organizationName: data.organization_name || "",
        profilePicture: data.picture_url || "",
      };
    } catch (error) {
      console.error("[NylasService] 获取邮箱账户信息错误:", error);
      throw error;
    }
  }

  // 获取邮件列表
  public async getEmails(
    grantId: string,
    options: { limit?: number; offset?: number; unread?: boolean } = {}
  ): Promise<EmailMessage[]> {
    const limit = options.limit || 5;
    const offset = options.offset || 0;

    try {
      // 构建查询参数
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });

      // 如果指定了unread参数，添加到查询中
      if (options.unread !== undefined) {
        queryParams.append("unread", options.unread.toString());
      }

      console.log(
        `[NylasService] 获取邮件列表, grantId: ${grantId}, 参数: ${queryParams.toString()}`
      );

      const response = await fetch(
        `${NYLAS_API_URI}/v3/grants/${grantId}/messages?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${NYLAS_API_KEY}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("[NylasService] 获取邮件列表错误:", errorData);
        throw new Error(
          `Nylas API error: ${errorData.message || response.statusText}`
        );
      }

      const apiResponse: NylasApiResponse<any> = await response.json();
      console.log(
        `[NylasService] 获取到 ${apiResponse.data?.length || 0} 封邮件`
      );

      if (!apiResponse.data) {
        return [];
      }

      // 映射API响应到EmailMessage类型
      return apiResponse.data.map((message: any) =>
        this.mapApiMessageToEmailMessage(message)
      );
    } catch (error) {
      console.error("[NylasService] 获取邮件列表错误:", error);
      throw error;
    }
  }

  // 获取单个邮件详情
  public async getEmail(
    grantId: string,
    messageId: string
  ): Promise<EmailMessage | null> {
    try {
      console.log(
        `[NylasService] 获取邮件详情, id: ${messageId}, grantId: ${grantId}`
      );

      const response = await fetch(
        `${NYLAS_API_URI}/v3/grants/${grantId}/messages/${messageId}`,
        {
          headers: {
            Authorization: `Bearer ${NYLAS_API_KEY}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("[NylasService] 获取邮件详情错误:", errorData);
        throw new Error(
          `Nylas API error: ${errorData.message || response.statusText}`
        );
      }

      const message = await response.json();
      console.log("[NylasService] 邮件详情获取成功");

      return this.mapApiMessageToEmailMessage(message);
    } catch (error) {
      console.error("[NylasService] 获取邮件详情错误:", error);
      return null;
    }
  }

  // 将API消息对象映射到EmailMessage类型
  private mapApiMessageToEmailMessage(message: any): EmailMessage {
    return {
      id: message.id,
      subject: message.subject || "(No Subject)",
      snippet: message.snippet || "",
      body: message.body,
      sender: {
        name: message.from?.[0]?.name || "Unknown",
        email: message.from?.[0]?.email || "unknown@email.com",
      },
      recipients: (message.to || []).map((to: any) => ({
        name: to.name || "Unknown",
        email: to.email || "",
      })),
      date: new Date(message.date * 1000), // 将时间戳转换为Date对象
      unread: message.unread || false,
      hasAttachments: !!message.attachments?.length,
      attachments: message.attachments?.map((att: any) => ({
        id: att.id,
        filename: att.filename,
        contentType: att.content_type,
        size: att.size,
        contentId: att.content_id,
      })),
    };
  }
}

const nylasService = new NylasService();
export default nylasService;
