"use client";

import { Template, formatDate } from '../template-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Star, MoreHorizontal, Copy, Pencil, Trash2, StarOff 
} from 'lucide-react';

interface ListViewProps {
  templates: Template[];
  onOpenPreview: (template: Template) => void;
  onToggleStar: (template: Template) => void;
}

export function ListView({
  templates,
  onOpenPreview,
  onToggleStar
}: ListViewProps) {
  return (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 py-3 px-4 border-b bg-muted/40 font-medium text-sm">
        <div className="col-span-4 md:col-span-3">模板名称</div>
        <div className="col-span-2 hidden md:block">分类</div>
        <div className="col-span-2 text-center hidden md:block">状态</div>
        <div className="col-span-4 md:col-span-3">更新时间</div>
        <div className="col-span-4 md:col-span-2 text-right">操作</div>
      </div>
      
      {templates.map((template) => (
        <div 
          key={template.id} 
          className="grid grid-cols-12 py-3 px-4 border-b hover:bg-muted/20 items-center"
        >
          <div className="col-span-4 md:col-span-3 font-medium flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gray-100 flex-shrink-0"></div>
            <span className="line-clamp-1">{template.name}</span>
          </div>
          <div className="col-span-2 hidden md:block">
            <Badge variant="outline">{template.category}</Badge>
          </div>
          <div className="col-span-2 text-center hidden md:block">
            <div className="flex items-center justify-end gap-2 -translate-x-1/3">
              {template.isStarred && (
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </Button>
              )}
              {template.isFeatured && <Badge className="h-6">精选</Badge>}
            </div>
          </div>
          <div className="col-span-4 md:col-span-3 text-muted-foreground text-sm">
            {formatDate(template.lastModified)}
          </div>
          <div className="col-span-4 md:col-span-2 flex justify-end items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8" 
              onClick={() => onOpenPreview(template)}
            >
              预览
            </Button>
            <Button size="sm" className="h-8">使用</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Pencil className="mr-2 h-4 w-4" /> 编辑
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="mr-2 h-4 w-4" /> 复制
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleStar(template)}>
                  {template.isStarred ? (
                    <>
                      <StarOff className="mr-2 h-4 w-4" /> 取消收藏
                    </>
                  ) : (
                    <>
                      <Star className="mr-2 h-4 w-4" /> 收藏
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> 删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
} 