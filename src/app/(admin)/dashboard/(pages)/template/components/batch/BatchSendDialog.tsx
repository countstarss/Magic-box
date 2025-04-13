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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { DataImporter } from "./DataImporter";
import { VariableManager, Variable } from "../editor/VariableManager";
import { VariableData, generatePreview, replaceVariables } from "@/lib/utils/template-variables";
import { useToast } from "@/hooks/use-toast";
import { Template } from "../template-data";
import { Mail, Loader2, Users, CheckCircle2, ScanSearch } from "lucide-react";

interface BatchSendDialogProps {
  template: Template;
  htmlContent: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSend: (recipients: VariableData[]) => Promise<void>;
}

export function BatchSendDialog({
  template,
  htmlContent,
  isOpen,
  onOpenChange,
  onSend,
}: BatchSendDialogProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("variables");
  const [variables, setVariables] = useState<Variable[]>([]);
  const [recipientData, setRecipientData] = useState<VariableData[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  
  // 预览当前收件人的邮件
  const previewHtml = recipientData.length > 0 
    ? generatePreview(htmlContent, recipientData[previewIndex])
    : htmlContent;
  
  // 处理发送邮件
  const handleSend = async () => {
    if (recipientData.length === 0) {
      toast({
        title: "无法发送",
        description: "没有收件人数据",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      await onSend(recipientData);
      
      toast({
        title: "发送成功",
        description: `已成功发送给 ${recipientData.length} 位收件人`,
      });
      
      // 重置状态并关闭对话框
      setRecipientData([]);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "发送失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
      console.error("Send error:", error);
    } finally {
      setIsSending(false);
    }
  };
  
  // 处理预览切换
  const handleNextPreview = () => {
    if (recipientData.length === 0) return;
    setPreviewIndex((prev) => (prev + 1) % recipientData.length);
  };
  
  const handlePrevPreview = () => {
    if (recipientData.length === 0) return;
    setPreviewIndex((prev) => (prev - 1 + recipientData.length) % recipientData.length);
  };
  
  // 处理变量管理器中插入变量
  const handleInsertVariable = (variable: string) => {
    // 这个函数在对话框中不需要实际插入变量，但我们保留它以满足VariableManager的接口要求
    toast({
      title: "变量插入",
      description: "在批量发送对话框中无法直接插入变量",
    });
  };
  
  // 处理数据导入
  const handleDataImported = (data: VariableData[]) => {
    setRecipientData(data);
    setActiveTab("preview");
    setPreviewIndex(0);
  };
  
  // 当对话框关闭时重置状态
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setActiveTab("variables");
      setPreviewIndex(0);
    }
    onOpenChange(open);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>批量发送 - {template.name}</DialogTitle>
          <DialogDescription>
            根据收件人数据批量发送包含个性化变量的邮件
          </DialogDescription>
        </DialogHeader>
        
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 overflow-hidden flex flex-col"
        >
          <TabsList className="justify-start mb-4">
            <TabsTrigger value="variables" className="flex items-center gap-1">
              <ScanSearch className="h-4 w-4" />
              模板变量
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              导入数据
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              className="flex items-center gap-1"
              disabled={recipientData.length === 0}
            >
              <Mail className="h-4 w-4" />
              预览
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-auto">
            <TabsContent 
              value="variables" 
              className="h-full overflow-auto"
            >
              <VariableManager
                onInsertVariable={handleInsertVariable}
                templateVariables={variables}
                onVariablesChange={setVariables}
              />
            </TabsContent>
            
            <TabsContent 
              value="import" 
              className="h-full overflow-auto"
            >
              <DataImporter
                htmlContent={htmlContent}
                variables={variables}
                onDataImported={handleDataImported}
              />
            </TabsContent>
            
            <TabsContent 
              value="preview" 
              className="h-full overflow-auto"
              style={{ display: activeTab === "preview" ? "block" : "none" }}
            >
              {recipientData.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      预览 {previewIndex + 1} / {recipientData.length}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrevPreview}
                        disabled={recipientData.length <= 1}
                      >
                        上一个
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPreview}
                        disabled={recipientData.length <= 1}
                      >
                        下一个
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 overflow-auto h-[400px] bg-white">
                    <iframe
                      srcDoc={previewHtml}
                      className="w-full h-full border-0"
                      title="邮件预览"
                    />
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-2">当前收件人数据</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(recipientData[previewIndex]).map(([key, value]) => (
                        <div key={key} className="flex items-start gap-1">
                          <span className="text-sm font-mono">{key}:</span>
                          <span className="text-sm text-muted-foreground break-words">
                            {String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">没有收件人数据</h3>
                  <p className="text-muted-foreground mt-1">
                    请先在&#34;导入数据&#34;选项卡中导入收件人数据
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab("import")}
                  >
                    导入数据
                  </Button>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
        
        <DialogFooter>
          <div className="w-full flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {recipientData.length > 0 
                ? `已准备 ${recipientData.length} 位收件人的数据` 
                : "尚未导入收件人数据"}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                取消
              </Button>
              <Button
                onClick={handleSend}
                disabled={recipientData.length === 0 || isSending}
              >
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    发送中...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    批量发送 ({recipientData.length})
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 