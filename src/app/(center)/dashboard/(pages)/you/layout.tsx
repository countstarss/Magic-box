'use client';
// app/layout.tsx
import React from 'react';
import Content from '../../_components/content';
import SidebarItem from '@/components/global/SidebarItem';
import InnerSidebar from '../_components/inner-sidebar';
import ContextMenuWrapper from '@/components/ui/ContextMenuWrapper';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ContextMenuWrapper>
      {/* Content里的p-0是用来覆盖Content的children的p-6 */}
      <Content title="You" >
        <div className="flex h-[calc(100vh-5rem)] bg-gray-50 dark:bg-transparent">
          {/* Sidebar */}
          <InnerSidebar>
            <SidebarItem title="Overview" href="/dashboard/you" />
            <SidebarItem title="Readed" href="/dashboard/you/readed" />
            <SidebarItem title="Liked" href="/dashboard/you/liked" />
          </InnerSidebar>
          <main className="flex-1 p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </Content>
    </ContextMenuWrapper>
  );
}


