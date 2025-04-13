"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search } from "lucide-react";
import Image from "next/image";
import { useTemplates } from "@/contexts/TemplateContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { usePublicTemplates } from "../hooks/usePublicTemplates";

// 占位图像
const placeholderImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' text-anchor='middle' dominant-baseline='middle' fill='%23888888'%3E邮件模板缩略图%3C/text%3E%3C/svg%3E";

export default function TemplateLibraryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { createTemplate } = useTemplates();
  
  // 使用公开模板Hook
  const {
    publicTemplates,
    searchQuery,
    setSearchQuery,
    clearSearch,
    isLoading,
    error
  } = usePublicTemplates();
  
  // 处理使用模板（创建副本）
  const handleUseTemplate = useCallback(async (templateId: number) => {
    try {
      // 查找选定的模板
      const selectedTemplate = publicTemplates.find(t => t.id === templateId);
      
      if (selectedTemplate) {
        // 创建模板副本
        const newTemplate = {
          name: `${selectedTemplate.name} (副本)`,
          description: selectedTemplate.description,
          category: selectedTemplate.category,
          thumbnail: selectedTemplate.thumbnail,
          htmlContent: selectedTemplate.htmlContent,
          design: selectedTemplate.design,
          isFeatured: false,
          isStarred: false,
          isPublic: false, // 副本默认为私有
          tags: selectedTemplate.tags || [],
          userId: selectedTemplate.userId,
        };
        
        // 保存到数据库
        await createTemplate(newTemplate);
        
        toast({
          title: "模板已添加到您的账户",
          description: `已创建"${newTemplate.name}"`,
        });
        
        // 导航到我的模板页面
        router.push("/dashboard/template");
      }
    } catch (error) {
      console.error("使用模板失败:", error);
      toast({
        title: "操作失败",
        description: error instanceof Error ? error.message : "无法使用此模板",
        variant: "destructive"
      });
    }
  }, [publicTemplates, createTemplate, toast, router]);
  
  // 返回上一页
  const handleBack = useCallback(() => {
    router.push("/dashboard/template");
  }, [router]);
  
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <h1 className="text-2xl font-bold">公开模板库</h1>
        </div>
        
        {/* 搜索框 */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索模板..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {/* 加载状态 */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden flex flex-col">
              <Skeleton className="aspect-[16/9] w-full" />
              <CardContent className="p-4 flex-1">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* 错误状态 */}
      {!isLoading && error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <h3 className="font-medium">加载失败</h3>
          <p>{error.message}</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            重试
          </Button>
        </div>
      )}
      
      {/* 模板网格 */}
      {!isLoading && !error && publicTemplates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publicTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden flex flex-col">
              <div className="relative aspect-[16/9] overflow-hidden">
                {template.htmlContent ? (
                  <iframe
                    srcDoc={`
                      <!DOCTYPE html>
                      <html>
                      <head>
                        <meta charset="utf-8">
                        <style>
                          body {
                            margin: 0;
                            transform: scale(0.35);
                            transform-origin: 0 0;
                            width: 285%;
                            height: 285%;
                          }
                        </style>
                      </head>
                      <body>${template.htmlContent}</body>
                      </html>
                    `}
                    className="w-full h-full border-0"
                    title={template.name}
                    sandbox="allow-same-origin"
                  />
                ) : (
                  <Image
                    src={template.thumbnail || placeholderImage}
                    alt={template.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = placeholderImage;
                    }}
                  />
                )}
                
                {/* 特殊状态标签 */}
                <div className="absolute top-2 left-2 flex gap-1">
                  {template.isFeatured && (
                    <Badge>精选</Badge>
                  )}
                </div>
              </div>
              <CardContent className="p-4 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{template.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{template.description}</p>
                <div className="mt-2 flex justify-between items-center">
                  <Badge variant="outline" className="font-normal">
                    {template.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(template.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  onClick={() => handleUseTemplate(template.id as number)}
                  className="w-full"
                >
                  使用此模板
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* 空状态 */}
      {!isLoading && !error && publicTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">没有找到匹配的公开模板</p>
          {searchQuery && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={clearSearch}
            >
              清除搜索
            </Button>
          )}
        </div>
      )}
    </div>
  );
} 