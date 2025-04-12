import { cn } from '@/lib/utils';
import React from 'react';

interface ContentProps {
  children?: React.ReactNode;
  title: string;
  className?: string;
}

const Content = ({
  children,
  className,
}: ContentProps) => {


  return (
    <div className="flex flex-col relative">
      <div className={cn("flex flex-col h-full", className)}>
        {children}
      </div>
    </div>
  );
};

export default Content;