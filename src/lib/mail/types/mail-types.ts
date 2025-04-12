// 邮箱账户
export interface EmailAccount {
  id: string;
  grantId: string;
  email: string;
  name: string;
  provider: string;
  organizationName?: string;
  profilePicture?: string;
}

// 邮件联系人
export interface EmailContact {
  name: string;
  email: string;
}

// 邮件附件
export interface EmailAttachment {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  contentId?: string;
}

// 邮件消息
export interface EmailMessage {
  id: string;
  subject: string;
  snippet: string;
  body?: string;
  sender: EmailContact;
  recipients: EmailContact[];
  date: Date;
  unread: boolean;
  hasAttachments: boolean;
  attachments?: EmailAttachment[];
  labels?: string[];
}

// 存储在本地的Nylas授权信息
export interface NylasAuthData {
  grantId: string;
  account: EmailAccount;
  addedAt: number;
}

// Nylas API响应
export interface NylasApiResponse<T> {
  data: T[];
  request_id: string;
  metadata: {
    total_count: number;
    limit: number;
    offset: number;
  };
}

// 邮件查询选项接口
export interface MailQueryOptions {
  limit?: number;
  offset?: number;
  unread?: boolean;
  folder?: string;
  forceRefresh?: boolean;
}

// 缓存的邮件消息
export interface EmailMessageCache extends EmailMessage {
  cachedAt: Date;
  accountId: string;
  folder?: string;
}

// 内存缓存项
export interface CacheItem<T> {
  data: T;
  expiry: number;
}
