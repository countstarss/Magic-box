"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { X, Tag } from 'lucide-react';
import { useTemplates } from '@/contexts/TemplateContext';
import { EmailTemplate } from '@/lib/db/template-db';

interface TemplateInfoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: {
    name?: string;
    description?: string;
    category?: string;
    tags?: string[];
  };
  onSave: (data: {
    name: string;
    description: string;
    category: string;
    tags: string[];
  }) => void;
}

export function TemplateInfoDialog({ 
  isOpen, 
  onOpenChange, 
  initialData, 
  onSave 
}: TemplateInfoDialogProps) {
  // 状态
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [currentTag, setCurrentTag] = useState('');
  const [isValid, setIsValid] = useState(false);
  
  // Hooks
  const { categories } = useTemplates();
  
  // 当初始数据变化时更新表单
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setCategory(initialData.category || '');
      setTags(initialData.tags || []);
    }
  }, [initialData]);
  
  // 验证表单
  useEffect(() => {
    setIsValid(!!name && !!category);
  }, [name, category]);
  
  // 添加标签
  const addTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag('');
    }
  };

  // 删除标签
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // 保存并关闭
  const handleSave = () => {
    if (isValid) {
      onSave({
        name,
        description,
        category,
        tags
      });
      onOpenChange(false);
    }
  };
  
  // 取消并重置
  const handleCancel = () => {
    onOpenChange(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>模板信息</DialogTitle>
          <DialogDescription>
            填写模板的基本信息，完成后即可保存您的邮件模板。
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-right">
              模板名称 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="输入模板名称"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category" className="text-right">
              分类 <span className="text-destructive">*</span>
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-right">标签</Label>
            <div className="flex">
              <Input
                id="tags"
                placeholder="添加标签"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={addTag}
                className="ml-2"
              >
                <Tag size={16} />
              </Button>
            </div>
            
            {/* 标签显示 */}
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="opacity-70 hover:opacity-100">
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-right">描述</Label>
            <Textarea
              id="description"
              placeholder="输入模板描述"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-20"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            取消
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!isValid}
          >
            保存信息
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 