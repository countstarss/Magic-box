// MARK: Event
export interface Event {
  id: string; // 唯一标识符
  teamId: string; // 团队ID
  title: string; // 事件标题
  description?: string; // 事件描述
  startDate: number; // 开始时间
  endDate: number; // 结束时间
  allDay: boolean; // 是否全天事件
  location?: EventLocation; // 地点信息
  categoryId?: string; // 事件分类ID
  isRecurring: boolean; // 是否重复事件
  recurrenceRule?: RecurrenceRule; // 重复规则
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
  createdBy: string; // 创建者ID
  status: "scheduled" | "canceled" | "completed"; // 事件状态
  priority: "low" | "medium" | "high"; // 优先级
  reminders?: Reminder[]; // 提醒设置
  color?: string; // 事件颜色
  isPrivate: boolean; // 是否私密事件
}

// MARK: 事件地点
export interface EventLocation {
  type: "physical" | "virtual" | "hybrid"; // 地点类型
  address?: string; // 物理地址
  virtualLink?: string; // 虚拟会议链接
  meetingId?: string; // 会议ID
  coordinates?: {
    latitude: number;
    longitude: number;
  }; // 坐标
  meetingProvider?: string; // 会议提供商(如Zoom, Teams)
}

// MARK: 重复规则
export interface RecurrenceRule {
  frequency: "daily" | "weekly" | "monthly" | "yearly"; // 频率
  interval: number; // 间隔
  endType: "never" | "on" | "after"; // 结束类型
  endDate?: number; // 结束日期
  occurrences?: number; // 重复次数
  daysOfWeek?: number[]; // 每周的哪几天 (0-6, 0表示周日)
  dayOfMonth?: number; // 每月的第几天
  monthOfYear?: number; // 每年的第几月
  exceptions?: number[]; // 例外日期(不重复的日期)
}

// MARK: 提醒设置
export interface Reminder {
  id: string; // 唯一标识符
  triggerBefore: number; // 提前多少毫秒提醒
  type: "notification" | "email" | "both"; // 提醒类型
  message?: string; // 自定义消息
}

// MARK: 事件参与者
export interface EventParticipant {
  id: string; // 唯一标识符
  eventId: string; // 事件ID
  userId?: string; // 用户ID (内部用户)
  contactId?: string; // 联系人ID (CRM联系人)
  externalEmail?: string; // 外部邮箱
  name?: string; // 姓名
  role: "organizer" | "required" | "optional"; // 参与者角色
  status: "needsAction" | "declined" | "tentative" | "accepted"; // 参与状态
  responseTimestamp?: number; // 响应时间
  responseComment?: string; // 响应评论
  invitedAt: number; // 邀请时间
  notifications: boolean; // 是否接收通知
}

// MARK: 事件分类
export interface EventCategory {
  id: string; // 唯一标识符
  teamId: string; // 团队ID
  name: string; // 分类名称
  description?: string; // 分类描述
  color: string; // 分类颜色
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
  createdBy: string; // 创建者ID
  isDefault: boolean; // 是否默认分类
}

// MARK: 事件详情-文档
export interface EventDetails {
  id: string; // 唯一标识符
  eventId: string; // 关联的事件ID
  content: Record<string, any>; // 详细描述内容
  attachments?: string[]; // 附件URL列表
  agenda?: string[]; // 议程列表
  notes?: string; // 会议纪要
  decisions?: string[]; // 决策事项
  actionItems?: ActionItem[]; // 行动项
  customFields?: Record<string, any>; // 自定义字段
}

// MARK: 行动项
export interface ActionItem {
  id: string; // 唯一标识符
  description: string; // 描述
  assignedTo?: string; // 分配给谁
  dueDate?: number; // 截止日期
  status: "pending" | "inProgress" | "completed"; // 状态
}

// MARK: 事件资源-文档
export interface EventResource {
  id: string; // 唯一标识符
  eventId: string; // 事件ID
  name: string; // 资源名称
  type: "document" | "link" | "file" | "presentation"; // 资源类型
  url: string; // 资源URL
  description?: string; // 资源描述
  uploadedBy: string; // 上传者ID
  uploadedAt: number; // 上传时间
  size?: number; // 文件大小(字节)
  thumbnailUrl?: string; // 缩略图URL
  version?: number; // 版本号
}

// MARK: 本地缓存-IDB
export interface EventLocalCache {
  id?: number; // IndexedDB键
  userId: string; // 用户ID
  teamId?: string; // 团队ID
  cacheType: "calendar" | "drafts" | "preferences"; // 缓存类型
  data: any; // 缓存数据
  rangeStart?: number; // 范围开始(日历缓存)
  rangeEnd?: number; // 范围结束(日历缓存)
  lastUpdated: number; // 最后更新时间
  syncStatus: "synced" | "pending" | "error"; // 同步状态
}
