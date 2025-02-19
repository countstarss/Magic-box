import React from 'react';


interface ContainerProps {
  // You can define any props needed here
  children: React.ReactNode;
  title?: string;
}

const Container = ({
  children,
  title
}: ContainerProps) => {


  return (
    <div className="my-10 md:mx-20 mx-0 rounded-sm bg-white dark:bg-gray-800 p-6">
      {title && <h1 className='text-2xl font-bold tracking-tighter mb-4'>{title}</h1>}
      {children}
    </div>
  );
};

export default Container;