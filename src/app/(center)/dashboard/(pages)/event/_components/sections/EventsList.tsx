"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Copy, Trash, ExternalLink, AlertCircle, AlarmClock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { EventStatus, EventType, useEvents } from "../context/EventContext";
import { EmptyEvents } from "../ui/EmptyEvents";

interface EventsListProps {
  searchQuery: string;
  statusFilter: string;
  typeFilter: string;
}

const EventsList: React.FC<EventsListProps> = ({
  searchQuery,
  statusFilter,
  typeFilter,
}) => {
  const { events, setSelectedEvent, duplicateEvent, deleteEvent, cancelEvent } = useEvents();
  
  // 处理选择事件
  const handleSelectEvent = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
    }
  };
  
  // 处理删除事件
  const handleDeleteEvent = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("确定要删除此事件吗？此操作不可撤销。")) {
      deleteEvent(eventId);
    }
  };
  
  // 处理复制事件
  const handleDuplicateEvent = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateEvent(eventId);
  };
  
  // 处理取消事件
  const handleCancelEvent = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("确定要取消此事件吗？")) {
      cancelEvent(eventId);
    }
  };
  
  // 获取状态标签
  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">草稿</Badge>;
      case "scheduled":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">已计划</Badge>;
      case "sending":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">发送中</Badge>;
      case "sent":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">已发送</Badge>;
      case "canceled":
        return <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">已取消</Badge>;
      default:
        return <Badge variant="outline">未知</Badge>;
    }
  };
  
  // 获取事件类型
  const getEventTypeLabel = (type: EventType) => {
    switch (type) {
      case "promotion":
        return "促销活动";
      case "newsletter":
        return "新闻通讯";
      case "announcement":
        return "公告";
      case "welcome":
        return "欢迎邮件";
      case "reminder":
        return "提醒邮件";
      default:
        return "其他";
    }
  };
  
  // 筛选事件
  const filteredEvents = events.filter(event => {
    // 搜索查询筛选
    if (searchQuery && !event.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // 状态筛选
    if (statusFilter !== "all" && event.status !== statusFilter) {
      return false;
    }
    
    // 类型筛选
    if (typeFilter !== "all" && event.type !== typeFilter) {
      return false;
    }
    
    return true;
  }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // 按创建时间降序排序
  
  // 如果没有事件，显示空状态
  if (filteredEvents.length === 0) {
    return (
      <EmptyEvents
        message={events.length === 0 ? "暂无事件" : "没有符合条件的事件"}
        type={events.length === 0 ? "empty" : "filtered"}
      />
    );
  }
  
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>事件名称</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>目标受众</TableHead>
              <TableHead>计划时间</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map(event => (
              <TableRow 
                key={event.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSelectEvent(event.id)}
              >
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{event.name}</span>
                    {event.description && (
                      <span className="text-xs text-muted-foreground line-clamp-1">{event.description}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getEventTypeLabel(event.type)}</TableCell>
                <TableCell>
                  <span className="flex flex-col">
                    <span>{event.audience.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {event.audience.count.toLocaleString()}人
                    </span>
                  </span>
                </TableCell>
                <TableCell>
                  {format(event.scheduledDate, 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                </TableCell>
                <TableCell>
                  {getStatusBadge(event.status)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">打开菜单</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>事件操作</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {event.status !== "sent" && event.status !== "canceled" && (
                        <DropdownMenuItem onClick={e => handleCancelEvent(event.id, e)}>
                          <AlertCircle className="mr-2 h-4 w-4 text-amber-500" />
                          <span>取消事件</span>
                        </DropdownMenuItem>
                      )}
                      {event.status === "scheduled" && (
                        <DropdownMenuItem onClick={e => e.stopPropagation()}>
                          <AlarmClock className="mr-2 h-4 w-4 text-blue-500" />
                          <span>修改计划</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={e => handleDuplicateEvent(event.id, e)}>
                        <Copy className="mr-2 h-4 w-4" />
                        <span>复制事件</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={e => handleDeleteEvent(event.id, e)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>删除事件</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default EventsList; 