"use client";

import { Template } from '../template-data';
import { Badge } from '@/components/ui/badge';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableTemplateItem } from './SortableTemplateItem';

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
  return (
    <div className="bg-muted/30 rounded-lg p-4 min-w-[300px] h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">{category}</h3>
        <Badge variant="outline">{templates.length}</Badge>
      </div>
      
      <div className="space-y-3 flex-1 overflow-auto">
        <SortableContext 
          items={templates.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {templates.map((template) => (
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
          ))}
        </SortableContext>
      </div>
    </div>
  );
} 