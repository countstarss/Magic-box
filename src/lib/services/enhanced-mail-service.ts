import { EmailMessage, NylasAuthData } from "../types/nylas-types";
import mailAccountService from "./mail-account-service";
import nylasService from "./nylas-service";
import { mailDB, EmailMessageCache } from "../db/mail-db";

// 定义邮件查询选项接口
export interface MailQueryOptions {
  limit?: number;
  offset?: number;
  unread?: boolean;
  folder?: string;
  forceRefresh?: boolean;
}

/**
 * MARK: 增强版邮件服务
 * 增强版邮件服务 - 整合在线API和本地缓存
 */
export class EnhancedMailService {
  // 缓存刷新时间间隔（分钟）
  private readonly cacheRefreshInterval = 5;

  /**
   * MARK: 获取邮件列表
   * @param options 查询选项
   */
  async getEmails(options: MailQueryOptions = {}): Promise<EmailMessage[]> {
    const {
      limit = 20,
      offset = 0,
      unread,
      folder = "inbox",
      forceRefresh = false,
    } = options;

    // 获取当前账户
    const currentAccount = mailAccountService.getCurrentAccount();
    if (!currentAccount) {
      console.log("没有当前账户");
      return [];
    }

    try {
      // 尝试从缓存获取数据
      if (!forceRefresh) {
        const cachedEmails = await this.getEmailsFromCache(
          currentAccount.grantId,
          {
            limit,
            offset,
            unread,
            folder,
          }
        );

        // 如果有缓存数据且未过期，则返回缓存
        if (cachedEmails.length > 0) {
          console.log(`从缓存中获取 ${cachedEmails.length} 封邮件`);

          // 在后台刷新缓存
          this.refreshCacheIfNeeded(currentAccount.grantId, { unread, folder });

          return cachedEmails;
        }
      }

      // 缓存不可用或强制刷新，从API获取数据
      console.log(`从API获取邮件，账户: ${currentAccount.grantId}`);

      // 构造API查询选项
      const apiOptions: any = {
        limit,
        offset,
      };

      if (unread !== undefined) {
        apiOptions.unread = unread;
      }

      // 调用Nylas API获取邮件
      const emails = await nylasService.getEmails(
        currentAccount.grantId,
        apiOptions
      );

      // 缓存结果
      await this.cacheEmails(emails, currentAccount.grantId, folder);

      return emails;
    } catch (error) {
      console.error("获取邮件失败:", error);

      // 如果API请求失败，尝试使用缓存数据（即使可能已过期）
      const cachedEmails = await this.getEmailsFromCache(
        currentAccount.grantId,
        {
          limit,
          offset,
          unread,
          folder,
        }
      );

      if (cachedEmails.length > 0) {
        console.log(`API失败，使用缓存中的 ${cachedEmails.length} 封邮件`);
        return cachedEmails;
      }

      throw error;
    }
  }

  /**
   * MARK: 获取单封邮件详情
   * @param messageId 邮件ID
   * @param forceRefresh 是否强制刷新
   */
  async getEmail(
    messageId: string,
    forceRefresh = false
  ): Promise<EmailMessage | null> {
    if (!messageId) {
      console.log("邮件ID不能为空");
      return null;
    }

    // 获取当前账户
    const currentAccount = mailAccountService.getCurrentAccount();
    if (!currentAccount) {
      console.log("没有当前账户");
      return null;
    }

    try {
      // 尝试从缓存获取
      if (!forceRefresh) {
        const cachedEmail = await mailDB.getCachedEmail(messageId);
        if (cachedEmail) {
          console.log(`从缓存中获取邮件 ${messageId}`);
          return cachedEmail;
        }
      }

      // 缓存不可用或强制刷新，从API获取
      console.log(`从API获取邮件 ${messageId}`);
      const email = await nylasService.getEmail(
        currentAccount.grantId,
        messageId
      );

      // 缓存单封邮件
      if (email) {
        await mailDB.cacheEmails([email], currentAccount.grantId);
      }

      return email;
    } catch (error) {
      console.error(`获取邮件 ${messageId} 详情失败:`, error);

      // 如果API请求失败，尝试使用缓存
      const cachedEmail = await mailDB.getCachedEmail(messageId);
      if (cachedEmail) {
        console.log(`API失败，使用缓存中的邮件 ${messageId}`);
        return cachedEmail;
      }

      return null;
    }
  }

