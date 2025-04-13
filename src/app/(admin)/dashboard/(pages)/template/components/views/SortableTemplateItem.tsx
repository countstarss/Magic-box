"use client";

import { Template, formatDate } from '../template-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, MoreHorizontal, Copy, Pencil, Trash2, Tag 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// 可拖拽模板项组件的props类型定义
export interface SortableTemplateItemProps {
  template: Template;
  onOpenPreview: (template: Template) => void;
  onToggleStar: (template: Template) => void;
  onTogglePublic: (template: Template) => void;
  onDuplicateTemplate: (template: Template) => void;
  onDeleteTemplate: (template: Template) => void;
  onUpdateCategory: (category: string, templateId: number) => void;
  onPrepareNewCategory: (template: Template) => void;
}

// 可拖拽模板项组件
export function SortableTemplateItem({
  template,
  onOpenPreview,
  onToggleStar,
  onTogglePublic,
  onDuplicateTemplate,
  onDeleteTemplate,
  onUpdateCategory,
  onPrepareNewCategory
}: SortableTemplateItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: template.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-white p-3 rounded-md border shadow-sm hover:shadow-md transition-shadow cursor-grab group"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 
          className="font-medium line-clamp-1"
          onClick={() => onOpenPreview(template)}
        >
          {template.name}
        </h4>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar(template);
            }}
          >
            {template.isStarred ? (
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            ) : (
              <Star className="h-3 w-3" />
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem onClick={() => onOpenPreview(template)}>
                <Pencil className="mr-2 h-4 w-4" /> 编辑
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicateTemplate(template)}>
                <Copy className="mr-2 h-4 w-4" /> 复制
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStar(template);
                }}
              >
                <Star className="mr-2 h-4 w-4" /> 
                {template.isStarred ? "取消收藏" : "收藏"}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePublic(template);
                }}
              >
                <Tag className="mr-2 h-4 w-4" /> 
                {template.isPublic ? "设为私有" : "发布为公开"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => onDeleteTemplate(template)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> 删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div {...listeners} onClick={() => onOpenPreview(template)}>
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {template.description}
        </p>
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">
            {formatDate(template.lastModified)}
          </span>
          <div className="flex gap-1">
            {template.isFeatured && (
              <Badge className="text-[10px] h-5">精选</Badge>
            )}
            {template.isPublic && (
              <Badge variant="secondary" className="text-[10px] h-5">公开</Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 