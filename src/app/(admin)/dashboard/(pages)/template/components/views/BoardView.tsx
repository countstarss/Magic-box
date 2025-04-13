"use client";

import { useCallback, useState, useEffect } from 'react';
import { Template } from '../template-data';
import { DndContext, DragOverlay, closestCorners, UniqueIdentifier } from '@dnd-kit/core';
import { CategoryColumn } from './board/CategoryColumn';
import { useBoardGroups } from './board/useBoardGroups';
import { useBoardDragAndDrop } from './board/useBoardDragAndDrop';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';

// 添加类别排序所需的组件
interface SortableColumnWrapperProps {
  id: string;
  children: React.ReactNode;
}

// 使列可排序的包装组件
function SortableColumnWrapper({ id, children }: SortableColumnWrapperProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="h-full"
    >
      {children}
    </div>
  );
}

interface BoardViewProps {
  templates: Template[];
  templateCategories: string[]; // 添加所有类别列表
  onOpenPreview: (template: Template) => void;
  onToggleStar: (template: Template) => void;
  onTogglePublic: (template: Template) => void;
  onDuplicateTemplate: (template: Template) => void;
  onDeleteTemplate: (template: Template) => void;
  onTemplateOrderChange?: (templates: Template[]) => void;
  onTemplateMove?: (templateId: string, sourceCategory: string, targetCategory: string) => void;
  onUpdateCategory: (category: string, templateId: number) => void;
  onPrepareNewCategory: (template: Template) => void;
  onCategoriesOrderChange?: (categories: string[]) => void; // 添加列顺序变化回调
}

