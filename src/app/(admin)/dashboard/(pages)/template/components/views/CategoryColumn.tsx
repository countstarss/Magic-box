"use client";

import { Template } from '../template-data';
import { Badge } from '@/components/ui/badge';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableTemplateItem } from './SortableTemplateItem';
import { useDroppable } from '@dnd-kit/core';
import { Plus } from 'lucide-react';

// 类别列组件的props类型定义
export interface CategoryColumnProps {
  category: string;
  templates: Template[];
  onOpenPreview: (template: Template) => void;
  onToggleStar: (template: Template) => void;
  onTogglePublic: (template: Template) => void;
  onDuplicateTemplate: (template: Template) => void;
  onDeleteTemplate: (template: Template) => void;
  onUpdateCategory: (category: string, templateId: number) => void;
  onPrepareNewCategory: (template: Template) => void;
}

// 渲染单个列/类别
export function CategoryColumn({ 
  category, 
  templates, 
  onOpenPreview,
  onToggleStar,
  onTogglePublic,
  onDuplicateTemplate,
  onDeleteTemplate,
  onUpdateCategory,
  onPrepareNewCategory
}: CategoryColumnProps) {
  // 使用useDroppable使整个类别列可作为拖拽目标
  const { setNodeRef, isOver } = useDroppable({
    id: category,
    data: { type: 'category', category }
  });

  return (
    <div 
      ref={setNodeRef}
      className={`bg-muted/30 rounded-lg p-4 min-w-[300px] h-full flex flex-col transition-colors
        ${isOver ? 'bg-muted/60 ring-2 ring-primary/50' : ''}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">{category}</h3>
        <Badge variant="outline">{templates.length}</Badge>
      </div>
      
      <div className="space-y-3 flex-1 overflow-auto">
        <SortableContext 
          items={templates.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {templates.length > 0 ? (
            templates.map((template) => (
              <SortableTemplateItem
                key={template.id}
                template={template}
                onOpenPreview={onOpenPreview}
                onToggleStar={onToggleStar}
                onTogglePublic={onTogglePublic}
                onDuplicateTemplate={onDuplicateTemplate}
                onDeleteTemplate={onDeleteTemplate}
                onUpdateCategory={onUpdateCategory}
                onPrepareNewCategory={onPrepareNewCategory}
              />
            ))
          ) : (
            <div className={`h-32 flex items-center justify-center border border-dashed 
              rounded-md text-muted-foreground text-sm p-4 text-center
              ${isOver ? 'bg-muted/50 border-primary/30' : 'border-muted-foreground/30'}`}>
              <div>
                <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>将模板拖放到此处</p>
                <p className="text-xs mt-1">或创建新模板</p>
              </div>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
} 