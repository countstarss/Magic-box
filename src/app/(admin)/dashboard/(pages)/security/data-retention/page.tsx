import React from 'react';
import SecurityLayout from '../_components/layout/SecurityLayout';
import DataRetentionSection from '../_components/sections/DataRetentionSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '数据保留策略 | 安全与合规',
  description: '管理您的数据保留和自动删除策略',
};

export default function DataRetentionPage() {
  return (
    <SecurityLayout>
      <DataRetentionSection />
    </SecurityLayout>
  );
} 