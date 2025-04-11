'use client';

import React, { useState } from 'react';
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { useTeamStore } from '../../store/useTeamStore';
import { TrashIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

const TeamSettings: React.FC = () => {
  const { selectedTeam, updateTeam, deleteTeam } = useTeamStore();
  const { toast } = useToast();
  
  const [generalForm, setGeneralForm] = useState({
    name: selectedTeam?.name || '',
    description: selectedTeam?.description || '',
    avatarUrl: selectedTeam?.avatarUrl || '',
    type: selectedTeam?.type || 'business',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  
  const handleGeneralChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setGeneralForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) return;
    
    setIsSubmitting(true);
    try {
      await updateTeam(selectedTeam.id, generalForm);
      toast({
        title: "设置已保存",
        description: "您的团队信息已成功更新。",
      });
    } catch (error) {
      toast({
        title: "保存失败",
        description: "无法更新团队信息，请稍后再试。",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteTeam = async () => {
    if (!selectedTeam) return;
    if (deleteConfirm !== selectedTeam.name) {
      toast({
        title: "确认错误",
        description: "请输入正确的团队名称以确认删除。",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await deleteTeam(selectedTeam.id);
      toast({
        title: "团队已删除",
        description: "您的团队已成功删除。",
      });
    } catch (error) {
      toast({
        title: "删除失败",
        description: "无法删除团队，请稍后再试。",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setDeleteConfirm('');
    }
  };

  if (!selectedTeam) {
    return (
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">团队设置</h1>
          <p className="text-muted-foreground">
            管理您的团队设置和首选项
          </p>
        </div>
        
        <Card className="py-12">
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-medium">没有选中的团队</h3>
            <p className="text-center text-muted-foreground max-w-md">
              请先选择一个团队以管理其设置。
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col space-y-6 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">团队设置</h1>
        <p className="text-muted-foreground">
          管理您的团队设置和首选项
        </p>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">基本信息</TabsTrigger>
          <TabsTrigger value="members">成员管理</TabsTrigger>
          <TabsTrigger value="billing">计划与账单</TabsTrigger>
          <TabsTrigger value="security">安全设置</TabsTrigger>
          <TabsTrigger value="advanced">高级设置</TabsTrigger>
        </TabsList>
        
        {/* 基本信息 */}
        <TabsContent value="general">
          <Card>
            <form onSubmit={handleSaveGeneral}>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
                <CardDescription>
                  更新您的团队基本信息和设置
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="avatarUrl">团队头像</Label>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={generalForm.avatarUrl} alt={generalForm.name} />
                      <AvatarFallback>{generalForm.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <Input
                      id="avatarUrl"
                      name="avatarUrl"
                      value={generalForm.avatarUrl}
                      onChange={handleGeneralChange}
                      placeholder="头像URL地址"
                      className="max-w-md"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="name">团队名称</Label>
                  <Input
                    id="name"
                    name="name"
                    value={generalForm.name}
                    onChange={handleGeneralChange}
                    placeholder="输入团队名称"
                    className="max-w-md"
                    required
                  />
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="description">团队描述</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={generalForm.description}
                    onChange={handleGeneralChange}
                    placeholder="描述这个团队的用途和目标"
                    className="max-w-xl"
                    rows={4}
                  />
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="type">团队类型</Label>
                  <select
                    id="type"
                    name="type"
                    value={generalForm.type}
                    onChange={handleGeneralChange}
                    className="max-w-md flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="business">企业团队</option>
                    <option value="education">教育团队</option>
                    <option value="nonprofit">非营利组织</option>
                    <option value="personal">个人团队</option>
                  </select>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? '保存中...' : '保存更改'}
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          <Card className="mt-6 border-red-300 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">危险区域</CardTitle>
              <CardDescription>
                以下操作不可撤销，请谨慎操作
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="deleteConfirm" className="text-red-600 dark:text-red-400">
                  删除团队
                </Label>
                <p className="text-sm text-muted-foreground">
                  这将永久删除此团队及其所有数据。输入团队名称 <strong>{selectedTeam.name}</strong> 以确认。
                </p>
                <Input
                  id="deleteConfirm"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder={`输入 ${selectedTeam.name} 确认删除`}
                  className="max-w-md border-red-300 dark:border-red-800"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="button" 
                variant="destructive"
                disabled={isSubmitting || deleteConfirm !== selectedTeam.name}
                onClick={handleDeleteTeam}
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                永久删除团队
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* 其他标签内容 - 这里只展示了占位符 */}
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>成员管理</CardTitle>
              <CardDescription>
                添加、移除和管理团队成员的权限
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">成员管理功能开发中...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>计划与账单</CardTitle>
              <CardDescription>
                管理您的团队计划、订阅和账单信息
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">计划与账单功能开发中...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>安全设置</CardTitle>
              <CardDescription>
                管理团队的安全设置和访问控制
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">安全设置功能开发中...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>高级设置</CardTitle>
              <CardDescription>
                配置高级团队功能和集成
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">自动存档会话</h4>
                  <p className="text-sm text-muted-foreground">自动存档超过30天未活动的团队聊天会话</p>
                </div>
                <Switch />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">API 访问</h4>
                  <p className="text-sm text-muted-foreground">允许团队成员通过API访问团队资源</p>
                </div>
                <Switch />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">第三方集成</h4>
                  <p className="text-sm text-muted-foreground">允许第三方应用程序与您的团队集成</p>
                </div>
                <Switch />
              </div>
            </CardContent>
            <CardFooter>
              <Button>保存高级设置</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamSettings; 