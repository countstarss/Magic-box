// 团队类型枚举
export type TeamType = "business" | "education" | "nonprofit" | "personal";

// 成员角色枚举
export type MemberRole = "owner" | "admin" | "member" | "guest";

// 计划类型
export interface TeamPlan {
  name: string;
  maxMembers: number; // 0 表示无限制
  maxStorage: number; // 以 MB 为单位，0 表示无限制
  features: string[];
  price: number; // 每月价格，0 表示免费
}

// 团队成员
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  avatarUrl?: string;
  joinedAt: Date;
  lastActive?: Date;
  permissions?: string[];
}

// 团队统计数据
export interface TeamStats {
  totalEmails: number;
  monthlyEmails: number;
  activeChats: number;
  pendingMessages: number;
  sharedDocs: number;
  recentDocs: number;
}

// 团队数据结构
export interface Team {
  id: string;
  name: string;
  description: string;
  avatarUrl?: string;
  type: TeamType;
  createdAt: Date;
  updatedAt?: Date;
  members: TeamMember[];
  plan: TeamPlan;
  stats: TeamStats;
  isVerified: boolean;
  metadata?: Record<string, any>;
}

// 创建团队的数据结构
export interface CreateTeamData {
  name: string;
  description: string;
  type: TeamType;
}

// 更新团队的数据结构
export interface UpdateTeamData {
  name?: string;
  description?: string;
  avatarUrl?: string;
  type?: TeamType;
}

// 邀请成员的数据结构
export interface InviteMemberData {
  email: string;
  role: MemberRole;
  message?: string;
}