export function BoardView({
  templates,
  templateCategories,
  onOpenPreview,
  onToggleStar,
  onTogglePublic,
  onDuplicateTemplate,
  onDeleteTemplate,
  onTemplateOrderChange,
  onTemplateMove,
  onUpdateCategory,
  onPrepareNewCategory,
  onCategoriesOrderChange
}: BoardViewProps) {
  // 使用自定义hook处理分组逻辑
  const { boardGroups, setBoardGroups, moveTemplate, reorderTemplate } = useBoardGroups(templates);
  
  // 类别顺序状态
  const [categoryOrder, setCategoryOrder] = useState<string[]>([]);
  
  // 拖拽状态（区分模板拖拽和列拖拽）
  const [isDraggingColumn, setIsDraggingColumn] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  
  // 初始化类别顺序
  useEffect(() => {
    // 如果没有设置过顺序，则使用模板类别和所有类别
    if (categoryOrder.length === 0) {
      // 合并已有模板的类别和所有类别，去重
      const combinedCategories = Array.from(
        new Set([...Object.keys(boardGroups), ...templateCategories])
      );
      setCategoryOrder(combinedCategories);
    } else {
      // 确保新的类别被添加到顺序中
      const newCategories = [...categoryOrder];
      let hasChanges = false;
      
      // 添加新类别
      [...Object.keys(boardGroups), ...templateCategories].forEach(category => {
        if (!newCategories.includes(category)) {
          newCategories.push(category);
          hasChanges = true;
        }
      });
      
      // 移除不存在的类别
      const existingCategories = new Set([...Object.keys(boardGroups), ...templateCategories]);
      const categoriesToRemove = newCategories.filter(cat => !existingCategories.has(cat));
      
      if (categoriesToRemove.length > 0) {
        categoriesToRemove.forEach(cat => {
          const index = newCategories.indexOf(cat);
          if (index !== -1) {
            newCategories.splice(index, 1);
            hasChanges = true;
          }
        });
      }
      
      if (hasChanges) {
        setCategoryOrder(newCategories);
      }
    }
  }, [boardGroups, templateCategories, categoryOrder]);
  
  // 使用自定义hook处理拖拽逻辑
  const { 
    activeId, 
    activeTemplate, 
    sensors, 
    handleDragStart, 
    handleDragOver, 
    handleDragEnd 
  } = useBoardDragAndDrop(
    boardGroups,
    onTemplateMove,
    onUpdateCategory,
    onTemplateOrderChange,
    onPrepareNewCategory
  );
  
  // 处理拖拽开始
  const onDragStart = (event: any) => {
    const { active } = event;
    // 检查当前拖拽的是列还是模板项
    if (typeof active.id === 'string' && !active.id.includes('-')) {
      // 如果ID是字符串且不包含短横线，认为是拖拽列
      setIsDraggingColumn(true);
      setActiveCategoryId(active.id);
    } else {
      // 否则是拖拽模板项
      setIsDraggingColumn(false);
      handleDragStart(event);
    }
  };
  
  // 处理拖拽结束的响应
  const onDragEnd = (event: any) => {
    if (isDraggingColumn) {
      // 处理列排序逻辑
      const { active, over } = event;
      
      if (over && active.id !== over.id) {
        setCategoryOrder(currentOrder => {
          const oldIndex = currentOrder.indexOf(active.id);
          const newIndex = currentOrder.indexOf(over.id);
          
          if (oldIndex !== -1 && newIndex !== -1) {
            const newOrder = [...currentOrder];
            newOrder.splice(oldIndex, 1);
            newOrder.splice(newIndex, 0, active.id);
            
            // 通知父组件顺序变化
            if (onCategoriesOrderChange) {
              onCategoriesOrderChange(newOrder);
            }
            
            return newOrder;
          }
          
          return currentOrder;
        });
      }
      
      setIsDraggingColumn(false);
      setActiveCategoryId(null);
    } else {
      // 处理模板拖拽逻辑
      const result = handleDragEnd(event);
      
      if (result) {
        if (result.type === 'moveCategory') {
          // 模板已经在handleDragOver中处理了类别变更，这里处理UI状态
          moveTemplate(
            result.activeId,
            result.sourceCategory,
            result.targetCategory
          );
          
          // 通知父组件更新模板类别
          if (onUpdateCategory) {
            onUpdateCategory(result.targetCategory, result.activeId);
          }
        } else if (result.type === 'reorder') {
          // 处理同一类别中的重新排序
          const updatedTemplates = reorderTemplate(
            result.category,
            result.templateId,
            result.oldIndex,
            result.newIndex
          );
          
          // 通知父组件顺序变化
          if (onTemplateOrderChange) {
            onTemplateOrderChange(updatedTemplates);
          }
        }
      }
    }
  };
  
  // 处理拖拽覆盖的响应
  const onDragOver = (event: any) => {
    if (!isDraggingColumn) {
      // 只有拖拽模板时才处理
      return handleDragOver(event);
    }
    return null;
  };
  
  // 渲染拖动覆盖层
  const renderDragOverlay = () => {
    if (isDraggingColumn && activeCategoryId) {
      // 渲染列拖拽的覆盖样式
      return (
        <div className="bg-muted/60 rounded-lg p-4 min-w-[300px] h-full opacity-80">
          <div className="font-medium">{activeCategoryId}</div>
        </div>
      );
    } else if (activeTemplate) {
      // 渲染模板拖拽的覆盖样式
      return (
        <div className="bg-white p-3 rounded-md border shadow-md opacity-80">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium line-clamp-1">{activeTemplate.name}</h4>
          </div>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
            {activeTemplate.description}
          </p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="flex-1 overflow-x-auto w-[calc(100vw-160px)]">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex overflow-x-auto pb-6 gap-6 h-full min-h-[500px]">
          {categoryOrder.length === 0 ? (
            <div className="flex items-center justify-center w-full h-full">
              <div className="text-center p-8">
                <p className="text-muted-foreground mb-2">没有可用的类别</p>
                <p className="text-sm text-muted-foreground">
                  创建新模板或添加类别来开始组织您的模板
                </p>
              </div>
            </div>
          ) : (
            <SortableContext 
              items={categoryOrder} 
              strategy={horizontalListSortingStrategy}
            >
              {categoryOrder.map((category) => (
                <SortableColumnWrapper key={category} id={category}>
                  <CategoryColumn
                    category={category}
                    templates={boardGroups[category] || []} // 使用空数组处理没有模板的类别
                    onOpenPreview={onOpenPreview}
                    onToggleStar={onToggleStar}
                    onTogglePublic={onTogglePublic}
                    onDuplicateTemplate={onDuplicateTemplate}
                    onDeleteTemplate={onDeleteTemplate}
                    onUpdateCategory={onUpdateCategory}
                    onPrepareNewCategory={onPrepareNewCategory}
                  />
                </SortableColumnWrapper>
              ))}
            </SortableContext>
          )}
        </div>
        
        <DragOverlay>
          {(activeId || activeCategoryId) && renderDragOverlay()}
        </DragOverlay>
      </DndContext>
    </div>
  );
} 