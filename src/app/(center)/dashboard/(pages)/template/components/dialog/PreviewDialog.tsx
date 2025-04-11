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
import { Smartphone, Tablet, Monitor } from 'lucide-react';
import { useState } from 'react';
import { Template } from '../template-data';

interface PreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  template: Template | null;
}

export function PreviewDialog({ isOpen, onOpenChange, template }: PreviewDialogProps) {
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <DialogTitle>{template.name}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={previewDevice === 'mobile' ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setPreviewDevice('mobile')}
              >
                <Smartphone size={16} />
              </Button>
              <Button
                variant={previewDevice === 'tablet' ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setPreviewDevice('tablet')}
              >
                <Tablet size={16} />
              </Button>
              <Button
                variant={previewDevice === 'desktop' ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setPreviewDevice('desktop')}
              >
                <Monitor size={16} />
              </Button>
            </div>
          </div>
          <DialogDescription>{template.description}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-gray-50">
          <div className={`
            bg-white overflow-auto shadow-lg rounded 
            ${previewDevice === 'mobile' ? 'w-[320px] h-[540px]' : 
              previewDevice === 'tablet' ? 'w-[768px] h-[80%]' : 
              'w-[90%] h-[80%]'}
          `}>
            <div className="p-6 h-full flex items-center justify-center text-center text-muted-foreground">
              <div>
                <p>这里将显示 {template.name} 的预览内容</p>
                <p className="text-sm mt-2">此处将展示真实的邮件模板内容</p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="p-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            关闭
          </Button>
          <Button>
            使用此模板
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 