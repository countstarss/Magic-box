import React from 'react';
import SecurityLayout from './_components/layout/SecurityLayout';
import SecurityOverview from './_components/sections/SecurityOverview';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '安全与合规 | Mail Box',
  description: '管理您的安全设置、合规策略和数据保护',
};

export default function SecurityPage() {
  return (
    <SecurityLayout>
      <SecurityOverview />
    </SecurityLayout>
  );
}