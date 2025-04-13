"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { 
  Plus, ChevronDown, VariableIcon, Tag, User, Mail, Building,
  CalendarDays, Clock, Map, Phone, Trash, PenSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// 预定义变量类型和对应的图标
export const variableCategories = [
  { name: '收件人信息', icon: <User className="h-4 w-4" /> },
  { name: '公司信息', icon: <Building className="h-4 w-4" /> },
  { name: '日期时间', icon: <CalendarDays className="h-4 w-4" /> },
  { name: '自定义变量', icon: <Tag className="h-4 w-4" /> },
];

// 预定义变量
export const predefinedVariables = [
  { name: 'recipient_name', label: '收件人姓名', category: '收件人信息', example: '张三' },
  { name: 'recipient_email', label: '收件人邮箱', category: '收件人信息', example: 'zhangsan@example.com' },
  { name: 'recipient_company', label: '收件人公司', category: '收件人信息', example: '示例公司' },
  { name: 'recipient_title', label: '收件人职位', category: '收件人信息', example: '市场经理' },
  { name: 'company_name', label: '公司名称', category: '公司信息', example: 'WizMail科技' },
  { name: 'company_address', label: '公司地址', category: '公司信息', example: '北京市海淀区' },
  { name: 'company_phone', label: '公司电话', category: '公司信息', example: '010-12345678' },
  { name: 'current_date', label: '当前日期', category: '日期时间', example: '2023-04-13' },
  { name: 'current_time', label: '当前时间', category: '日期时间', example: '14:30' },
];

// 变量类型组件
export interface Variable {
  name: string;
  label: string;
  category: string;
  example?: string;
}

interface VariableManagerProps {
  onInsertVariable: (variable: string) => void;
  templateVariables?: Variable[];
  onVariablesChange?: (variables: Variable[]) => void;
}

export function VariableManager({ 
  onInsertVariable, 
  templateVariables,
  onVariablesChange 
}: VariableManagerProps) {
  const { toast } = useToast();
  const [isAddingVariable, setIsAddingVariable] = useState(false);
  const [newVariable, setNewVariable] = useState<Variable>({
    name: '',
    label: '',
    category: '自定义变量',
    example: ''
  });
  
  const [variables, setVariables] = useState<Variable[]>(
    templateVariables || predefinedVariables
  );
  
  // 处理新增变量
  const handleAddVariable = () => {
    if (!newVariable.name.trim() || !newVariable.label.trim()) {
      toast({
        title: "请填写完整信息",
        description: "变量名称和显示名称不能为空",
        variant: "destructive"
      });
      return;
    }
    
    // 验证变量名格式 (只允许字母、数字和下划线)
    if (!/^[a-zA-Z0-9_]+$/.test(newVariable.name)) {
      toast({
        title: "变量名称格式错误",
        description: "变量名称只能包含字母、数字和下划线",
        variant: "destructive"
      });
      return;
    }
    
    // 检查变量名是否已存在
    if (variables.some(v => v.name === newVariable.name)) {
      toast({
        title: "变量已存在",
        description: `变量 "${newVariable.name}" 已经存在`,
        variant: "destructive"
      });
      return;
    }
    
    const updatedVariables = [...variables, newVariable];
    setVariables(updatedVariables);
    
    if (onVariablesChange) {
      onVariablesChange(updatedVariables);
    }
    
    setNewVariable({
      name: '',
      label: '',
      category: '自定义变量',
      example: ''
    });
    
    setIsAddingVariable(false);
    
    toast({
      title: "变量添加成功",
      description: `变量 "${newVariable.label}" 已添加`
    });
  };
  
  // 处理删除变量
  const handleDeleteVariable = (name: string) => {
    // 只允许删除自定义变量
    const variable = variables.find(v => v.name === name);
    if (!variable || variable.category !== '自定义变量') {
      toast({
        title: "无法删除",
        description: "只能删除自定义变量",
        variant: "destructive"
      });
      return;
    }
    
    const updatedVariables = variables.filter(v => v.name !== name);
    setVariables(updatedVariables);
    
    if (onVariablesChange) {
      onVariablesChange(updatedVariables);
    }
    
    toast({
      title: "变量已删除",
      description: `变量 "${variable.label}" 已删除`
    });
  };
  
  // 处理变量插入
  const handleInsertVariable = (name: string) => {
    onInsertVariable(`{{${name}}}`);
    toast({
      title: "变量已插入",
      description: `变量 {{${name}}} 已插入到编辑器`
    });
  };
  
  // 根据类别分组变量
  const groupedVariables = variables.reduce((acc, variable) => {
    if (!acc[variable.category]) {
      acc[variable.category] = [];
    }
    acc[variable.category].push(variable);
    return acc;
  }, {} as Record<string, Variable[]>);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">模板变量</h3>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <VariableIcon className="h-4 w-4" />
                插入变量
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {variableCategories.map(category => (
                <React.Fragment key={category.name}>
                  <div className="px-2 py-1.5 text-sm font-semibold flex items-center gap-1.5">
                    {category.icon}
                    {category.name}
                  </div>
                  {groupedVariables[category.name]?.map(variable => (
                    <DropdownMenuItem 
                      key={variable.name}
                      onClick={() => handleInsertVariable(variable.name)}
                      className="flex gap-2"
                    >
                      <span className="text-sm">{variable.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {`{{${variable.name}}}`}
                      </span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </React.Fragment>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Dialog open={isAddingVariable} onOpenChange={setIsAddingVariable}>
            <DialogTrigger asChild>
              <Button size="sm" variant="ghost" className="gap-1">
                <Plus className="h-4 w-4" />
                添加变量
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>添加自定义变量</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="variable-name" className="text-right">
                    变量名称
                  </label>
                  <Input
                    id="variable-name"
                    value={newVariable.name}
                    onChange={(e) => setNewVariable({...newVariable, name: e.target.value})}
                    placeholder="customer_id"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="variable-label" className="text-right">
                    显示名称
                  </label>
                  <Input
                    id="variable-label"
                    value={newVariable.label}
                    onChange={(e) => setNewVariable({...newVariable, label: e.target.value})}
                    placeholder="客户ID"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="variable-example" className="text-right">
                    示例值
                  </label>
                  <Input
                    id="variable-example"
                    value={newVariable.example || ''}
                    onChange={(e) => setNewVariable({...newVariable, example: e.target.value})}
                    placeholder="CID12345"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">取消</Button>
                </DialogClose>
                <Button onClick={handleAddVariable}>添加</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">变量名</TableHead>
            <TableHead>显示名称</TableHead>
            <TableHead>示例值</TableHead>
            <TableHead>分类</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {variables.map(variable => (
            <TableRow key={variable.name}>
              <TableCell className="font-mono">{`{{${variable.name}}}`}</TableCell>
              <TableCell>{variable.label}</TableCell>
              <TableCell>{variable.example || '-'}</TableCell>
              <TableCell>{variable.category}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleInsertVariable(variable.name)}
                >
                  <PenSquare className="h-4 w-4" />
                </Button>
                {variable.category === '自定义变量' && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteVariable(variable.name)}
                    className="text-destructive"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 