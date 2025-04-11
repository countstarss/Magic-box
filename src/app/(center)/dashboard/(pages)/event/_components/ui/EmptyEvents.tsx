import React from "react";
import { Calendar, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEvents } from "../context/EventContext";

interface EmptyEventsProps {
  message?: string;
  type?: "empty" | "filtered";
}

export const EmptyEvents: React.FC<EmptyEventsProps> = ({
  message = "暂无事件",
  type = "empty"
}) => {
  const { setIsCreatingEvent } = useEvents();
  
  // 创建新事件
  const handleCreateEvent = () => {
    setIsCreatingEvent(true);
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-gray-100 dark:bg-gray-800 h-20 w-20 rounded-full flex items-center justify-center mb-4">
        <Calendar className="h-10 w-10 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-medium mb-2">
        {type === "filtered" ? "未找到匹配的事件" : message}
      </h3>
      
      <p className="text-muted-foreground max-w-md mb-6">
        {type === "filtered" 
          ? "尝试调整筛选条件或搜索关键词，以查看更多事件" 
          : "创建您的第一个营销事件，管理您的邮件活动和促销"
        }
      </p>
      
      {type === "filtered" ? (
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          重置筛选条件
        </Button>
      ) : (
        <Button 
          onClick={handleCreateEvent}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          创建事件
        </Button>
      )}
    </div>
  );
}; 