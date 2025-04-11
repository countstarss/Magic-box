// MARK: 数据库名称常量
export const DB_NAME = "mailbox_local_db";

// MARK: 视图类型
export type ViewType =
  | "inbox"
  | "sent"
  | "drafts"
  | "trash"
  | "contacts"
  | "calendar"
  | "templates"
  | "crm"
  | "dashboard"
  | "settings";

// MARK: 导出所有数据模型
export * from "./local-storage";
export * from "./team-models";
export * from "./security-models";
export * from "./crm-models";
export * from "./event-models";
export * from "./billing-models";
export * from "./notification-models";
export * from "./settings-models";
export * from "./template-models";

// MARK: UI偏好设置
export interface UIPreferences {
  id?: number;
  userId: string;
  theme: "light" | "dark" | "system";
  language: string;
  sidebarCollapsed: boolean;
  compactView: boolean;
  notifications: boolean;
  sounds: boolean;
  lastUpdated: number;
}

// MARK: 最近查看的项目
export interface RecentlyViewed {
  id?: number;
  userId: string;
  itemId: string;
  itemType: string;
  itemName: string;
  viewedAt: number;
}

// MARK: 草稿项目
export interface DraftItem {
  id?: number;
  userId: string;
  draftType: string;
  draftData: any;
  title: string;
  createdAt: number;
  updatedAt: number;
}

// MARK: 搜索历史
export interface SearchHistory {
  id?: number;
  userId: string;
  searchQuery: string;
  searchArea: string;
  timestamp: number;
  resultsCount?: number;
}

// MARK: 视图设置
export interface ViewSettings {
  id?: number;
  userId: string;
  viewType: ViewType;
  columns?: string[];
  sorting?: {
    field: string;
    direction: "asc" | "desc";
  };
  filters?: any;
  pageSize: number;
  lastUpdated: number;
}

// MARK: 通知状态
export interface NotificationState {
  id?: number;
  userId: string;
  notificationId: string;
  read: boolean;
  dismissed: boolean;
  updatedAt: number;
}

// MARK: 仪表盘小组件配置
export interface DashboardWidgetConfig {
  id?: number;
  userId: string;
  widgets: {
    id: string;
    type: string;
    position: {
      x: number;
      y: number;
      w: number;
      h: number;
    };
    config: any;
  }[];
  layout: string;
  lastUpdated: number;
}
