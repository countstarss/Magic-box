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
            <SidebarItem title="CRM" href="/dashboard/crm" />
            <SidebarItem title="Contacts" href="/dashboard/crm/contacts" />
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