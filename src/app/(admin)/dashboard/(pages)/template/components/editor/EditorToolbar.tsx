"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link,
  Image,
  List,
  ListOrdered,
  Type,
  VariableIcon,
  ChevronDown,
  User,
  Building,
  CalendarDays,
  Tag
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Variable, predefinedVariables, variableCategories } from './VariableManager';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { placeholderImage } from '../template-data';

// 编辑器工具栏属性
interface EditorToolbarProps {
  onInsertVariable: (variable: string) => void;
  onFormatText: (format: string, value?: string) => void;
  onSelectFontSize: (size: string) => void;
  customVariables?: Variable[];
}

// 字体大小选项
const fontSizes = [
  { label: '小', value: '12px' },
  { label: '正常', value: '16px' },
  { label: '中', value: '20px' },
  { label: '大', value: '24px' },
  { label: '超大', value: '32px' },
];

// 编辑器工具栏组件
export function EditorToolbar({ 
  onInsertVariable, 
  onFormatText,
  onSelectFontSize,
  customVariables = []
}: EditorToolbarProps) {
  // 合并预定义变量和自定义变量
  const allVariables = [...predefinedVariables, ...customVariables.filter(
    // 过滤掉与预定义变量同名的自定义变量
    customVar => !predefinedVariables.some(preVar => preVar.name === customVar.name)
  )];
  
  // 按类别分组变量
  const groupedVariables = allVariables.reduce<Record<string, Variable[]>>((acc, variable) => {
    if (!acc[variable.category]) {
      acc[variable.category] = [];
    }
    acc[variable.category].push(variable);
    return acc;
  }, {});
  
  // 获取变量类别对应的图标
  const getCategoryIcon = (category: string) => {
    const categoryConfig = variableCategories.find(c => c.name === category);
    return categoryConfig?.icon || <Tag className="h-4 w-4" />;
  };
  
  return (
    <div className="bg-muted/40 border rounded-md mb-2 p-1 flex flex-wrap gap-1 items-center">
      {/* 文本格式化工具 */}
      <TooltipProvider>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => onFormatText('bold')}
              >
                <Bold className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>加粗</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => onFormatText('italic')}
              >
                <Italic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>斜体</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => onFormatText('underline')}
              >
                <Underline className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>下划线</TooltipContent>
          </Tooltip>
        </div>
        
        <div className="h-8 w-[1px] bg-border mx-1" />
        
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => onFormatText('justifyLeft')}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>左对齐</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => onFormatText('justifyCenter')}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>居中对齐</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => onFormatText('justifyRight')}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>右对齐</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => onFormatText('justifyFull')}
              >
                <AlignJustify className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>两端对齐</TooltipContent>
          </Tooltip>
        </div>
        
        <div className="h-8 w-[1px] bg-border mx-1" />
        
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => onFormatText('insertUnorderedList')}
              >
                <List className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>无序列表</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => onFormatText('insertOrderedList')}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>有序列表</TooltipContent>
          </Tooltip>
        </div>
        
        <div className="h-8 w-[1px] bg-border mx-1" />
        
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => {
                  const url = prompt('输入链接地址:', 'https://');
                  if (url) onFormatText('createLink', url);
                }}
              >
                <Link className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>插入链接</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => {
                  const url = prompt('输入图片地址:', 'https://');
                  if (url) onFormatText('insertImage', url);
                }}
              >
                <img 
                  src={placeholderImage}
                  height={16} 
                  width={16} 
                  className=" h-4 w-4"
                  alt="placeholder"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>插入图片</TooltipContent>
          </Tooltip>
        </div>
        
        <div className="h-8 w-[1px] bg-border mx-1" />
        
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <Type className="h-4 w-4 mr-1" />
                <Select onValueChange={onSelectFontSize}>
                  <SelectTrigger className="h-8 w-24">
                    <SelectValue placeholder="字号" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TooltipTrigger>
            <TooltipContent>字体大小</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
      
      <div className="flex-1" />
      
      {/* 变量插入工具 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="ml-auto">
            <VariableIcon className="mr-1 h-4 w-4" />
            插入变量
            <ChevronDown className="ml-1 h-3 w-3 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {variableCategories.map((category) => (
            <React.Fragment key={category.name}>
              <DropdownMenuLabel className="flex items-center gap-2">
                {category.icon}
                {category.name}
              </DropdownMenuLabel>
              <DropdownMenuGroup>
                {groupedVariables[category.name]?.map((variable) => (
                  <DropdownMenuItem 
                    key={variable.name}
                    onClick={() => onInsertVariable(`{{${variable.name}}}`)}
                  >
                    <div className="flex-1">
                      <div className="text-sm">{variable.label}</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {`{{${variable.name}}}`}
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 