// 联系人基本信息
export interface Contact {
  id: string; // 唯一标识符
  teamId: string; // 团队ID
  firstName: string; // 名
  lastName: string; // 姓
  email: string; // 电子邮件地址
  phone?: string; // 电话号码
  jobTitle?: string; // 职位
  companyId?: string; // 所属公司ID
  avatar?: string; // 头像URL
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
  createdBy: string; // 创建者ID
  lastContactedAt?: number; // 最后联系时间
  status: "active" | "inactive" | "lead" | "customer"; // 联系人状态
  tags?: string[]; // 标签ID列表
}

// 公司信息
export interface Company {
  id: string; // 唯一标识符
  teamId: string; // 团队ID
  name: string; // 公司名称
  industry?: string; // 行业
  website?: string; // 网站
  logo?: string; // 公司logo URL
  size?: string; // 公司规模
  address?: Address; // 地址信息
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
  createdBy: string; // 创建者ID
  description?: string; // 公司描述
  status: "active" | "inactive" | "lead" | "customer"; // 公司状态
  tags?: string[]; // 标签ID列表
}

// 地址信息
export interface Address {
  street?: string; // 街道
  city?: string; // 城市
  state?: string; // 州/省
  zipCode?: string; // 邮编
  country?: string; // 国家
}

// 销售机会/交易
export interface Deal {
  id: string; // 唯一标识符
  teamId: string; // 团队ID
  name: string; // 交易名称
  contactIds: string[]; // 相关联系人ID列表
  companyId?: string; // 相关公司ID
  value: number; // 交易金额
  currency: string; // 货币类型
  stage: string; // 阶段
  probability?: number; // 成功概率
  expectedCloseDate?: number; // 预计成交日期
  actualCloseDate?: number; // 实际成交日期
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
  createdBy: string; // 创建者ID
  ownerId: string; // 负责人ID
  status: "open" | "won" | "lost" | "abandoned"; // 交易状态
  tags?: string[]; // 标签ID列表
}

// 活动记录
export interface Activity {
  id: string; // 唯一标识符
  teamId: string; // 团队ID
  type: "call" | "meeting" | "email" | "task" | "note"; // 活动类型
  subject: string; // 主题
  description?: string; // 描述
  contactIds?: string[]; // 相关联系人ID列表
  companyId?: string; // 相关公司ID
  dealId?: string; // 相关交易ID
  scheduledAt?: number; // 计划时间
  completedAt?: number; // 完成时间
  dueDate?: number; // 截止日期
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
  createdBy: string; // 创建者ID
  assignedTo?: string; // 分配给用户ID
  status: "scheduled" | "completed" | "canceled"; // 活动状态
}

// 标签管理
export interface Tag {
  id: string; // 唯一标识符
  teamId: string; // 团队ID
  name: string; // 标签名称
  color: string; // 标签颜色
  scope: ("contact" | "company" | "deal")[]; // 标签适用范围
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
  createdBy: string; // 创建者ID
}

// 交互历史 (存储在文档型数据库)
export interface InteractionHistory {
  id: string; // 唯一标识符
  contactId: string; // 联系人ID
  companyId?: string; // 公司ID
  teamId: string; // 团队ID
  type: "email" | "call" | "meeting" | "social" | "other"; // 交互类型
  timestamp: number; // 交互时间
  description: string; // 交互描述
  content?: Record<string, any>; // 详细内容
  metadata?: Record<string, any>; // 元数据
  sentiment?: "positive" | "neutral" | "negative"; // 情感分析
  attachments?: string[]; // 附件URL列表
  createdBy: string; // 记录创建者ID
}

// 联系人笔记 (存储在文档型数据库)
export interface ContactNote {
  id: string; // 唯一标识符
  contactId: string; // 联系人ID
  teamId: string; // 团队ID
  title?: string; // 笔记标题
  content: string; // 笔记内容
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
  createdBy: string; // 创建者ID
  isPrivate: boolean; // 是否私密
  tags?: string[]; // 笔记标签
}

// 自定义字段配置 (存储在文档型数据库)
export interface CustomField {
  id: string; // 唯一标识符
  teamId: string; // 团队ID
  name: string; // 字段名称
  description?: string; // 字段描述
  entityType: "contact" | "company" | "deal"; // 应用实体类型
  fieldType: "text" | "number" | "date" | "select" | "multiselect" | "boolean"; // 字段类型
  options?: string[]; // 选择类型的选项
  isRequired: boolean; // 是否必填
  defaultValue?: any; // 默认值
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
  createdBy: string; // 创建者ID
  order: number; // 显示顺序
  isActive: boolean; // 是否启用
}

// 本地缓存类型 (存储在IndexedDB)
export interface CrmLocalCache {
  id?: number; // IndexedDB键
  userId: string; // 用户ID
  teamId: string; // 团队ID
  cacheType: "contacts" | "companies" | "recent" | "viewSettings"; // 缓存类型
  data: any; // 缓存数据
  lastUpdated: number; // 最后更新时间
  syncStatus: "synced" | "pending" | "error"; // 同步状态
}
