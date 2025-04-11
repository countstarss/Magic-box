import React from 'react';
import Content from '../../_components/content';
import ContextMenuWrapper from '@/components/ui/ContextMenuWrapper';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <ContextMenuWrapper>
        <Content title="Settings">
          <div className="h-screen bg-gray-50 dark:bg-transparent overflow-hidden">
            {children}
          </div>
        </Content>
      </ContextMenuWrapper>
    </>
  );
}