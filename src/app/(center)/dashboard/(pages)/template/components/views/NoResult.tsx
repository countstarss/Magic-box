import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import React from 'react';

interface NoResultProps {
  onResetFilters: () => void;
}

const NoResult = ({ onResetFilters }: NoResultProps) => {
  

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Search className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="font-medium text-lg mb-1">未找到模板</h3>
      <p className="text-muted-foreground mb-4">
        没有符合当前筛选条件的模板。
      </p>
      <Button variant="outline" onClick={onResetFilters}>
        重置所有筛选条件
      </Button>
    </div>
  );
};

export default NoResult;