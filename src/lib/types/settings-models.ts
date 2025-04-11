// MARK: 核心用户设置
export interface UserSettings {
  id: string; // 唯一标识符
  userId: string; // 用户ID
  language: string; // 语言首选项
  timezone: string; // 时区
  dateFormat: string; // 日期格式
  timeFormat: string; // 时间格式
  firstDayOfWeek: number; // 一周的第一天 (0-6, 0表示周日)
  defaultView: string; // 默认视图
  emailSignature?: string; // 邮件签名
  emailReplyTo?: string; // 回复邮箱
  emailForwarding?: EmailForwardingSetting; // 邮件转发设置
  accessibility: AccessibilitySettings; // 无障碍设置
  privacy: PrivacySettings; // 隐私设置
  notifications?: string; // 通知设置ID (指向NotificationSettings)
  twoFactorAuth: boolean; // 是否启用双因素认证
  twoFactorMethod?: "app" | "sms" | "email"; // 双因素认证方式
  accountRecoveryEmail?: string; // 账户恢复邮箱
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
  syncWithDevices: boolean; // 是否与设备同步
}

// MARK: 邮件转发设置
export interface EmailForwardingSetting {
  enabled: boolean; // 是否启用
  toAddress?: string; // 转发地址
  keepCopy: boolean; // 是否保留副本
  filter?: string; // 过滤器表达式
}

// MARK: 无障碍设置
export interface AccessibilitySettings {
  highContrast: boolean; // 高对比度
  largeText: boolean; // 大文本
  reducedMotion: boolean; // 减少动效
  screenReader: boolean; // 屏幕阅读器优化
  keyboardNavigation: boolean; // 键盘导航增强
  customStyles?: Record<string, string>; // 自定义样式
}

// MARK: 隐私设置
export interface PrivacySettings {
  shareUsageData: boolean; // 分享使用数据
  allowCookies: boolean; // 允许Cookie
  showOnlineStatus: boolean; // 显示在线状态
  lastSeenVisible: boolean; // 上次在线时间可见
  readReceiptsEnabled: boolean; // 已读回执
  trackEmailOpens: boolean; // 追踪邮件打开
  personalization: boolean; // 个性化
}

// MARK: 应用全局设置
export interface AppSettings {
  id: string; // 唯一标识符
  teamId?: string; // 团队ID（如果是团队设置）
  appName: string; // 应用名称
  logo?: string; // 应用Logo URL
  favicon?: string; // 网站图标 URL
  primaryColor: string; // 主色调
  secondaryColor: string; // 次色调
  tertiaryColor?: string; // 第三色调
  customFonts?: {
    heading?: string;
    body?: string;
    monospace?: string;
  }; // 自定义字体
  loginPageSettings?: {
    backgroundImage?: string;
    welcomeMessage?: string;
    showTeamName: boolean;
  }; // 登录页面设置
  defaultLanguage: string; // 默认语言
  availableLanguages: string[]; // 可用语言
  maintenanceMode: boolean; // 是否处于维护模式
  maintenanceMessage?: string; // 维护消息
  supportEmail: string; // 支持邮箱
  helpCenterUrl?: string; // 帮助中心URL
  termsUrl?: string; // 服务条款URL
  privacyUrl?: string; // 隐私政策URL
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
  updatedBy: string; // 更新者ID
  featureFlags?: Record<string, boolean>; // 功能开关
}

// MARK: UI首选项-IDB
export interface UIPreferences {
  id?: number; // IndexedDB键
  userId: string; // 用户ID
  theme: "light" | "dark" | "auto"; // 主题
  sidebarCollapsed: boolean; // 侧边栏是否折叠
  sidebarWidth: number; // 侧边栏宽度
  density: "compact" | "comfortable" | "spacious"; // 界面密度
  fontSize: "small" | "medium" | "large"; // 字体大小
  animations: boolean; // 是否启用动画
  layout: "default" | "compact" | "focus"; // 布局类型
  customColors?: Record<string, string>; // 自定义颜色
  recentSearches?: string[]; // 最近搜索
  recentViews?: string[]; // 最近查看视图
  dashboardLayout?: any; // 仪表盘布局
  lastUpdated: number; // 最后更新时间
  syncStatus?: "synced" | "pending" | "error"; // 同步状态
}

// MARK: 布局配置-IDB
export interface LayoutConfig {
  id?: number; // IndexedDB键
  userId: string; // 用户ID
  viewType: string; // 视图类型
  columns?: string[]; // 列配置
  sorting?: {
    field: string;
    direction: "asc" | "desc";
  }[]; // 排序配置
  filters?: any[]; // 过滤器配置
  grouping?: string[]; // 分组配置
  pageSize: number; // 每页项目数
  customViews?: {
    id: string;
    name: string;
    config: any;
  }[]; // 自定义视图
  lastUpdated: number; // 最后更新时间
}
