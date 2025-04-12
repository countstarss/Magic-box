import Dexie, { Table } from "dexie";
import { Email } from "@/lib/data";
import {
  EmailMessage,
  EmailAccount,
  EmailAttachment,
  EmailContact,
  NylasAuthData,
} from "@/lib/types/nylas-types";

// 定义数据库结构
export interface EmailMessageCache extends EmailMessage {
  cachedAt: Date;
  accountId: string;
  folder?: string;
}

// 定义数据库类
export class MailDatabase extends Dexie {
  // 数据表
  emails!: Table<EmailMessageCache, string>; // id为主键
  accounts!: Table<NylasAuthData, string>; // grantId为主键

  constructor() {
    super("MailDatabase");

    // 定义数据库架构
    this.version(1).stores({
      emails: "id, accountId, unread, date, folder, cachedAt",
      accounts: "grantId, account.email, addedAt",
    });
  }

  // 缓存邮件列表
  async cacheEmails(
    emails: EmailMessage[],
    accountId: string,
    folder: string = "inbox"
  ): Promise<void> {
    if (!emails || emails.length === 0) return;

    const now = new Date();
    const emailsWithCache = emails.map((email) => ({
      ...email,
      cachedAt: now,
      accountId,
      folder,
    }));

    // 使用bulkPut批量更新，存在则更新，不存在则添加
    await this.emails.bulkPut(emailsWithCache);
    console.log(`缓存了 ${emails.length} 封邮件`);
  }

  // 获取缓存的邮件
  async getCachedEmails(
    accountId: string,
    options: {
      limit?: number;
      offset?: number;
      unread?: boolean;
      folder?: string;
    } = {}
  ): Promise<EmailMessageCache[]> {
    const { limit = 20, offset = 0, unread, folder = "inbox" } = options;

    let query = this.emails.where("accountId").equals(accountId);

    if (folder) {
      query = query.and((item) => item.folder === folder);
    }

    if (unread !== undefined) {
      query = query.and((item) => item.unread === unread);
    }

    const emails = await query
      .reverse() // 最新的邮件排在前面
      .sortBy("date");

    return emails.slice(offset, offset + limit);
  }

  // 获取单封邮件的缓存
  async getCachedEmail(id: string): Promise<EmailMessageCache | undefined> {
    return await this.emails.get(id);
  }

  // 更新邮件读取状态
  async updateEmailReadStatus(id: string, isRead: boolean): Promise<void> {
    await this.emails.update(id, { unread: !isRead });
  }

  // 清除过期的缓存（超过maxAge分钟的缓存）
  async clearStaleCache(maxAge: number = 30): Promise<number> {
    const cutoffTime = new Date(Date.now() - maxAge * 60 * 1000);

    const staleItems = await this.emails
      .where("cachedAt")
      .below(cutoffTime)
      .toArray();

    if (staleItems.length > 0) {
      await this.emails.bulkDelete(staleItems.map((item) => item.id));
      console.log(`清除了 ${staleItems.length} 条过期缓存`);
    }

    return staleItems.length;
  }

  // 缓存账户信息
  async cacheAccounts(accounts: NylasAuthData[]): Promise<void> {
    if (!accounts || accounts.length === 0) return;

    await this.accounts.bulkPut(accounts);
    console.log(`缓存了 ${accounts.length} 个账户信息`);
  }

  // 获取缓存的账户信息
  async getCachedAccounts(): Promise<NylasAuthData[]> {
    return await this.accounts.toArray();
  }

  // 获取特定账户信息
  async getCachedAccount(grantId: string): Promise<NylasAuthData | undefined> {
    return await this.accounts.get(grantId);
  }
}

// 创建数据库实例
export const mailDB = new MailDatabase();
