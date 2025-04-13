import React, { useState } from 'react';
import { TabType } from '../hooks/useTemplateFilters';
import { 
  CustomTabs, 
  CustomTabsList, 
  CustomTabsTrigger,
  CustomTabsIndicator
} from "@/components/ui/custom-tabs";

interface TabsFilterProps {
  activeTab: TabType;
  setActiveTab: (value: TabType) => void;
}

export function TabsFilter({ activeTab, setActiveTab }: TabsFilterProps) {
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  const handleTabChange = (value: TabType) => {
    // 根据当前和目标标签的位置关系确定滑动方向
    const tabOrder = ['all', 'featured', 'starred'];
    const currentIndex = tabOrder.indexOf(activeTab);
    const newIndex = tabOrder.indexOf(value);
    
    if (newIndex > currentIndex) {
      setSlideDirection('right');
    } else {
      setSlideDirection('left');
    }
    
    setActiveTab(value);
  };

  return (
    <CustomTabs 
      defaultValue="all" 
      className="w-full" 
      value={activeTab} 
      onValueChange={(value) => handleTabChange(value as TabType)}
    >
      <CustomTabsList className="relative w-auto max-w-md">
        <CustomTabsTrigger value="all">全部模板</CustomTabsTrigger>
        <CustomTabsTrigger value="featured">精选模板</CustomTabsTrigger>
        <CustomTabsTrigger value="starred">已收藏</CustomTabsTrigger>
        <CustomTabsIndicator />
      </CustomTabsList>
    </CustomTabs>
  );
} 