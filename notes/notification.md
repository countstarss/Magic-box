<think>我需要为用户创建一个完整的通知系统，包含预设的通知UI组件，这个系统将用于事件通知和团队内通知。我将需要创建多个组件和一个通知管理系统。

首先，我需要确定要创建的文件和组件：

1. 通知页面主组件：显示所有通知
2. 通知卡片组件：显示单个通知
3. 通知系统管理器：处理通知的添加、删除、标记为已读等
4. 通知设置组件：允许用户配置通知偏好
5. 通知类型组件：不同类型的通知（系统通知、团队通知、事件通知等）
6. 通知提示组件：用于在界面顶部或侧边显示新通知

我将创建这些组件，确保它们风格与现有组件一致，并采用已经使用的UI库（看起来是shadcn/ui）。</think># 创建通知系统

我将为您创建一个完整的通知系统，包括各种预设UI组件和管理功能，以支持事件通知和团队内部通知。这个系统将遵循您现有的设计风格，并具有强大的扩展性。

## 首先，创建通知页面基础组件

```typescript jsx:src/app/(center)/dashboard/(pages)/notification/page.tsx
import React from 'react';
import ContextMenuWrapper from '@/components/ui/ContextMenuWrapper';
import NotificationLayout from './_components/NotificationLayout';

const NotificationPage = () => {
  return (
    <ContextMenuWrapper>
      <div className="p-8 pb-24">
        <NotificationLayout />
      </div>
    </ContextMenuWrapper>
  );
};

export default NotificationPage;
```
## 创建布局文件

```typescript jsx:src/app/(center)/dashboard/(pages)/notification/layout.tsx
'use client';
import React from 'react';
import Content from '../../_components/content';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Content title="通知中心">
        <div className="h-[calc(100vh-5rem)] bg-gray-50 dark:bg-transparent overflow-hidden">
          {children}
        </div>
      </Content>
    </>
  );
}
```
## 创建通知系统的主要组件

```typescript jsx:src/app/(center)/dashboard/(pages)/notification/_components/NotificationLayout.tsx
"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, Users, Calendar, Settings, Filter, CheckCheck, Search 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";

// 导入通知组件
import AllNotifications from "./sections/AllNotifications";
import TeamNotifications from "./sections/TeamNotifications";
import EventNotifications from "./sections/EventNotifications";
import NotificationSettings from "./sections/NotificationSettings";

const NotificationLayout = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  // 标记所有通知为已读
  const markAllAsRead = () => {
    console.log("标记所有通知为已读");
    // 这里将实现标记所有通知为已读的逻辑
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold">通知中心</h1>
        <p className="text-muted-foreground">查看所有系统、团队和事件通知</p>
      </div>
      
      {/* 搜索和筛选区域 */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索通知..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <Select 
            value={filter} 
            onValueChange={setFilter}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="筛选通知" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有通知</SelectItem>
              <SelectItem value="unread">未读通知</SelectItem>
              <SelectItem value="recent">最近7天</SelectItem>
              <SelectItem value="important">重要通知</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={markAllAsRead}
            className="gap-2"
          >
            <CheckCheck className="h-4 w-4" />
            全部标为已读
          </Button>
        </div>
      </div>
      
      {/* 选项卡区域 */}
      <Tabs 
        defaultValue="all" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 w-full max-w-2xl mb-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">所有通知</span>
            <span className="sm:hidden">全部</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">团队通知</span>
            <span className="sm:hidden">团队</span>
          </TabsTrigger>
          <TabsTrigger value="event" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">事件通知</span>
            <span className="sm:hidden">事件</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">通知设置</span>
            <span className="sm:hidden">设置</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <AllNotifications searchQuery={searchQuery} filter={filter} />
        </TabsContent>
        
        <TabsContent value="team" className="mt-0">
          <TeamNotifications searchQuery={searchQuery} filter={filter} />
        </TabsContent>
        
        <TabsContent value="event" className="mt-0">
          <EventNotifications searchQuery={searchQuery} filter={filter} />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-0">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationLayout;
```
## 创建通知数据模型和上下文

