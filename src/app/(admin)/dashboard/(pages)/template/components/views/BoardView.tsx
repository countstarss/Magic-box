"use client";

import { Template } from '../template-data';
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import { CategoryColumn } from './CategoryColumn';
import { useBoardGroups } from './useBoardGroups';
import { useBoardDragAndDrop } from './useBoardDragAndDrop';

interface BoardViewProps {
  templates: Template[];
  onOpenPreview: (template: Template) => void;
  onToggleStar: (template: Template) => void;
  onTogglePublic: (template: Template) => void;
  onDuplicateTemplate: (template: Template) => void;
  onDeleteTemplate: (template: Template) => void;
  onTemplateOrderChange?: (templates: Template[]) => void;
  onTemplateMove?: (templateId: string, sourceCategory: string, targetCategory: string) => void;
  onUpdateCategory: (category: string, templateId: number) => void;
  onPrepareNewCategory: (template: Template) => void;
}

export function BoardView({
  templates,
  onOpenPreview,
  onToggleStar,
  onTogglePublic,
  onDuplicateTemplate,
  onDeleteTemplate,
  onTemplateOrderChange,
  onTemplateMove,
  onUpdateCategory,
  onPrepareNewCategory
}: BoardViewProps) {
  // 使用自定义hook处理分组逻辑
  const { boardGroups, setBoardGroups, moveTemplate, reorderTemplate } = useBoardGroups(templates);
  
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
  
  // 处理拖拽结束的响应
  const onDragEnd = (event: any) => {
    const result = handleDragEnd(event);
    
    if (result) {
      if (result.type === 'moveCategory') {
        // 模板已经在handleDragOver中处理了类别变更，这里处理UI状态
        moveTemplate(
          result.activeId,
          result.sourceCategory,
          result.targetCategory
        );
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
  };
  
  // 处理拖拽覆盖的响应
  const onDragOver = (event: any) => {
    const result = handleDragOver(event);
    
    if (result) {
      // 处理UI更新
      moveTemplate(
        result.activeId,
        result.activeCategory,
        result.overCategory
      );
    }
  };
  
  // 渲染拖动覆盖层
  const renderDragOverlay = () => {
    if (!activeTemplate) return null;
    
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
  };

  return (
    <div className="flex-1 overflow-x-auto w-[calc(100vw-200px)]">
      <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="flex overflow-x-auto pb-6 gap-6">
        {Object.entries(boardGroups).map(([category, categoryTemplates]) => (
          <CategoryColumn
            key={category}
            category={category}
            templates={categoryTemplates}
            onOpenPreview={onOpenPreview}
            onToggleStar={onToggleStar}
            onTogglePublic={onTogglePublic}
            onDuplicateTemplate={onDuplicateTemplate}
            onDeleteTemplate={onDeleteTemplate}
            onUpdateCategory={onUpdateCategory}
            onPrepareNewCategory={onPrepareNewCategory}
          />
        ))}
      </div>
      
      <DragOverlay>{activeId && renderDragOverlay()}</DragOverlay>
    </DndContext>
    </div>
  );
} 