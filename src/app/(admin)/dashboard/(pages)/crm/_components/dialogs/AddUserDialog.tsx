'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCrmStore, UserSource, UserStatus } from '../../store/useCrmStore';
import { BadgePlus, BadgeCheck, User, Mail, Phone, Briefcase, Tag, MessageSquare } from 'lucide-react';

// 用户来源选项
const sourceOptions: { value: UserSource; label: string }[] = [
  { value: 'form', label: '表单' },
  { value: 'import', label: '导入' },
  { value: 'webhook', label: 'Webhook' },
  { value: 'manual', label: '手动' },
];

// 用户状态选项
const statusOptions: { value: UserStatus; label: string }[] = [
  { value: 'active', label: '正常' },
  { value: 'inactive', label: '不活跃' },
  { value: 'pending', label: '待激活' },
  { value: 'blocked', label: '已封禁' },
];

const AddUserDialog: React.FC = () => {
  const { isAddingUser, setIsAddingUser, addUser } = useCrmStore();
  
  // 初始表单状态
  const initialFormState = {
    fullName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    source: 'manual' as UserSource,
    status: 'active' as UserStatus,
    notes: '',
    totalSpent: 0,
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // 处理输入变化
  const handleInputChange = (field: string, value: string | number) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // 清除相关字段的错误
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };
  
  // 验证表单
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = '请输入姓名';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }
    
    if (formData.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone)) {
      newErrors.phone = '请输入有效的电话号码';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 提交表单
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    
    // 创建用户对象
    const newUser = {
      ...formData,
      tags: [],
      lastLoginAt: new Date(),
    };
    
    // 调用添加用户方法
    addUser(newUser);
    
    // 重置表单和关闭对话框
    setFormData(initialFormState);
    setIsAddingUser(false);
  };
  
  // 关闭对话框
  const handleClose = () => {
    setFormData(initialFormState);
    setErrors({});
    setIsAddingUser(false);
  };
  
  return (
    <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>添加新客户</DialogTitle>
          <DialogDescription>
            手动添加新客户信息
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="fullName">姓名</Label>
            </div>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="输入客户姓名"
              className={errors.fullName ? "border-red-500" : ""}
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="email">邮箱</Label>
            </div>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="输入客户邮箱"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="phone">电话</Label>
            </div>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="输入客户电话"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="company">公司</Label>
              </div>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="输入公司名称"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="position">职位</Label>
              </div>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="输入职位"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="source">数据来源</Label>
              </div>
              <Select 
                value={formData.source} 
                onValueChange={(value) => handleInputChange('source', value as UserSource)}
              >
                <SelectTrigger id="source">
                  <SelectValue placeholder="选择来源" />
                </SelectTrigger>
                <SelectContent>
                  {sourceOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BadgePlus className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="status">状态</Label>
              </div>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleInputChange('status', value as UserStatus)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="notes">备注</Label>
            </div>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="添加客户备注..."
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>取消</Button>
          <Button onClick={handleSubmit}>添加客户</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;