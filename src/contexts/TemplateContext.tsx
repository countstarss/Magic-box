"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { EmailTemplate, TemplateCategory, templateDb } from "@/lib/db/template-db";
import { useLiveQuery } from "dexie-react-hooks";

// 模板筛选选项
export interface TemplateFilters {
  category?: string;
  search?: string;
  featured?: boolean;
  starred?: boolean;
  tags?: string[];
}

// 模板上下文类型
interface TemplateContextType {
  // 状态
  templates: EmailTemplate[];
  categories: TemplateCategory[];
  isLoading: boolean;
  error: Error | null;
  selectedTemplate: EmailTemplate | null;
  
  // 筛选状态
  filters: TemplateFilters;
  
  // 操作
  setFilters: (filters: Partial<TemplateFilters>) => void;
  resetFilters: () => void;
  selectTemplate: (template: EmailTemplate | null) => void;
  createTemplate: (template: Omit<EmailTemplate, "id" | "createdAt" | "updatedAt">) => Promise<number>;
  updateTemplate: (template: EmailTemplate) => Promise<number>;
  deleteTemplate: (id: number) => Promise<void>;
  toggleStar: (id: number) => Promise<void>;
  toggleFeatured: (id: number) => Promise<void>;
  createCategory: (name: string, description?: string) => Promise<number>;
  updateCategory: (id: number, name: string, description?: string) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  
  // 获取当前用户ID
  userId: string;
}

// 创建上下文
const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

// Provider Props 类型
interface TemplateProviderProps {
  children: ReactNode;
  userId: string;
}

// Provider 组件
export function TemplateProvider({ children, userId }: TemplateProviderProps) {
  // 状态
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [filters, setFiltersState] = useState<TemplateFilters>({});

  // 使用 Dexie 的 useLiveQuery 钩子获取实时更新的数据
  const templates = useLiveQuery(
    () => templateDb.getTemplates({
      userId,
      category: filters.category,
      featured: filters.featured,
      starred: filters.starred,
      search: filters.search,
      tags: filters.tags
    }),
    [userId, filters],
    [] // 默认为空数组
  );

  const categories = useLiveQuery(
    () => templateDb.getCategories(userId),
    [userId],
    [] // 默认为空数组
  );

  // 初始化时加载状态
  useEffect(() => {
    if (templates && categories) {
      setIsLoading(false);
    }
  }, [templates, categories]);

  // 更新筛选器
  const setFilters = (newFilters: Partial<TemplateFilters>) => {
    // 避免重复设置相同的值
    const needUpdate = Object.entries(newFilters).some(([key, value]) => {
      return filters[key as keyof TemplateFilters] !== value;
    });
    
    if (needUpdate) {
      setFiltersState(prev => ({ ...prev, ...newFilters }));
    }
  };

  // 重置筛选器
  const resetFilters = () => {
    // 避免重复重置
    if (Object.values(filters).some(value => value !== undefined)) {
      setFiltersState({});
    }
  };

  // 选择模板
  const selectTemplate = (template: EmailTemplate | null) => {
    setSelectedTemplate(template);
  };

  // 创建模板
  const createTemplate = async (templateData: Omit<EmailTemplate, "id" | "createdAt" | "updatedAt">) => {
    try {
      // 添加必要属性
      const template: EmailTemplate = {
        ...templateData,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userId,
      };
      return await templateDb.saveTemplate(template);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };

  // 更新模板
  const updateTemplate = async (template: EmailTemplate) => {
    try {
      return await templateDb.saveTemplate(template);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };

  // 删除模板
  const deleteTemplate = async (id: number) => {
    try {
      await templateDb.deleteTemplate(id);
      if (selectedTemplate && selectedTemplate.id === id) {
        setSelectedTemplate(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };

  // 切换星标状态
  const toggleStar = async (id: number) => {
    try {
      await templateDb.toggleStar(id);
      // 如果当前选中的模板是被操作的模板，更新状态
      if (selectedTemplate && selectedTemplate.id === id) {
        const updatedTemplate = await templateDb.getTemplate(id);
        if (updatedTemplate) {
          setSelectedTemplate(updatedTemplate);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };

  // 切换精选状态
  const toggleFeatured = async (id: number) => {
    try {
      await templateDb.toggleFeatured(id);
      // 如果当前选中的模板是被操作的模板，更新状态
      if (selectedTemplate && selectedTemplate.id === id) {
        const updatedTemplate = await templateDb.getTemplate(id);
        if (updatedTemplate) {
          setSelectedTemplate(updatedTemplate);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };

  // 创建分类
  const createCategory = async (name: string, description?: string) => {
    try {
      const category: TemplateCategory = {
        name,
        description,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId
      };
      return await templateDb.addCategory(category);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };

  // 更新分类
  const updateCategory = async (id: number, name: string, description?: string) => {
    try {
      await templateDb.updateCategory(id, name, description);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };

  // 删除分类
  const deleteCategory = async (id: number) => {
    try {
      await templateDb.deleteCategory(id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };

  // 上下文值
  const value: TemplateContextType = {
    templates: templates || [],
    categories: categories || [],
    isLoading,
    error,
    selectedTemplate,
    filters,
    setFilters,
    resetFilters,
    selectTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    toggleStar,
    toggleFeatured,
    createCategory,
    updateCategory,
    deleteCategory,
    userId
  };

  return (
    <TemplateContext.Provider value={value}>
      {children}
    </TemplateContext.Provider>
  );
}

// 自定义钩子
export function useTemplates() {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error("useTemplates must be used within a TemplateProvider");
  }
  return context;
} 