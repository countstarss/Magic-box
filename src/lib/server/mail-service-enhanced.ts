import { MailService, EmailQueryOptions } from "./mail-service";
import cacheManager from "./cache-manager";

/**
 * 增强版邮件服务 - 包含缓存机制
 */
export class EnhancedMailService {
  private mailService: MailService;

  constructor(mailService: MailService) {
    this.mailService = mailService;
  }

  /**
   * 获取邮件列表，带缓存
   */
  async getEmails(options: EmailQueryOptions = {}) {
    const { limit = 20, offset = 0, unread } = options;
    const cacheKey = `emails:${limit}:${offset}:${unread}`;

    // 尝试从缓存获取
    const cachedData = cacheManager.get(cacheKey);
    if (cachedData) {
      console.log(`[EnhancedMailService] Cache hit for ${cacheKey}`);
      return cachedData;
    }

    // 缓存未命中，从API获取
    console.log(`[EnhancedMailService] Cache miss for ${cacheKey}`);
    const data = await this.mailService.getEmails(options);

    // 缓存结果，有效期2分钟
    cacheManager.set(cacheKey, data, 2 * 60 * 1000);

    return data;
  }

  /**
   * 获取单个邮件详情，带缓存
   */
  async getEmail(emailId: string) {
    const cacheKey = `email:${emailId}`;

    // 尝试从缓存获取
    const cachedData = cacheManager.get(cacheKey);
    if (cachedData) {
      console.log(`[EnhancedMailService] Cache hit for ${cacheKey}`);
      return cachedData;
    }

    // 缓存未命中，从API获取
    console.log(`[EnhancedMailService] Cache miss for ${cacheKey}`);
    const data = await this.mailService.getEmail(emailId);

    // 缓存结果，有效期5分钟
    cacheManager.set(cacheKey, data, 5 * 60 * 1000);

    return data;
  }

  /**
   * 获取账户信息，带缓存
   */
  async getAccount() {
    const cacheKey = `account:${process.env.NYLAS_GRANT_ID}`;

    // 尝试从缓存获取
    const cachedData = cacheManager.get(cacheKey);
    if (cachedData) {
      console.log(`[EnhancedMailService] Cache hit for ${cacheKey}`);
      return cachedData;
    }

    // 缓存未命中，从API获取
    console.log(`[EnhancedMailService] Cache miss for ${cacheKey}`);
    const data = await this.mailService.getAccount();

    // 缓存结果，有效期30分钟
    cacheManager.set(cacheKey, data, 30 * 60 * 1000);

    return data;
  }

  /**
   * 使邮件列表缓存失效
   */
  invalidateEmailsCache() {
    console.log("[EnhancedMailService] Invalidating emails cache");
    cacheManager.invalidate("emails:");
  }

  /**
   * 使特定邮件的缓存失效
   */
  invalidateEmailCache(emailId: string) {
    console.log(
      `[EnhancedMailService] Invalidating cache for email ${emailId}`
    );
    cacheManager.invalidate(`email:${emailId}`);
  }
}

/**
 * 创建增强版邮件服务实例
 */
import { createMailService } from "./mail-service";

export function createEnhancedMailService() {
  const mailService = createMailService();
  return new EnhancedMailService(mailService);
}

// 创建单例实例
export const enhancedMailService = createEnhancedMailService();
