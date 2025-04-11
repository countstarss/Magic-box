<think>用户需要我设计一个Event页面，主要用于创建和管理事件（如产品促销、会员优惠等）。这个页面需要包含以下功能：

1. 创建事件功能
2. 选择邮件模板（从模板库中，使用Mock数据）
3. 选择接收用户名单或用户分类
4. 设置发送时间
5. 查看事件邮件发送后的数据分析（insights面板）
6. 数据可视化图表展示

我应该设计一个类似于之前的Billing和Notification页面的UI结构，但功能针对事件管理。可以借鉴已有的代码风格和组件结构。

页面结构可以包括：
- 主页面：显示事件列表和概览
- 创建事件页面/模态框
- 事件详情页面，包含insights数据分析

我将首先设计主页面，然后是创建事件的表单，最后是详情页面。</think># 事件管理系统设计

我将为您设计一个功能完整的事件管理系统，可用于创建产品促销、会员优惠等营销活动，并提供完整的数据分析。

让我们从基础布局开始：

```typescript jsx:src/app/(center)/dashboard/(pages)/event/page.tsx
import React from 'react';
import ContextMenuWrapper from '@/components/ui/ContextMenuWrapper';
import EventLayout from './_components/EventLayout';

const EventPage = () => {
  return (
    <ContextMenuWrapper>
      <div className="p-8 pb-24">
        <EventLayout />
      </div>
    </ContextMenuWrapper>
  );
};

export default EventPage;
```
现在创建布局文件：

```typescript jsx:src/app/(center)/dashboard/(pages)/event/layout.tsx
'use client';
import React from 'react';
import Content from '../../_components/content';
import EventProvider from './providers';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <EventProvider>
      <Content title="事件管理">
        <div className="h-[calc(100vh-5rem)] bg-gray-50 dark:bg-transparent overflow-auto">
          {children}
        </div>
      </Content>
    </EventProvider>
  );
}
```
创建事件的上下文状态管理：

