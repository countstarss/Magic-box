"use client";

import React, { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, Mail, Calendar, Users, MessageSquare, Laptop, 
  Phone, Save 
} from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

const NotificationSettings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  
  // 通知设置状态
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [desktopPreview, setDesktopPreview] = useState(true);
  
  // 通知类型设置
  const [notificationTypes, setNotificationTypes] = useState({
    system: true,
    team: true,
    event: true,
    message: true
  });
  
  // 频率设置
  const [frequency, setFrequency] = useState("realtime");
  
  // 保存设置
  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // 模拟API请求
    setTimeout(() => {
      setIsSaving(false);
      // 这里会实际保存设置
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue="general" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full max-w-md grid grid-cols-3 mb-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            常规设置
          </TabsTrigger>
          <TabsTrigger value="channels" className="flex items-center gap-2">
            <Laptop className="h-4 w-4" />
            通知渠道
          </TabsTrigger>
          <TabsTrigger value="types" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            通知类型
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>通知频率</CardTitle>
              <CardDescription>控制通知的发送频率和方式</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="frequency">通知频率</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="选择通知频率" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">实时通知</SelectItem>
                    <SelectItem value="hourly">每小时摘要</SelectItem>
                    <SelectItem value="daily">每日摘要</SelectItem>
                    <SelectItem value="weekly">每周摘要</SelectItem>
                    <SelectItem value="none">不接收通知</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">声音提醒</Label>
                  <p className="text-sm text-muted-foreground">收到新通知时播放声音提示</p>
                </div>
                <Switch 
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">桌面预览</Label>
                  <p className="text-sm text-muted-foreground">在桌面通知中显示消息内容</p>
                </div>
                <Switch 
                  checked={desktopPreview}
                  onCheckedChange={setDesktopPreview}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>隐私和安全</CardTitle>
              <CardDescription>控制通知的隐私和安全选项</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">锁屏通知</Label>
                  <p className="text-sm text-muted-foreground">在设备锁屏时显示通知</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">通知历史记录</Label>
                  <p className="text-sm text-muted-foreground">保存通知历史记录的时间</p>
                </div>
                <Select defaultValue="30days">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="选择时间" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">7天</SelectItem>
                    <SelectItem value="30days">30天</SelectItem>
                    <SelectItem value="90days">90天</SelectItem>
                    <SelectItem value="forever">永久</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="channels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>通知渠道</CardTitle>
              <CardDescription>选择您希望接收通知的方式</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">应用内通知</Label>
                  <p className="text-sm text-muted-foreground">在应用内接收通知提醒</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">电子邮件通知</Label>
                  <p className="text-sm text-muted-foreground">通过电子邮件接收通知</p>
                </div>
                <Switch 
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">推送通知</Label>
                  <p className="text-sm text-muted-foreground">在移动设备上接收推送通知</p>
                </div>
                <Switch 
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">短信通知</Label>
                  <p className="text-sm text-muted-foreground">通过短信接收重要通知</p>
                </div>
                <Switch defaultChecked={false} />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>已连接设备</CardTitle>
              <CardDescription>管理可接收通知的设备</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Laptop className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Chrome - Mac OS</p>
                      <p className="text-xs text-muted-foreground">上次活动：今天</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">iPhone 13</p>
                      <p className="text-xs text-muted-foreground">上次活动：昨天</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="types" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>通知类型设置</CardTitle>
              <CardDescription>选择您要接收的通知类型</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900 h-8 w-8 rounded-full flex items-center justify-center">
                    <Bell className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-base">系统通知</Label>
                    <p className="text-sm text-muted-foreground">关于系统更新、维护和安全的通知</p>
                  </div>
                </div>
                <Switch 
                  checked={notificationTypes.system}
                  onCheckedChange={(checked) => setNotificationTypes(prev => ({ ...prev, system: checked }))}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 dark:bg-green-900 h-8 w-8 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-base">团队通知</Label>
                    <p className="text-sm text-muted-foreground">关于团队成员、协作和任务分配的通知</p>
                  </div>
                </div>
                <Switch 
                  checked={notificationTypes.team}
                  onCheckedChange={(checked) => setNotificationTypes(prev => ({ ...prev, team: checked }))}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 dark:bg-amber-900 h-8 w-8 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-base">事件通知</Label>
                    <p className="text-sm text-muted-foreground">关于日历事件、任务截止和提醒的通知</p>
                  </div>
                </div>
                <Switch 
                  checked={notificationTypes.event}
                  onCheckedChange={(checked) => setNotificationTypes(prev => ({ ...prev, event: checked }))}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 dark:bg-purple-900 h-8 w-8 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-purple-500" />
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-base">消息通知</Label>
                    <p className="text-sm text-muted-foreground">关于聊天、评论和回复的通知</p>
                  </div>
                </div>
                <Switch 
                  checked={notificationTypes.message}
                  onCheckedChange={(checked) => setNotificationTypes(prev => ({ ...prev, message: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* 保存按钮 */}
      <div className="fixed bottom-8 right-8">
        <Button 
          size="lg" 
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="shadow-lg gap-2"
        >
          {isSaving ? (
            <>
              <span className="animate-spin">◌</span>
              保存中...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              保存设置
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default NotificationSettings; 