'use client';
import React from 'react';
import Content from '../../_components/content';
import Providers from './providers';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Providers>
      <Content title="通知中心">
        <div className="container mx-auto h-screen dark:bg-transparent overflow-auto">
          {children}
        </div>
      </Content>
    </Providers>
  );
} 