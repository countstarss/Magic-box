import React from 'react';
import Content from '../../_components/content';
import EventProvider from './providers';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <EventProvider>
      <Content title="事件管理">
        <div className="h-screen bg-gray-50 dark:bg-transparent overflow-auto">
          {children}
        </div>
      </Content>
    </EventProvider>
  );
} 