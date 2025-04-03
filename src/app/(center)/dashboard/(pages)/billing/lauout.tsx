'use client';
// app/layout.tsx
import React from 'react';
import Content from '../../_components/content';
import SidebarItem from '@/components/global/SidebarItem';
import ContextMenuWrapper from '@/components/ui/ContextMenuWrapper';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      {/* Content里的p-0是用来覆盖Content的children的p-6 */}
      <Content title="You" >
        <div className="flex h-[calc(100vh-60px)] bg-gray-50 dark:bg-transparent">
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </Content>
    </>
  );
}


