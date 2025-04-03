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

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      {/* Content里的p-0是用来覆盖Content的children的p-6 */}
      <Content title="Content" >
        <ContextMenuWrapper>
        <div className="flex max-h-screen h-[90vh] bg-transparent ">
          {/* Sidebar */}
          <InnerSidebar>
            <SidebarItem title="Mail" href="/dashboard/mail" />
            <SidebarItem title="Unread" href="/dashboard/mail/unread" />
            <SidebarItem title="Sent" href="/dashboard/mail/sent" />
            <SidebarItem title="Trash" href="/dashboard/mail/trash" />
            <SidebarItem title="Draft" href="/dashboard/mail/draft" />
          </InnerSidebar>

          {/* Main Content */}
          <main className="flex-1 p-2 md:p-8">
            <ContextMenuWrapper>
              {children}
            </ContextMenuWrapper>
          </main>
        </div>
        </ContextMenuWrapper>
      </Content>
    </>
  );
}

export default Layout;