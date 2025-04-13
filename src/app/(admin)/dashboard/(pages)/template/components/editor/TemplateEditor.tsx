"use client";

import React, { useRef, useState, useEffect } from "react";
import { EmailTemplate } from "@/lib/db/template-db";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft, Settings, Eye } from "lucide-react";
import EmailEditor from "react-email-editor";
import { TemplateInfoDialog } from "../dialog/TemplateInfoDialog";
import { EditorToolbar } from "./EditorToolbar";
import { Variable, predefinedVariables } from "./VariableManager";
import { extractVariables } from "@/lib/utils/template-variables";
import { TemplateVariablePreview } from "./TemplateVariablePreview";

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
  const [customVariables, setCustomVariables] = useState<Variable[]>([]);
  const [currentHtmlContent, setCurrentHtmlContent] = useState<string>('');
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [templateInfo, setTemplateInfo] = useState({
    name: template?.name || "",
    description: template?.description || "",
    category: template?.category || "",
    tags: template?.tags || [],
  });
  
  // Hooks
  const { toast } = useToast();

  // 当编辑器准备好且是新建模板时，自动显示信息对话框
  useEffect(() => {
    // 如果是新建模板（无ID）且编辑器已准备好，自动显示模板信息对话框
    if (isEditorReady && !template?.id && 
        (importType === 'blank' || importType === 'html')) {
      // 延迟一点显示对话框，确保编辑器加载完成
      const timer = setTimeout(() => {
        setIsInfoDialogOpen(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isEditorReady, template, importType]);

  // 编辑器准备好的回调
  const onEditorReady = () => {
    setIsEditorReady(true);
    
    try {
      // 如果编辑现有模板，加载设计
      if (template && template.design && emailEditorRef.current) {
        // 尝试确保design是一个有效的对象
        const designData = typeof template.design === 'string' 
          ? JSON.parse(template.design) 
          : template.design;
          
        emailEditorRef.current.editor.loadDesign(designData);
        
        // 加载完成后提取自定义变量
        if (template.htmlContent) {
          extractCustomVariablesFromHtml(template.htmlContent);
        }
      } 
      // 如果是导入HTML
      else if (importType === 'html' && importHtml && emailEditorRef.current) {
        emailEditorRef.current.editor.loadHTML(importHtml);
        
        // 从导入的HTML中提取自定义变量
        if (importHtml) {
          extractCustomVariablesFromHtml(importHtml);
        }
      }
      // 如果是导入设计
      else if (importType === 'template' && importDesign && emailEditorRef.current) {
        const designData = typeof importDesign === 'string'
          ? JSON.parse(importDesign)
          : importDesign;
          
        emailEditorRef.current.editor.loadDesign(designData);
      }
      // 如果已有保存的设计数据（例如从预览返回）
      else if (savedDesignData && emailEditorRef.current) {
        const designData = typeof savedDesignData === 'string'
          ? JSON.parse(savedDesignData)
          : savedDesignData;
          
        emailEditorRef.current.editor.loadDesign(designData);
        savedDesignData = null; // 加载后清空
      }
    } catch (error) {
      console.error('加载模板数据失败:', error);
      // 尝试备选方案
      if (template?.htmlContent && emailEditorRef.current) {
        console.log('尝试加载HTML内容');
        emailEditorRef.current.editor.loadHTML(template.htmlContent);
        
        // 提取自定义变量
        extractCustomVariablesFromHtml(template.htmlContent);
      }
    }
  };
  
  // 从HTML内容中提取自定义变量
  const extractCustomVariablesFromHtml = (html: string) => {
    try {
      // 提取变量名
      const varNames = extractVariables(html);
      
      // 过滤掉预定义变量，创建自定义变量数组
      const customVars: Variable[] = varNames
        .filter(name => !predefinedVariables.some(pre => pre.name === name))
        .map(name => ({
          name,
          label: name.replace(/_/g, ' '), // 简单转换为显示名称
          category: '自定义变量',
          example: `[${name}]`
        }));
      
      if (customVars.length > 0) {
        setCustomVariables(customVars);
      }
    } catch (error) {
      console.error('提取变量失败:', error);
    }
  };
  
  // 处理文本格式化
  const handleFormatText = (format: string, value?: string) => {
    if (!emailEditorRef.current) return;
    
    try {
      // 向编辑器发送格式化命令
      emailEditorRef.current.editor.execCommand(format, value);
    } catch (error) {
      console.error('格式化文本失败:', error);
    }
  };
  
  // 处理插入变量
  const handleInsertVariable = (variable: string) => {
    if (!emailEditorRef.current) return;
    
    try {
      // 向编辑器中插入变量的方法取决于编辑器API
      // 这里假设编辑器支持将变量作为文本插入
      emailEditorRef.current.editor.insertText(variable);
      
      toast({
        title: "变量已插入",
        description: `变量 ${variable} 已插入到编辑器`
      });
    } catch (error) {
      console.error('插入变量失败:', error);
      
      toast({
        title: "变量插入失败",
        description: "编辑器不支持直接插入变量，请手动复制粘贴",
        variant: "destructive"
      });
    }
  };
  
  // 处理字体大小选择
  const handleSelectFontSize = (size: string) => {
    if (!emailEditorRef.current) return;
    
    try {
      // 向编辑器发送字体大小命令
      emailEditorRef.current.editor.execCommand('fontSize', size);
    } catch (error) {
      console.error('设置字体大小失败:', error);
    }
  };

  // 获取当前编辑器的HTML内容
  const getCurrentHtml = async (): Promise<string> => {
    if (!emailEditorRef.current) {
      return '';
    }
    
    return new Promise<string>((resolve) => {
      emailEditorRef.current.editor.exportHtml((data: {design: any, html: string}) => {
        resolve(data.html);
      });
    });
  };
  
  // 打开预览对话框
  const handleOpenPreview = async () => {
    try {
      const html = await getCurrentHtml();
      setCurrentHtmlContent(html);
      setIsPreviewDialogOpen(true);
    } catch (error) {
      console.error('获取HTML内容失败:', error);
      toast({
        title: "预览失败",
        description: "无法获取当前编辑器内容",
        variant: "destructive"
      });
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
      
      // 使用Promise获取设计数据和HTML内容
      const designPromise = new Promise<any>((resolve) => {
        emailEditorRef.current.editor.saveDesign((design: any) => {
          resolve(design);
        });
      });
      
      const htmlPromise = getCurrentHtml();
      
      // 同时获取设计数据和HTML内容
      const [designData, htmlContent] = await Promise.all([designPromise, htmlPromise]);
      
      // 保存当前的HTML内容
      setCurrentHtmlContent(htmlContent);
      
      // 从HTML中提取新的自定义变量
      extractCustomVariablesFromHtml(htmlContent);
      
      // 生成缩略图URL - 理想情况下应从编辑器获取，但这里使用默认占位图
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
        isPublic: template?.isPublic || false,
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
      <div className="absolute top-2 left-4 right-4 z-10 flex justify-between items-center">
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
            onClick={handleOpenPreview}
            disabled={!isEditorReady}
          >
            <Eye className="mr-2 h-4 w-4" />
            预览变量
          </Button>
          
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
      
      {/* 自定义编辑器工具栏 */}
      {isEditorReady && (
        <div className="absolute top-12 left-4 right-4 z-10">
          <EditorToolbar
            onFormatText={handleFormatText}
            onInsertVariable={handleInsertVariable}
            onSelectFontSize={handleSelectFontSize}
            customVariables={customVariables}
          />
        </div>
      )}
      
      {/* Email编辑器 - 现在占据整个屏幕 */}
      <div className="flex-1 h-full w-full pt-24">
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
            },
            // 添加变量支持
            mergeTags: [...predefinedVariables, ...customVariables].reduce((acc, variable) => {
              acc[variable.name] = {
                name: variable.label,
                value: `{{${variable.name}}}`,
                sample: variable.example || `[${variable.name}]`
              };
              return acc;
            }, {} as Record<string, any>)
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
      
      {/* 变量预览组件 */}
      {currentHtmlContent && (
        <TemplateVariablePreview
          variables={[...predefinedVariables, ...customVariables]}
          htmlContent={currentHtmlContent}
        />
      )}
    </div>
  );
} 