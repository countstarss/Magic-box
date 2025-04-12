/**
 * 增强型邮件服务（兼容性包装）
 *
 * 注意: 此文件为兼容性包装，实际实现已移至新的邮件服务结构
 * 参见: @/lib/mail
 *
 * 为确保兼容性，此文件导出了与原始服务相同的接口
 */

import mailService from "@/lib/mail";
export type { MailQueryOptions } from "@/lib/mail";

// 为向后兼容性导出
export default mailService;
