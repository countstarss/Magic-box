// MARK: 通知设置
export interface NotificationSettings {
  id: string; // 唯一标识符
  userId: string; // 用户ID
  teamId?: string; // 团队ID，可选（如果是团队级别设置）
  enabledChannels: NotificationChannel[]; // 已启用的通知渠道
  emailFrequency: "immediate" | "daily" | "weekly" | "never"; // 邮件频率
  emailDigestDay?: number; // 邮件摘要的周几(0-6)
  emailDigestTime?: number; // 邮件摘要的时间(分钟，从午夜开始)
  pushEnabled: boolean; // 是否启用推送通知
  desktopEnabled: boolean; // 是否启用桌面通知
  browserEnabled: boolean; // 是否启用浏览器通知
  soundEnabled: boolean; // 是否启用声音
  doNotDisturbStart?: number; // 免打扰开始时间(分钟，从午夜开始)
  doNotDisturbEnd?: number; // 免打扰结束时间(分钟，从午夜开始)
  doNotDisturbDays?: number[]; // 免打扰日期(0-6)
  typePreferences: Record<string, NotificationTypePreference>; // 各通知类型的偏好
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
}

// MARK: 通知渠道
export type NotificationChannel =
  | "email"
  | "push"
  | "in_app"
  | "desktop"
  | "sms";

// MARK: 通知类型偏好
export interface NotificationTypePreference {
  enabled: boolean; // 是否启用
  channels: NotificationChannel[]; // 启用的渠道
  importance: "low" | "normal" | "high"; // 重要性
}

// MARK: 通知类型定义
export interface NotificationType {
  id: string; // 唯一标识符
  key: string; // 类型键名，作为系统标识符
  name: string; // 类型名称
  description: string; // 描述
  category:
    | "system"
    | "team"
    | "email"
    | "crm"
    | "event"
    | "security"
    | "billing"; // 类别
  defaultChannels: NotificationChannel[]; // 默认渠道
  defaultImportance: "low" | "normal" | "high"; // 默认重要性
  template: {
    title: string; // 标题模板
    content: string; // 内容模板
    emailSubject?: string; // 邮件主题模板
    emailTemplate?: string; // 邮件内容模板
  }; // 通知模板
  actionable: boolean; // 是否可操作
  actions?: NotificationAction[]; // 可用操作
  systemManaged: boolean; // 是否系统管理
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
}

// MARK: 通知操作
export interface NotificationAction {
  id: string; // 唯一标识符
  key: string; // 操作键名
  label: string; // 显示标签
  url?: string; // 操作链接(可含占位符)
  apiEndpoint?: string; // API端点
  httpMethod?: "GET" | "POST" | "PUT" | "DELETE"; // HTTP方法
  confirmationRequired?: boolean; // 是否需要确认
  confirmationMessage?: string; // 确认消息
  style?: "primary" | "secondary" | "danger"; // 样式
}

// MARK: 用户通知-文档
export interface UserNotification {
  id: string; // 唯一标识符
  userId: string; // 用户ID
  teamId?: string; // 团队ID
  typeKey: string; // 通知类型键名
  title: string; // 标题
  content: string; // 内容
  data?: Record<string, any>; // 详细数据
  importance: "low" | "normal" | "high"; // 重要性
  read: boolean; // 是否已读
  readAt?: number; // 读取时间
  dismissed: boolean; // 是否已忽略
  dismissedAt?: number; // 忽略时间
  sentVia: NotificationChannel[]; // 已发送渠道
  createdAt: number; // 创建时间
  expiresAt?: number; // 过期时间
  actions?: UserNotificationAction[]; // 可用操作
  actionTaken?: {
    actionKey: string;
    timestamp: number;
    result?: any;
  }; // 已执行操作
  sourceType?: string; // 来源类型
  sourceId?: string; // 来源ID
  groupId?: string; // 通知组ID（用于对相关通知进行分组）
}

// MARK: 用户通知操作
export interface UserNotificationAction extends NotificationAction {
  dynamicUrl?: string; // 动态生成的URL
  dynamicLabel?: string; // 动态生成的标签
  available: boolean; // 是否可用
}

// MARK: 本地通知缓存-IDB
export interface NotificationLocalCache {
  id?: number; // IndexedDB键
  userId: string; // 用户ID
  notifications: UserNotification[]; // 通知列表缓存
  unreadCount: number; // 未读数量
  lastSyncAt: number; // 最后同步时间
  syncStatus: "synced" | "pending" | "error"; // 同步状态
}

// MARK: 通知首选项-IDB
export interface NotificationPreferences {
  id?: number; // IndexedDB键
  userId: string; // 用户ID
  disabled: boolean; // 是否禁用所有通知
  doNotDisturb: boolean; // 是否处于免打扰状态
  muteSounds: boolean; // 是否静音
  showPreview: boolean; // 是否显示预览
  badgeStyle: "count" | "dot" | "none"; // 通知角标样式
  groupingPreference: "group" | "separate" | "time"; // 分组偏好
  sortOrder: "newest" | "importance" | "unread"; // 排序顺序
  lastUpdated: number; // 更新时间
}
