"use client";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface PageProps {
  // You can define any props needed here
  params: {
    documentsId: string;
  };
}

const Page = ({params}: PageProps) => {

  // 设置更宽的布局
  const [isWidth, setIsWidth] = useState(false);
  

  return (
    <div className="w-full h-full px-16 py-6 justify-center mx-auto">
      <div className={twMerge("h-full w-11/12 2xl:w-1/2 flex flex-col items-center justify-center mx-auto bg-neutral-600",
          "transition-all duration-300 ease-in-out",
         isWidth ? "2xl:w-11/12" : "2xl:w-1/2")}
      >
        <Button onClick={() => setIsWidth(!isWidth)}>
          {isWidth ? "更窄" : "更宽"}
        </Button>
        {params.documentsId}
      </div>
    </div>
  );
};

export default Page;
