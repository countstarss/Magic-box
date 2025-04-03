import { cn } from "@/lib/utils";
import { NotificationItem as NotificationItemType } from "@/types/redis/notification";
import { format } from "date-fns";
import { Bell, CheckCheck, Info, AlertTriangle, AlertCircle } from "lucide-react";
import Link from "next/link";

interface NotificationItemProps {
  notification: NotificationItemType;
  onMarkAsRead?: (id: string) => void;
}

const iconMap = {
  info: Info,
  success: CheckCheck,
  warning: AlertTriangle,
  error: AlertCircle,
};

const backgroundMap = {
  info: "bg-blue-50 dark:bg-blue-900/20",
  success: "bg-green-50 dark:bg-green-900/20",
  warning: "bg-yellow-50 dark:bg-yellow-900/20",
  error: "bg-red-50 dark:bg-red-900/20",
};

const textColorMap = {
  info: "text-blue-700 dark:text-blue-300",
  success: "text-green-700 dark:text-green-300",
  warning: "text-yellow-700 dark:text-yellow-300",
  error: "text-red-700 dark:text-red-300",
};

export const NotificationItem = ({
  notification,
  onMarkAsRead,
}: NotificationItemProps) => {
  const Icon = iconMap[notification.type] || Bell;

  const content = (
    <div
      className={cn(
        "flex items-start gap-4 p-4 rounded-lg transition-colors border border-muted-foreground/20 mt-4",
        notification.isRead ? "opacity-60" : backgroundMap[notification.type],
        "hover:opacity-100 hover:shadow-md transition-all duration-300"
      )}
    >
      <Icon className={cn("w-5 h-5 mt-1", textColorMap[notification.type])} />
      <div className="flex-1 space-y-1">
        <p className="font-medium">{notification.title}</p>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(notification.createdAt), "MMM d, yyyy 'at' h:mm a")}
        </p>
      </div>
      {!notification.isRead && onMarkAsRead && (
        <button
          onClick={() => onMarkAsRead(notification.id)}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Mark as read
        </button>
      )}
    </div>
  );

  return notification.link ? (
    <Link href={notification.link}>{content}</Link>
  ) : (
    content
  );
}; 