import React from 'react';
import ContextMenuWrapper from '@/components/ui/ContextMenuWrapper';
import NotificationLayout from './_components/NotificationLayout';

const NotificationPage = () => {
  return (
    <ContextMenuWrapper>
      <div className="p-8 pb-24">
        <NotificationLayout />
      </div>
    </ContextMenuWrapper>
  );
};

export default NotificationPage;