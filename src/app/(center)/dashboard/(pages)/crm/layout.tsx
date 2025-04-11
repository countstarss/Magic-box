import React from 'react';
import Content from '../../_components/content';
import CrmProvider from './providers';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <CrmProvider>
      <Content title="客户管理">
        <div className="h-screen bg-gray-50 dark:bg-transparent overflow-auto">
          {children}
        </div>
      </Content>
    </CrmProvider>
  );
} 