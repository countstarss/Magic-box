'use client'
import prisma from '@/lib/prisma';
import { EventType } from '@prisma/client';
import { usePathname } from 'next/navigation';
import React from 'react';

interface EventEditPageProps {
  // You can define any props needed here
  event: EventType
}
async function getData(eventId: string) {
  
  const event = await prisma.eventType.findUnique({
    where: {
      id: eventId
    }
  });
  return event;
}
const EventEditPage =async ({
  
}: EventEditPageProps) => {
  //获取pathName，然后根据其信息找到数据库里的event type
  const pathName = usePathname();
  const eventId = pathName?.split('/').pop();
  const event = await getData(eventId!);
  return (
    <div>
      <h1>EventEditPage</h1>
      <div>
        <h2>{event?.title}</h2>
        <p>this is the description of the event: {event?.title}</p>
      </div>
    </div>
  );
};

export default EventEditPage;