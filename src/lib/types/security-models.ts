// 访问控制策略
export interface AccessPolicy {
  id: string; // 唯一标识符
  name: string; // 策略名称
  description?: string; // 策略描述
  teamId: string; // 团队ID
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
  createdBy: string; // 创建者ID
  rules: AccessRule[]; // 访问规则
  status: "active" | "disabled"; // 策略状态
}

// 访问规则
export interface AccessRule {
  id: string; // 唯一标识符
  resourceType: "email" | "template" | "contact" | "event" | "report"; // 资源类型
  resourceIds?: string[]; // 特定资源ID列表，为空表示全部
  actions: string[]; // 允许的操作，如"read", "write", "delete"
  conditions?: Record<string, any>; // 额外条件，如时间、IP等
  effect: "allow" | "deny"; // 规则效果
  priority: number; // 规则优先级
}

// 数据保留策略
export interface DataRetentionPolicy {
  id: string; // 唯一标识符
  name: string; // 策略名称
  description?: string; // 策略描述
  teamId: string; // 团队ID
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
  createdBy: string; // 创建者ID
  dataType: "email" | "template" | "contact" | "event" | "log"; // 数据类型
  retentionPeriod: number; // 保留期限(天)
  action: "delete" | "archive" | "anonymize"; // 期满后操作
  status: "active" | "disabled"; // 策略状态
}

// IP白名单
export interface IpAllowlist {
  id: string; // 唯一标识符
  teamId: string; // 团队ID
  name: string; // 规则名称
  description?: string; // 规则描述
  ipRanges: string[]; // IP范围列表
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
  createdBy: string; // 创建者ID
  status: "active" | "disabled"; // 状态
}

// 安全审计日志 (关键操作)
export interface SecurityAuditLog {
  id: string; // 唯一标识符
  timestamp: number; // 操作时间
  userId: string; // 操作用户ID
  teamId: string; // 团队ID
  action: string; // 操作类型
  resource: string; // 资源类型
  resourceId?: string; // 资源ID
  ipAddress: string; // IP地址
  userAgent?: string; // 用户代理
  status: "success" | "failure"; // 操作状态
  details?: Record<string, any>; // 详细信息
}

// 详细安全日志 (存储在文档型数据库)
export interface DetailedSecurityLog {
  id: string; // 唯一标识符
  baseLogId: string; // 关联的基础日志ID
  request?: Record<string, any>; // 请求详情
  response?: Record<string, any>; // 响应详情
  context?: Record<string, any>; // 上下文信息
  metadata?: Record<string, any>; // 元数据
  severity: "info" | "warning" | "error" | "critical"; // 严重程度
}

// 本地安全缓存 (IndexedDB)
export interface SecurityLocalCache {
  id?: number; // IndexedDB键
  userId: string; // 用户ID
  teamId: string; // 团队ID
  securitySettings: Record<string, any>; // 安全设置
  lastUpdated: number; // 最后更新时间
  syncStatus: "synced" | "pending" | "error"; // 同步状态
}
