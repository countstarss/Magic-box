"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Download, Upload, Plus, Eye, Pencil, Trash2, SendHorizonal } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Template } from "@/app/(admin)/dashboard/(pages)/template/components/template-data";
import { VariableInterpolationDemo } from "@/app/(admin)/dashboard/(pages)/template/components/demo/VariableInterpolationDemo";
import { DataTable } from "@/app/(admin)/dashboard/(pages)/template/components/usage/DataTable";
import { ImportDataDialog } from "@/app/(admin)/dashboard/(pages)/template/components/usage/ImportDataDialog";
import { Variable } from "@/app/(admin)/dashboard/(pages)/template/components/editor/VariableManager";
import { VariableData, extractVariables } from "@/lib/utils/template-variables";
import { useRouter } from "next/navigation";

interface TemplateUsagePageProps {
  template: Template;
}

export function TemplateUsagePage({ template }: TemplateUsagePageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("variables");
  const [variables, setVariables] = useState<Variable[]>([]);
  const [variableData, setVariableData] = useState<VariableData[]>([]);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  
  // 初始化：从模板中提取变量
  useEffect(() => {
    if (template.htmlContent) {
      const extractedVars = extractVariables(template.htmlContent);
      setColumns(extractedVars);
      
      // 创建变量对象数组
      const vars: Variable[] = extractedVars.map(name => ({
        name,
        label: name.replace(/_/g, ' '),
        category: '自定义变量'
      }));
      
      setVariables(vars);
    }
  }, [template]);
  
  // 处理变量变更
  const handleVariablesChange = (newVariables: Variable[]) => {
    setVariables(newVariables);
    
    // 更新列
    const newColumns = newVariables.map(v => v.name);
    setColumns(newColumns);
    
    // 确保现有数据包含新变量
    if (variableData.length > 0) {
      const updatedData = variableData.map(row => {
        const newRow = {...row};
        newColumns.forEach(col => {
          if (newRow[col] === undefined) {
            newRow[col] = '';
          }
        });
        return newRow;
      });
      setVariableData(updatedData);
    }
  };
  
  // 添加新行
  const handleAddRow = () => {
    if (columns.length === 0) {
      toast({
        title: "无法添加",
        description: "请先定义变量",
        variant: "destructive"
      });
      return;
    }
    
    const newRow: VariableData = {};
    columns.forEach(col => {
      newRow[col] = '';
    });
    
    setVariableData([...variableData, newRow]);
    setEditingIndex(variableData.length);
  };
  
  // 更新行数据
  const handleUpdateRow = (index: number, field: string, value: string) => {
    const updatedData = [...variableData];
    if (!updatedData[index]) {
      updatedData[index] = {};
    }
    updatedData[index][field] = value;
    setVariableData(updatedData);
  };
  
  // 删除行
  const handleDeleteRow = (index: number) => {
    const updatedData = [...variableData];
    updatedData.splice(index, 1);
    setVariableData(updatedData);
    
    if (previewIndex === index) {
      setPreviewIndex(null);
    } else if (previewIndex !== null && previewIndex > index) {
      setPreviewIndex(previewIndex - 1);
    }
  };
  
  // 导入数据
  const handleImportData = (data: VariableData[]) => {
    setVariableData(data);
    setImportDialogOpen(false);
    
    toast({
      title: "数据导入成功",
      description: `已导入 ${data.length} 条数据`
    });
  };
  
  // 预览指定行
  const handlePreview = (index: number) => {
    setPreviewIndex(index);
    setActiveTab("preview");
  };
  
  // 获取预览内容
  const getPreviewContent = () => {
    if (previewIndex === null || !variableData[previewIndex]) {
      return <div className="text-center py-12 text-muted-foreground">请先选择要预览的数据行</div>;
    }
    
    return (
      <iframe
        srcDoc={template.htmlContent}
        className="w-full h-[600px] border-0"
        title="邮件预览"
      />
    );
  };
  
  // 发送邮件
  const handleSendAll = () => {
    toast({
      title: "功能开发中",
      description: "批量发送功能尚未实现"
    });
  };
  
  // 导出数据
  const handleExportData = () => {
    toast({
      title: "功能开发中",
      description: "数据导出功能尚未实现"
    });
  };
  
  return (
    <div className="container mx-auto py-6">
      <Card className="w-full">
        <CardHeader className="border-b px-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </div>
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回模板列表
            </Button>
          </div>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="px-6 pt-6">
            <TabsTrigger value="variables">1. 变量定义</TabsTrigger>
            <TabsTrigger value="data">2. 数据管理</TabsTrigger>
            <TabsTrigger value="preview">3. 预览效果</TabsTrigger>
          </TabsList>
          
          <CardContent className="p-6">
            <TabsContent value="variables" className="mt-0">
              <VariableInterpolationDemo 
                template={template} 
                onVariablesChange={handleVariablesChange}
                previewMode={false}
              />
            </TabsContent>
            
            <TabsContent value="data" className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">管理数据</h3>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setImportDialogOpen(true)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    导入数据
                  </Button>
                  
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={handleAddRow}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    添加行
                  </Button>
                </div>
              </div>
              
              {variables.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  请先在&quot;变量定义&quot;选项卡中定义变量
                </div>
              ) : variableData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  没有数据，请导入数据或手动添加
                </div>
              ) : (
                <DataTable 
                  data={variableData}
                  columns={columns}
                  onEdit={(index: number) => setEditingIndex(index)}
                  onUpdate={handleUpdateRow}
                  onDelete={handleDeleteRow}
                  onPreview={handlePreview}
                  actions={(rowIndex: number) => (
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePreview(rowIndex)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingIndex(rowIndex)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRow(rowIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                />
              )}
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  预览 (行 {previewIndex !== null ? previewIndex + 1 : '?'})
                </h3>
              </div>
              
              {previewIndex !== null && (
                <VariableInterpolationDemo 
                  template={template} 
                  initialVariables={variables}
                  previewMode={true}
                  previewData={variableData[previewIndex]}
                />
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
        
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <Button variant="outline" onClick={() => router.back()}>
            返回
          </Button>
          <Button 
            disabled={variableData.length === 0}
            onClick={handleSendAll}
          >
            <SendHorizonal className="h-4 w-4 mr-2" />
            批量发送
          </Button>
        </CardFooter>
      </Card>
      
      <ImportDataDialog 
        isOpen={importDialogOpen} 
        onOpenChange={setImportDialogOpen}
        onImport={handleImportData}
        variables={columns}
      />
    </div>
  );
} 