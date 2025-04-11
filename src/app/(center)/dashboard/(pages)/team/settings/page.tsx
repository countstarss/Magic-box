import React from 'react';
import TeamLayout from '../_components/layout/TeamLayout';
import TeamSettings from '../_components/sections/TeamSettings';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '团队设置 | Mail Box',
  description: '管理您的团队设置和计划',
};

export default function TeamSettingsPage() {
  return (
    <TeamLayout>
      <TeamSettings />
    </TeamLayout>
  );
} 