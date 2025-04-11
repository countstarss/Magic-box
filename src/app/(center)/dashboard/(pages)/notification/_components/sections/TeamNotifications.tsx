"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, Loader2, UserPlus } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { NotificationCard } from "../ui/NotificationCard";
import EmptyNotifications from "../ui/EmptyNotifications";

interface TeamNotificationsProps {
  searchQuery: string;
  filter: string;
}

const TeamNotifications: React.FC<TeamNotificationsProps> = ({
  searchQuery,
  filter,
}) => {
  const { getFilteredNotifications } = useNotifications();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  
  // 获取筛选后的团队通知
  const filteredNotifications = getFilteredNotifications(searchQuery, filter, "team");
  
  // 分页展示的通知
  const paginatedNotifications = filteredNotifications.slice(0, page * itemsPerPage);
  
  // 模拟加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 点击加载更多
  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  // 没有通知时显示空状态
  if (filteredNotifications.length === 0) {
    return (
      <EmptyNotifications 
        type={searchQuery || filter !== "all" ? "filtered" : "empty"} 
        message="暂无团队通知"
      />
    );
  }
  
  return (
    <div className="space-y-4">
      {/* 团队通知列表 */}
      <div className="space-y-4">
        {paginatedNotifications.map(notification => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
      </div>
      
      {/* 加载更多按钮 */}
      {filteredNotifications.length > paginatedNotifications.length && (
        <div className="flex justify-center py-4">
          <Button 
            variant="ghost" 
            onClick={handleLoadMore}
            className="gap-2"
          >
            <ArrowDown className="h-4 w-4" />
            加载更多
          </Button>
        </div>
      )}
      
      {/* 结束提示 */}
      {filteredNotifications.length <= paginatedNotifications.length && 
        filteredNotifications.length > 0 && (
        <div className="text-center py-4 text-muted-foreground text-sm">
          已显示全部团队通知
        </div>
      )}
    </div>
  );
};

export default TeamNotifications; 