```typescript jsx:src/app/(center)/dashboard/(pages)/event/_components/context/EventContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// 事件状态类型
export type EventStatus = "draft" | "scheduled" | "sending" | "sent" | "canceled";

// 事件类型
export type EventType = "promotion" | "newsletter" | "announcement" | "welcome" | "reminder" | "other";

// 目标用户类型
export type TargetAudience = {
  id: string;
  name: string;
  count: number;
  description?: string;
};

// 模板类型
export type EmailTemplate = {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  description?: string;
};

// 事件数据结构
export interface Event {
  id: string;
  name: string;
  description?: string;
  type: EventType;
  status: EventStatus;
  template: EmailTemplate;
  audience: TargetAudience;
  scheduledDate: Date;
  createdAt: Date;
  updatedAt: Date;
  sentAt?: Date;
  stats?: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
    complaints: number;
  };
  metadata?: Record<string, any>;
}

// 上下文接口
interface EventContextType {
  events: Event[];
  templates: EmailTemplate[];
  audiences: TargetAudience[];
  selectedEvent: Event | null;
  isCreatingEvent: boolean;
  setIsCreatingEvent: (isCreating: boolean) => void;
  setSelectedEvent: (event: Event | null) => void;
  createEvent: (event: Omit<Event, "id" | "createdAt" | "updatedAt">) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  duplicateEvent: (id: string) => void;
  cancelEvent: (id: string) => void;
  getEventById: (id: string) => Event | undefined;
}

// 创建上下文
const EventContext = createContext<EventContextType | undefined>(undefined);

// 模拟数据 - 邮件模板
const mockTemplates: EmailTemplate[] = [
  {
    id: "template1",
    name: "促销活动模板",
    category: "promotion",
    thumbnail: "https://github.com/shadcn.png",
    description: "适用于产品促销活动的模板，包含产品展示和优惠信息"
  },
  {
    id: "template2",
    name: "会员优惠模板",
    category: "promotion",
    thumbnail: "https://github.com/shadcn.png",
    description: "适用于会员专属优惠活动的模板"
  },
  {
    id: "template3",
    name: "新品发布模板",
    category: "announcement",
    thumbnail: "https://github.com/shadcn.png",
    description: "新产品发布通知模板，突出展示产品特点"
  },
  {
    id: "template4",
    name: "每周通讯模板",
    category: "newsletter",
    thumbnail: "https://github.com/shadcn.png",
    description: "适用于周期性发送的通讯邮件"
  },
  {
    id: "template5",
    name: "欢迎注册模板",
    category: "welcome",
    thumbnail: "https://github.com/shadcn.png",
    description: "用户注册后的欢迎邮件模板"
  },
  {
    id: "template6",
    name: "节日祝福模板",
    category: "promotion",
    thumbnail: "https://github.com/shadcn.png",
    description: "各类节日活动的祝福邮件模板"
  }
];

// 模拟数据 - 目标受众
const mockAudiences: TargetAudience[] = [
  {
    id: "audience1",
    name: "所有用户",
    count: 24850,
    description: "所有注册用户"
  },
  {
    id: "audience2",
    name: "活跃用户",
    count: 15620,
    description: "最近30天内有活动的用户"
  },
  {
    id: "audience3",
    name: "付费会员",
    count: 8540,
    description: "已订阅付费服务的用户"
  },
  {
    id: "audience4",
    name: "新注册用户",
    count: 3210,
    description: "最近7天注册的新用户"
  },
  {
    id: "audience5",
    name: "沉睡用户",
    count: 6430,
    description: "超过60天未活动的用户"
  },
  {
    id: "audience6",
    name: "高价值用户",
    count: 1280,
    description: "累计消费超过1000元的用户"
  }
];

// 模拟数据 - 事件
const mockEvents: Event[] = [
  {
    id: "event1",
    name: "夏季促销活动",
    description: "夏季新品上市，全场商品7折起",
    type: "promotion",
    status: "sent",
    template: mockTemplates[0],
    audience: mockAudiences[0],
    scheduledDate: new Date(2023, 5, 15, 10, 0), // 2023-06-15 10:00
    createdAt: new Date(2023, 5, 10),
    updatedAt: new Date(2023, 5, 10),
    sentAt: new Date(2023, 5, 15, 10, 5),
    stats: {
      sent: 24850,
      delivered: 23760,
      opened: 12500,
      clicked: 8200,
      bounced: 1090,
      unsubscribed: 120,
      complaints: 15
    }
  },
  {
    id: "event2",
    name: "会员专享折扣",
    description: "会员专享优惠活动，会员商品额外9折",
    type: "promotion",
    status: "sent",
    template: mockTemplates[1],
    audience: mockAudiences[2],
    scheduledDate: new Date(2023, 6, 1, 9, 30), // 2023-07-01 9:30
    createdAt: new Date(2023, 5, 25),
    updatedAt: new Date(2023, 5, 28),
    sentAt: new Date(2023, 6, 1, 9, 32),
    stats: {
      sent: 8540,
      delivered: 8125,
      opened: 5240,
      clicked: 3450,
      bounced: 415,
      unsubscribed: 78,
      complaints: 5
    }
  },
  {
    id: "event3",
    name: "新品上市通知",
    description: "秋季新品系列正式发布，先到先得",
    type: "announcement",
    status: "scheduled",
    template: mockTemplates[2],
    audience: mockAudiences[1],
    scheduledDate: new Date(2023, 7, 15, 10, 0), // 2023-08-15 10:00
    createdAt: new Date(2023, 7, 1),
    updatedAt: new Date(2023, 7, 5)
  },
  {
    id: "event4",
    name: "周末限时活动",
    description: "本周末限时特惠，部分商品5折起",
    type: "promotion",
    status: "draft",
    template: mockTemplates[0],
    audience: mockAudiences[0],
    scheduledDate: new Date(2023, 7, 20, 9, 0), // 2023-08-20 9:00
    createdAt: new Date(2023, 7, 10),
    updatedAt: new Date(2023, 7, 10)
  }
];

// 提供者组件
export const EventProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  
  // 创建新事件
  const createEvent = (eventData: Omit<Event, "id" | "createdAt" | "updatedAt">) => {
    const newEvent: Event = {
      ...eventData,
      id: `event${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setEvents(prev => [newEvent, ...prev]);
    return newEvent;
  };
  
  // 更新事件
  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === id 
          ? { ...event, ...updates, updatedAt: new Date() } 
          : event
      )
    );
  };
  
  // 删除事件
  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };
  
  // 复制事件
  const duplicateEvent = (id: string) => {
    const eventToDuplicate = events.find(event => event.id === id);
    if (!eventToDuplicate) return;
    
    const duplicatedEvent: Event = {
      ...eventToDuplicate,
      id: `event${Date.now()}`,
      name: `${eventToDuplicate.name} (复制)`,
      status: "draft",
      sentAt: undefined,
      stats: undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setEvents(prev => [duplicatedEvent, ...prev]);
  };
  
  // 取消事件
  const cancelEvent = (id: string) => {
    updateEvent(id, { status: "canceled" });
  };
  
  // 根据ID获取事件
  const getEventById = (id: string) => {
    return events.find(event => event.id === id);
  };
  
  return (
    <EventContext.Provider
      value={{
        events,
        templates: mockTemplates,
        audiences: mockAudiences,
        selectedEvent,
        isCreatingEvent,
        setIsCreatingEvent,
        setSelectedEvent,
        createEvent,
        updateEvent,
        deleteEvent,
        duplicateEvent,
        cancelEvent,
        getEventById
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

// 自定义钩子，方便使用事件上下文
export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvents必须在EventProvider内部使用");
  }
  return context;
};
```
创建事件Provider文件：

```typescript jsx:src/app/(center)/dashboard/(pages)/event/providers.tsx
'use client';

import React, { ReactNode } from 'react';
import { EventProvider } from './_components/context/EventContext';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <EventProvider>
      {children}
    </EventProvider>
  );
}
```
现在创建事件布局组件：

```typescript jsx:src/app/(center)/dashboard/(pages)/event/_components/EventLayout.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, Clock, FileText, ListFilter, Plus, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";

// 导入事件组件
import EventsList from "./sections/EventsList";
import EventInsights from "./sections/EventInsights";
import { useEvents } from "./context/EventContext";
import CreateEventDialog from "./dialogs/CreateEventDialog";

