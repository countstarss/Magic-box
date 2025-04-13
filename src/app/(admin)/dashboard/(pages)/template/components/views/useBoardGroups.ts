import { useState, useEffect } from "react";
import { Template } from "../template-data";

/**
 * 自定义Hook，处理看板分组逻辑
 * @param templates 模板数组
 * @returns 分组后的数据和设置函数
 */
export function useBoardGroups(templates: Template[]) {
  const [boardGroups, setBoardGroups] = useState<Record<string, Template[]>>(
    {}
  );

  // 当templates变化时，重新进行分组
  useEffect(() => {
    const groups: Record<string, Template[]> = {};

    // 按类别分组
    templates.forEach((template) => {
      if (!groups[template.category]) {
        groups[template.category] = [];
      }
      groups[template.category].push(template);
    });

    setBoardGroups(groups);
  }, [templates]);

  /**
   * 将模板从一个类别移动到另一个类别
   */
  const moveTemplate = (
    templateId: number,
    sourceCategory: string,
    targetCategory: string
  ) => {
    // 查找模板
    const template = boardGroups[sourceCategory]?.find(
      (t) => t.id === templateId
    );
    if (!template) return;

    const newGroups = { ...boardGroups };

    // 从源类别中移除
    newGroups[sourceCategory] = newGroups[sourceCategory].filter(
      (t) => t.id !== templateId
    );

    // 添加到目标类别
    if (!newGroups[targetCategory]) {
      newGroups[targetCategory] = [];
    }

    newGroups[targetCategory].push({
      ...template,
      category: targetCategory,
    });

    setBoardGroups(newGroups);
  };

  /**
   * 重新排序模板
   */
  const reorderTemplate = (
    category: string,
    templateId: number,
    oldIndex: number,
    newIndex: number
  ) => {
    const newGroups = { ...boardGroups };
    const [movedItem] = newGroups[category].splice(oldIndex, 1);
    newGroups[category].splice(newIndex, 0, movedItem);

    setBoardGroups(newGroups);

    return Object.values(newGroups).flat();
  };

  return {
    boardGroups,
    setBoardGroups,
    moveTemplate,
    reorderTemplate,
  };
}
