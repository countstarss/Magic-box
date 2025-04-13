"use client";

import { Template, formatDate } from '../../template-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, MoreHorizontal, Copy, Pencil, Trash2, Tag, GripVertical,
  ChevronDown, PlusCircle, Check
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTemplates } from '@/contexts/TemplateContext';

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
  // 获取所有类别
  const { categories } = useTemplates();
  const availableCategories = categories.map(c => c.name);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: template.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 1 : 0
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`bg-white p-3 rounded-md border shadow-sm hover:shadow-md transition-all group ${
        isDragging ? 'ring-2 ring-primary/50 shadow-lg' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div 
            {...listeners}
            {...attributes}
            className="cursor-grab opacity-30 hover:opacity-100 touch-none"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <h4 
            className="font-medium line-clamp-1 cursor-pointer"
            onClick={() => onOpenPreview(template)}
          >
            {template.name}
          </h4>
        </div>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
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
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onOpenPreview(template);
              }}>
                <Pencil className="mr-2 h-4 w-4" /> 编辑
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onDuplicateTemplate(template);
              }}>
                <Copy className="mr-2 h-4 w-4" /> 复制
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onToggleStar(template);
                }}
              >
                <Star className="mr-2 h-4 w-4" /> 
                {template.isStarred ? "取消收藏" : "收藏"}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onTogglePublic(template);
                }}
              >
                <Tag className="mr-2 h-4 w-4" /> 
                {template.isPublic ? "设为私有" : "发布为公开"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Tag className="mr-2 h-4 w-4" /> 修改分类
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {availableCategories.filter(c => c !== template.category).map((category) => (
                      <DropdownMenuItem 
                        key={category}
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          e.preventDefault();
                          onUpdateCategory(category, template.id); 
                        }}
                      >
                        {category}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onPrepareNewCategory(template);
                      }}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> 创建新分类
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onDeleteTemplate(template);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> 删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div 
        className="cursor-pointer ml-6" 
        onClick={() => onOpenPreview(template)}
      >
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {template.description}
        </p>
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              {formatDate(template.lastModified)}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div 
                  className="flex items-center gap-1 cursor-pointer hover:text-primary" 
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  <Badge variant="outline" className="h-5 text-[10px] px-1">
                    {template.category}
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Badge>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[160px]">
                {availableCategories.map((category) => (
                  <DropdownMenuItem 
                    key={category}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onUpdateCategory(category, template.id);
                    }}
                    className="flex items-center justify-between"
                  >
                    {category}
                    {template.category === category && (
                      <Check className="h-3 w-3" />
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onPrepareNewCategory(template);
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> 创建新分类
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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