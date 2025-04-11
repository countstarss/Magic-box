import React from 'react';
import ContextMenuWrapper from '@/components/ui/ContextMenuWrapper';
import EventLayout from './_components/EventLayout';

const EventPage = () => {
  return (
    <ContextMenuWrapper>
      <div className="p-8 pb-24">
        <EventLayout />
      </div>
    </ContextMenuWrapper>
  );
};

export default EventPage;