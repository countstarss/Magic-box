import React from 'react';
import ContextMenuWrapper from '@/components/ui/ContextMenuWrapper';
import CrmLayout from './_components/CrmLayout';

const CrmPage = () => {
  return (
    <ContextMenuWrapper>
      <div className="p-8 pb-24">
        <CrmLayout />
      </div>
    </ContextMenuWrapper>
  );
};

export default CrmPage;