"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Template } from '../template-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SimpleRichTextEditor } from "../editor/SimpleRichTextEditor";
import { Variable, predefinedVariables } from "../editor/VariableManager";
import { generatePreview, VariableData, extractVariables } from "@/lib/utils/template-variables";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, FileSpreadsheet, Mail, Clipboard, Upload, Download, RefreshCw, Check, PlusCircle, Trash2, Eye, Copy } from 'lucide-react';
import { DataTable } from './DataTable';
import { ImportDataDialog } from './ImportDataDialog';
import { Badge } from '@/components/ui/badge';

interface TemplateUsageWorkflowProps {
  template: Template;
}

export function TemplateUsageWorkflow({ template }: TemplateUsageWorkflowProps) {
  // 工作流程步骤
  const [currentStep, setCurrentStep] = useState(1);
  const [templateHtml, setTemplateHtml] = useState<string>(template.htmlContent || '');
  const [availableVariables, setAvailableVariables] = useState<string[]>([]);
  const [recipients, setRecipients] = useState<VariableData[]>([]);
  const [currentRecipientIndex, setCurrentRecipientIndex] = useState(0);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // 初始化：提取模板中的变量
  useEffect(() => {
    const extractedVars = extractVariables(templateHtml);
    setAvailableVariables(extractedVars);
    
    // 如果没有收件人数据，初始化一个空数据结构
    if (recipients.length === 0 && extractedVars.length > 0) {
      const initialRecipient: VariableData = {};
      extractedVars.forEach(varName => {
        initialRecipient[varName] = '';
      });
      setRecipients([initialRecipient]);
    }
  }, [templateHtml]);

  // 处理模板内容更改
  const handleTemplateChange = (html: string) => {
    setTemplateHtml(html);
    
    // 提取模板中的变量
    const extractedVars = extractVariables(html);
    setAvailableVariables(extractedVars);
    
    // 更新收件人数据结构，确保包含所有变量
    if (recipients.length > 0) {
      const updatedRecipients = recipients.map(recipient => {
        const newRecipient = {...recipient};
        extractedVars.forEach(varName => {
          if (newRecipient[varName] === undefined) {
            newRecipient[varName] = '';
          }
        });
        return newRecipient;
      });
      setRecipients(updatedRecipients);
    }
  };

  // 处理导入数据完成
  const handleDataImported = (data: VariableData[]) => {
    if (data.length > 0) {
      setRecipients(data);
      setCurrentRecipientIndex(0);
      setIsImportDialogOpen(false);
      toast({
        title: "数据导入成功",
        description: `已导入 ${data.length} 条数据记录`
      });
    }
  };

  // 添加新收件人
  const handleAddRecipient = () => {
    const newRecipient: VariableData = {};
    availableVariables.forEach(varName => {
      newRecipient[varName] = '';
    });
    
    setRecipients([...recipients, newRecipient]);
    setCurrentRecipientIndex(recipients.length);
    
    toast({
      title: "已添加新收件人",
      description: "请填写收件人数据"
    });
  };

  // 删除收件人
  const handleDeleteRecipient = (index: number) => {
    if (recipients.length <= 1) {
      toast({
        title: "无法删除",
        description: "至少需要保留一条数据记录",
        variant: "destructive"
      });
      return;
    }
    
    const newRecipients = [...recipients];
    newRecipients.splice(index, 1);
    setRecipients(newRecipients);
    
    // 调整当前索引
    if (currentRecipientIndex >= newRecipients.length) {
      setCurrentRecipientIndex(Math.max(0, newRecipients.length - 1));
    }
    
    toast({
      title: "已删除记录",
      description: `还剩 ${newRecipients.length} 条数据记录`
    });
  };

  // 更新收件人数据
  const handleUpdateRecipient = (index: number, field: string, value: string) => {
    const updatedRecipients = [...recipients];
    const recipient = {...updatedRecipients[index]};
    recipient[field] = value;
    updatedRecipients[index] = recipient;
    setRecipients(updatedRecipients);
  };

  // 切换到下一步
  const handleNextStep = () => {
    // 验证当前步骤
    if (currentStep === 1) {
      if (availableVariables.length === 0) {
        toast({
          title: "无法继续",
          description: "模板中需要至少包含一个变量",
          variant: "destructive"
        });
        return;
      }
    } else if (currentStep === 2) {
      // 验证是否有收件人数据
      if (recipients.length === 0) {
        toast({
          title: "无法继续",
          description: "需要至少一条收件人数据",
          variant: "destructive"
        });
        return;
      }
      
      // 验证收件人数据是否完整
      const hasEmptyFields = recipients.some(recipient => {
        return availableVariables.some(variable => {
          return !recipient[variable] && recipient[variable] !== 0;
        });
      });
      
      if (hasEmptyFields) {
        // 只显示警告，但允许继续
        toast({
          title: "数据不完整",
          description: "部分收件人的数据字段为空，这可能导致邮件中显示空白",
          variant: "destructive"
        });
      }
    }
    
    setCurrentStep(Math.min(3, currentStep + 1));
  };

  // 切换到上一步
  const handlePrevStep = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
  };

  // 复制指定收件人的HTML内容
  const handleCopyHtml = (index: number) => {
    try {
      const previewHtml = generatePreview(templateHtml, recipients[index]);
      navigator.clipboard.writeText(previewHtml);
      
      toast({
        title: "已复制到剪贴板",
        description: `第 ${index + 1} 条邮件内容已复制到剪贴板`
      });
    } catch (error) {
      toast({
        title: "复制失败",
        description: "无法复制HTML内容",
        variant: "destructive"
      });
    }
  };

  // 下载所有HTML文件为ZIP
  const handleDownloadAll = () => {
    // 实际项目中应实现ZIP打包功能
    toast({
      title: "功能开发中",
      description: "这个功能尚未实现，将在后续版本中支持"
    });
  };

  // 发送邮件（占位函数）
  const handleSendEmails = () => {
    toast({
      title: "功能开发中",
      description: "邮件发送功能尚未实现，暂不支持真实发送"
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* 步骤指示器 */}
      <div className="mb-6">
        <div className="flex items-center">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              1
            </div>
            <div className="ml-2 mr-6">
              <div className="text-sm font-medium">编辑模板</div>
              <div className="text-xs text-muted-foreground">确认邮件内容和变量</div>
            </div>
          </div>
          
          <div className="w-8 h-0.5 bg-muted mx-2" />
          
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              2
            </div>
            <div className="ml-2 mr-6">
              <div className="text-sm font-medium">填写数据</div>
              <div className="text-xs text-muted-foreground">添加或导入收件人信息</div>
            </div>
          </div>
          
          <div className="w-8 h-0.5 bg-muted mx-2" />
          
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              3
            </div>
            <div className="ml-2">
              <div className="text-sm font-medium">预览与发送</div>
              <div className="text-xs text-muted-foreground">确认最终效果</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* MARK: 步骤1
      */}
      <div className="flex-1">
        {/* 步骤1：编辑模板 */}
        {currentStep === 1 && (
          <Card className="h-full flex flex-col pb-24">
            <CardHeader>
              <CardTitle>编辑模板内容</CardTitle>
              <div className="flex flex-row justify-between">
                <CardDescription>
                  确认邮件模板内容，可以根据需要修改文本和变量
                </CardDescription>
                <Button onClick={handleNextStep} disabled={availableVariables.length === 0}>
                  下一步：填写数据
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 h-[60vh] overflow-auto">
              <div className="mb-4">
                <div className="text-sm font-medium mb-2">模板中的变量：</div>
                <div className="flex flex-wrap gap-2">
                  {availableVariables.length > 0 ? (
                    availableVariables.map((variable) => (
                      <Badge key={variable} variant="outline">{`{{${variable}}}`}</Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">尚未检测到变量，请添加变量以启用个性化功能</span>
                  )}
                </div>
              </div>
              
              <SimpleRichTextEditor
                initialHtml={templateHtml}
                onChange={handleTemplateChange}
                height="calc(100vh - 350px)"
                customVariables={predefinedVariables}
              />
            </CardContent>
          </Card>
        )}
        
        {/* MARK: 步骤2
        ：填写数据 */}
        {currentStep === 2 && (
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>填写收件人数据</CardTitle>
              <CardDescription>
                为每位收件人填写数据，或批量导入数据
              </CardDescription>
              <div className="flex flex-row justify-end gap-4">
                <Button variant="outline" onClick={handlePrevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  返回编辑模板
                </Button>
                <Button onClick={handleNextStep} disabled={recipients.length === 0}>
                  下一步：预览效果
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex justify-between mb-4">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsImportDialogOpen(true)}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    导入数据
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      // 导出CSV模板，实际项目中应实现
                      toast({
                        title: "模板已下载",
                        description: "已下载CSV模板文件，可填写数据后导入"
                      });
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    下载模板
                  </Button>
                </div>
                
                <Button 
                  size="sm"
                  onClick={handleAddRecipient}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  添加收件人
                </Button>
              </div>
              
              <DataTable 
                data={recipients}
                columns={availableVariables}
                onUpdate={handleUpdateRecipient}
                onDelete={handleDeleteRecipient}
              />
            </CardContent>
          </Card>
        )}
        
        {/* 步骤3：预览与发送 */}
        {currentStep === 3 && (
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>预览与发送</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleDownloadAll}>
                    <Download className="mr-2 h-4 w-4" />
                    下载全部
                  </Button>
                  <Button size="sm" onClick={handleSendEmails}>
                    <Mail className="mr-2 h-4 w-4" />
                    发送邮件
                  </Button>
                </div>
              </div>
              <CardDescription>
                预览生成的邮件内容，确认无误后可以发送
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <div className="space-y-6">
                {recipients.map((recipient, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">收件人 #{index + 1}</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleCopyHtml(index)}>
                          <Copy className="mr-2 h-4 w-4" />
                          复制HTML
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-4 p-3 bg-muted/20 rounded-lg">
                      {availableVariables.map(variable => (
                        <div key={variable} className="flex">
                          <span className="text-sm font-medium min-w-[120px]">{variable}:</span>
                          <span className="text-sm">{recipient[variable] || '(空)'}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border bg-white rounded-lg p-2 h-[300px] overflow-auto">
                      <iframe
                        srcDoc={generatePreview(templateHtml, recipient)}
                        className="w-full h-full border-0"
                        title={`预览 #${index + 1}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePrevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回填写数据
              </Button>
              <div className="text-sm text-muted-foreground">
                共 {recipients.length} 封邮件
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
      
      {/* 导入数据对话框 */}
      <ImportDataDialog
        isOpen={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        variables={availableVariables}
        onImport={handleDataImported}
      />
    </div>
  );
} 