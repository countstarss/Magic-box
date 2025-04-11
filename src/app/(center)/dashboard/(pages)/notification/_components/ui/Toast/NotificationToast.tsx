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