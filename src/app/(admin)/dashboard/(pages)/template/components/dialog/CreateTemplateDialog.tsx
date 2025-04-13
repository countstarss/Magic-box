"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileUp,
  PlusCircle,
  LayoutTemplate,
} from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/components/ui/use-toast";
import { useTemplates } from '@/contexts/TemplateContext';

interface CreateTemplateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTemplateDialog({ isOpen, onOpenChange }: CreateTemplateDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  // 状态
  const [selectedOption, setSelectedOption] = useState<'blank' | 'template' | 'html'>('blank');
  const [importStep, setImportStep] = useState(1);
  const [htmlContent, setHtmlContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 处理选项选择
  const handleOptionSelect = (option: 'blank' | 'template' | 'html') => {
    setSelectedOption(option);
    
    if (option === 'blank') {
      // 直接跳转到编辑页面，模板信息将在那里填写
      onOpenChange(false);
      router.push('/dashboard/template/edit?type=blank');
    } else {
      // 对于其他选项，显示下一步
      setImportStep(2);
    }
  };
  
  // 处理HTML导入
  const handleHtmlImport = () => {
    // 检查HTML内容
    if (!htmlContent.trim()) {
      toast({
        title: "HTML内容不能为空",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // 解析HTML内容，确保格式正确
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      
      if (doc.querySelector('parsererror')) {
        toast({
          title: "HTML格式无效",
          description: "请提供有效的HTML内容",
          variant: "destructive",
        });
        return;
      }
      
      // 存储HTML内容到会话存储
      sessionStorage.setItem('importedHtml', htmlContent);
      
      // 关闭对话框并导航到编辑页面
      onOpenChange(false);
      router.push(`/dashboard/template/edit?type=html`);
      
    } catch (error) {
      toast({
        title: "解析HTML失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    }
  };
  
  // 处理从模板库导入
  const handleTemplateLibrary = () => {
    // 关闭对话框并导航到模板库页面
    onOpenChange(false);
    router.push('/dashboard/template/library');
  };
  
  // 重置对话框状态
  const handleClose = () => {
    setSelectedOption('blank');
    setImportStep(1);
    setHtmlContent('');
    onOpenChange(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>创建新模板</DialogTitle>
          <DialogDescription>
            选择创建模板的方式
          </DialogDescription>
        </DialogHeader>
        
        {importStep === 1 && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <Button 
                variant="outline" 
                className="justify-start h-auto py-4 px-6"
                onClick={() => handleOptionSelect('blank')}
              >
                <div className="flex items-center gap-3">
                  <PlusCircle className="h-5 w-5 text-primary" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">空白模板</span>
                    <span className="text-sm text-muted-foreground">从头开始创建您的模板</span>
                  </div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start h-auto py-4 px-6"
                onClick={() => handleOptionSelect('template')}
              >
                <div className="flex items-center gap-3">
                  <LayoutTemplate className="h-5 w-5 text-primary" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">使用模板库</span>
                    <span className="text-sm text-muted-foreground">从我们精选的专业模板开始</span>
                  </div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start h-auto py-4 px-6"
                onClick={() => handleOptionSelect('html')}
              >
                <div className="flex items-center gap-3">
                  <FileUp className="h-5 w-5 text-primary" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">导入HTML</span>
                    <span className="text-sm text-muted-foreground">上传您的HTML模板</span>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        )}
        
        {importStep === 2 && selectedOption === 'html' && (
          <div className="space-y-4 py-4">
            <Label htmlFor="html-content">输入或粘贴HTML代码</Label>
            <Textarea
              id="html-content"
              placeholder="<html><body>您的模板代码...</body></html>"
              className="h-40 font-mono text-sm"
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              输入有效的HTML代码，将会在编辑器中解析并显示。
            </p>
          </div>
        )}
        
        {importStep === 2 && selectedOption === 'template' && (
          <div className="space-y-4 py-4">
            <p className="text-sm">
              您将被引导至模板库页面，在那里您可以浏览并选择一个起始模板。
            </p>
          </div>
        )}
        
        <DialogFooter className="flex items-center justify-between">
          {importStep === 2 && (
            <Button 
              variant="outline" 
              onClick={() => setImportStep(1)}
              className="mr-auto"
            >
              返回
            </Button>
          )}
          
          {importStep === 2 && selectedOption === 'html' && (
            <Button 
              onClick={handleHtmlImport}
              disabled={!htmlContent.trim() || isSubmitting}
            >
              {isSubmitting ? "处理中..." : "继续"}
            </Button>
          )}
          
          {importStep === 2 && selectedOption === 'template' && (
            <Button 
              onClick={handleTemplateLibrary}
            >
              浏览模板库
            </Button>
          )}
          
          <Button variant="outline" onClick={handleClose}>
            取消
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 