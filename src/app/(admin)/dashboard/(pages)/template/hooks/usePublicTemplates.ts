import { useState, useEffect, useMemo, useRef } from "react";
import { useTemplates } from "@/contexts/TemplateContext";
import { EmailTemplate } from "@/lib/db/template-db";

/**
 * 自定义Hook: 获取和过滤公开模板
 * @param initialSearchQuery 初始搜索查询
 * @returns 公开模板相关的状态和方法
 */
export function usePublicTemplates(initialSearchQuery: string = "") {
  // 状态
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const filtersInitialized = useRef(false);

  // 使用模板上下文
  const { templates, isLoading, error, setFilters, filters } = useTemplates();

  // 设置过滤器只显示公开模板
  useEffect(() => {
    // 只在首次渲染或filters.public未定义时设置过滤器
    if (!filtersInitialized.current || filters.public === undefined) {
      filtersInitialized.current = true;
      setFilters({ public: true });
    }

    // 组件卸载时清除过滤器
    return () => {
      setFilters({ public: undefined });
    };
  }, []); // 仅在挂载和卸载时执行

  // 过滤模板 - 只有在templates或searchQuery变化时才重新计算
  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) return templates;

    const query = searchQuery.toLowerCase();
    return templates.filter(
      (template) =>
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.category.toLowerCase().includes(query)
    );
  }, [templates, searchQuery]);

  // 清除搜索
  const clearSearch = () => setSearchQuery("");

  return {
    publicTemplates: filteredTemplates,
    searchQuery,
    setSearchQuery,
    clearSearch,
    isLoading,
    error,
  };
}
