"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import TemplateEditor from "../components/editor/TemplateEditor";
import { EmailTemplate } from "@/lib/db/template-db";
import { useTemplates } from "@/contexts/TemplateContext";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditTemplatePage() {
  // 状态
  const [template, setTemplate] = useState<EmailTemplate | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [importHtml, setImportHtml] = useState<string | undefined>(undefined);
  const [importType, setImportType] = useState<"blank" | "template" | "html">("blank");
  
  // Hooks
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { templates, createTemplate, updateTemplate } = useTemplates();
  
  // 获取URL参数
  const templateId = searchParams.get("id");
  const type = searchParams.get("type");
  
  // 加载模板数据
  useEffect(() => {
    const loadData = async () => {
      try {
        // 编辑现有模板
        if (templateId) {
          const id = parseInt(templateId);
          const foundTemplate = templates.find(t => t.id === id);
          
          if (!foundTemplate) {
            toast({
              title: "模板不存在",
              description: "找不到所请求的模板",
              variant: "destructive",
            });
            router.push("/dashboard/template");
            return;
          }
          
          setTemplate(foundTemplate);
          setImportType("template");
        } 
        // 新建模板
        else if (type) {
          // 确保type是有效的类型
          const validType = ["blank", "template", "html"].includes(type) 
            ? type as "blank" | "template" | "html" 
            : "blank";
          
          setImportType(validType);
          
          // 如果是HTML导入，从会话存储获取HTML内容
          if (validType === "html") {
            const html = sessionStorage.getItem("importedHtml");
            if (html) {
              setImportHtml(html);
              // 清除会话存储
              sessionStorage.removeItem("importedHtml");
            } else {
              toast({
                title: "没有HTML内容",
                description: "找不到要导入的HTML内容",
                variant: "destructive",
              });
              router.push("/dashboard/template");
              return;
            }
          }
          // 如果是模板库导入，从会话存储获取设计数据
          else if (validType === "template") {
            const designData = sessionStorage.getItem("selectedTemplateDesign");
            if (!designData) {
              console.log("没有找到模板设计数据");
              // 继续使用空白模板，无需重定向
            }
          }
        } else {
          // 默认为空白模板
          setImportType("blank");
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("加载模板失败:", error);
        toast({
          title: "加载失败",
          description: error instanceof Error ? error.message : "未知错误",
          variant: "destructive",
        });
        router.push("/dashboard/template");
      }
    };
    
    loadData();
  }, [templateId, type, templates, toast, router]);
  
  // 检查是否已经加载了模板数据
  useEffect(() => {
    if (!isLoading && importType && templates.length > 0) {
      console.log("模板类型:", importType);
    }
  }, [isLoading, importType, templates.length]);

  // 保存模板
  const handleSaveTemplate = async (templateData: Omit<EmailTemplate, "id" | "createdAt" | "updatedAt">) => {
    try {
      // 编辑现有模板
      if (template && template.id) {
        await updateTemplate({
          ...template,
          ...templateData,
        });
        
        toast({
          title: "模板已更新",
          description: `模板 "${templateData.name}" 已成功更新`,
        });
      } 
      // 创建新模板
      else {
        await createTemplate(templateData);
        
        toast({
          title: "模板已创建",
          description: `模板 "${templateData.name}" 已成功创建`,
        });
      }
      
      // 返回模板列表页
      router.push("/dashboard/template");
    } catch (error) {
      console.error("保存模板失败:", error);
      toast({
        title: "保存失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    }
  };
  
  // 取消编辑
  const handleCancel = () => {
    router.push("/dashboard/template");
  };
  
  // 加载中状态
  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  // 渲染编辑器
  return (
    <div className="h-full overflow-hidden">
      <TemplateEditor
        template={template}
        onSave={handleSaveTemplate}
        onCancel={handleCancel}
        importType={importType}
        importHtml={importHtml}
      />
    </div>
  );
} 