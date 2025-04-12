import { useState, useCallback } from "react";
import {
  useNotifications,
  Notification,
  NotificationType,
  NotificationPriority,
} from "../context/NotificationContext";
import { useToast } from "@/hooks/use-toast";

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
    (
      title: string,
      message: string,
      options?: Omit<Parameters<typeof sendNotification>[2], "type">
    ) => {
      return sendNotification(title, message, { ...options, type: "system" });
    },
    [sendNotification]
  );

  const sendTeamNotification = useCallback(
    (
      title: string,
      message: string,
      options?: Omit<Parameters<typeof sendNotification>[2], "type">
    ) => {
      return sendNotification(title, message, { ...options, type: "team" });
    },
    [sendNotification]
  );

  const sendEventNotification = useCallback(
    (
      title: string,
      message: string,
      options?: Omit<Parameters<typeof sendNotification>[2], "type">
    ) => {
      return sendNotification(title, message, { ...options, type: "event" });
    },
    [sendNotification]
  );

  const sendMessageNotification = useCallback(
    (
      title: string,
      message: string,
      options?: Omit<Parameters<typeof sendNotification>[2], "type">
    ) => {
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
