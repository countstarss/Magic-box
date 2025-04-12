/**
 * 邮件服务 - 统一导出
 *
 * 提供整合的邮件相关功能，包括：
 * 1. 邮件列表获取与操作
 * 2. 单封邮件获取与操作
 * 3. 账户信息管理
 * 4. 缓存管理
 */

// 导出类型定义
export * from "./types/mail-types";

// 导出基础 Nylas 服务
export { default as nylasService } from "./nylas-service";

// 导出缓存服务
export { default as memoryCacheManager } from "./cache/memory-cache";
export { default as mailDB } from "./cache/db-cache";

// 导出各种邮件操作
// - 邮件列表操作
export {
  getEmails,
  refreshEmailsCache,
  invalidateEmailsCache,
  cleanupCache,
} from "./operations/emails";

// - 单封邮件操作
export {
  getEmail,
  markAsRead,
  markAsUnread,
  invalidateEmailCache,
} from "./operations/email";

// - 账户操作
export {
  getAccount,
  getAuthUrl,
  exchangeCodeForToken,
} from "./operations/account";

// 统一服务对象（为了兼容旧代码）
import {
  getEmails,
  refreshEmailsCache,
  invalidateEmailsCache,
  cleanupCache,
} from "./operations/emails";
import {
  getEmail,
  markAsRead,
  markAsUnread,
  invalidateEmailCache,
} from "./operations/email";
import { getAccount } from "./operations/account";

// 邮件服务统一接口
export const mailService = {
  // 邮件列表操作
  getEmails,
  refreshCache: refreshEmailsCache,
  invalidateEmailsCache,
  cleanupCache,

  // 单封邮件操作
  getEmail,
  markAsRead,
  markAsUnread,
  invalidateEmailCache,

  // 账户操作
  getAccount,
};

// 默认导出mailService作为推荐用法
export default mailService;
