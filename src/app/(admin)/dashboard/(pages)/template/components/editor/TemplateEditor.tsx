"use client";

import React, { useRef, useState, useEffect } from "react";
import { EmailTemplate } from "@/lib/db/template-db";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useTemplates } from "@/contexts/TemplateContext";
import { Save, ArrowLeft, Settings } from "lucide-react";
import EmailEditor from "react-email-editor";
import { TemplateInfoDialog } from "../dialog/TemplateInfoDialog";

// 由于没有安装依赖，暂时使用类型定义
interface EmailEditorProps {
  ref: React.RefObject<any>;
  onReady?: () => void;
  projectId?: number;
  options?: {
    customCSS?: string[];
    customJS?: string[];
    appearance?: {
      theme?: 'light' | 'dark';
      panels?: {
        tools?: {
          dock?: 'left' | 'right';
        };
      };
    };
    features?: {
      preview?: boolean;
    };
    mergeTags?: Record<string, any>;
  };
  minHeight?: string;
}

// 本地内存中保存的设计数据
let savedDesignData: any = null;

interface TemplateEditorProps {
  template?: EmailTemplate;
  onSave: (template: Omit<EmailTemplate, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
  importType?: 'blank' | 'template' | 'html';
  importHtml?: string;
  importDesign?: any;
}

export default function TemplateEditor({
  template,
  onSave,
  onCancel,
  importType = 'blank',
  importHtml,
  importDesign,
}: TemplateEditorProps) {
  // 引用编辑器
  const emailEditorRef = useRef<any>(null);
  
  // 状态
  const [isSaving, setIsSaving] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const [templateInfo, setTemplateInfo] = useState({
    name: template?.name || "",
    description: template?.description || "",
    category: template?.category || "",
    tags: template?.tags || [],
  });
  
  // Hooks
  const { toast } = useToast();

  // 编辑器准备好的回调
  const onEditorReady = () => {
    setIsEditorReady(true);
    
    // 如果编辑现有模板，加载设计
    if (template && template.design && emailEditorRef.current) {
      emailEditorRef.current.editor.loadDesign(template.design);
    } 
    // 如果是导入HTML
    else if (importType === 'html' && importHtml && emailEditorRef.current) {
      emailEditorRef.current.editor.loadHTML(importHtml);
    }
    // 如果是导入设计
    else if (importType === 'template' && importDesign && emailEditorRef.current) {
      emailEditorRef.current.editor.loadDesign(importDesign);
    }
    // 如果已有保存的设计数据（例如从预览返回）
    else if (savedDesignData && emailEditorRef.current) {
      emailEditorRef.current.editor.loadDesign(savedDesignData);
      savedDesignData = null; // 加载后清空
    }
  };

  // 保存模板
  const handleSave = async () => {
    if (!templateInfo.name || !templateInfo.category) {
      setIsInfoDialogOpen(true);
      return;
    }

    if (!emailEditorRef.current) {
      toast({
        title: "编辑器未准备就绪",
        description: "请稍后再试",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      
      // 导出设计JSON和HTML
      // 这里是示例代码，实际使用时需要使用emailEditorRef.current.editor的方法
      const designData = { /* 编辑器设计数据 */ };
      const htmlContent = "<!-- 模板HTML内容 -->";
      
      // 生成缩略图URL
      const thumbnail = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' text-anchor='middle' dominant-baseline='middle' fill='%23888888'%3E邮件模板缩略图%3C/text%3E%3C/svg%3E";
      
      const templateData: Omit<EmailTemplate, "id" | "createdAt" | "updatedAt"> = {
        name: templateInfo.name,
        description: templateInfo.description,
        category: templateInfo.category,
        thumbnail,
        htmlContent,
        design: designData,
        isFeatured: template?.isFeatured || false,
        isStarred: template?.isStarred || false,
        tags: templateInfo.tags,
        userId: template?.userId || "current-user-id", // 在实际应用中，应从认证系统获取
      };
      
      onSave(templateData);
      
    } catch (error) {
      console.error("保存模板失败:", error);
      toast({
        title: "保存失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 更新模板信息
  const handleUpdateTemplateInfo = (data: {
    name: string;
    description: string;
    category: string;
    tags: string[];
  }) => {
    setTemplateInfo(data);
  };

  // 渲染UI
  return (
    <div className="flex flex-col h-full relative">
      {/* 浮动操作工具栏 */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          className="bg-white shadow-md"
          onClick={onCancel}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-white shadow-md"
            onClick={() => setIsInfoDialogOpen(true)}
          >
            <Settings className="mr-2 h-4 w-4" />
            模板信息
          </Button>
          
          <Button
            size="sm"
            className="shadow-md"
            onClick={handleSave}
            disabled={isSaving || !isEditorReady}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "保存中..." : "保存模板"}
          </Button>
        </div>
      </div>
      
      {/* Email编辑器 - 现在占据整个屏幕 */}
      <div className="flex-1 h-full w-full">
        <EmailEditor
          ref={emailEditorRef}
          onReady={onEditorReady}
          minHeight="100%"
          options={{
            appearance: {
              theme: 'light',
              panels: {
                tools: {
                  dock: 'left'
                }
              }
            },
            features: {
              preview: true
            }
          }}
        />
      </div>
      
      {/* 模板信息对话框 */}
      <TemplateInfoDialog
        isOpen={isInfoDialogOpen}
        onOpenChange={setIsInfoDialogOpen}
        initialData={templateInfo}
        onSave={handleUpdateTemplateInfo}
      />
    </div>
  );
} 