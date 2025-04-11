// MARK: 模板基本信息
export interface Template {
  id: string; // 唯一标识符
  teamId: string; // 团队ID
  name: string; // 模板名称
  description?: string; // 模板描述
  categoryId?: string; // 分类ID
  tags?: string[]; // 标签列表
  thumbnailUrl?: string; // 缩略图URL
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
  createdBy: string; // 创建者ID
  lastModifiedBy: string; // 最后修改者ID
  isPublic: boolean; // 是否公开
  isStarred: boolean; // 是否收藏
  status: "draft" | "published" | "archived"; // 状态
  useCount: number; // 使用次数
  lastUsedAt?: number; // 最后使用时间
  customProperties?: Record<string, any>; // 自定义属性
  version: number; // 当前版本号
}

// MARK: 模板分类
export interface TemplateCategory {
  id: string; // 唯一标识符
  teamId: string; // 团队ID
  name: string; // 分类名称
  description?: string; // 分类描述
  color?: string; // 分类颜色
  icon?: string; // 分类图标
  parentId?: string; // 父分类ID
  order: number; // 排序顺序
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
  createdBy: string; // 创建者ID
  templateCount: number; // 模板数量
}

// MARK: 模板共享权限
export interface TemplateSharing {
  id: string; // 唯一标识符
  templateId: string; // 模板ID
  sharedWith: "team" | "user" | "role" | "public"; // 共享对象类型
  teamId?: string; // 团队ID
  userId?: string; // 用户ID
  roleId?: string; // 角色ID
  permission: "view" | "edit" | "admin"; // 权限级别
  createdAt: number; // 创建时间
  updatedBy: string; // 最后更新者
  expiresAt?: number; // 过期时间
  shareLink?: string; // 共享链接
  passwordProtected: boolean; // 是否密码保护
  sharePassword?: string; // 共享密码(加密存储)
}

// MARK: 模板内容-文档
export interface TemplateContent {
  id: string; // 唯一标识符
  templateId: string; // 关联的模板ID
  version: number; // 版本号
  htmlContent: string; // HTML内容
  textContent?: string; // 纯文本内容
  subject?: string; // 电子邮件主题
  preheader?: string; // 电子邮件预览文本
  structure: any; // 模板结构(JSON)
  assets: TemplateAsset[]; // 模板资源
  variables: TemplateVariable[]; // 模板变量
  styles: any; // 样式设置(JSON)
  metadata: any; // 元数据(JSON)
  size: number; // 内容大小(字节)
  createdAt: number; // 创建时间
  createdBy: string; // 创建者ID
}

// MARK: 模板资源
export interface TemplateAsset {
  id: string; // 唯一标识符
  type: "image" | "font" | "css" | "js"; // 资源类型
  name: string; // 资源名称
  url: string; // 资源URL
  size?: number; // 资源大小
  dimensions?: {
    width: number;
    height: number;
  }; // 图片尺寸
  alt?: string; // 替代文本
  createdAt: number; // 创建时间
}

// MARK: 模板变量
export interface TemplateVariable {
  id: string; // 唯一标识符
  name: string; // 变量名称
  defaultValue?: string; // 默认值
  type: "text" | "image" | "url" | "date" | "number" | "boolean" | "list"; // 变量类型
  description?: string; // 变量描述
  required: boolean; // 是否必填
  validationRule?: string; // 验证规则
  options?: string[]; // 选项列表(用于选择类型)
}

// MARK: 模板历史版本-文档
export interface TemplateVersion {
  id: string; // 唯一标识符
  templateId: string; // 模板ID
  version: number; // 版本号
  contentId: string; // 内容ID
  changeDescription?: string; // 变更描述
  createdAt: number; // 创建时间
  createdBy: string; // 创建者ID
  isPinned: boolean; // 是否固定版本
  restoredFrom?: number; // 从哪个版本恢复
}

// MARK: 模板使用记录
export interface TemplateUsage {
  id: string; // 唯一标识符
  templateId: string; // 模板ID
  userId: string; // 用户ID
  usedAt: number; // 使用时间
  context: "email" | "campaign" | "automation" | "other"; // 使用上下文
  contextId?: string; // 上下文ID
  customProperties?: Record<string, any>; // 自定义属性
}

// MARK: 模板评分
export interface TemplateRating {
  id: string; // 唯一标识符
  templateId: string; // 模板ID
  userId: string; // 用户ID
  rating: number; // 评分(1-5)
  comment?: string; // 评论
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
}

// MARK: 模板编辑器状态-IDB
export interface TemplateEditorState {
  id?: number; // IndexedDB键
  userId: string; // 用户ID
  templateId: string; // 模板ID
  autosaveContent: string; // 自动保存内容
  autosaveMetadata: any; // 自动保存元数据
  lastEditedAt: number; // 最后编辑时间
  undoStack: any[]; // 撤销栈
  redoStack: any[]; // 重做栈
  selectedElementId?: string; // 当前选中元素
  zoom: number; // 缩放比例
  viewMode: "desktop" | "mobile" | "split"; // 视图模式
  panelState: Record<string, boolean>; // 面板开关状态
}

// MARK: 模板本地缓存-IDB
export interface TemplateLocalCache {
  id?: number; // IndexedDB键
  userId: string; // 用户ID
  cacheType: "favorites" | "recent" | "drafts" | "components"; // 缓存类型
  data: any; // 缓存数据
  lastUpdated: number; // 最后更新时间
  syncStatus: "synced" | "pending" | "error"; // 同步状态
}
