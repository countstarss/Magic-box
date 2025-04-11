// MARK: 用户界面偏好
export interface UIPreferences {
  id?: number; // IndexedDB主键
  userId: string; // 用户ID，用于区分不同用户的设置
  darkMode: boolean; // 暗黑模式
  sidebarCollapsed: boolean; // 侧边栏折叠状态
  fontSize: "small" | "medium" | "large"; // 字体大小
  density: "compact" | "comfortable" | "spacious"; // 界面密度
  accentColor: string; // 强调色
  lastUpdated: number; // 最后更新时间戳
}

// MARK: 最近查看记录
export interface RecentlyViewed {
  id?: number; // IndexedDB主键
  userId: string; // 用户ID
  itemType: "contact" | "template" | "event" | "document"; // 项目类型
  itemId: string; // 项目ID
  title: string; // 项目标题
  icon?: string; // 项目图标
  viewedAt: number; // 查看时间戳
}

// MARK: 草稿内容
export interface DraftItem {
  id?: number; // IndexedDB主键
  userId: string; // 用户ID
  draftType: "email" | "template" | "event" | "note"; // 草稿类型
  content: any; // 草稿内容 (可以是任何JSON可序列化的数据)
  title: string; // 草稿标题
  createdAt: number; // 创建时间戳
  updatedAt: number; // 更新时间戳
  tempId?: string; // 临时ID，用于创建新项目前标识
}

// MARK: 过滤-搜索历史
export interface SearchHistory {
  id?: number; // IndexedDB主键
  userId: string; // 用户ID
  searchArea: "contacts" | "emails" | "templates" | "events" | "global"; // 搜索区域
  query: string; // 搜索查询
  filters: Record<string, any>; // 应用的过滤器
  timestamp: number; // 搜索时间戳
}

// MARK: 视图类型
export type ViewType = "crm" | "emails" | "templates" | "events";

// MARK: 自定义视图设置
export interface ViewSettings {
  id?: number; // IndexedDB主键
  userId: string; // 用户ID
  viewType: ViewType; // 视图类型
  columns: string[]; // 显示的列
  sortBy: string; // 排序字段
  sortDirection: "asc" | "desc"; // 排序方向
  pageSize: number; // 每页显示数量
  filters: Record<string, any>; // 默认过滤器
  lastUpdated: number; // 最后更新时间戳
}

// MARK: 通知状态
export interface NotificationState {
  id?: number; // IndexedDB主键
  userId: string; // 用户ID
  notificationId: string; // 通知ID
  read: boolean; // 已读状态
  dismissed: boolean; // 已忽略状态
  updatedAt: number; // 更新时间戳
}

// MARK: 仪表盘小组件配置
export interface DashboardWidgetConfig {
  id?: number; // IndexedDB主键
  userId: string; // 用户ID
  layout: WidgetLayout[]; // 小组件布局
  hiddenWidgets: string[]; // 隐藏的小组件
  lastUpdated: number; // 最后更新时间戳
}

// MARK: 小组件布局
export interface WidgetLayout {
  widgetId: string; // 小组件ID
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  config?: Record<string, any>; // 小组件特定配置
}

// MARK: 数据库常量
export const DB_NAME = "mailbox_local";
export const STORES = {
  UI_PREFERENCES: "uiPreferences",
  RECENTLY_VIEWED: "recentlyViewed",
  DRAFTS: "drafts",
  SEARCH_HISTORY: "searchHistory",
  VIEW_SETTINGS: "viewSettings",
  NOTIFICATION_STATES: "notificationStates",
  DASHBOARD_WIDGETS: "dashboardWidgets",
};
