import { useState } from "react";
import { Template } from "../template-data";
import {
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  useSensor,
  useSensors,
  KeyboardSensor,
  PointerSensor,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

/**
 * 自定义Hook，处理看板拖拽逻辑
 */
export function useBoardDragAndDrop(
  boardGroups: Record<string, Template[]>,
  onTemplateMove?: (
    templateId: string,
    sourceCategory: string,
    targetCategory: string
  ) => void,
  onUpdateCategory?: (category: string, templateId: number) => void,
  onTemplateOrderChange?: (templates: Template[]) => void,
  onPrepareNewCategory?: (template: Template) => void
) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);

  // 设置传感器
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 开始拖拽时的处理
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = Number(active.id);
    setActiveId(activeId.toString());

    // 找出被拖拽的模板对象
    for (const category in boardGroups) {
      const template = boardGroups[category].find((t) => t.id === activeId);
      if (template) {
        setActiveTemplate(template);
        break;
      }
    }
  };

  // 处理拖拽覆盖事件，用于跨列移动
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return null;

    const activeId = Number(active.id);
    const overId = Number(over.id);

    // 找出拖拽对象和目标对象所属的类别
    let activeCategory = "";
    let overCategory = "";

    for (const category in boardGroups) {
      if (boardGroups[category].some((t) => t.id === activeId)) {
        activeCategory = category;
      }
      if (boardGroups[category].some((t) => t.id === overId)) {
        overCategory = category;
      }
    }

    // 如果不是跨类别移动，则不需要处理
    if (activeCategory === overCategory) return null;

    // 找出被拖拽的模板
    const activeTemplate = boardGroups[activeCategory].find(
      (t) => t.id === activeId
    );
    if (!activeTemplate) return null;

    // 检查目标类别是否为特殊类别（如"创建新类别"）
    if (overCategory === "新建类别" && onPrepareNewCategory) {
      // 调用准备新类别的回调函数
      onPrepareNewCategory(activeTemplate);
      return null; // 中断后续处理，等待新类别创建
    }

    // 创建新的分组对象的逻辑现在由移至useBoardGroups的moveTemplate函数处理

    // 调用回调函数通知父组件
    if (onTemplateMove) {
      onTemplateMove(activeId.toString(), activeCategory, overCategory);
    }

    // 调用更新类别的回调函数
    if (onUpdateCategory) {
      onUpdateCategory(overCategory, activeId);
    }

    return {
      activeId,
      activeCategory,
      overCategory,
      activeTemplate,
    };
  };

  // 拖拽结束时的处理
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setActiveTemplate(null);
      return null;
    }

    const activeId = Number(active.id);
    const overId = Number(over.id);

    if (activeId !== overId) {
      // 找出拖拽对象和目标对象所属的类别
      let activeCategory = "";
      let overCategory = "";

      for (const category in boardGroups) {
        if (boardGroups[category].some((t) => t.id === activeId)) {
          activeCategory = category;
        }
        if (boardGroups[category].some((t) => t.id === overId)) {
          overCategory = category;
        }
      }

      // 检查是否为跨类别拖拽
      if (activeCategory !== overCategory && overCategory && onUpdateCategory) {
        // 调用更新类别的回调函数（如果handleDragOver中没有处理）
        onUpdateCategory(overCategory, activeId);

        const result = {
          type: "moveCategory" as const,
          activeId,
          sourceCategory: activeCategory,
          targetCategory: overCategory,
        };

        setActiveId(null);
        setActiveTemplate(null);
        return result;
      } else {
        // 在同一类别内重新排序
        const oldIndex = boardGroups[activeCategory].findIndex(
          (t) => t.id === activeId
        );
        const newIndex = boardGroups[activeCategory].findIndex(
          (t) => t.id === overId
        );

        if (oldIndex !== -1 && newIndex !== -1) {
          // 重排序逻辑已移至useBoardGroups的reorderTemplate函数

          const result = {
            type: "reorder" as const,
            category: activeCategory,
            templateId: activeId,
            oldIndex,
            newIndex,
          };

          setActiveId(null);
          setActiveTemplate(null);
          return result;
        }
      }
    }

    setActiveId(null);
    setActiveTemplate(null);
    return null;
  };

  return {
    activeId,
    activeTemplate,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