  /**
   * MARK: 标记邮件为已读
   * @param messageId 邮件ID
   */
  async markAsRead(messageId: string): Promise<boolean> {
    try {
      // 获取当前账户
      const currentAccount = mailAccountService.getCurrentAccount();
      if (!currentAccount) {
        console.log("没有当前账户");
        return false;
      }

      // TODO: 实现API调用标记为已读
      // 这里需要实现真实的Nylas API调用

      // 更新本地缓存
      await mailDB.updateEmailReadStatus(messageId, true);

      return true;
    } catch (error) {
      console.error(`标记邮件 ${messageId} 为已读失败:`, error);
      return false;
    }
  }

  /**
   * MARK: 标记邮件为未读
   * @param messageId 邮件ID
   */
  async markAsUnread(messageId: string): Promise<boolean> {
    try {
      // 获取当前账户
      const currentAccount = mailAccountService.getCurrentAccount();
      if (!currentAccount) {
        console.log("没有当前账户");
        return false;
      }

      // TODO: 实现API调用标记为未读
      // 这里需要实现真实的Nylas API调用

      // 更新本地缓存
      await mailDB.updateEmailReadStatus(messageId, false);

      return true;
    } catch (error) {
      console.error(`标记邮件 ${messageId} 为未读失败:`, error);
      return false;
    }
  }

  /**
   * MARK: 刷新邮件缓存
   */
  async refreshCache(options: MailQueryOptions = {}): Promise<boolean> {
    const currentAccount = mailAccountService.getCurrentAccount();
    if (!currentAccount) {
      console.log("没有当前账户");
      return false;
    }

    try {
      // 强制从API获取最新邮件
      const emails = await this.getEmails({
        ...options,
        forceRefresh: true,
      });

      console.log(`刷新缓存，获取 ${emails.length} 封邮件`);
      return true;
    } catch (error) {
      console.error("刷新缓存失败:", error);
      return false;
    }
  }

  /**
   * MARK: 清理过期缓存
   */
  async cleanupCache(): Promise<number> {
    try {
      const clearedCount = await mailDB.clearStaleCache(30);
      return clearedCount;
    } catch (error) {
      console.error("清理缓存失败:", error);
      return 0;
    }
  }

  // 以下是私有辅助方法

  /**
   * MARK: 从缓存获取邮件
   */
  private async getEmailsFromCache(
    accountId: string,
    options: MailQueryOptions
  ): Promise<EmailMessageCache[]> {
    return await mailDB.getCachedEmails(accountId, options);
  }

  /**
   * MARK: 缓存邮件列表
   */
  private async cacheEmails(
    emails: EmailMessage[],
    accountId: string,
    folder: string = "inbox"
  ): Promise<void> {
    await mailDB.cacheEmails(emails, accountId, folder);
  }

  /**
   * MARK: 刷新缓存
   * NOTE: 如果需要则刷新缓存（后台进行）
   */
  private async refreshCacheIfNeeded(
    accountId: string,
    options: { unread?: boolean; folder?: string } = {}
  ): Promise<void> {
    try {
      // 检查最新的缓存时间
      const cachedEmails = await mailDB.getCachedEmails(accountId, {
        limit: 1,
        ...options,
      });

      if (cachedEmails.length === 0) {
        // 没有缓存，需要刷新
        this.refreshCache(options);
        return;
      }

      const latestCache = cachedEmails[0];
      const cacheAge =
        (Date.now() - latestCache.cachedAt.getTime()) / (1000 * 60);

      // 如果缓存超过指定刷新间隔，则后台刷新
      if (cacheAge > this.cacheRefreshInterval) {
        console.log(`缓存已过期 ${cacheAge.toFixed(1)}分钟，在后台刷新`);
        this.refreshCache(options);
      }
    } catch (error) {
      console.error("检查缓存刷新失败:", error);
    }
  }
}

//MARK: 创建单例
const enhancedMailService = new EnhancedMailService();
export default enhancedMailService;
