"use client";

import React, { useState, useEffect } from 'react';
import { SimpleRichTextEditor } from './SimpleRichTextEditor';
import { VariableManager, Variable, predefinedVariables } from './VariableManager';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { extractVariables, replaceVariables, generatePreview } from '@/lib/utils/template-variables';
import { Eye, Save, ArrowLeft } from 'lucide-react';

interface VariableEditorPageProps {
  initialHtml?: string;
  onSave: (html: string, variables: Variable[]) => void;
  onCancel: () => void;
}

export function VariableEditorPage({
  initialHtml = '',
  onSave,
  onCancel
}: VariableEditorPageProps) {
  const [currentHtml, setCurrentHtml] = useState(initialHtml);
  const [customVariables, setCustomVariables] = useState<Variable[]>([]);
  const [activeTab, setActiveTab] = useState('editor');
  
  // 从初始HTML中提取变量
  useEffect(() => {
    if (initialHtml) {
      extractCustomVariablesFromHtml(initialHtml);
    }
  }, [initialHtml]);
  
  // 从HTML内容中提取自定义变量
  const extractCustomVariablesFromHtml = (html: string) => {
    try {
      // 提取变量名
      const varNames = extractVariables(html);
      
      // 过滤掉预定义变量和已有的自定义变量
      const existingVarNames = [...predefinedVariables, ...customVariables].map(v => v.name);
      const newVarNames = varNames.filter(name => !existingVarNames.includes(name));
      
      if (newVarNames.length > 0) {
        const newCustomVars: Variable[] = newVarNames.map(name => ({
          name,
          label: name.replace(/_/g, ' '), // 简单转换为显示名称
          category: '自定义变量',
          example: `[${name}]`
        }));
        
        setCustomVariables(prev => [...prev, ...newCustomVars]);
      }
    } catch (error) {
      console.error('提取变量失败:', error);
    }
  };
  
  // 处理HTML内容变更
  const handleHtmlChange = (html: string) => {
    setCurrentHtml(html);
    
    // 从新内容中提取变量
    extractCustomVariablesFromHtml(html);
  };
  
  // 处理变量列表变更
  const handleVariablesChange = (variables: Variable[]) => {
    // 只保存自定义变量
    const customVars = variables.filter(v => v.category === '自定义变量');
    setCustomVariables(customVars);
  };
  
  // 处理变量插入
  const handleInsertVariable = (variable: string) => {
    // 这个函数在选项卡视图中不会直接插入变量，但需要保留以满足VariableManager的接口要求
    console.log('变量管理器请求插入变量:', variable);
  };
  
  // 生成预览数据
  const generatePreviewData = () => {
    const allVariables = [...predefinedVariables, ...customVariables];
    return allVariables.reduce((acc, variable) => {
      acc[variable.name] = variable.example || `[${variable.name}]`;
      return acc;
    }, {} as Record<string, string | number | boolean | null | undefined>);
  };
  
  // 处理保存
  const handleSave = () => {
    onSave(currentHtml, customVariables);
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回
        </Button>
        
        <div className="flex items-center gap-2">
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            保存模板
          </Button>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="editor">编辑器</TabsTrigger>
            <TabsTrigger value="variables">变量管理</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="h-full">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>模板编辑器</CardTitle>
                <CardDescription>
                  编辑模板并插入变量，变量使用双大括号语法
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <SimpleRichTextEditor
                  initialHtml={initialHtml}
                  onChange={handleHtmlChange}
                  height="calc(100vh - 300px)"
                  customVariables={customVariables}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="variables" className="h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>变量管理</CardTitle>
                  <CardDescription>
                    管理和创建模板变量
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VariableManager
                    onInsertVariable={handleInsertVariable}
                    templateVariables={[...predefinedVariables, ...customVariables]}
                    onVariablesChange={handleVariablesChange}
                  />
                </CardContent>
              </Card>
              
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>预览效果</CardTitle>
                  <CardDescription>
                    使用示例数据预览模板效果
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[calc(100%-80px)]">
                  <div className="border rounded-md p-4 h-full overflow-auto bg-white">
                    <iframe
                      srcDoc={generatePreview(currentHtml, generatePreviewData())}
                      className="w-full h-full border-0"
                      title="变量预览"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 