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