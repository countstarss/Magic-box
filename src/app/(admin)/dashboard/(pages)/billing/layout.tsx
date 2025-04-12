'use client';
import React from 'react';
import Content from '../../_components/content';
import ContextMenuWrapper from '@/components/ui/ContextMenuWrapper';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Content title="账单与订阅">
        <div className="container mx-auto h-screen dark:bg-transparent overflow-auto">
          {children}
        </div>
      </Content>
    </>
  );
} 