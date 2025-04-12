"use client";

import { useState, useEffect } from "react";
import { Template } from "../template-data";
import { subDays } from "date-fns";

// MARK: 筛选选项接口
export interface FilterOptions {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  categories: string[];
  showFeatured: boolean;
  showStarred: boolean;
}

// MARK: 排序类型
export type SortType = "newest" | "oldest" | "name";

// MARK: 标签筛选类型
export type TabType = "all" | "featured" | "starred";

interface UseTemplateFiltersProps {
  templates: Template[]; // 原始模板数据
  defaultCategory?: string;
  defaultTab?: TabType;
  defaultSort?: SortType;
}

export function useTemplateFilters({
  templates,
  defaultCategory = "全部",
  defaultTab = "all",
  defaultSort = "newest",
}: UseTemplateFiltersProps) {
  // 基础筛选状态
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
  const [sortBy, setSortBy] = useState<SortType>(defaultSort);

  // 高级筛选状态
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<FilterOptions>({
    dateRange: { from: undefined, to: undefined },
    categories: [],
    showFeatured: false,
    showStarred: false,
  });

  // 筛选后的模板数据
  const [filteredTemplates, setFilteredTemplates] =
    useState<Template[]>(templates);

  // 筛选和排序逻辑
  useEffect(() => {
    let result = [...templates];

    // 基础筛选
    // 按类别筛选
    if (selectedCategory !== "全部") {
      result = result.filter(
        (template) => template.category === selectedCategory
      );
    }

    // 按标签筛选
    if (activeTab === "featured") {
      result = result.filter((template) => template.isFeatured);
    } else if (activeTab === "starred") {
      result = result.filter((template) => template.isStarred);
    }

    // MARK: 按关键词筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (template) =>
          template.name.toLowerCase().includes(query) ||
          template.description.toLowerCase().includes(query)
      );
    }

    // MARK: 高级筛选
    if (showAdvancedFilters) {
      // 日期范围筛选
      if (advancedFilters.dateRange.from || advancedFilters.dateRange.to) {
        result = result.filter((template) => {
          const modifiedDate = new Date(template.lastModified);
          if (advancedFilters.dateRange.from && advancedFilters.dateRange.to) {
            return (
              modifiedDate >= advancedFilters.dateRange.from &&
              modifiedDate <= advancedFilters.dateRange.to
            );
          } else if (advancedFilters.dateRange.from) {
            return modifiedDate >= advancedFilters.dateRange.from;
          } else if (advancedFilters.dateRange.to) {
            return modifiedDate <= advancedFilters.dateRange.to;
          }
          return true;
        });
      }

      // MARK: 多选类别筛选
      if (advancedFilters.categories.length > 0) {
        result = result.filter((template) =>
          advancedFilters.categories.includes(template.category)
        );
      }

      // MARK: 精选收藏筛选
      if (advancedFilters.showFeatured && !advancedFilters.showStarred) {
        result = result.filter((template) => template.isFeatured);
      } else if (!advancedFilters.showFeatured && advancedFilters.showStarred) {
        result = result.filter((template) => template.isStarred);
      } else if (advancedFilters.showFeatured && advancedFilters.showStarred) {
        result = result.filter(
          (template) => template.isFeatured || template.isStarred
        );
      }
    }

    // MARK: 排序
    if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.lastModified).getTime() -
          new Date(a.lastModified).getTime()
      );
    } else if (sortBy === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.lastModified).getTime() -
          new Date(b.lastModified).getTime()
      );
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredTemplates(result);
  }, [
    templates,
    selectedCategory,
    activeTab,
    searchQuery,
    sortBy,
    showAdvancedFilters,
    advancedFilters,
  ]);

  // MARK: 重置高级筛选
  const resetAdvancedFilters = () => {
    setAdvancedFilters({
      dateRange: { from: undefined, to: undefined },
      categories: [],
      showFeatured: false,
      showStarred: false,
    });
  };

  // MARK: 日期范围选择
  const selectDateRange = (days: number) => {
    setAdvancedFilters({
      ...advancedFilters,
      dateRange: {
        from: subDays(new Date(), days),
        to: new Date(),
      },
    });
  };

  // MARK: 重置所有筛选
  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory(defaultCategory);
    setActiveTab(defaultTab);
    resetAdvancedFilters();
  };

  // MARK: 多选类别切换
  const toggleCategory = (category: string) => {
    const isSelected = advancedFilters.categories.includes(category);

    setAdvancedFilters({
      ...advancedFilters,
      categories: isSelected
        ? advancedFilters.categories.filter((c) => c !== category)
        : [...advancedFilters.categories, category],
    });
  };

  // MARK: 设置日期范围
  const setDateRange = (from?: Date, to?: Date) => {
    setAdvancedFilters({
      ...advancedFilters,
      dateRange: {
        from: from || advancedFilters.dateRange.from,
        to: to || advancedFilters.dateRange.to,
      },
    });
  };

  // MARK: 切换特性筛选
  const toggleFeatureFilter = (feature: "showFeatured" | "showStarred") => {
    setAdvancedFilters({
      ...advancedFilters,
      [feature]: !advancedFilters[feature],
    });
  };

  return {
    // MARK: 筛选状态
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    activeTab,
    setActiveTab,
    sortBy,
    setSortBy,

    // MARK: 高级筛选状态
    showAdvancedFilters,
    setShowAdvancedFilters,
    advancedFilters,
    setAdvancedFilters,

    // MARK: 筛选结果
    filteredTemplates,

    // MARK: 工具函数
    resetAdvancedFilters,
    resetAllFilters,
    selectDateRange,
    toggleCategory,
    setDateRange,
    toggleFeatureFilter,
  };
}
