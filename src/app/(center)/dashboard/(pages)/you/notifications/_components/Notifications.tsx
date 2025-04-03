import { useEffect, useState } from 'react';
import { NotificationItem } from './NotificationItem';
import { NotificationItem as NotificationItemType } from '@/types/redis/notification';



interface NotificationsProps {
  // You can define any props needed here
  notifications: NotificationItemType[];
  handleMarkAsRead: (id: string) => void;
}

const Notifications = ({
  notifications,
  handleMarkAsRead,
}: NotificationsProps) => {

  return (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No notifications yet
        </p>
      ) : (
        notifications.map((notification,index) => (
          <NotificationItem
            key={index}
            notification={notification}
            onMarkAsRead={handleMarkAsRead}
          />
        ))
      )}
    </div>
  );
};

export default Notifications;