```typescript jsx:src/app/(center)/dashboard/(pages)/notification/_components/context/NotificationContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// 通知类型定义
export type NotificationType = "system" | "team" | "event" | "message";
export type NotificationPriority = "normal" | "important" | "urgent";
export type NotificationStatus = "read" | "unread";

// 通知数据结构
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  timestamp: Date;
  actionUrl?: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
  metadata?: Record<string, any>;
}

// 通知上下文接口
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "status">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  getFilteredNotifications: (
    searchQuery: string,
    filter: string,
    type?: NotificationType
  ) => Notification[];
}

// 创建上下文
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// 示例通知数据
const sampleNotifications: Notification[] = [
  {
    id: "1",
    title: "系统更新完成",
    message: "系统已成功更新到最新版本v2.3.1，包含多项安全更新和功能改进。",
    type: "system",
    priority: "normal",
    status: "unread",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30分钟前
  },
  {
    id: "2",
    title: "团队协作提醒",
    message: "张三邀请您加入「市场营销」项目团队，点击查看详情。",
    type: "team",
    priority: "important",
    status: "unread",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2小时前
    actionUrl: "/projects/marketing",
    sender: {
      id: "user1",
      name: "张三",
      avatar: "https://github.com/shadcn.png",
    },
  },
  {
    id: "3",
    title: "活动提醒",
    message: "您安排的「团队周会」将在30分钟后开始，请做好准备。",
    type: "event",
    priority: "urgent",
    status: "unread",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4小时前
    actionUrl: "/calendar/event/123",
  },
  {
    id: "4",
    title: "新消息",
    message: "李四在「产品讨论」群组发送了5条新消息。",
    type: "message",
    priority: "normal",
    status: "read",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1天前
    actionUrl: "/messages/groups/product",
    sender: {
      id: "user2",
      name: "李四",
      avatar: "/avatars/user2.png",
    },
  },
  {
    id: "5",
    title: "系统维护通知",
    message: "系统将于今晚22:00-23:00进行例行维护，期间服务可能出现短暂中断。",
    type: "system",
    priority: "important",
    status: "read",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2天前
  },
  {
    id: "6",
    title: "团队成员变动",
    message: "王五已加入您的团队「设计部门」，现在可以进行协作。",
    type: "team",
    priority: "normal",
    status: "read",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3天前
    sender: {
      id: "user3",
      name: "王五",
      avatar: "/avatars/user3.png",
    },
  },
  {
    id: "7",
    title: "任务截止提醒",
    message: "您的任务「完成首页设计」将在明天截止，请尽快完成。",
    type: "event",
    priority: "urgent",
    status: "unread",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5小时前
    actionUrl: "/tasks/456",
  },
  {
    id: "8",
    title: "新评论通知",
    message: "赵六在您的设计方案上发表了评论。",
    type: "message",
    priority: "normal",
    status: "read",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96), // 4天前
    actionUrl: "/designs/comments/789",
    sender: {
      id: "user4",
      name: "赵六",
      avatar: "/avatars/user4.png",
    },
  },
];

// 提供者组件
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  
  // 计算未读通知数量
  const unreadCount = notifications.filter(n => n.status === "unread").length;
  
  // 添加新通知
  const addNotification = (newNotification: Omit<Notification, "id" | "timestamp" | "status">) => {
    const notification: Notification = {
      ...newNotification,
      id: Date.now().toString(), // 简单生成ID
      timestamp: new Date(),
      status: "unread",
    };
    
    setNotifications(prev => [notification, ...prev]);
  };
  
  // 标记通知为已读
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, status: "read" } 
          : notification
      )
    );
  };
  
  // 标记所有通知为已读
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, status: "read" }))
    );
  };
  
  // 删除通知
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  // 清除所有通知
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  // 获取筛选后的通知
  const getFilteredNotifications = (
    searchQuery: string,
    filter: string,
    type?: NotificationType
  ): Notification[] => {
    return notifications.filter(notification => {
      // 类型筛选
      if (type && notification.type !== type) {
        return false;
      }
      
      // 搜索查询筛选
      if (
        searchQuery && 
        !notification.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !notification.message.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      
      // 状态筛选
      if (filter === "unread" && notification.status !== "unread") {
        return false;
      }
      
      // 时间筛选 - 最近7天
      if (filter === "recent") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        if (notification.timestamp < sevenDaysAgo) {
          return false;
        }
      }
      
      // 重要性筛选
      if (filter === "important" && notification.priority !== "important" && notification.priority !== "urgent") {
        return false;
      }
      
      return true;
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // 按时间降序排序
  };
  
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        getFilteredNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// 自定义钩子，方便使用通知上下文
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications必须在NotificationProvider内部使用");
  }
  return context;
};
```
## 创建通知卡片组件

