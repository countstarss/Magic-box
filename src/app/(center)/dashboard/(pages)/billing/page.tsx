import React from 'react';
import BillData from './_components/BillData';
import ContextMenuWrapper from '@/components/ui/ContextMenuWrapper';


const Billing = () => {

  return (
    <ContextMenuWrapper>
      <h1 className="text-4xl sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg flex items-center border-b">
        <span>Billing</span>
      </h1>
      <div className='p-4'>
        <BillData />
      </div>
    </ContextMenuWrapper>
  );
};

export default Billing;