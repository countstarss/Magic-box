import { EmailMessage } from "../types/mail-types";
import nylasService from "../nylas-service";
import memoryCacheManager from "../cache/memory-cache";
import mailDB from "../cache/db-cache";

// 是否在服务器环境
const isServer = typeof window === "undefined";

/**
 * 获取单封邮件详情
 * @param messageId 邮件ID
 * @param forceRefresh 是否强制刷新
 */
export async function getEmail(
  messageId: string,
  forceRefresh = false
): Promise<EmailMessage | null> {
  if (!messageId) {
    console.log("[MailService] 邮件ID不能为空");
    return null;
  }

  // 获取默认账户ID
  const accountId = process.env.NYLAS_GRANT_ID || "c6zfpqxupbtdx0f5jn9efbwj8";

  // 服务器端和客户端使用不同的缓存策略
  if (isServer) {
    return await getEmailServer(accountId, messageId, forceRefresh);
  } else {
    return await getEmailClient(accountId, messageId, forceRefresh);
  }
}

/**
 * 服务器端获取单封邮件（使用内存缓存）
 */
async function getEmailServer(
  accountId: string,
  messageId: string,
  forceRefresh = false
): Promise<EmailMessage | null> {
  const cacheKey = `email:${messageId}`;

  // 如果强制刷新或处于开发环境，跳过缓存
  if (forceRefresh || process.env.NODE_ENV === "development") {
    console.log(`[MailService] 跳过缓存，直接从API获取邮件详情`);
    try {
      const email = await nylasService.getEmail(accountId, messageId);
      // 更新缓存
      if (email) {
        memoryCacheManager.set(cacheKey, email, 5 * 60 * 1000); // 缓存5分钟
      }
      return email;
    } catch (error) {
      console.error(`[MailService] API获取邮件详情失败:`, error);
      return null;
    }
  }

  // 尝试从缓存获取
  const cachedData = memoryCacheManager.get<EmailMessage>(cacheKey);
  if (cachedData) {
    console.log(`[MailService] 服务器缓存命中: ${cacheKey}`);
    return cachedData;
  }

  // 缓存未命中，从API获取
  console.log(`[MailService] 服务器缓存未命中: ${cacheKey}`);
  try {
    const email = await nylasService.getEmail(accountId, messageId);

    // 缓存结果
    if (email) {
      memoryCacheManager.set(cacheKey, email, 5 * 60 * 1000); // 缓存5分钟
    }

    return email;
  } catch (error) {
    console.error(`[MailService] API获取邮件详情失败:`, error);
    return null;
  }
}

/**
 * 客户端获取单封邮件（使用IndexedDB缓存）
 */
async function getEmailClient(
  accountId: string,
  messageId: string,
  forceRefresh = false
): Promise<EmailMessage | null> {
  try {
    // 尝试从缓存获取
    if (!forceRefresh) {
      const cachedEmail = await mailDB.getCachedEmail(messageId);
      if (cachedEmail) {
        console.log(`[MailService] 客户端缓存命中: ${messageId}`);
        return cachedEmail;
      }
    }

    // 缓存不可用或强制刷新，从API获取
    console.log(
      `[MailService] 客户端缓存未命中，从API获取邮件详情: ${messageId}`
    );
    const email = await nylasService.getEmail(accountId, messageId);

    // 缓存单封邮件
    if (email) {
      await mailDB.cacheEmails([email], accountId);
    }

    return email;
  } catch (error) {
    console.error(`[MailService] 获取邮件 ${messageId} 详情失败:`, error);

    // 如果API请求失败，尝试使用缓存
    const cachedEmail = await mailDB.getCachedEmail(messageId);
    if (cachedEmail) {
      console.log(`[MailService] API失败，使用缓存中的邮件 ${messageId}`);
      return cachedEmail;
    }

    return null;
  }
}

/**
 * 标记邮件为已读
 * @param messageId 邮件ID
 */
export async function markAsRead(messageId: string): Promise<boolean> {
  try {
    // 获取默认账户ID
    const accountId = process.env.NYLAS_GRANT_ID || "c6zfpqxupbtdx0f5jn9efbwj8";

    // TODO: 实现API调用标记为已读
    // 这里需要实现真实的Nylas API调用
    // const success = await nylasService.markAsRead(accountId, messageId);

    // 更新本地缓存
    if (!isServer) {
      await mailDB.updateEmailReadStatus(messageId, true);
    }

    // 使服务器端缓存失效
    invalidateEmailCache(messageId);

    return true;
  } catch (error) {
    console.error(`[MailService] 标记邮件 ${messageId} 为已读失败:`, error);
    return false;
  }
}

/**
 * 标记邮件为未读
 * @param messageId 邮件ID
 */
export async function markAsUnread(messageId: string): Promise<boolean> {
  try {
    // 获取默认账户ID
    const accountId = process.env.NYLAS_GRANT_ID || "c6zfpqxupbtdx0f5jn9efbwj8";

    // TODO: 实现API调用标记为未读
    // 这里需要实现真实的Nylas API调用
    // const success = await nylasService.markAsUnread(accountId, messageId);

    // 更新本地缓存
    if (!isServer) {
      await mailDB.updateEmailReadStatus(messageId, false);
    }

    // 使服务器端缓存失效
    invalidateEmailCache(messageId);

    return true;
  } catch (error) {
    console.error(`[MailService] 标记邮件 ${messageId} 为未读失败:`, error);
    return false;
  }
}

/**
 * 使特定邮件的缓存失效
 */
export function invalidateEmailCache(emailId: string) {
  console.log(`[MailService] 使邮件 ${emailId} 缓存失效`);
  if (isServer) {
    memoryCacheManager.invalidate(`email:${emailId}`);
  }
}
