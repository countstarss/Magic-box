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