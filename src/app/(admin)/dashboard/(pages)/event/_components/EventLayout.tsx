"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, Clock, FileText, ListFilter, Plus, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";

// 导入事件组件
import EventsList from "./sections/EventsList";
import EventInsights from "./sections/EventInsights";
import { useEvents } from "./context/EventContext";
import CreateEventDialog from "./dialogs/CreateEventDialog";

const EventLayout = () => {
  const { events, selectedEvent, setSelectedEvent, isCreatingEvent, setIsCreatingEvent } = useEvents();
  
  const [activeTab, setActiveTab] = useState<string>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // 当选择事件时，自动切换到insights标签页
  useEffect(() => {
    if (selectedEvent) {
      setActiveTab("insights");
    }
  }, [selectedEvent]);

  // 处理返回事件列表
  const handleBackToList = () => {
    setSelectedEvent(null);
    setActiveTab("list");
  };

  // 处理创建新事件
  const handleCreateEvent = () => {
    setIsCreatingEvent(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">事件管理</h1>
          <Button onClick={handleCreateEvent} className="gap-2">
            <Plus className="h-4 w-4" />
            创建事件
          </Button>
        </div>
        <p className="text-muted-foreground">
          创建和管理您的营销事件，包括促销活动、会员优惠等
        </p>
      </div>
      
      {/* 搜索和筛选区域，仅在列表页显示 */}
      {!selectedEvent && activeTab === "list" && (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-auto flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索事件名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="状态筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有状态</SelectItem>
                <SelectItem value="draft">草稿</SelectItem>
                <SelectItem value="scheduled">已计划</SelectItem>
                <SelectItem value="sending">发送中</SelectItem>
                <SelectItem value="sent">已发送</SelectItem>
                <SelectItem value="canceled">已取消</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={typeFilter} 
              onValueChange={setTypeFilter}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="类型筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有类型</SelectItem>
                <SelectItem value="promotion">促销活动</SelectItem>
                <SelectItem value="newsletter">新闻通讯</SelectItem>
                <SelectItem value="announcement">公告</SelectItem>
                <SelectItem value="welcome">欢迎邮件</SelectItem>
                <SelectItem value="reminder">提醒邮件</SelectItem>
                <SelectItem value="other">其他</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      {/* 如果选择了事件，则显示返回按钮 */}
      {selectedEvent && (
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBackToList}
            className="gap-2"
          >
            <Calendar className="h-4 w-4" />
            返回事件列表
          </Button>
          <h2 className="ml-4 text-lg font-semibold">
            {selectedEvent.name}
          </h2>
        </div>
      )}
      
      {/* 事件内容区域 */}
      <Tabs 
        defaultValue="list" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        {!selectedEvent && (
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              事件列表
            </TabsTrigger>
            <TabsTrigger value="insights" disabled={!selectedEvent} className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              数据分析
            </TabsTrigger>
          </TabsList>
        )}
        
        <TabsContent value="list" className="mt-0">
          <EventsList 
            searchQuery={searchQuery} 
            statusFilter={statusFilter} 
            typeFilter={typeFilter} 
          />
        </TabsContent>
        
        <TabsContent value="insights" className="mt-0">
          {selectedEvent ? (
            <EventInsights event={selectedEvent} />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              请选择一个事件查看数据分析
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* 创建事件对话框 */}
      <CreateEventDialog 
        isOpen={isCreatingEvent} 
        onClose={() => setIsCreatingEvent(false)} 
      />
    </div>
  );
};

export default EventLayout; 