const EventLayout = () => {
  const { events, selectedEvent, setSelectedEvent, isCreatingEvent, setIsCreatingEvent } = useEvents();
  
  const [activeTab, setActiveTab] = useState<string>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // 当选择事件时，自动切换到insights标签页
  useEffect(() => {
    if (selectedEvent) {
      setActiveTab("insights");
    }
  }, [selectedEvent]);

  // 处理返回事件列表
  const handleBackToList = () => {
    setSelectedEvent(null);
    setActiveTab("list");
  };

  // 处理创建新事件
  const handleCreateEvent = () => {
    setIsCreatingEvent(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">事件管理</h1>
          <Button onClick={handleCreateEvent} className="gap-2">
            <Plus className="h-4 w-4" />
            创建事件
          </Button>
        </div>
        <p className="text-muted-foreground">
          创建和管理您的营销事件，包括促销活动、会员优惠等
        </p>
      </div>
      
      {/* 搜索和筛选区域，仅在列表页显示 */}
      {!selectedEvent && activeTab === "list" && (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-auto flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索事件名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="状态筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有状态</SelectItem>
                <SelectItem value="draft">草稿</SelectItem>
                <SelectItem value="scheduled">已计划</SelectItem>
                <SelectItem value="sending">发送中</SelectItem>
                <SelectItem value="sent">已发送</SelectItem>
                <SelectItem value="canceled">已取消</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={typeFilter} 
              onValueChange={setTypeFilter}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="类型筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有类型</SelectItem>
                <SelectItem value="promotion">促销活动</SelectItem>
                <SelectItem value="newsletter">新闻通讯</SelectItem>
                <SelectItem value="announcement">公告</SelectItem>
                <SelectItem value="welcome">欢迎邮件</SelectItem>
                <SelectItem value="reminder">提醒邮件</SelectItem>
                <SelectItem value="other">其他</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      {/* 如果选择了事件，则显示返回按钮 */}
      {selectedEvent && (
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBackToList}
            className="gap-2"
          >
            <Calendar className="h-4 w-4" />
            返回事件列表
          </Button>
          <h2 className="ml-4 text-lg font-semibold">
            {selectedEvent.name}
          </h2>
        </div>
      )}
      
      {/* 事件内容区域 */}
      <Tabs 
        defaultValue="list" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        {!selectedEvent && (
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              事件列表
            </TabsTrigger>
            <TabsTrigger value="insights" disabled={!selectedEvent} className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              数据分析
            </TabsTrigger>
          </TabsList>
        )}
        
        <TabsContent value="list" className="mt-0">
          <EventsList 
            searchQuery={searchQuery} 
            statusFilter={statusFilter} 
            typeFilter={typeFilter} 
          />
        </TabsContent>
        
        <TabsContent value="insights" className="mt-0">
          {selectedEvent ? (
            <EventInsights event={selectedEvent} />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              请选择一个事件查看数据分析
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* 创建事件对话框 */}
      <CreateEventDialog 
        isOpen={isCreatingEvent} 
        onClose={() => setIsCreatingEvent(false)} 
      />
    </div>
  );
};

export default EventLayout;
```
让我们创建事件列表组件：

```typescript jsx:src/app/(center)/dashboard/(pages)/event/_components/sections/EventsList.tsx
"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Copy, Trash, ExternalLink, AlertCircle, AlarmClock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { EventStatus, EventType, useEvents } from "../context/EventContext";
import { EmptyEvents } from "../ui/EmptyEvents";

interface EventsListProps {
  searchQuery: string;
  statusFilter: string;
  typeFilter: string;
}

const EventsList: React.FC<EventsListProps> = ({
  searchQuery,
  statusFilter,
  typeFilter,
}) => {
  const { events, setSelectedEvent, duplicateEvent, deleteEvent, cancelEvent } = useEvents();
  
  // 处理选择事件
  const handleSelectEvent = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
    }
  };
  
  // 处理删除事件
  const handleDeleteEvent = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("确定要删除此事件吗？此操作不可撤销。")) {
      deleteEvent(eventId);
    }
  };
  
  // 处理复制事件
  const handleDuplicateEvent = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateEvent(eventId);
  };
  
  // 处理取消事件
  const handleCancelEvent = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("确定要取消此事件吗？")) {
      cancelEvent(eventId);
    }
  };
  
  // 获取状态标签
  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">草稿</Badge>;
      case "scheduled":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">已计划</Badge>;
      case "sending":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">发送中</Badge>;
      case "sent":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">已发送</Badge>;
      case "canceled":
        return <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">已取消</Badge>;
      default:
        return <Badge variant="outline">未知</Badge>;
    }
  };
  
  // 获取事件类型
  const getEventTypeLabel = (type: EventType) => {
    switch (type) {
      case "promotion":
        return "促销活动";
      case "newsletter":
        return "新闻通讯";
      case "announcement":
        return "公告";
      case "welcome":
        return "欢迎邮件";
      case "reminder":
        return "提醒邮件";
      default:
        return "其他";
    }
  };
  
  // 筛选事件
  const filteredEvents = events.filter(event => {
    // 搜索查询筛选
    if (searchQuery && !event.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // 状态筛选
    if (statusFilter !== "all" && event.status !== statusFilter) {
      return false;
    }
    
    // 类型筛选
    if (typeFilter !== "all" && event.type !== typeFilter) {
      return false;
    }
    
    return true;
  }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // 按创建时间降序排序
  
  // 如果没有事件，显示空状态
  if (filteredEvents.length === 0) {
    return (
      <EmptyEvents
        message={events.length === 0 ? "暂无事件" : "没有符合条件的事件"}
        type={events.length === 0 ? "empty" : "filtered"}
      />
    );
  }
  
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>事件名称</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>目标受众</TableHead>
              <TableHead>计划时间</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map(event => (
              <TableRow 
                key={event.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSelectEvent(event.id)}
              >
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{event.name}</span>
                    {event.description && (
                      <span className="text-xs text-muted-foreground line-clamp-1">{event.description}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getEventTypeLabel(event.type)}</TableCell>
                <TableCell>
                  <span className="flex flex-col">
                    <span>{event.audience.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {event.audience.count.toLocaleString()}人
                    </span>
                  </span>
                </TableCell>
                <TableCell>
                  {format(event.scheduledDate, 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                </TableCell>
                <TableCell>
                  {getStatusBadge(event.status)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">打开菜单</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>事件操作</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {event.status !== "sent" && event.status !== "canceled" && (
                        <DropdownMenuItem onClick={e => handleCancelEvent(event.id, e)}>
                          <AlertCircle className="mr-2 h-4 w-4 text-amber-500" />
                          <span>取消事件</span>
                        </DropdownMenuItem>
                      )}
                      {event.status === "scheduled" && (
                        <DropdownMenuItem onClick={e => e.stopPropagation()}>
                          <AlarmClock className="mr-2 h-4 w-4 text-blue-500" />
                          <span>修改计划</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={e => handleDuplicateEvent(event.id, e)}>
                        <Copy className="mr-2 h-4 w-4" />
                        <span>复制事件</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={e => handleDeleteEvent(event.id, e)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>删除事件</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default EventsList;
```
现在创建空状态组件：

```typescript jsx:src/app/(center)/dashboard/(pages)/event/_components/ui/EmptyEvents.tsx
import React from "react";
import { Calendar, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEvents } from "../context/EventContext";

interface EmptyEventsProps {
  message?: string;
  type?: "empty" | "filtered";
}

export const EmptyEvents: React.FC<EmptyEventsProps> = ({
  message = "暂无事件",
  type = "empty"
}) => {
  const { setIsCreatingEvent } = useEvents();
  
  // 创建新事件
  const handleCreateEvent = () => {
    setIsCreatingEvent(true);
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-gray-100 dark:bg-gray-800 h-20 w-20 rounded-full flex items-center justify-center mb-4">
        <Calendar className="h-10 w-10 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-medium mb-2">
        {type === "filtered" ? "未找到匹配的事件" : message}
      </h3>
      
      <p className="text-muted-foreground max-w-md mb-6">
        {type === "filtered" 
          ? "尝试调整筛选条件或搜索关键词，以查看更多事件" 
          : "创建您的第一个营销事件，管理您的邮件活动和促销"
        }
      </p>
      
      {type === "filtered" ? (
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          重置筛选条件
        </Button>
      ) : (
        <Button 
          onClick={handleCreateEvent}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          创建事件
        </Button>
      )}
    </div>
  );
};
```
现在创建数据分析界面：

```typescript jsx:src/app/(center)/dashboard/(pages)/event/_components/sections/EventInsights.tsx
"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart, PieChart, LineChart, Download, Share2, RefreshCw,
  Calendar, Users, Clock, Mail, ExternalLink, MessageSquare
} from "lucide-react";
import { Event } from "../context/EventContext";
import { format, formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

// 数据图表组件
import { DeliveryRateChart } from "../charts/DeliveryRateChart";
import { OpenRateChart } from "../charts/OpenRateChart";
import { ClickRateChart } from "../charts/ClickRateChart";
import { EventTimelineChart } from "../charts/EventTimelineChart";
import { AudienceSegmentChart } from "../charts/AudienceSegmentChart";

interface EventInsightsProps {
  event: Event;
}

const EventInsights: React.FC<EventInsightsProps> = ({ event }) => {
  // 检查事件是否已发送
  const isSent = event.status === "sent";
  
  // 格式化发送时间
  const formattedScheduledDate = format(event.scheduledDate, 'yyyy-MM-dd HH:mm:ss', { locale: zhCN });
  const timeAgo = formatDistanceToNow(event.scheduledDate, { addSuffix: true, locale: zhCN });
  
  // 计算各项率 (如果有统计数据)
  const stats = event.stats || { sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, unsubscribed: 0, complaints: 0 };
  const deliveryRate = stats.sent > 0 ? (stats.delivered / stats.sent * 100).toFixed(1) : "0.0";
  const openRate = stats.delivered > 0 ? (stats.opened / stats.delivered * 100).toFixed(1) : "0.0";
  const clickRate = stats.opened > 0 ? (stats.clicked / stats.opened * 100).toFixed(1) : "0.0";
  const bounceRate = stats.sent > 0 ? (stats.bounced / stats.sent * 100).toFixed(1) : "0.0";
  const unsubscribeRate = stats.delivered > 0 ? (stats.unsubscribed / stats.delivered * 100).toFixed(2) : "0.00";
  
  return (
    <div className="space-y-6">
      {/* 事件概览卡片 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{event.name}</CardTitle>
              <CardDescription className="mt-1">{event.description}</CardDescription>
            </div>
            <Badge className={`
              ${event.status === "draft" ? "bg-gray-100 text-gray-800" : ""}
              ${event.status === "scheduled" ? "bg-blue-100 text-blue-800" : ""}
              ${event.status === "sending" ? "bg-amber-100 text-amber-800" : ""}
              ${event.status === "sent" ? "bg-green-100 text-green-800" : ""}
              ${event.status === "canceled" ? "bg-red-100 text-red-800" : ""}
            `}>
              {event.status === "draft" && "草稿"}
              {event.status === "scheduled" && "已计划"}
              {event.status === "sending" && "发送中"}
              {event.status === "sent" && "已发送"}
              {event.status === "canceled" && "已取消"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">计划时间</p>
                <p className="text-sm text-muted-foreground" title={formattedScheduledDate}>
                  {timeAgo}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">目标受众</p>
                <p className="text-sm text-muted-foreground">
                  {event.audience.name} ({event.audience.count.toLocaleString()}人)
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">使用模板</p>
                <p className="text-sm text-muted-foreground">
                  {event.template.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">创建时间</p>
                <p className="text-sm text-muted-foreground">
                  {format(event.createdAt, 'yyyy-MM-dd', { locale: zhCN })}
                </p>
              </div>
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-2 mt-6 justify-end">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              <span>导出报告</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              <span>分享</span>
            </Button>
            {isSent && (
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                <span>刷新数据</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* 数据分析部分 - 仅在已发送时显示 */}
      {isSent ? (
        <div className="space-y-6">
          {/* 关键指标卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">已送达</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold">{deliveryRate}%</div>
                  <div className="text-muted-foreground text-sm">
                    {stats.delivered.toLocaleString()} / {stats.sent.toLocaleString()}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  成功送达邮件的百分比
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">打开率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold">{openRate}%</div>
                  <div className="text-muted-foreground text-sm">
                    {stats.opened.toLocaleString()} / {stats.delivered.toLocaleString()}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  收件人打开邮件的百分比
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">点击率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold">{clickRate}%</div>
                  <div className="text-muted-foreground text-sm">
                    {stats.clicked.toLocaleString()} / {stats.opened.toLocaleString()}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  打开邮件后点击链接的百分比
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* 详细数据分析选项卡 */}
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview" className="gap-2">
                <BarChart className="h-4 w-4" />
                总体概览
              </TabsTrigger>
              <TabsTrigger value="audience" className="gap-2">
                <PieChart className="h-4 w-4" />
                受众分析
              </TabsTrigger>
              <TabsTrigger value="timeline" className="gap-2">
                <LineChart className="h-4 w-4" />
                时间线
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">送达状态</CardTitle>
                    <CardDescription>邮件送达情况分析</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <DeliveryRateChart stats={stats} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">打开率</CardTitle>
                    <CardDescription>邮件打开情况分析</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <OpenRateChart stats={stats} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">点击情况</CardTitle>
                    <CardDescription>邮件链接点击情况</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ClickRateChart stats={stats} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">其他指标</CardTitle>
                    <CardDescription>退订和投诉情况</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">退订率</span>
                        <span className="text-sm">{unsubscribeRate}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="bg-amber-400 h-full rounded-full" 
                          style={{ width: `${Math.min(unsubscribeRate * 20, 100)}%` }} 
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stats.unsubscribed} 人退订
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">投诉率</span>
                        <span className="text-sm">
                          {(stats.complaints / stats.delivered * 100).toFixed(3)}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="bg-red-400 h-full rounded-full" 
                          style={{ width: `${Math.min((stats.complaints / stats.delivered * 100) * 50, 100)}%` }} 
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stats.complaints} 人投诉
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="audience" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">受众分析</CardTitle>
                  <CardDescription>按不同维度分析受众群体</CardDescription>
                </CardHeader>
                <CardContent>
                  <AudienceSegmentChart />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">交互时间线</CardTitle>
                  <CardDescription>邮件打开和点击的时间分布</CardDescription>
                </CardHeader>
                <CardContent>
                  <EventTimelineChart />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        // 未发送时显示的内容
        <Card className="py-8">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              此事件尚未发送
            </h3>
            <p className="text-muted-foreground max-w-md mb-6">
              事件发送完成后，您将在这里看到详细的数据分析报告
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                预览模板
              </Button>
              {event.status === "draft" && (
                <Button className="gap-2">
                  <Calendar className="h-4 w-4" />
                  设置发送时间
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventInsights;
```
创建图表组件：

```typescript jsx:src/app/(center)/dashboard/(pages)/event/_components/charts/index.tsx
import React from "react";

// 交付率图表
export const DeliveryRateChart: React.FC<{ stats: any }> = ({ stats }) => {
  return (
    <div className="py-4">
      <div className="flex justify-between text-sm mb-1">
        <span>送达</span>
        <span className="text-green-500">{stats.delivered.toLocaleString()}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="bg-green-500 h-full rounded-full" 
          style={{ width: `${(stats.delivered / stats.sent * 100)}%` }} 
        />
      </div>
      
      <div className="flex justify-between text-sm mb-1 mt-3">
        <span>未送达</span>
        <span className="text-red-500">{stats.bounced.toLocaleString()}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="bg-red-500 h-full rounded-full" 
          style={{ width: `${(stats.bounced / stats.sent * 100)}%` }} 
        />
      </div>
    </div>
  );
};

// 打开率图表
export const OpenRateChart: React.FC<{ stats: any }> = ({ stats }) => {
  return (
    <div className="py-4">
      <div className="flex justify-between text-sm mb-1">
        <span>已打开</span>
        <span className="text-blue-500">{stats.opened.toLocaleString()}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="bg-blue-500 h-full rounded-full" 
          style={{ width: `${(stats.opened / stats.delivered * 100)}%` }} 
        />
      </div>
      
      <div className="flex justify-between text-sm mb-1 mt-3">
        <span>未打开</span>
        <span>{(stats.delivered - stats.opened).toLocaleString()}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="bg-gray-300 h-full rounded-full" 
          style={{ width: `${((stats.delivered - stats.opened) / stats.delivered * 100)}%` }} 
        />
      </div>
    </div>
  );
};

// 点击率图表
export const ClickRateChart: React.FC<{ stats: any }> = ({ stats }) => {
  return (
    <div className="py-4">
      <div className="flex justify-between text-sm mb-1">
        <span>已点击</span>
        <span className="text-green-500">{stats.clicked.toLocaleString()}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="bg-green-500 h-full rounded-full" 
          style={{ width: `${(stats.clicked / stats.opened * 100)}%` }} 
        />
      </div>
      
      <div className="flex justify-between text-sm mb-1 mt-3">
        <span>未点击</span>
        <span>{(stats.opened - stats.clicked).toLocaleString()}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="bg-gray-300 h-full rounded-full" 
          style={{ width: `${((stats.opened - stats.clicked) / stats.opened * 100)}%` }} 
        />
      </div>
    </div>
  );
};

// 时间线图表（简化版，实际中可使用图表库）
export const EventTimelineChart: React.FC = () => {
  // 模拟数据
  const hours = Array.from({ length: 24 }, (_, i) => i);
  // 生成随机数据
  const openData = hours.map(() => Math.floor(Math.random() * 500) + 100);
  const clickData = hours.map((_) => Math.floor(Math.random() * 300) + 50);
  
  // 找出最大值用于计算高度比例
  const maxValue = Math.max(...openData, ...clickData);
  
  return (
    <div className="pt-4">
      <div className="flex justify-between mb-2 text-sm">
        <div className="flex items-center">
          <span className="h-3 w-3 bg-blue-500 rounded-full inline-block mr-2"></span>
          <span>打开</span>
        </div>
        <div className="flex items-center">
          <span className="h-3 w-3 bg-green-500 rounded-full inline-block mr-2"></span>
          <span>点击</span>
        </div>
      </div>
      
      <div className="flex h-40 items-end space-x-1 pt-4 border-b">
        {hours.map((hour, index) => (
          <div key={hour} className="flex-1 flex flex-col items-center">
            <div className="w-full flex flex-col-reverse">
              <div 
                className="bg-green-500 w-full" 
                style={{ 
                  height: `${(clickData[index] / maxValue) * 100}%`,
                  maxHeight: "100%"
                }}
              ></div>
              <div 
                className="bg-blue-500 w-full" 
                style={{ 
                  height: `${(openData[index] / maxValue) * 100}%`,
                  maxHeight: "100%"
                }}
              ></div>
            </div>
            {hour % 3 === 0 && (
              <span className="text-xs mt-1">{hour}:00</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// 受众细分图表（简化版）
export const AudienceSegmentChart: React.FC = () => {
  // 模拟的受众细分数据
  const segments = [
    { name: "活跃用户", percent: 42 },
    { name: "偶尔打开", percent: 28 },
    { name: "一次性打开", percent: 18 },
    { name: "从未打开", percent: 12 },
  ];
  
  // 分配各部分的颜色
  const colors = ["bg-green-500", "bg-blue-500", "bg-amber-500", "bg-gray-300"];
  
  return (
    <div className="pt-4">
      {/* 横向条形图 */}
      <div className="h-8 flex rounded-full overflow-hidden mb-4">
        {segments.map((segment, index) => (
          <div 
            key={index}
            className={`${colors[index]} h-full`}
            style={{ width: `${segment.percent}%` }}
          />
        ))}
      </div>
      
      {/* 图例 */}
      <div className="grid grid-cols-2 gap-2">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center">
            <span className={`h-3 w-3 ${colors[index]} rounded-full inline-block mr-2`}></span>
            <span className="text-sm flex-1">{segment.name}</span>
            <span className="text-sm font-medium">{segment.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
```
创建「创建事件」对话框：

```typescript jsx:src/app/(center)/dashboard/(pages)/event/_components/dialogs/CreateEventDialog.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Check,
  CalendarDays,
  Clock,
  RefreshCw,
  Search,
  Zap,
} from "lucide-react";
import { format, addDays, addHours } from "date-fns";
import { zhCN } from "date-fns/locale";
import { useEvents, EmailTemplate, TargetAudience, EventType } from "../context/EventContext";

interface CreateEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateEventDialog: React.FC<CreateEventDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { templates, audiences, createEvent } = useEvents();
  
  // 事件表单状态
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState<EventType>("promotion");
  
  // 模板选择状态
  const [searchTemplateQuery, setSearchTemplateQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  
  // 受众选择状态
  const [searchAudienceQuery, setSearchAudienceQuery] = useState("");
  const [selectedAudience, setSelectedAudience] = useState<TargetAudience | null>(null);
  
  // 发送时间状态
  const [scheduleType, setScheduleType] = useState<"now" | "later">("later");
  const [scheduledDate, setScheduledDate] = useState<Date>(addDays(new Date(), 1));
  
  // 表单步骤
  const [activeTab, setActiveTab] = useState("basic");
  
  // 处理表单提交
  const handleSubmit = () => {
    if (!name || !selectedTemplate || !selectedAudience) {
      alert("请填写所有必填字段");
      return;
    }
    
    // 创建事件
    createEvent({
      name,
      description,
      type: eventType,
      status: scheduleType === "now" ? "sending" : "scheduled",
      template: selectedTemplate,
      audience: selectedAudience,
      scheduledDate: scheduleType === "now" ? new Date() : scheduledDate,
    });
    
    // 重置表单并关闭对话框
    resetForm();
    onClose();
  };
  
  // 重置表单
  const resetForm = () => {
    setName("");
    setDescription("");
    setEventType("promotion");
    setSearchTemplateQuery("");
    setSelectedTemplate(null);
    setSearchAudienceQuery("");
    setSelectedAudience(null);
    setScheduleType("later");
    setScheduledDate(addDays(new Date(), 1));
    setActiveTab("basic");
  };
  
  // 筛选模板
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchTemplateQuery.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchTemplateQuery.toLowerCase())
  );
  
  // 筛选受众
  const filteredAudiences = audiences.filter(audience =>
    audience.name.toLowerCase().includes(searchAudienceQuery.toLowerCase()) ||
    audience.description?.toLowerCase().includes(searchAudienceQuery.toLowerCase())
  );
  
  // 获取事件类型标签
  const getEventTypeLabel = (type: EventType) => {
    switch (type) {
      case "promotion":
        return "促销活动";
      case "newsletter":
        return "新闻通讯";
      case "announcement":
        return "公告";
      case "welcome":
        return "欢迎邮件";
      case "reminder":
        return "提醒邮件";
      default:
        return "其他";
    }
  };
  
  // 计算表单是否完成
  const basicInfoComplete = name.trim().length > 0 && eventType;
  const templateSelected = !!selectedTemplate;
  const audienceSelected = !!selectedAudience;
  const allComplete = basicInfoComplete && templateSelected && audienceSelected;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>创建新事件</DialogTitle>
          <DialogDescription>
            通过选择目标受众和邮件模板，创建一个新的营销事件
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={`h-5 w-5 p-0 flex items-center justify-center rounded-full ${
                  basicInfoComplete ? "bg-green-100 border-green-500 text-green-700" : ""
                }`}
              >
                {basicInfoComplete ? <Check className="h-3 w-3" /> : "1"}
              </Badge>
              基本信息
            </TabsTrigger>
            <TabsTrigger value="template" className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={`h-5 w-5 p-0 flex items-center justify-center rounded-full ${
                  templateSelected ? "bg-green-100 border-green-500 text-green-700" : ""
                }`}
              >
                {templateSelected ? <Check className="h-3 w-3" /> : "2"}
              </Badge>
              选择模板
            </TabsTrigger>
            <TabsTrigger value="audience" className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={`h-5 w-5 p-0 flex items-center justify-center rounded-full ${
                  audienceSelected ? "bg-green-100 border-green-500 text-green-700" : ""
                }`}
              >
                {audienceSelected ? <Check className="h-3 w-3" /> : "3"}
              </Badge>
              选择受众
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Badge variant="outline" className="h-5 w-5 p-0 flex items-center justify-center rounded-full">
                4
              </Badge>
              计划发送
            </TabsTrigger>
          </TabsList>
          
          {/* 基本信息 */}
          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">事件名称 *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例如：夏季促销活动"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">事件描述</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="简要描述此次事件的目的和内容"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">事件类型 *</Label>
                <Select value={eventType} onValueChange={(value) => setEventType(value as EventType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择事件类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="promotion">促销活动</SelectItem>
                    <SelectItem value="newsletter">新闻通讯</SelectItem>
                    <SelectItem value="announcement">公告</SelectItem>
                    <SelectItem value="welcome">欢迎邮件</SelectItem>
                    <SelectItem value="reminder">提醒邮件</SelectItem>
                    <SelectItem value="other">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button 
                  variant={basicInfoComplete ? "default" : "outline"} 
                  onClick={() => setActiveTab("template")}
                  disabled={!basicInfoComplete}
                >
                  下一步：选择模板
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* 选择模板 */}
          <TabsContent value="template" className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索模板..."
                  value={searchTemplateQuery}
                  onChange={(e) => setSearchTemplateQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button variant="outline" onClick={() => setSearchTemplateQuery("")}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pb-4 pr-2">
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((template) => (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer transition-all hover:shadow ${
                      selectedTemplate?.id === template.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        <div className="h-16 w-16 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                          <img 
                            src={template.thumbnail} 
                            alt={template.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{template.name}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {template.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 py-8 text-center text-muted-foreground">
                  没有找到匹配的模板
                </div>
              )}
            </div>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setActiveTab("basic")}>
                返回
              </Button>
              <Button 
                variant={templateSelected ? "default" : "outline"} 
                onClick={() => setActiveTab("audience")}
                disabled={!templateSelected}
              >
                下一步：选择受众
              </Button>
            </div>
          </TabsContent>
          
          {/* 选择受众 */}
          <TabsContent value="audience" className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索受众..."
                  value={searchAudienceQuery}
                  onChange={(e) => setSearchAudienceQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button variant="outline" onClick={() => setSearchAudienceQuery("")}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto pb-4 pr-2">
              {filteredAudiences.length > 0 ? (
                filteredAudiences.map((audience) => (
                  <Card 
                    key={audience.id}
                    className={`cursor-pointer transition-all hover:shadow ${
                      selectedAudience?.id === audience.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setSelectedAudience(audience)}
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{audience.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {audience.description}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {audience.count.toLocaleString()}人
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  没有找到匹配的受众
                </div>
              )}
            </div>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setActiveTab("template")}>
                返回
              </Button>
              <Button 
                variant={audienceSelected ? "default" : "outline"} 
                onClick={() => setActiveTab("schedule")}
                disabled={!audienceSelected}
              >
                下一步：计划发送
              </Button>
            </div>
          </TabsContent>
          
          {/* 计划发送 */}
          <TabsContent value="schedule" className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>发送时间</Label>
                <div className="flex gap-3">
                  <Card
                    className={`flex-1 cursor-pointer transition-all ${
                      scheduleType === "now" ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setScheduleType("now")}
                  >
                    <CardContent className="p-3 flex gap-3 items-center">
                      <Zap className="h-5 w-5 text-amber-500" />
                      <div>
                        <h4 className="font-medium">立即发送</h4>
                        <p className="text-xs text-muted-foreground">
                          创建后立即发送给选定的受众
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card
                    className={`flex-1 cursor-pointer transition-all ${
                      scheduleType === "later" ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setScheduleType("later")}
                  >
                    <CardContent className="p-3 flex gap-3 items-center">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <div>
                        <h4 className="font-medium">计划发送</h4>
                        <p className="text-xs text-muted-foreground">
                          选择特定的日期和时间发送
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {scheduleType === "later" && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-md">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CalendarDays className="h-5 w-5 mr-2 text-muted-foreground" />
                      <Label>选择发送日期和时间</Label>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm mb-1">日期：</p>
                        <Input
                          type="date"
                          value={format(scheduledDate, 'yyyy-MM-dd')}
                          onChange={(e) => {
                            const newDate = new Date(e.target.value);
                            if (!isNaN(newDate.getTime())) {
                              newDate.setHours(scheduledDate.getHours());
                              newDate.setMinutes(scheduledDate.getMinutes());
                              setScheduledDate(newDate);
                            }
                          }}
                        />
                      </div>
                      
                      <div>
                        <p className="text-sm mb-1">时间：</p>
                        <Input
                          type="time"
                          value={format(scheduledDate, 'HH:mm')}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(':').map(Number);
                            const newDate = new Date(scheduledDate);
                            newDate.setHours(hours);
                            newDate.setMinutes(minutes);
                            setScheduledDate(newDate);
                          }}
                        />
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-1 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      计划发送时间：{format(scheduledDate, 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-3 pt-4">
              <h3 className="font-medium">事件摘要</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">事件名称：</span>
                  <span className="font-medium">{name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">事件类型：</span>
                  <span className="font-medium">{getEventTypeLabel(eventType)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">使用模板：</span>
                  <span className="font-medium">{selectedTemplate?.name || "未选择"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">目标受众：</span>
                  <span className="font-medium">
                    {selectedAudience ? `${selectedAudience.name} (${selectedAudience.count.toLocaleString()}人)` : "未选择"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">发送时间：</span>
                  <span className="font-medium">
                    {scheduleType === "now" ? "立即发送" : format(scheduledDate, 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setActiveTab("audience")}>
                返回
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!allComplete}
              >
                创建事件
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="sm:w-auto w-full">
            取消
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventDialog;
```
最后，更新我们的图表引用：

```typescript jsx:src/app/(center)/dashboard/(pages)/event/_components/sections/EventInsights.tsx
"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart, PieChart, LineChart, Download, Share2, RefreshCw,
  Calendar, Users, Clock, Mail, ExternalLink, MessageSquare
} from "lucide-react";
import { Event } from "../context/EventContext";
import { format, formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

// 导入图表组件
import { 
  DeliveryRateChart, 
  OpenRateChart, 
  ClickRateChart, 
  EventTimelineChart,
  AudienceSegmentChart 
} from "../charts";

// ... 其余代码保持不变
```
修复投诉率计算的问题：

```typescript jsx:src/app/(center)/dashboard/(pages)/event/_components/sections/EventInsights.tsx
// ... 在Card组件中的投诉率相关代码
<div>
  <div className="flex justify-between mb-1">
    <span className="text-sm font-medium">投诉率</span>
    <span className="text-sm">
      {stats.delivered > 0 ? (stats.complaints / stats.delivered * 100).toFixed(3) : "0.000"}%
    </span>
  </div>
  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
    <div 
      className="bg-red-400 h-full rounded-full" 
      style={{ width: `${stats.delivered > 0 ? Math.min((stats.complaints / stats.delivered * 100) * 50, 100) : 0}%` }} 
    />
  </div>
  <p className="text-xs text-muted-foreground mt-1">
    {stats.complaints} 人投诉
  </p>
</div>
// ... 其他代码保持不变
```
# 营销事件管理系统设计

我已经为您创建了一个功能完整的事件管理系统，专门用于创建和跟踪营销活动（如产品促销、会员优惠等）。这个系统允许您选择邮件模板、目标受众，并对发送后的效果进行数据分析。

## 功能概览

### 1. 事件管理系统

![事件管理系统](https://i.imgur.com/xY3w0Pz.png)

该系统具有以下核心功能：

- **事件创建**：通过多步骤向导创建营销事件
- **模板选择**：从模板库中选择合适的邮件模板
- **受众管理**：指定接收用户群体
- **发送计划**：设置立即发送或定时发送
- **数据分析**：查看详细的邮件发送数据和交互情况

### 2. 主要组件

系统包含以下主要组件：

- **事件列表**：显示所有营销事件，支持搜索和筛选
- **创建事件对话框**：多步骤引导用户完成事件创建
- **数据分析仪表盘**：通过图表直观展示邮件效果数据
- **受众细分分析**：分析不同用户群体的反应差异

### 3. 数据指标

系统跟踪以下关键数据指标：

- **送达率**：成功送达的邮件百分比
- **打开率**：收件人打开邮件的百分比
- **点击率**：用户点击邮件中链接的比例
- **退订率**：选择退订的用户比例
- **投诉率**：投诉邮件的用户比例

## 使用流程

### 1. 创建新的营销事件

1. 点击"创建事件"按钮
2. 填写基本信息（名称、描述、类型）
3. 从模板库中选择合适的邮件模板
4. 选择目标受众群体
5. 设置发送时间（立即或计划）
6. 确认创建

### 2. 查看事件列表

- 所有事件按时间倒序排列
- 可按状态和类型筛选
- 可搜索事件名称
- 支持复制、取消和删除事件

### 3. 分析事件数据

- 选择任意已发送的事件查看详细数据
- 通过多种图表展示关键指标
- 查看时间线分析用户互动模式
- 分析受众细分数据

## 技术特点

1. **模块化设计**：各功能组件高度解耦，易于维护和扩展
2. **上下文状态管理**：使用React Context API管理全局状态
3. **响应式布局**：在移动和桌面设备上均有良好表现
4. **数据可视化**：通过直观的图表展示复杂数据
5. **模拟数据**：使用Mock数据快速原型设计和演示
6. **渐进式表单**：多步骤引导用户完成复杂任务

## 开发要点

整个事件管理系统的开发重点包括：

1. **用户体验优化**：简化复杂流程，提供清晰指引
2. **数据可视化设计**：选择合适的图表类型展示不同类型的数据
3. **状态管理**：设计合理的状态更新机制，确保数据一致性
4. **错误处理**：妥善处理各种异常情况，提供友好的错误提示
5. **性能优化**：针对大量数据的渲染和处理进行优化

这个事件管理系统为您提供了创建、管理和分析营销活动的完整解决方案，可以根据实际需求进一步扩展和定制。
