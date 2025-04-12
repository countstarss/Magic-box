import React from 'react';
import SecurityLayout from '../_components/layout/SecurityLayout';
import AccessControlSection from '../_components/sections/AccessControlSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '访问控制 | 安全与合规',
  description: '管理用户访问权限和安全认证方式',
};

export default function AccessControlPage() {
  return (
    <SecurityLayout>
      <AccessControlSection />
    </SecurityLayout>
  );
} 