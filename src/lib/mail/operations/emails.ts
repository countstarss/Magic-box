import { EmailMessage, MailQueryOptions } from "../types/mail-types";
import nylasService from "../nylas-service";
import memoryCacheManager from "../cache/memory-cache";
import mailDB from "../cache/db-cache";

// 是否在服务器环境
const isServer = typeof window === "undefined";

/**
 * 获取邮件列表
 * @param options 查询选项
 */
export async function getEmails(
  options: MailQueryOptions = {}
): Promise<EmailMessage[]> {
  // 获取默认账户ID
  const accountId = process.env.NYLAS_GRANT_ID || "c6zfpqxupbtdx0f5jn9efbwj8";

  // 服务器端和客户端使用不同的缓存策略
  if (isServer) {
    return await getEmailsServer(accountId, options);
  } else {
    return await getEmailsClient(accountId, options);
  }
}

/**
 * 服务器端获取邮件列表（使用内存缓存）
 */
async function getEmailsServer(
  accountId: string,
  options: MailQueryOptions = {}
): Promise<EmailMessage[]> {
  const { limit = 20, offset = 0, unread, forceRefresh = false } = options;
  const cacheKey = `emails:${accountId}:${limit}:${offset}:${unread}`;

  // 如果强制刷新或处于开发环境，跳过缓存
  if (forceRefresh || process.env.NODE_ENV === "development") {
    console.log(`[MailService] 跳过缓存，直接从API获取邮件`);
    try {
      const data = await fetchEmailsFromApi(accountId, {
        limit,
        offset,
        unread,
      });
      // 更新缓存
      memoryCacheManager.set(cacheKey, data, 2 * 60 * 1000); // 缓存2分钟
      return data;
    } catch (error) {
      console.error(`[MailService] API获取邮件失败:`, error);
      return [];
    }
  }

  // 尝试从缓存获取
  const cachedData = memoryCacheManager.get<EmailMessage[]>(cacheKey);
  if (cachedData) {
    console.log(`[MailService] 服务器缓存命中: ${cacheKey}`);
    return cachedData;
  }

  // 缓存未命中，从API获取
  console.log(`[MailService] 服务器缓存未命中: ${cacheKey}`);
  try {
    const data = await fetchEmailsFromApi(accountId, {
      limit,
      offset,
      unread,
    });

    // 缓存结果
    memoryCacheManager.set(cacheKey, data, 2 * 60 * 1000); // 缓存2分钟
    return data;
  } catch (error) {
    console.error(`[MailService] API获取邮件失败:`, error);
    return [];
  }
}

/**
 * 客户端获取邮件列表（使用IndexedDB缓存）
 */
async function getEmailsClient(
  accountId: string,
  options: MailQueryOptions = {}
): Promise<EmailMessage[]> {
  const {
    limit = 20,
    offset = 0,
    unread,
    folder = "inbox",
    forceRefresh = false,
  } = options;

  try {
    // 尝试从IndexedDB缓存获取数据
    if (!forceRefresh) {
      const cachedEmails = await mailDB.getCachedEmails(accountId, {
        limit,
        offset,
        unread,
        folder,
      });

      // 如果有缓存数据且未过期，则返回缓存
      if (cachedEmails.length > 0) {
        console.log(
          `[MailService] 客户端缓存命中: ${cachedEmails.length}封邮件`
        );
        return cachedEmails;
      }
    }

    // 缓存不可用或强制刷新，从API获取数据
    console.log(`[MailService] 客户端缓存未命中，从API获取邮件: ${accountId}`);

    // 从API获取邮件
    const emails = await fetchEmailsFromApi(accountId, {
      limit,
      offset,
      unread,
    });

    // 缓存结果
    if (emails.length > 0) {
      await mailDB.cacheEmails(emails, accountId, folder);
    }

    return emails;
  } catch (error) {
    console.error("[MailService] 获取邮件失败:", error);

    // 如果API请求失败，尝试使用缓存数据（即使可能已过期）
    const cachedEmails = await mailDB.getCachedEmails(accountId, {
      limit,
      offset,
      unread,
      folder,
    });

    if (cachedEmails.length > 0) {
      console.log(
        `[MailService] API失败，使用缓存中的 ${cachedEmails.length} 封邮件`
      );
      return cachedEmails;
    }

    return [];
  }
}

/**
 * 从API获取邮件
 */
async function fetchEmailsFromApi(
  accountId: string,
  options: { limit?: number; offset?: number; unread?: boolean }
): Promise<EmailMessage[]> {
  // 构造API查询选项
  const apiOptions: any = {
    limit: options.limit || 20,
    offset: options.offset || 0,
  };

  if (options.unread !== undefined) {
    apiOptions.unread = options.unread;
  }

  // 调用Nylas API获取邮件
  try {
    return await nylasService.getEmails(accountId, apiOptions);
  } catch (error) {
    console.error(`[MailService] Nylas API调用失败:`, error);
    return [];
  }
}

/**
 * 刷新邮件缓存
 */
export async function refreshEmailsCache(
  options: MailQueryOptions = {}
): Promise<boolean> {
  try {
    // 强制从API获取最新邮件
    const emails = await getEmails({
      ...options,
      forceRefresh: true,
    });

    console.log(`[MailService] 刷新缓存，获取 ${emails.length} 封邮件`);

    // 使服务器端缓存失效
    if (isServer) {
      invalidateEmailsCache();
    }

    return true;
  } catch (error) {
    console.error("[MailService] 刷新缓存失败:", error);
    return false;
  }
}

/**
 * 使邮件列表缓存失效
 */
export function invalidateEmailsCache() {
  console.log("[MailService] 使邮件列表缓存失效");
  if (isServer) {
    memoryCacheManager.invalidate("emails:");
  }
}

/**
 * 清理过期缓存
 */
export async function cleanupCache(): Promise<number> {
  try {
    if (!isServer) {
      // 清理客户端IndexedDB缓存
      const count = await mailDB.clearStaleCache(30); // 清理30分钟以上的缓存
      return count;
    }
    return 0;
  } catch (error) {
    console.error("[MailService] 清理缓存失败:", error);
    return 0;
  }
}
