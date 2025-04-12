'use client';

import React, { ReactNode } from 'react';
import { NotificationProvider } from './_components/context/NotificationContext';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <NotificationProvider>
      {children}
    </NotificationProvider>
  );
}