```typescript jsx:src/app/(center)/dashboard/(pages)/notification/_components/ui/NotificationCard.tsx
import React from "react";
import { 
  BellRing, Calendar, Users, MessageSquare, ArrowRight, 
  Trash2, CheckCircle, AlertCircle, InfoIcon 
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { 
  Card, CardContent, CardFooter, CardHeader 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Notification, NotificationType, useNotifications } from "../context/NotificationContext";

interface NotificationCardProps {
  notification: Notification;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
  const { markAsRead, deleteNotification } = useNotifications();
  
  // 获取通知图标
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "system":
        return <InfoIcon className="h-5 w-5 text-blue-500" />;
      case "team":
        return <Users className="h-5 w-5 text-green-500" />;
      case "event":
        return <Calendar className="h-5 w-5 text-amber-500" />;
      case "message":
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      default:
        return <BellRing className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // 获取优先级样式和图标
  const getPriorityBadge = () => {
    switch (notification.priority) {
      case "urgent":
        return (
          <Badge variant="destructive" className="ml-2">
            紧急
          </Badge>
        );
      case "important":
        return (
          <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
            重要
          </Badge>
        );
      default:
        return null;
    }
  };
  
  // 格式化时间
  const formattedTime = formatDistanceToNow(notification.timestamp, { 
    addSuffix: true,
    locale: zhCN
  });
  const fullDateTime = format(notification.timestamp, 'yyyy-MM-dd HH:mm:ss');
  
  // 处理通知点击
  const handleNotificationClick = () => {
    if (notification.status === "unread") {
      markAsRead(notification.id);
    }
  };
  
  // 处理删除
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(notification.id);
  };
  
  // 处理查看详情
  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAsRead(notification.id);
    
    if (notification.actionUrl) {
      // 在实际应用中，这里可能会使用路由导航
      window.location.href = notification.actionUrl;
    }
  };
  
  return (
    <Card 
      className={`mb-4 transition-all hover:shadow-md ${
        notification.status === "unread" ? "bg-blue-50/30 dark:bg-blue-900/10 border-l-4 border-l-blue-500" : ""
      }`}
      onClick={handleNotificationClick}
    >
      <CardHeader className="py-4 flex flex-row items-start space-y-0 gap-3">
        <div className="flex items-center gap-3 flex-1">
          {notification.sender ? (
            <Avatar>
              <AvatarImage src={notification.sender.avatar} />
              <AvatarFallback>
                {notification.sender.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              {getNotificationIcon(notification.type)}
            </div>
          )}
          
          <div className="flex-1 space-y-1">
            <div className="flex items-center">
              <h4 className="font-medium">{notification.title}</h4>
              {getPriorityBadge()}
            </div>
            
            {notification.sender && (
              <p className="text-sm text-muted-foreground">
                来自 {notification.sender.name}
              </p>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground whitespace-nowrap" title={fullDateTime}>
            {formattedTime}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="py-0">
        <p className="text-sm">
          {notification.message}
        </p>
      </CardContent>
      
      <CardFooter className="py-3 flex justify-between">
        <div className="flex gap-2">
          {notification.status === "unread" && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 gap-1"
              onClick={() => markAsRead(notification.id)}
            >
              <CheckCircle className="h-4 w-4" />
              <span>标为已读</span>
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        {notification.actionUrl && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 gap-1"
            onClick={handleViewDetails}
          >
            查看详情
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
```
## 创建通知为空状态组件

