import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ColBoxProps {
  // You can define any props needed here
  children?:React.ReactNode;
  className?:string;
}

const FlexBox: React.FC<ColBoxProps> = ({
  children,className
}) => {
  return (
    <div className={twMerge(`flex flex-col,${className}`)}>
      {children}
    </div>
  );
};

export default FlexBox;