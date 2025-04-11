'use client';

import React, { ReactNode } from 'react';
import { EventProvider } from './_components/context/EventContext';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <EventProvider>
      {children}
    </EventProvider>
  );
} 