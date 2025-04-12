import React from 'react';
import TeamLayout from './_components/layout/TeamLayout';
import TeamOverview from './_components/sections/TeamOverview';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '团队管理 | Mail Box',
  description: '管理您的团队、成员和协作',
};

export default function TeamPage() {
  return (
    <TeamLayout>
      <TeamOverview />
    </TeamLayout>
  );
}