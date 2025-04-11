import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Template } from '../template-data';

interface CreateCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCategory?: (categoryName: string) => void;
  templateForCategory?: Template | null; // 使用正确的模板类型
}

export function CreateCategoryDialog({
  isOpen,
  onOpenChange,
  onAddCategory,
  templateForCategory
}: CreateCategoryDialogProps) {
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = () => {
    if (newCategoryName && onAddCategory) {
      onAddCategory(newCategoryName);
      setNewCategoryName(''); // 重置输入
      onOpenChange(false); // 关闭对话框
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>创建新分类</DialogTitle>
          <DialogDescription>
            添加新的模板分类，便于更好地组织和管理模板。
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="category-name" className="mb-2 block">分类名称</Label>
          <Input
            id="category-name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="输入分类名称"
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleAddCategory} disabled={!newCategoryName}>
            创建分类
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
