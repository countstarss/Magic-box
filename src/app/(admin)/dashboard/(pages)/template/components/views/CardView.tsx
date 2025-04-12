"use client";

import { Template, formatDate, placeholderImage } from '../template-data';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
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
import { 
  Star, MoreHorizontal, Copy, Pencil, Trash2, Tag, PlusCircle, Check
} from 'lucide-react';

interface CardViewProps {
  templates: Template[];
  templateCategories: string[];
  onOpenPreview: (template: Template) => void;
  onToggleStar: (template: Template) => void;
  onUpdateCategory: (category: string) => void;
  onPrepareNewCategory: (template: Template) => void;
}

export function CardView({
  templates,
  templateCategories,
  onOpenPreview,
  onToggleStar,
  onUpdateCategory,
  onPrepareNewCategory
}: CardViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {templates.map((template) => (
        <Card key={template.id} className="overflow-hidden">
          <div className="relative">
            {/* 缩略图 */}
            <div 
              className="h-[180px] bg-cover bg-center cursor-pointer"
              style={{ backgroundImage: `url(${placeholderImage})` }}
              onClick={() => onOpenPreview(template)}
            />
            
            {/* 收藏按钮 */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white backdrop-blur-sm"
              onClick={() => onToggleStar(template)}
            >
              {template.isStarred ? (
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ) : (
                <Star className="h-4 w-4" />
              )}
            </Button>
            
            {/* 精选标签 */}
            {template.isFeatured && (
              <Badge className="absolute top-2 left-2">
                精选
              </Badge>
            )}
          </div>
          
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg cursor-pointer" onClick={() => onOpenPreview(template)}>
                {template.name}
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onOpenPreview(template)}>
                    预览
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Pencil className="mr-2 h-4 w-4" /> 编辑
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="mr-2 h-4 w-4" /> 复制
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Tag className="mr-2 h-4 w-4" /> 修改分类
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {templateCategories.filter(c => c !== '全部').map((category) => (
                          <DropdownMenuItem 
                            key={category}
                            onClick={() => onUpdateCategory(category)}
                          >
                            {category}
                            {template.category === category && (
                              <Check className="ml-auto h-4 w-4" />
                            )}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onPrepareNewCategory(template)}>
                          <PlusCircle className="mr-2 h-4 w-4" /> 创建新分类
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> 删除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex justify-between">
              <CardDescription>
                <Badge variant="outline" className="font-normal">
                  {template.category}
                </Badge>
              </CardDescription>
              <CardDescription>更新于 {formatDate(template.lastModified)}</CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {template.description}
            </p>
          </CardContent>
          
          <CardFooter className="flex justify-between pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-[48%]" 
              onClick={() => onOpenPreview(template)}
            >
              预览
            </Button>
            <Button size="sm" className="w-[48%]">使用</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
} 