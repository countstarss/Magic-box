import Image from 'next/image';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface BannerProps {
  // You can define any props needed here
  bannerUrl: string;
  children?: React.ReactNode;
  className?: string;
}

const Banner = ({ bannerUrl, children, className }: BannerProps) => {


  return (
    <div className={twMerge(
      "w-screen my-10 mx-0 bg-white dark:bg-black/70 h-[720px] overflow-hidden",
      className
    )}>
      <Image src={bannerUrl} alt="banner" width={1000} height={1000} className='w-screen object-fill' />
      {children}
    </div>
  );
};

export default Banner;