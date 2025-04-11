// 团队基本信息
export interface Team {
  id: string; // 唯一标识符
  name: string; // 团队名称
  description?: string; // 团队描述
  logoUrl?: string; // 团队logo
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
  createdBy: string; // 创建者ID
  domain?: string; // 团队域名
  isPersonal: boolean; // 是否为个人团队
}

// 团队成员关系
export interface TeamMember {
  id: string; // 唯一标识符
  teamId: string; // 团队ID
  userId: string; // 用户ID
  roleId: string; // 角色ID
  joinedAt: number; // 加入时间
  invitedBy: string; // 邀请人ID
  status: "active" | "invited" | "suspended"; // 成员状态
  lastActive?: number; // 最后活跃时间
}

// 团队邀请
export interface TeamInvitation {
  id: string; // 唯一标识符
  teamId: string; // 团队ID
  email: string; // 被邀请人邮箱
  roleId: string; // 角色ID
  invitedBy: string; // 邀请人ID
  invitedAt: number; // 邀请时间
  expiresAt: number; // 过期时间
  status: "pending" | "accepted" | "declined" | "expired"; // 邀请状态
  token: string; // 邀请令牌
}

// 成员角色
export interface MemberRole {
  id: string; // 唯一标识符
  name: string; // 角色名称
  description?: string; // 角色描述
  permissions: string[]; // 权限列表
  isCustom: boolean; // 是否为自定义角色
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
  teamId?: string; // 团队ID (若为自定义团队角色)
}

// 分页查询参数
export interface TeamQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

// 团队统计信息
export interface TeamStats {
  teamId: string;
  memberCount: number;
  activeMembers: number;
  totalEmails: number;
  totalTemplates: number;
  totalEvents: number;
  lastActive: number;
}
