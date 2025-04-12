import React from 'react';
import ContextMenuWrapper from '@/components/ui/ContextMenuWrapper';
import BillingLayout from './_components/BillingLayout';

const Billing = () => {
  return (
    <ContextMenuWrapper>
      <div className="p-8 pb-24">
        <BillingLayout />
      </div>
    </ContextMenuWrapper>
  );
};

export default Billing;