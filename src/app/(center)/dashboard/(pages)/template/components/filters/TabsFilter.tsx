import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabType } from '../hooks/useTemplateFilters';

interface TabsFilterProps {
  activeTab: TabType;
  setActiveTab: (value: TabType) => void;
}

export function TabsFilter({ activeTab, setActiveTab }: TabsFilterProps) {
  return (
    <Tabs 
      defaultValue="all" 
      className="w-full" 
      value={activeTab} 
      onValueChange={(value) => setActiveTab(value as TabType)}
    >
      <TabsList>
        <TabsTrigger value="all">全部模板</TabsTrigger>
        <TabsTrigger value="featured">精选模板</TabsTrigger>
        <TabsTrigger value="starred">已收藏</TabsTrigger>
      </TabsList>
    </Tabs>
  );
} 