```typescript jsx:src/app/(center)/dashboard/(pages)/notification/_components/ui/EmptyNotifications.tsx
import React from "react";
import { Bell, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyNotificationsProps {
  message?: string;
  resetFilters?: () => void;
  type?: "empty" | "filtered";
}

const EmptyNotifications: React.FC<EmptyNotificationsProps> = ({
  message = "暂无通知",
  resetFilters,
  type = "empty"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-gray-100 dark:bg-gray-800 h-20 w-20 rounded-full flex items-center justify-center mb-4">
        <Bell className="h-10 w-10 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-medium mb-2">
        {type === "filtered" ? "未找到匹配的通知" : message}
      </h3>
      
      <p className="text-muted-foreground max-w-md mb-6">
        {type === "filtered" 
          ? "尝试调整筛选条件或搜索关键词，以查看更多通知" 
          : "当您收到系统、团队或事件的通知时，它们将显示在这里"
        }
      </p>
      
      {type === "filtered" && resetFilters && (
        <Button 
          variant="outline" 
          onClick={resetFilters}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          重置筛选条件
        </Button>
      )}
    </div>
  );
};

export default EmptyNotifications;
```
## 创建通知角标组件

```typescript jsx:src/app/(center)/dashboard/(pages)/notification/_components/ui/NotificationBadge.tsx
import React from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface NotificationBadgeProps {
  maxCount?: number;
  showDropdown?: boolean;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  maxCount = 99,
  showDropdown = true
}) => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  
  // 获取最近未读通知
  const recentUnreadNotifications = notifications
    .filter(n => n.status === "unread")
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5);
  
  // 格式化计数
  const formattedCount = unreadCount > maxCount ? `${maxCount}+` : unreadCount;
  
  // 如果没有通知或不显示下拉菜单，则直接显示角标
  if (unreadCount === 0 || !showDropdown) {
    return (
      <div className="relative">
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            {formattedCount}
          </span>
        )}
      </div>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            {formattedCount}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[320px]">
        <DropdownMenuLabel>最近通知</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {recentUnreadNotifications.length > 0 ? (
            recentUnreadNotifications.map(notification => (
              <DropdownMenuItem key={notification.id} asChild>
                <Link 
                  href={notification.actionUrl || "/dashboard/notification"} 
                  className="flex flex-col py-2 cursor-pointer"
                  onClick={() => markAsRead(notification.id)}
                >
                  <span className="font-medium">{notification.title}</span>
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {notification.message}
                  </span>
                </Link>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-2 py-4 text-center text-muted-foreground">
              暂无未读通知
            </div>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/notification" className="w-full justify-center">
            查看全部通知
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBadge;
```
## 创建消息弹出通知组件

```typescript jsx:src/app/(center)/dashboard/(pages)/notification/_components/ui/Toast/NotificationToast.tsx
import React from "react";
import { Check, X, AlertCircle, Info, Bell } from "lucide-react";
import { useNotifications, Notification } from "../../context/NotificationContext";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

interface NotificationToastProps {
  notification: Notification;
  onOpenChange: (open: boolean) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onOpenChange,
}) => {
  const { markAsRead } = useNotifications();
  
  const getIcon = () => {
    switch (notification.priority) {
      case "urgent":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "important":
        return <Info className="h-5 w-5 text-amber-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const handleAction = () => {
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    markAsRead(notification.id);
    onOpenChange(false);
  };
  
  return (
    <Toast
      onOpenChange={onOpenChange}
      className={`${
        notification.priority === "urgent" 
          ? "border-l-4 border-red-500" 
          : notification.priority === "important"
          ? "border-l-4 border-amber-500"
          : ""
      }`}
    >
      <div className="flex gap-3">
        <div className="flex items-center justify-center">
          {getIcon()}
        </div>
        <div className="grid gap-1">
          <ToastTitle className="flex items-center gap-2">
            {notification.title}
          </ToastTitle>
          <ToastDescription className="text-sm">
            {notification.message}
          </ToastDescription>
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => {
            markAsRead(notification.id);
            onOpenChange(false);
          }}
        >
          <Check className="mr-2 h-4 w-4" />
          标记为已读
        </Button>
        {notification.actionUrl && (
          <Button
            size="sm"
            className="h-8"
            onClick={handleAction}
          >
            查看详情
          </Button>
        )}
      </div>
      <ToastClose />
    </Toast>
  );
};

export const NotificationToastContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ToastProvider>
      {children}
      <ToastViewport className="fixed top-4 right-4 flex flex-col gap-2 w-96 max-w-[100vw] m-0 z-[100] outline-none" />
    </ToastProvider>
  );
};
```
## 创建通知管理hooks

