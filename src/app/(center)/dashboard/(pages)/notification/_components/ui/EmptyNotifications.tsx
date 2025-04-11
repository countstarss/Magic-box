import React from "react";
import { Bell, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyNotificationsProps {
  message?: string;
  resetFilters?: () => void;
  type?: "empty" | "filtered";
}

const EmptyNotifications: React.FC<EmptyNotificationsProps> = ({
  message = "暂无通知",
  resetFilters,
  type = "empty"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-gray-100 dark:bg-gray-800 h-20 w-20 rounded-full flex items-center justify-center mb-4">
        <Bell className="h-10 w-10 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-medium mb-2">
        {type === "filtered" ? "未找到匹配的通知" : message}
      </h3>
      
      <p className="text-muted-foreground max-w-md mb-6">
        {type === "filtered" 
          ? "尝试调整筛选条件或搜索关键词，以查看更多通知" 
          : "当您收到系统、团队或事件的通知时，它们将显示在这里"
        }
      </p>
      
      {type === "filtered" && resetFilters && (
        <Button 
          variant="outline" 
          onClick={resetFilters}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          重置筛选条件
        </Button>
      )}
    </div>
  );
};

export default EmptyNotifications; 