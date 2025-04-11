"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, Users, Calendar, Settings, Filter, CheckCheck, Search 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";

// 导入通知组件
import { AllNotifications, TeamNotifications, EventNotifications, NotificationSettings } from "./sections/index";

const NotificationLayout = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  // 标记所有通知为已读
  const markAllAsRead = () => {
    console.log("标记所有通知为已读");
    // 这里将实现标记所有通知为已读的逻辑
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold">通知中心</h1>
        <p className="text-muted-foreground">查看所有系统、团队和事件通知</p>
      </div>
      
      {/* 搜索和筛选区域 */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索通知..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <Select 
            value={filter} 
            onValueChange={setFilter}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="筛选通知" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有通知</SelectItem>
              <SelectItem value="unread">未读通知</SelectItem>
              <SelectItem value="recent">最近7天</SelectItem>
              <SelectItem value="important">重要通知</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={markAllAsRead}
            className="gap-2"
          >
            <CheckCheck className="h-4 w-4" />
            全部标为已读
          </Button>
        </div>
      </div>
      
      {/* 选项卡区域 */}
      <Tabs 
        defaultValue="all" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 w-full max-w-2xl mb-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">所有通知</span>
            <span className="sm:hidden">全部</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">团队通知</span>
            <span className="sm:hidden">团队</span>
          </TabsTrigger>
          <TabsTrigger value="event" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">事件通知</span>
            <span className="sm:hidden">事件</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">通知设置</span>
            <span className="sm:hidden">设置</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <AllNotifications searchQuery={searchQuery} filter={filter} />
        </TabsContent>
        
        <TabsContent value="team" className="mt-0">
          <TeamNotifications searchQuery={searchQuery} filter={filter} />
        </TabsContent>
        
        <TabsContent value="event" className="mt-0">
          <EventNotifications searchQuery={searchQuery} filter={filter} />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-0">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationLayout; 