```typescript:src/app/(center)/dashboard/(pages)/notification/_components/hooks/useToastNotification.ts
import { useState, useCallback } from "react";
import { 
  useNotifications, 
  Notification, 
  NotificationType, 
  NotificationPriority 
} from "../context/NotificationContext";
import { useToast } from "@/components/ui/use-toast";

export const useToastNotification = () => {
  const { addNotification } = useNotifications();
  const { toast } = useToast();
  
  // 发送通知并显示Toast
  const sendNotification = useCallback(
    (
      title: string,
      message: string,
      options?: {
        type?: NotificationType;
        priority?: NotificationPriority;
        actionUrl?: string;
        sender?: { id: string; name: string; avatar?: string };
        showToast?: boolean;
      }
    ) => {
      const {
        type = "system",
        priority = "normal",
        actionUrl,
        sender,
        showToast = true,
      } = options || {};
      
      // 创建通知数据
      const notificationData = {
        title,
        message,
        type,
        priority,
        actionUrl,
        sender,
        metadata: {},
      };
      
      // 添加到通知中心
      addNotification(notificationData);
      
      // 显示Toast通知
      if (showToast) {
        toast({
          title,
          description: message,
          variant: priority === "urgent" ? "destructive" : undefined,
        });
      }
      
      return notificationData;
    },
    [addNotification, toast]
  );
  
  // 简化版方法，用于不同类型通知
  const sendSystemNotification = useCallback(
    (title: string, message: string, options?: Omit<Parameters<typeof sendNotification>[2], "type">) => {
      return sendNotification(title, message, { ...options, type: "system" });
    },
    [sendNotification]
  );
  
  const sendTeamNotification = useCallback(
    (title: string, message: string, options?: Omit<Parameters<typeof sendNotification>[2], "type">) => {
      return sendNotification(title, message, { ...options, type: "team" });
    },
    [sendNotification]
  );
  
  const sendEventNotification = useCallback(
    (title: string, message: string, options?: Omit<Parameters<typeof sendNotification>[2], "type">) => {
      return sendNotification(title, message, { ...options, type: "event" });
    },
    [sendNotification]
  );
  
  const sendMessageNotification = useCallback(
    (title: string, message: string, options?: Omit<Parameters<typeof sendNotification>[2], "type">) => {
      return sendNotification(title, message, { ...options, type: "message" });
    },
    [sendNotification]
  );
  
  return {
    sendNotification,
    sendSystemNotification,
    sendTeamNotification,
    sendEventNotification,
    sendMessageNotification,
  };
};
```
## 创建通知UI组件 - 所有通知部分

```typescript jsx:src/app/(center)/dashboard/(pages)/notification/_components/sections/AllNotifications.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, Loader2 } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { NotificationCard } from "../ui/NotificationCard";
import EmptyNotifications from "../ui/EmptyNotifications";

interface AllNotificationsProps {
  searchQuery: string;
  filter: string;
}

const AllNotifications: React.FC<AllNotificationsProps> = ({
  searchQuery,
  filter,
}) => {
  const { getFilteredNotifications } = useNotifications();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  
  // 获取筛选后的通知
  const filteredNotifications = getFilteredNotifications(searchQuery, filter);
  
  // 分页展示的通知
  const paginatedNotifications = filteredNotifications.slice(0, page * itemsPerPage);
  
  // 模拟加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 点击加载更多
  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  // 没有通知时显示空状态
  if (filteredNotifications.length === 0) {
    return (
      <EmptyNotifications 
        type={searchQuery || filter !== "all" ? "filtered" : "empty"} 
      />
    );
  }
  
  return (
    <div className="space-y-4">
      {/* 通知列表 */}
      <div className="space-y-4">
        {paginatedNotifications.map(notification => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
      </div>
      
      {/* 加载更多按钮 */}
      {filteredNotifications.length > paginatedNotifications.length && (
        <div className="flex justify-center py-4">
          <Button 
            variant="ghost" 
            onClick={handleLoadMore}
            className="gap-2"
          >
            <ArrowDown className="h-4 w-4" />
            加载更多
          </Button>
        </div>
      )}
      
      {/* 结束提示 */}
      {filteredNotifications.length <= paginatedNotifications.length && 
        filteredNotifications.length > 0 && (
        <div className="text-center py-4 text-muted-foreground text-sm">
          已显示全部通知
        </div>
      )}
    </div>
  );
};

export default AllNotifications;
```
## 创建团队通知组件

