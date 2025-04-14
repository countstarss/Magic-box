"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SimpleRichTextEditor } from "../editor/SimpleRichTextEditor";
import { Variable, predefinedVariables } from "../editor/VariableManager";
import { generatePreview, VariableData, extractVariables } from "@/lib/utils/template-variables";
import { highlightVariables } from "@/lib/utils/template-variables";
import { PlusCircle, Trash2, Eye, RefreshCw, Mail, Copy } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Template } from "../template-data";

interface VariableInterpolationDemoProps {
  template?: Template;
  initialVariables?: Variable[];
  previewMode?: boolean;
  previewData?: VariableData;
  onVariablesChange?: (newVariables: Variable[]) => void;
}

export function VariableInterpolationDemo({
  template,
  initialVariables = [],
  previewMode = false,
  previewData,
  onVariablesChange
}: VariableInterpolationDemoProps) {
  // 状态管理
  const [templateHtml, setTemplateHtml] = useState<string>(
    template?.htmlContent || 
    `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <h2 style="color: #4f46e5;">您好，{{recipient_name|尊敬的用户}}！</h2>
      <p>感谢您对{{company_name|我们公司}}的支持与信任。</p>
      <p>我们很高兴地通知您，您的账户已成功激活。您可以使用以下信息登录：</p>
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p><strong>用户名:</strong> {{username|您的用户名}}</p>
        <p><strong>注册日期:</strong> {{registration_date|2023年1月1日}}</p>
        <p><strong>会员等级:</strong> {{membership_level|普通会员}}</p>
      </div>
      <p>如有任何问题，请随时联系我们的客服团队：{{support_email|support@example.com}}</p>
      <p>祝您使用愉快！</p>
      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">{{company_name|我们公司}} - {{company_address|公司地址}}</p>
      </div>
    </div>`
  );
  const [recipients, setRecipients] = useState<VariableData[]>([
    previewData || {
      recipient_name: "张三",
      username: "zhangsan123",
      registration_date: "2023年6月15日",
      membership_level: "黄金会员",
      company_name: "未来科技有限公司",
      company_address: "北京市海淀区科技园路100号",
      support_email: "support@future-tech.com"
    }
  ]);
  const [currentRecipientIndex, setCurrentRecipientIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(previewMode ? "preview" : "template");
  const [editingRecipient, setEditingRecipient] = useState<VariableData>({...recipients[0]});
  const [availableVariables, setAvailableVariables] = useState<string[]>([]);
  const [customVariables, setCustomVariables] = useState<Variable[]>(initialVariables);
  
  // 初始化：提取模板中的变量
  useEffect(() => {
    const extractedVars = extractVariables(templateHtml);
    setAvailableVariables(extractedVars);
  }, []);
  
  // 当previewData变化时更新recipients
  useEffect(() => {
    if (previewMode && previewData) {
      setRecipients([previewData]);
      setCurrentRecipientIndex(0);
      setEditingRecipient({...previewData});
    }
  }, [previewMode, previewData]);
  
  // 处理模板HTML更改
  const handleTemplateChange = (html: string) => {
    setTemplateHtml(html);
    
    // 提取模板中的变量
    const extractedVars = extractVariables(html);
    setAvailableVariables(extractedVars);
    
    // 初始化新变量的默认值
    const updatedRecipients = recipients.map(recipient => {
      const newRecipient = {...recipient};
      extractedVars.forEach(varName => {
        if (newRecipient[varName] === undefined) {
          newRecipient[varName] = `[${varName}]`;
        }
      });
      return newRecipient;
    });
    setRecipients(updatedRecipients);
    setEditingRecipient({...updatedRecipients[currentRecipientIndex]});
  };
  
  // 添加新收件人
  const handleAddRecipient = () => {
    // 创建新收件人，复制当前编辑的收件人数据
    const newRecipient = {...editingRecipient};
    
    // 添加到收件人列表
    setRecipients([...recipients, newRecipient]);
    
    // 切换到新添加的收件人
    const newIndex = recipients.length;
    setCurrentRecipientIndex(newIndex);
    setEditingRecipient({...newRecipient});
    
    toast({
      title: "已添加新收件人",
      description: `现在共有 ${newIndex + 1} 个收件人`
    });
  };
  
  // 删除当前收件人
  const handleDeleteRecipient = () => {
    if (recipients.length <= 1) {
      toast({
        title: "无法删除",
        description: "必须保留至少一个收件人",
        variant: "destructive"
      });
      return;
    }
    
    const newRecipients = [...recipients];
    newRecipients.splice(currentRecipientIndex, 1);
    setRecipients(newRecipients);
    
    // 调整当前索引
    const newIndex = Math.min(currentRecipientIndex, newRecipients.length - 1);
    setCurrentRecipientIndex(newIndex);
    setEditingRecipient({...newRecipients[newIndex]});
    
    toast({
      title: "已删除收件人",
      description: `现在共有 ${newRecipients.length} 个收件人`
    });
  };
  
  // 处理收件人字段更改
  const handleRecipientChange = (field: string, value: string) => {
    const updated = {...editingRecipient, [field]: value};
    setEditingRecipient(updated);
    
    // 实时更新收件人列表
    const updatedRecipients = [...recipients];
    updatedRecipients[currentRecipientIndex] = updated;
    setRecipients(updatedRecipients);
  };
  
  // 切换收件人
  const handleChangeRecipient = (index: number) => {
    if (index >= 0 && index < recipients.length) {
      setCurrentRecipientIndex(index);
      setEditingRecipient({...recipients[index]});
    }
  };
  
  // 复制当前预览的邮件HTML
  const handleCopyHtml = () => {
    try {
      const previewHtml = generatePreview(templateHtml, recipients[currentRecipientIndex]);
      navigator.clipboard.writeText(previewHtml);
      
      toast({
        title: "已复制到剪贴板",
        description: "邮件HTML内容已复制到剪贴板"
      });
    } catch (error) {
      toast({
        title: "复制失败",
        description: "无法复制HTML内容",
        variant: "destructive"
      });
    }
  };
  
  // 生成指定收件人的预览HTML
  const getPreviewHtml = (index: number) => {
    return generatePreview(templateHtml, recipients[index]);
  };
  
  // 如果是预览模式，只显示预览内容
  if (previewMode) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>邮件预览</CardTitle>
          <CardDescription>
            使用填入的变量数据生成的最终邮件
          </CardDescription>
        </CardHeader>
        <CardContent className="border rounded-md p-0 h-[500px] overflow-auto">
          <iframe 
            srcDoc={generatePreview(templateHtml, recipients[0])}
            className="w-full h-full border-0"
            title="邮件预览"
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={handleCopyHtml}>
            <Copy className="h-4 w-4 mr-2" />
            复制HTML
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">邮件模板变量插值系统演示</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="template">编辑模板</TabsTrigger>
          <TabsTrigger value="recipients">收件人信息</TabsTrigger>
          <TabsTrigger value="preview">预览效果</TabsTrigger>
        </TabsList>
        
        {/* 模板编辑选项卡 */}
        <TabsContent value="template" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>邮件模板编辑</CardTitle>
              <CardDescription>
                编辑邮件模板内容，使用 <code>{"{{变量名}}"}</code> 或 <code>{"{{变量名|默认值}}"}</code> 添加变量
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleRichTextEditor
                initialHtml={templateHtml}
                onChange={handleTemplateChange}
                height="400px"
                customVariables={[...predefinedVariables, ...customVariables]}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>
                <h3 className="text-sm font-medium mb-2">模板中的变量：</h3>
                <div className="flex flex-wrap gap-2">
                  {availableVariables.length > 0 ? (
                    availableVariables.map((variable) => (
                      <Badge key={variable} variant="outline">{`{{${variable}}}`}</Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">尚未检测到变量</span>
                  )}
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setActiveTab("recipients")}
                disabled={availableVariables.length === 0}
              >
                下一步：填写收件人信息
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* 收件人信息选项卡 */}
        <TabsContent value="recipients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>收件人信息</CardTitle>
              <CardDescription>
                为每位收件人填写对应的变量值，生成个性化邮件内容
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-medium">收件人 {currentRecipientIndex + 1}/{recipients.length}</h3>
                <div className="flex-1"></div>
                <Button variant="outline" size="sm" onClick={handleAddRecipient}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  添加收件人
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDeleteRecipient}
                  disabled={recipients.length <= 1}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  删除此收件人
                </Button>
              </div>
              
              <div className="flex overflow-auto py-2 mb-4">
                {recipients.map((_, index) => (
                  <Button
                    key={index}
                    variant={index === currentRecipientIndex ? "default" : "outline"}
                    size="sm"
                    className="mx-1 min-w-[40px]"
                    onClick={() => handleChangeRecipient(index)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableVariables.map((variable) => (
                  <div key={variable} className="space-y-2">
                    <Label htmlFor={variable}>{variable.replace(/_/g, ' ')}:</Label>
                    <Input
                      id={variable}
                      value={editingRecipient[variable] as string || ''}
                      onChange={(e) => handleRecipientChange(variable, e.target.value)}
                      placeholder={`输入${variable.replace(/_/g, ' ')}`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("template")}>
                返回编辑模板
              </Button>
              <Button onClick={() => setActiveTab("preview")}>
                <Eye className="mr-2 h-4 w-4" />
                预览生成的邮件
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* 预览选项卡 */}
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>预览效果</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleChangeRecipient((currentRecipientIndex - 1 + recipients.length) % recipients.length)}
                    disabled={recipients.length <= 1}
                  >
                    上一个
                  </Button>
                  <span className="text-sm font-medium">
                    {currentRecipientIndex + 1}/{recipients.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleChangeRecipient((currentRecipientIndex + 1) % recipients.length)}
                    disabled={recipients.length <= 1}
                  >
                    下一个
                  </Button>
                </div>
              </div>
              <CardDescription>
                预览当前收件人的个性化邮件内容
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-md bg-white min-h-[400px]">
                <iframe
                  srcDoc={getPreviewHtml(currentRecipientIndex)}
                  className="w-full h-[400px] border-0"
                  title="邮件预览"
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">当前收件人变量数据：</h3>
                <div className="grid grid-cols-2 gap-2 p-4 border rounded-md bg-muted/40">
                  {Object.entries(recipients[currentRecipientIndex]).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-1">
                      <span className="text-sm font-mono font-medium">{key}:</span>
                      <span className="text-sm text-muted-foreground break-words">
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("recipients")}>
                返回编辑收件人信息
              </Button>
              <Button onClick={handleCopyHtml}>
                <Copy className="mr-2 h-4 w-4" />
                复制当前邮件HTML
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 