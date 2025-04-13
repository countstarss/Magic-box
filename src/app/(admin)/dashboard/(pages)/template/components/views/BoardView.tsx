"use client";

import { useMemo } from 'react';
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

interface BoardViewProps {
  templates: Template[];
  onOpenPreview: (template: Template) => void;
  onToggleStar: (template: Template) => void;
  onTogglePublic: (template: Template) => void;
  onDuplicateTemplate: (template: Template) => void;
  onDeleteTemplate: (template: Template) => void;
}

export function BoardView({
  templates,
  onOpenPreview,
  onToggleStar,
  onTogglePublic,
  onDuplicateTemplate,
  onDeleteTemplate
}: BoardViewProps) {
  // 按分类将模板分组
  const boardGroups = useMemo(() => {
    const groups: Record<string, Template[]> = {};
    
    // 按类别分组
    templates.forEach(template => {
      if (!groups[template.category]) {
        groups[template.category] = [];
      }
      groups[template.category].push(template);
    });
    
    return groups;
  }, [templates]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Object.entries(boardGroups).map(([category, templates]) => (
        <div key={category} className="bg-muted/30 rounded-lg p-4 min-h-[200px] h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">{category}</h3>
            <Badge variant="outline">{templates.length}</Badge>
          </div>
          
          <div className="space-y-3 flex-1 overflow-auto">
            {templates.map((template) => (
              <div 
                key={template.id} 
                className="bg-white p-3 rounded-md border shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
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
                <div onClick={() => onOpenPreview(template)}>
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
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 