```typescript jsx:src/app/(center)/dashboard/(pages)/notification/_components/sections/TeamNotifications.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, Loader2, UserPlus } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { NotificationCard } from "../ui/NotificationCard";
import EmptyNotifications from "../ui/EmptyNotifications";

interface TeamNotificationsProps {
  searchQuery: string;
  filter: string;
}

const TeamNotifications: React.FC<TeamNotificationsProps> = ({
  searchQuery,
  filter,
}) => {
  const { getFilteredNotifications } = useNotifications();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  
  // 获取筛选后的团队通知
  const filteredNotifications = getFilteredNotifications(searchQuery, filter, "team");
  
  // 分页展示的通知
  const paginatedNotifications = filteredNotifications.slice(0, page * itemsPerPage);
  
  // 模拟加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 点击加载更多
  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  // 没有通知时显示空状态
  if (filteredNotifications.length === 0) {
    return (
      <EmptyNotifications 
        type={searchQuery || filter !== "all" ? "filtered" : "empty"} 
        message="暂无团队通知"
      />
    );
  }
  
  return (
    <div className="space-y-4">
      {/* 团队通知列表 */}
      <div className="space-y-4">
        {paginatedNotifications.map(notification => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
      </div>
      
      {/* 加载更多按钮 */}
      {filteredNotifications.length > paginatedNotifications.length && (
        <div className="flex justify-center py-4">
          <Button 
            variant="ghost" 
            onClick={handleLoadMore}
            className="gap-2"
          >
            <ArrowDown className="h-4 w-4" />
            加载更多
          </Button>
        </div>
      )}
      
      {/* 结束提示 */}
      {filteredNotifications.length <= paginatedNotifications.length && 
        filteredNotifications.length > 0 && (
        <div className="text-center py-4 text-muted-foreground text-sm">
          已显示全部团队通知
        </div>
      )}
    </div>
  );
};

export default TeamNotifications;
```
## 创建事件通知组件

```typescript jsx:src/app/(center)/dashboard/(pages)/notification/_components/sections/EventNotifications.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, Loader2 } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { NotificationCard } from "../ui/NotificationCard";
import EmptyNotifications from "../ui/EmptyNotifications";

interface EventNotificationsProps {
  searchQuery: string;
  filter: string;
}

const EventNotifications: React.FC<EventNotificationsProps> = ({
  searchQuery,
  filter,
}) => {
  const { getFilteredNotifications } = useNotifications();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  
  // 获取筛选后的事件通知
  const filteredNotifications = getFilteredNotifications(searchQuery, filter, "event");
  
  // 分页展示的通知
  const paginatedNotifications = filteredNotifications.slice(0, page * itemsPerPage);
  
  // 模拟加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 点击加载更多
  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  // 没有通知时显示空状态
  if (filteredNotifications.length === 0) {
    return (
      <EmptyNotifications 
        type={searchQuery || filter !== "all" ? "filtered" : "empty"} 
        message="暂无事件通知"
      />
    );
  }
  
  return (
    <div className="space-y-4">
      {/* 事件通知列表 */}
      <div className="space-y-4">
        {paginatedNotifications.map(notification => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
      </div>
      
      {/* 加载更多按钮 */}
      {filteredNotifications.length > paginatedNotifications.length && (
        <div className="flex justify-center py-4">
          <Button 
            variant="ghost" 
            onClick={handleLoadMore}
            className="gap-2"
          >
            <ArrowDown className="h-4 w-4" />
            加载更多
          </Button>
        </div>
      )}
      
      {/* 结束提示 */}
      {filteredNotifications.length <= paginatedNotifications.length && 
        filteredNotifications.length > 0 && (
        <div className="text-center py-4 text-muted-foreground text-sm">
          已显示全部事件通知
        </div>
      )}
    </div>
  );
};

export default EventNotifications;
```
## 创建通知设置组件

```typescript jsx:src/app/(center)/dashboard/(pages)/notification/_components/sections/NotificationSettings.tsx
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
  Bell, Mail, Calendar, Users, MessageSquare, Desktop, 
  SmartphoneMobile, Save 
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
            <Desktop className="h-4 w-4" />
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
                    <Desktop className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Chrome - Mac OS</p>
                      <p className="text-xs text-muted-foreground">上次活动：今天</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <SmartphoneMobile className="h-5 w-5 text-muted-foreground" />
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
```
让我们修复这个问题，更新NotificationSettings组件中图标的引用：

