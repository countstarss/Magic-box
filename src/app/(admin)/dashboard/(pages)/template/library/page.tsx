"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Search, Bookmark, Star } from "lucide-react";
import Image from "next/image";

// 预置模板数据
const templateLibrary = [
  {
    id: "tpl-1",
    name: "极简周报通讯",
    description: "简洁现代的周报模板，适合发送内容摘要和重要更新",
    category: "通讯",
    thumbnail: "/templates/newsletter-minimal.jpg",
    design: { /* 设计数据 */ },
  },
  {
    id: "tpl-2",
    name: "产品发布公告",
    description: "突出展示新产品特性和优势的专业模板",
    category: "产品发布",
    thumbnail: "/templates/product-launch.jpg",
    design: { /* 设计数据 */ },
  },
  {
    id: "tpl-3",
    name: "限时促销活动",
    description: "醒目的促销模板，带有倒计时和清晰的号召性按钮",
    category: "促销活动",
    thumbnail: "/templates/promotion.jpg",
    design: { /* 设计数据 */ },
  },
  {
    id: "tpl-4",
    name: "欢迎新订阅者",
    description: "温馨友好的欢迎邮件，介绍您的品牌和预期内容",
    category: "欢迎邮件",
    thumbnail: "/templates/welcome.jpg",
    design: { /* 设计数据 */ },
  },
  {
    id: "tpl-5",
    name: "内容创作者简报",
    description: "专为博主和内容创作者设计的个性化通讯模板",
    category: "个人博客",
    thumbnail: "/templates/content-creator.jpg",
    design: { /* 设计数据 */ },
  },
  {
    id: "tpl-6",
    name: "数据驱动报告",
    description: "清晰展示统计数据和图表的专业报告模板",
    category: "通讯",
    thumbnail: "/templates/data-report.jpg",
    design: { /* 设计数据 */ },
  },
];

// 占位图像
const placeholderImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' text-anchor='middle' dominant-baseline='middle' fill='%23888888'%3E邮件模板缩略图%3C/text%3E%3C/svg%3E";

export default function TemplateLibraryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  
  // 过滤模板
  const filteredTemplates = templateLibrary.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // 处理选择模板
  const handleSelectTemplate = (templateId: string) => {
    // 在实际实现中，这里应该获取模板数据并存储到会话中
    const selectedTemplate = templateLibrary.find(t => t.id === templateId);
    
    if (selectedTemplate) {
      // 存储设计数据
      sessionStorage.setItem("selectedTemplateDesign", JSON.stringify(selectedTemplate.design));
      
      // 导航到编辑页面
      router.push(`/dashboard/template/edit?type=template`);
    }
  };
  
  // 返回上一页
  const handleBack = () => {
    router.push("/dashboard/template");
  };
  
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <h1 className="text-2xl font-bold">模板库</h1>
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
      
      {/* 模板网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="overflow-hidden flex flex-col">
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={template.thumbnail}
                alt={template.name}
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src = placeholderImage;
                }}
              />
            </div>
            <CardContent className="p-4 flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">{template.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
              <div className="mt-2">
                <span className="text-xs bg-muted px-2 py-1 rounded-md">
                  {template.category}
                </span>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button 
                onClick={() => handleSelectTemplate(template.id)}
                className="w-full"
              >
                使用此模板
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* 空状态 */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">没有找到匹配的模板</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setSearchQuery("")}
          >
            清除搜索
          </Button>
        </div>
      )}
    </div>
  );
} 