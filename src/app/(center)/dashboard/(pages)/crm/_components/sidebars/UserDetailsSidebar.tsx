'use client';

import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow, format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Edit2, Save, User, Mail, Phone, Briefcase, Tag, Clock, DollarSign, Calendar } from 'lucide-react';
import { User as UserType, useCrmStore } from '../../store/useCrmStore';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// 用户标签颜色
const tagColorMap: Record<string, string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  premium: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  inactive: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  highValue: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  lead: "bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-400",
};

// 用户标签中文名称
const tagNameMap: Record<string, string> = {
  active: "活跃",
  premium: "付费",
  new: "新用户",
  inactive: "沉睡",
  highValue: "高价值",
  lead: "潜在",
};

// 用户来源中文名称
const sourceNameMap: Record<string, string> = {
  form: "表单",
  import: "导入",
  webhook: "Webhook",
  manual: "手动",
};

interface UserDetailsSidebarProps {
  open: boolean;
  onClose: () => void;
  user: UserType | null;
}

const UserDetailsSidebar: React.FC<UserDetailsSidebarProps> = ({
  open,
  onClose,
  user
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<UserType>>({});
  const { updateUser } = useCrmStore();
  
  // 如果没有用户数据，返回null
  if (!user) {
    return null;
  }
  
  // 处理编辑模式切换
  const handleEditToggle = () => {
    if (isEditing) {
      // 保存更改
      updateUser(user.id, editedUser);
      setIsEditing(false);
      setEditedUser({});
    } else {
      // 进入编辑模式
      setIsEditing(true);
      setEditedUser({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        company: user.company,
        position: user.position,
        notes: user.notes,
      });
    }
  };
  
  // 处理输入变化
  const handleInputChange = (field: string, value: string) => {
    setEditedUser({
      ...editedUser,
      [field]: value
    });
  };
  
  // 获取用户头像
  const getUserAvatar = () => {
    const initials = user.fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
    
    return (
      <Avatar className="h-20 w-20">
        <AvatarImage src={user.avatar} alt={user.fullName} />
        <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
      </Avatar>
    );
  };
  
  return (
    <Sheet open={open} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>客户详情</SheetTitle>
          <SheetDescription>
            查看和编辑客户信息
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-8">
          {/* 用户基本信息区域 */}
          <div className="flex flex-col items-center text-center py-4">
            {getUserAvatar()}
            
            {isEditing ? (
              <div className="mt-4 w-full space-y-2">
                <Input
                  value={editedUser.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="text-center font-bold text-lg"
                />
                <Input
                  value={editedUser.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="text-center text-sm text-muted-foreground"
                />
              </div>
            ) : (
              <div className="mt-4">
                <h3 className="font-bold text-lg">{user.fullName}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            )}
            
            <div className="flex flex-wrap justify-center gap-1 mt-3">
              {user.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className={tagColorMap[tag] || ""}
                >
                  {tagNameMap[tag] || tag}
                </Badge>
              ))}
              {user.customTags?.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* 编辑按钮 */}
          <div className="flex justify-end">
            <Button onClick={handleEditToggle} className="gap-2">
              {isEditing ? (
                <>
                  <Save className="h-4 w-4" />
                  保存更改
                </>
              ) : (
                <>
                  <Edit2 className="h-4 w-4" />
                  编辑信息
                </>
              )}
            </Button>
          </div>
          
          {/* 用户详细信息 */}
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">基本信息</TabsTrigger>
              <TabsTrigger value="activity">活动记录</TabsTrigger>
              <TabsTrigger value="notes">备注</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <Label>电话</Label>
                  </div>
                  {isEditing ? (
                    <Input
                      value={editedUser.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  ) : (
                    <div>{user.phone || '未设置'}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <Label>公司</Label>
                  </div>
                  {isEditing ? (
                    <Input
                      value={editedUser.company || ''}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                    />
                  ) : (
                    <div>{user.company || '未设置'}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <Label>职位</Label>
                  </div>
                  {isEditing ? (
                    <Input
                      value={editedUser.position || ''}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                    />
                  ) : (
                    <div>{user.position || '未设置'}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <Label>累计消费</Label>
                  </div>
                  <div className="text-lg font-medium">
                    ¥{user.totalSpent.toLocaleString()}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    <Label>数据来源</Label>
                  </div>
                  <div>
                    <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                      {sourceNameMap[user.source] || user.source}
                    </Badge>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="activity" className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <Label>注册时间</Label>
                  </div>
                  <div>
                    {format(new Date(user.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
                    <div className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true, locale: zhCN })}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <Label>最后活动</Label>
                  </div>
                  <div>
                    {format(new Date(user.lastLoginAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
                    <div className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(user.lastLoginAt), { addSuffix: true, locale: zhCN })}
                    </div>
                  </div>
                </div>
                
                {/* 这里可以添加更多的活动记录，如邮件打开记录等 */}
                <div className="rounded-md border p-4">
                  <div className="text-muted-foreground text-center">
                    暂无详细活动记录
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notes" className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label>客户备注</Label>
                {isEditing ? (
                  <Textarea
                    value={editedUser.notes || ''}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="添加客户备注..."
                    className="min-h-[150px]"
                  />
                ) : (
                  <div className="rounded-md border p-4 min-h-[150px]">
                    {user.notes || '暂无备注'}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserDetailsSidebar; 