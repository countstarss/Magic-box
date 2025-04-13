import { useState, useCallback, useRef } from "react";
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

  // 使用ref存储上次拖拽信息，避免频繁状态更新
  const lastDragInfo = useRef<{
    activeId: number;
    activeCategory: string;
    overCategory: string;
  } | null>(null);

  // 设置传感器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // 增加激活延迟，减少拖拽触发频率
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 开始拖拽时的处理
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
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

      // 重置上次拖拽信息
      lastDragInfo.current = null;
    },
    [boardGroups]
  );

  // 处理拖拽覆盖事件，用于跨列移动
  // 只搜集必要信息，不主动触发状态更新
  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
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

      // 如果与上次拖拽信息相同，避免重复处理
      if (
        lastDragInfo.current &&
        lastDragInfo.current.activeId === activeId &&
        lastDragInfo.current.activeCategory === activeCategory &&
        lastDragInfo.current.overCategory === overCategory
      ) {
        return null;
      }

      // 更新上次拖拽信息
      lastDragInfo.current = {
        activeId,
        activeCategory,
        overCategory,
      };

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

      // 注意：不再调用回调函数，只返回必要信息
      return {
        activeId,
        activeCategory,
        overCategory,
        activeTemplate,
      };
    },
    [boardGroups, onPrepareNewCategory]
  );

  // 拖拽结束时的处理
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
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
        if (activeCategory !== overCategory && overCategory) {
          // 在拖拽结束时才调用回调函数
          if (onTemplateMove) {
            onTemplateMove(activeId.toString(), activeCategory, overCategory);
          }

          if (onUpdateCategory) {
            onUpdateCategory(overCategory, activeId);
          }

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
    },
    [boardGroups, onTemplateMove, onUpdateCategory]
  );

  return {
    activeId,
    activeTemplate,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
