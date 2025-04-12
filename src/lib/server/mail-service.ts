import { EmailMessage } from "../types/nylas-types";

// 服务配置类型
interface MailServiceConfig {
  apiKey: string;
  apiUrl: string;
  grantId: string;
}

// 邮件查询选项类型
export interface EmailQueryOptions {
  limit?: number;
  offset?: number;
  unread?: boolean;
}

/**
 * 邮件服务类 - 封装Nylas API调用
 */
export class MailService {
  private config: MailServiceConfig;

  constructor(config: MailServiceConfig) {
    this.config = config;
  }

  /**
   * 获取邮件列表
   */
  async getEmails(options: EmailQueryOptions = {}) {
    const { limit = 20, offset = 0, unread } = options;

    // 构建查询参数
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    if (unread) {
      queryParams.append("unread", "true");
    }

    try {
      const response = await this.fetchWithRetry(
        `${this.config.apiUrl}/v3/grants/${this.config.grantId}/messages?${queryParams.toString()}`,
        {
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Nylas API error (${response.status}): ${errorText || response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("[MailService] getEmails failed:", error);
      throw this.formatError(error);
    }
  }

  /**
   * 获取单个邮件详情
   */
  async getEmail(emailId: string) {
    if (!emailId) {
      throw new Error("Email ID is required");
    }

    try {
      const response = await this.fetchWithRetry(
        `${this.config.apiUrl}/v3/grants/${this.config.grantId}/messages/${emailId}`,
        {
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Nylas API error (${response.status}): ${errorText || response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`[MailService] getEmail failed for ID ${emailId}:`, error);
      throw this.formatError(error);
    }
  }

  /**
   * 获取账户信息
   */
  async getAccount() {
    try {
      const response = await this.fetchWithRetry(
        `${this.config.apiUrl}/v3/grants/${this.config.grantId}/account`,
        {
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Nylas API error (${response.status}): ${errorText || response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("[MailService] getAccount failed:", error);
      throw this.formatError(error);
    }
  }

  /**
   * 创建统一的请求头
   */
  private getHeaders() {
    return {
      Authorization: `Bearer ${this.config.apiKey}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  }

  /**
   * 格式化错误对象
   */
  private formatError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error(String(error));
  }

  /**
   * 带重试机制的fetch
   */
  private async fetchWithRetry(
    url: string,
    options: RequestInit,
    maxRetries: number = 3,
    retryDelay: number = 300
  ): Promise<Response> {
    let lastError: Error | null = null;

    // 尝试多次请求
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(url, options);

        // 只对服务器错误(5xx)和网络错误进行重试
        if (response.status < 500) {
          return response;
        }

        lastError = new Error(`Server error: ${response.status}`);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
      }

      // 如果不是最后一次尝试，则等待一段时间再重试
      if (attempt < maxRetries - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay * Math.pow(2, attempt))
        );
      }
    }

    throw lastError || new Error("Failed after retry attempts");
  }
}

/**
 * 创建邮件服务实例
 */
export function createMailService() {
  const config: MailServiceConfig = {
    apiKey: process.env.NYLAS_API_KEY || "",
    apiUrl: process.env.NYLAS_API_URI || "https://api.us.nylas.com",
    grantId: process.env.GRANT_ID || "",
  };

  return new MailService(config);
}
