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