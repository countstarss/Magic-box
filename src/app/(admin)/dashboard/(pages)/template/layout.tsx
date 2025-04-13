"use client";

import React from 'react';
import { TemplateProvider } from '@/contexts/TemplateContext';

type Props = { 
  children: React.ReactNode 
};

const Layout = ({ children }: Props) => {
  // 在实际应用中，userId 应该从认证系统获取，这里使用 "current-user-id" 作为示例
  // 注意：这个值和TemplateEditor组件中使用的一致
  const userId = "current-user-id";

  return (
    <TemplateProvider userId={userId}>
      {children}
    </TemplateProvider>
  );
};

export default Layout; 