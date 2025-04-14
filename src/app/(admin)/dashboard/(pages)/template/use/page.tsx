"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Template } from '../components/template-data';
import { useTemplates } from '@/contexts/TemplateContext';
import { TemplateUsageWorkflow } from '../components/usage/TemplateUsageWorkflow';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { EmailTemplate } from '@/lib/db/template-db';

export default function TemplateUsePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get('id');
  const { templates } = useTemplates();
  
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (templates && templateId) {
      const emailTemplate = templates.find(t => t.id === parseInt(templateId));
      if (emailTemplate) {
        // 转换EmailTemplate到Template类型，添加lastModified属性
        const template: Template = {
          id: emailTemplate.id!,
          name: emailTemplate.name,
          description: emailTemplate.description,
          category: emailTemplate.category,
          thumbnail: emailTemplate.thumbnail,
          isFeatured: emailTemplate.isFeatured,
          isStarred: emailTemplate.isStarred,
          isPublic: emailTemplate.isPublic,
          lastModified: emailTemplate.updatedAt.toISOString(),
          htmlContent: emailTemplate.htmlContent
        };
        setSelectedTemplate(template);
      }
    }
    
    setIsLoading(false);
  }, [templates, templateId]);
  
  // 如果没有找到模板，显示错误信息
  if (!isLoading && !selectedTemplate) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.back()}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <h1 className="text-2xl font-bold">未找到模板</h1>
        </div>
        <p>找不到指定的模板，请返回选择其他模板。</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-4 h-full">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.back()}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回
        </Button>
        <h1 className="text-2xl font-bold">
          {isLoading ? '加载中...' : `使用模板: ${selectedTemplate?.name}`}
        </h1>
      </div>
      
      {selectedTemplate && (
        <TemplateUsageWorkflow template={selectedTemplate} />
      )}
    </div>
  );
} 