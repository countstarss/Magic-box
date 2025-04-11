"use client";

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateTemplateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTemplateDialog({ isOpen, onOpenChange }: CreateTemplateDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>创建新模板</DialogTitle>
          <DialogDescription>
            选择从头开始创建或从现有模板复制
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <Button variant="outline" className="justify-start h-auto py-4 px-6">
              <div className="flex flex-col items-start">
                <span className="font-medium">空白模板</span>
                <span className="text-sm text-muted-foreground">从头开始创建您的模板</span>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-4 px-6">
              <div className="flex flex-col items-start">
                <span className="font-medium">使用模板库</span>
                <span className="text-sm text-muted-foreground">从我们精选的专业模板开始</span>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-4 px-6">
              <div className="flex flex-col items-start">
                <span className="font-medium">导入HTML</span>
                <span className="text-sm text-muted-foreground">上传您的HTML模板</span>
              </div>
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 