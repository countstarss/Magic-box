/**
 * 服务器增强型邮件服务（兼容性包装）
 *
 * 注意: 此文件为兼容性包装，实际实现已移至新的邮件服务结构
 * 参见: @/lib/mail
 */

import {
  getEmails,
  getEmail,
  getAccount,
  markAsRead,
  markAsUnread,
  refreshEmailsCache as refreshCache,
  cleanupCache,
  invalidateEmailsCache,
  invalidateEmailCache,
} from "@/lib/mail";

// 重新导出增强型邮件服务（为了兼容性）
export {
  getEmails,
  getEmail,
  getAccount,
  markAsRead,
  markAsUnread,
  refreshCache,
  cleanupCache,
  invalidateEmailsCache,
  invalidateEmailCache,
};

// 导出服务实例作为enhancedMailService
import mailService from "@/lib/mail";
export const enhancedMailService = mailService;
