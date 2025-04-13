import { useState, useEffect, useCallback } from "react";
import { Template } from "../../template-data";

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
  // MARK: 移动类别
   * 将模板从一个类别移动到另一个类别
   */
  const moveTemplate = useCallback(
    (templateId: number, sourceCategory: string, targetCategory: string) => {
      // 如果源类别和目标类别相同，不需处理
      if (sourceCategory === targetCategory) return;

      // 如果源类别不存在，不需处理
      if (!boardGroups[sourceCategory]) return;

      // 查找模板
      const template = boardGroups[sourceCategory]?.find(
        (t) => t.id === templateId
      );
      if (!template) return;

      // 使用函数式更新，确保基于最新状态更新
      setBoardGroups((prevGroups) => {
        const newGroups = { ...prevGroups };

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

        return newGroups;
      });
    },
    [boardGroups]
  );

  /**
   * MARK: 重新排序模板
   * 重新排序模板
   */
  const reorderTemplate = useCallback(
    (
      category: string,
      templateId: number,
      oldIndex: number,
      newIndex: number
    ) => {
      // 使用函数式更新
      let allTemplates: Template[] = [];

      setBoardGroups((prevGroups) => {
        const newGroups = { ...prevGroups };

        if (!newGroups[category]) return newGroups;

        const [movedItem] = newGroups[category].splice(oldIndex, 1);
        newGroups[category].splice(newIndex, 0, movedItem);

        // 收集所有模板用于返回
        allTemplates = Object.values(newGroups).flat();

        return newGroups;
      });

      return allTemplates;
    },
    []
  );

  return {
    boardGroups,
    setBoardGroups,
    moveTemplate,
    reorderTemplate,
  };
}
