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