```typescript jsx:src/app/(center)/dashboard/(pages)/notification/_components/sections/NotificationSettings.tsx
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
  Bell, Mail, Calendar, Users, MessageSquare, Monitor, 
  Smartphone, Save 
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
            <Monitor className="h-4 w-4" />
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
                    <Monitor className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Chrome - Mac OS</p>
                      <p className="text-xs text-muted-foreground">上次活动：今天</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
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
```
## 创建索引文件导出所有部分组件

```typescript:src/app/(center)/dashboard/(pages)/notification/_components/sections/index.ts
export { default as AllNotifications } from './AllNotifications';
export { default as TeamNotifications } from './TeamNotifications';
export { default as EventNotifications } from './EventNotifications';
export { default as NotificationSettings } from './NotificationSettings';
```
## 为整个通知系统创建一个Provider包装器

```typescript jsx:src/app/(center)/dashboard/(pages)/notification/providers.tsx
'use client';

import React, { ReactNode } from 'react';
import { NotificationProvider } from './_components/context/NotificationContext';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <NotificationProvider>
      {children}
    </NotificationProvider>
  );
}
```

Ran tool
## 更新布局文件，使用通知Provider

```typescript jsx:src/app/(center)/dashboard/(pages)/notification/layout.tsx
'use client';
import React from 'react';
import Content from '../../_components/content';
import Providers from './providers';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Providers>
      <Content title="通知中心">
        <div className="h-[calc(100vh-5rem)] bg-gray-50 dark:bg-transparent overflow-hidden">
          {children}
        </div>
      </Content>
    </Providers>
  );
}
```

Ran tool
# 通知系统设计完成

我已经为您创建了一个功能完整的通知系统，包含多种预设UI组件和管理功能。这个系统可以满足您的事件通知和团队内部通知需求。

## 主要功能和组件概述：

### 1. 核心管理系统
- **NotificationContext** - 通知数据状态管理和操作
- **通知数据模型** - 定义了通知类型、优先级和状态
- **通知管理API** - 添加、删除、标记已读等功能

### 2. 通知UI组件
- **NotificationCard** - 可复用的通知卡片组件
- **NotificationBadge** - 角标组件，可显示未读数量
- **NotificationToast** - 弹出式通知组件
- **EmptyNotifications** - 无通知状态显示组件

### 3. 功能模块组件
- **AllNotifications** - 显示所有类型通知
- **TeamNotifications** - 专门显示团队相关通知
- **EventNotifications** - 专门显示事件相关通知
- **NotificationSettings** - 通知偏好设置

### 4. 工具组件
- **useToastNotification** - 封装的通知发送Hook

## 系统特点：

1. **模块化设计** - 所有功能都被拆分为独立组件，易于维护和扩展
2. **类型化接口** - 使用TypeScript提供类型安全
3. **状态管理** - 通过Context API集中管理通知状态
4. **响应式布局** - 在移动和桌面设备上都有良好表现
5. **丰富的设置选项** - 通过设置面板提供细粒度控制
6. **多种显示方式** - 支持卡片、角标、弹出Toast等多种通知形式
7. **筛选和搜索** - 内置通知筛选和搜索功能

## 使用方法：

### 发送新通知：
```typescript
const { sendNotification } = useToastNotification();

// 发送普通通知
sendNotification(
  "标题", 
  "消息内容",
  { 
    type: "system", 
    priority: "normal",
    actionUrl: "/some-link"
  }
);

// 发送团队通知
sendTeamNotification(
  "团队邀请", 
  "您被邀请加入项目团队",
  { 
    priority: "important",
    sender: { id: "user1", name: "张三" }
  }
);
```

### 添加通知角标：
```jsx
<NotificationBadge maxCount={99} showDropdown={true} />
```

### 显示弹出通知：
```jsx
<NotificationToast 
  notification={notification}
  onOpenChange={(open) => setToastOpen(open)}
/>
```

这个通知系统能够满足现代应用所需的各种通知场景，并可以根据您的实际需求进一步扩展。
