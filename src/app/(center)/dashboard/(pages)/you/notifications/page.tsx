"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { NotificationItem as NotificationItemType } from '@/types/redis/notification';
import { useSession } from 'next-auth/react';
// import { Spinner } from '@/components/ui/spinner';
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '@/actions/notification/notification';
import Notifications from './_components/Notifications';
import { Button } from '@/components/ui/button';
import { CheckSquare, RefreshCw } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Loading from '@/components/global/Loading';

// MARK: 本地缓存
// NOTE: 使用静态变量在路由切换时保持缓存
let notificationsCache: {
  data: NotificationItemType[] | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0,
};

// 缓存过期时间（5分钟）
const CACHE_EXPIRY = 20 * 60 * 1000;

const NotificationPage = () => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<NotificationItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);
  const pathname = usePathname();

  // NOTE: 10. 建立WebSocket连接
  useEffect(() => {
    if (!session?.user?.id) return;

    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/api/ws`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    // NOTE: 11. 监听WebSocket消息
    ws.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      
      // NOTE: 12. 更新本地状态和缓存
      setNotifications(prev => {
        const updated = [newNotification, ...prev];
        notificationsCache.data = updated;
        return updated;
      });

      // NOTE: 13. 触发系统通知
      // MARK: 触发系统通知
      new Audio('/notification.mp3').play().catch(() => {});
      toast.info(newNotification.message);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [session?.user?.id]);

  // MARK: 获取通知
  const fetchNotifications = useCallback(async (forceRefresh = false) => {
    try {
      const now = Date.now();
      
      // INFO: 1. 检查缓存是否可用
      if (!forceRefresh && 
          notificationsCache.data && 
          now - notificationsCache.timestamp < CACHE_EXPIRY) {
        setNotifications(notificationsCache.data);
        setIsLoading(false);
        return;
      }

      // INFO: 2. 从服务器获取新数据
      const data = await getNotifications();
      
      // INFO: 3. 更新缓存和状态
      notificationsCache = {
        data,
        timestamp: now,
      };
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // MARK: 初始加载
  useEffect(() => {
    if (session?.user) {
      fetchNotifications();
    }

    return () => {
      setIsLoading(true);
    };
  }, [session?.user, pathname, fetchNotifications]);

  // MARK: 标记已读
  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      
      // INFO: 更新本地状态和缓存
      const updatedNotifications = notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      );
      setNotifications(updatedNotifications);
      notificationsCache.data = updatedNotifications;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // MARK: 全部已读
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      
      // INFO: 更新本地状态和缓存
      const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
      setNotifications(updatedNotifications);
      notificationsCache.data = updatedNotifications;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // MARK: 手动刷新
  const handleRefresh = async () => {
    setIsLoading(true);
    await fetchNotifications(true); // 强制刷新
  };

  // MARK: Loading状态
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your latest notifications
          </p>
        </div>
        <div className="flex items-center justify-center h-[60vh]">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-semibold dark:text-gray-200">
            Notifications
          </h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="rounded-xl"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <span className="text-gray-800 dark:text-white text-sm">刷新</span>
              <RefreshCw className={cn(
                "h-4 w-4 ml-2",
                isLoading && "animate-spin"
              )} />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="rounded-xl"
              onClick={handleMarkAllAsRead}
            >
              <span className="text-gray-800 dark:text-white text-sm">全部已读</span>
              <CheckSquare className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">
          Stay updated with your latest notifications
        </p>
      </div>

      <Notifications
        notifications={notifications}
        handleMarkAsRead={handleMarkAsRead}
      />
    </div>
  );
};

export default NotificationPage;