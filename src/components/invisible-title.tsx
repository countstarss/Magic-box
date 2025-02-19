"use client"
import { usePathname } from 'next/navigation';
import React from 'react';

interface InvisibleTitleProps {
  // You can define any props needed here
}

const InvisibleTitle = ({

}: InvisibleTitleProps) => {
  const pathName = usePathname()

  return (
    <h1 className="text-xl font-bold">{pathName.slice(1)}</h1>
  );
};

export default InvisibleTitle;