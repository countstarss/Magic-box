"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, RefreshCw } from "lucide-react";
import { Variable } from "./VariableManager";
import { Card, CardContent } from "@/components/ui/card";
import { VariableData, generatePreview } from "@/lib/utils/template-variables";

interface TemplateVariablePreviewProps {
  variables: Variable[];
  htmlContent: string;
}

export function TemplateVariablePreview({ 
  variables,
  htmlContent
}: TemplateVariablePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // 生成预览数据
  const previewData: VariableData = variables.reduce((acc, variable) => {
    acc[variable.name] = variable.example || `[${variable.name}]`;
    return acc;
  }, {} as VariableData);
  
  // 生成预览HTML
  const previewHtml = generatePreview(htmlContent, previewData);
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="mr-2 h-4 w-4" />
          预览变量效果
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>变量预览</DialogTitle>
          <DialogDescription>
            预览邮件模板中的变量替换效果
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-4 h-[60vh]">
          <Card className="flex-1 overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-sm font-medium">变量数据</h3>
              <div className="text-xs text-muted-foreground">
                使用示例值替换变量
              </div>
            </div>
            <CardContent className="p-4 overflow-auto h-full">
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(previewData).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-1">
                    <span className="text-sm font-mono">{key}:</span>
                    <span className="text-sm text-muted-foreground break-words">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="flex-1 overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-sm font-medium">预览效果</h3>
            </div>
            <CardContent className="p-0 overflow-auto h-full">
              <iframe
                srcDoc={previewHtml}
                className="w-full h-full border-0"
                title="变量预览"
              />
            </CardContent>
          </Card>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 