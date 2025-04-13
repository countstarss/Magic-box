import Dexie, { Table } from "dexie";

// 模板类型定义
export interface EmailTemplate {
  id?: number; // 自增主键
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  htmlContent: string; // 存储模板的HTML内容
  design: any; // 存储unlayer编辑器的设计JSON
  isFeatured: boolean;
  isStarred: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: string[]; // 标签数组，用于增强搜索和分类
  userId: string; // 用户ID，支持多用户环境
}

// 模板分类定义
export interface TemplateCategory {
  id?: number; // 自增主键
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string; // 归属用户
}

// 定义数据库类
export class TemplateDatabase extends Dexie {
  // 定义表
  templates!: Table<EmailTemplate, number>;
  categories!: Table<TemplateCategory, number>;

  constructor() {
    super("TemplateDatabase");

    // 定义数据库架构
    this.version(1).stores({
      templates:
        "++id, name, category, isFeatured, isStarred, createdAt, updatedAt, userId, *tags",
      categories: "++id, name, userId",
    });
  }

  // 获取模板列表（支持筛选）
  async getTemplates(
    options: {
      userId?: string;
      category?: string;
      featured?: boolean;
      starred?: boolean;
      search?: string;
      tags?: string[];
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<EmailTemplate[]> {
    let query = this.templates.toCollection();

    // 按用户筛选
    if (options.userId) {
      query = this.templates.where("userId").equals(options.userId);
    }

    // 获取所有记录
    let templates = await query.toArray();

    // 按类别筛选
    if (options.category) {
      templates = templates.filter((t) => t.category === options.category);
    }

    // 按特性筛选
    if (options.featured !== undefined) {
      templates = templates.filter((t) => t.isFeatured === options.featured);
    }

    // 按收藏筛选
    if (options.starred !== undefined) {
      templates = templates.filter((t) => t.isStarred === options.starred);
    }

    // 按标签筛选
    if (options.tags && options.tags.length > 0) {
      templates = templates.filter((t) =>
        options.tags!.some((tag) => t.tags.includes(tag))
      );
    }

    // 按关键词搜索
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      templates = templates.filter(
        (t) =>
          t.name.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower) ||
          t.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // 按最后更新时间排序（最新优先）
    templates.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    // 分页
    if (options.offset !== undefined || options.limit !== undefined) {
      const offset = options.offset || 0;
      const limit = options.limit || templates.length;
      templates = templates.slice(offset, offset + limit);
    }

    return templates;
  }

  // 获取单个模板
  async getTemplate(id: number): Promise<EmailTemplate | undefined> {
    return await this.templates.get(id);
  }

  // 添加或更新模板
  async saveTemplate(template: EmailTemplate): Promise<number> {
    const now = new Date();

    // 如果是新模板
    if (!template.id) {
      template.createdAt = now;
      template.updatedAt = now;
      return await this.templates.add(template);
    }
    // 如果是更新现有模板
    else {
      const id = template.id;
      template.updatedAt = now;
      await this.templates.update(id, { ...template });
      return id;
    }
  }

  // 删除模板
  async deleteTemplate(id: number): Promise<void> {
    await this.templates.delete(id);
  }

  // 切换星标状态
  async toggleStar(id: number): Promise<void> {
    const template = await this.getTemplate(id);
    if (template) {
      template.isStarred = !template.isStarred;
      template.updatedAt = new Date();
      await this.templates.update(id, {
        isStarred: template.isStarred,
        updatedAt: template.updatedAt,
      });
    }
  }

  // 切换精选状态
  async toggleFeatured(id: number): Promise<void> {
    const template = await this.getTemplate(id);
    if (template) {
      template.isFeatured = !template.isFeatured;
      template.updatedAt = new Date();
      await this.templates.update(id, {
        isFeatured: template.isFeatured,
        updatedAt: template.updatedAt,
      });
    }
  }

  // 获取所有分类
  async getCategories(userId?: string): Promise<TemplateCategory[]> {
    if (userId) {
      return await this.categories.where("userId").equals(userId).toArray();
    }
    return await this.categories.toArray();
  }

  // 添加分类
  async addCategory(category: TemplateCategory): Promise<number> {
    const now = new Date();
    category.createdAt = now;
    category.updatedAt = now;
    return await this.categories.add(category);
  }

  // 更新分类
  async updateCategory(
    id: number,
    name: string,
    description?: string
  ): Promise<void> {
    await this.categories.update(id, {
      name,
      description,
      updatedAt: new Date(),
    });
  }

  // 删除分类
  async deleteCategory(id: number): Promise<void> {
    await this.categories.delete(id);
  }
}

// 创建单例实例
export const templateDb = new TemplateDatabase();
export default templateDb;
