"use client";

import { useState } from "react";
import { Template } from "../template-data";

interface UseTemplateActionsProps {
  activeTab: string;
  onUpdateTemplates: (updatedTemplates: Template[]) => void;
}

export function useTemplateActions({
  activeTab,
  onUpdateTemplates,
}: UseTemplateActionsProps) {
  // 模板操作状态
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedTemplateForCategory, setSelectedTemplateForCategory] =
    useState<Template | null>(null);

  // 打开预览对话框
  const openPreview = (template: Template) => {
    setSelectedTemplate(template);
    setPreviewDialogOpen(true);
  };

  // MARK: toggleStar
  const toggleStar = (template: Template, templates: Template[]) => {
    const updatedTemplates = templates.map((t) => {
      if (t.id === template.id) {
        return { ...t, isStarred: !t.isStarred };
      }
      return t;
    });

    // 在实际应用中，这里应该有一个API调用来更新后端数据
    // 目前仅在前端更新UI，真实项目中需要替换为后端API调用
    const filteredTemplates = updatedTemplates.filter(
      (t) =>
        activeTab === "all" ||
        (activeTab === "featured" && t.isFeatured) ||
        (activeTab === "starred" && t.isStarred)
    );

    onUpdateTemplates(filteredTemplates);
  };

  // MARK: 更新模板分类
  const updateTemplateCategory = (category: string, templates: Template[]) => {
    if (selectedTemplateForCategory) {
      const updatedTemplates = templates.map((t) => {
        if (t.id === selectedTemplateForCategory.id) {
          return { ...t, category };
        }
        return t;
      });
      // 这里应该有API调用来更新后端数据
      onUpdateTemplates(updatedTemplates);
      setSelectedTemplateForCategory(null);
    }
  };

  // 准备打开分类对话框
  const prepareForCategoryChange = (template: Template) => {
    setSelectedTemplateForCategory(template);
  };

  return {
    selectedTemplate,
    previewDialogOpen,
    setPreviewDialogOpen,
    openPreview,
    toggleStar,
    updateTemplateCategory,
    prepareForCategoryChange,
    selectedTemplateForCategory,
    setSelectedTemplateForCategory,
  };
}
