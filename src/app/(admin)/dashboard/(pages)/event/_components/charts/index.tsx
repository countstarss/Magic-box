import React from "react";

// MARK: 交付率图表
export const DeliveryRateChart: React.FC<{ stats: any }> = ({ stats }) => {
  return (
    <div className="py-4">
      <div className="flex justify-between text-sm mb-1">
        <span>送达</span>
        <span className="text-green-500">{stats.delivered.toLocaleString()}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="bg-green-500 h-full rounded-full" 
          style={{ width: `${(stats.delivered / stats.sent * 100)}%` }} 
        />
      </div>
      
      <div className="flex justify-between text-sm mb-1 mt-3">
        <span>未送达</span>
        <span className="text-red-500">{stats.bounced.toLocaleString()}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="bg-red-500 h-full rounded-full" 
          style={{ width: `${(stats.bounced / stats.sent * 100)}%` }} 
        />
      </div>
    </div>
  );
};

// MARK: 打开率图表
export const OpenRateChart: React.FC<{ stats: any }> = ({ stats }) => {
  return (
    <div className="py-4">
      <div className="flex justify-between text-sm mb-1">
        <span>已打开</span>
        <span className="text-blue-500">{stats.opened.toLocaleString()}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="bg-blue-500 h-full rounded-full" 
          style={{ width: `${(stats.opened / stats.delivered * 100)}%` }} 
        />
      </div>
      
      <div className="flex justify-between text-sm mb-1 mt-3">
        <span>未打开</span>
        <span>{(stats.delivered - stats.opened).toLocaleString()}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="bg-gray-300 h-full rounded-full" 
          style={{ width: `${((stats.delivered - stats.opened) / stats.delivered * 100)}%` }} 
        />
      </div>
    </div>
  );
};

// MARK: 点击率图表
export const ClickRateChart: React.FC<{ stats: any }> = ({ stats }) => {
  return (
    <div className="py-4">
      <div className="flex justify-between text-sm mb-1">
        <span>已点击</span>
        <span className="text-green-500">{stats.clicked.toLocaleString()}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="bg-green-500 h-full rounded-full" 
          style={{ width: `${(stats.clicked / stats.opened * 100)}%` }} 
        />
      </div>
      
      <div className="flex justify-between text-sm mb-1 mt-3">
        <span>未点击</span>
        <span>{(stats.opened - stats.clicked).toLocaleString()}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="bg-gray-300 h-full rounded-full" 
          style={{ width: `${((stats.opened - stats.clicked) / stats.opened * 100)}%` }} 
        />
      </div>
    </div>
  );
};

// MARK: 时间线图表
// 简化版，实际中可使用图表库）
export const EventTimelineChart: React.FC = () => {
  // 模拟数据
  const hours = Array.from({ length: 24 }, (_, i) => i);
  // 生成随机数据
  const openData = hours.map(() => Math.floor(Math.random() * 500) + 100);
  const clickData = hours.map((_) => Math.floor(Math.random() * 300) + 50);
  
  // 找出最大值用于计算高度比例
  const maxValue = Math.max(...openData, ...clickData);
  
  return (
    <div className="pt-4">
      <div className="flex justify-between mb-2 text-sm">
        <div className="flex items-center">
          <span className="h-3 w-3 bg-blue-500 rounded-full inline-block mr-2"></span>
          <span>打开</span>
        </div>
        <div className="flex items-center">
          <span className="h-3 w-3 bg-green-500 rounded-full inline-block mr-2"></span>
          <span>点击</span>
        </div>
      </div>
      
      <div className="flex h-40 items-end space-x-1 pt-4 border-b">
        {hours.map((hour, index) => (
          <div key={hour} className="flex-1 flex flex-col items-center">
            <div className="w-full flex flex-col-reverse">
              <div 
                className="bg-green-500 w-full" 
                style={{ 
                  height: `${(clickData[index] / maxValue) * 100}%`,
                  maxHeight: "100%"
                }}
              ></div>
              <div 
                className="bg-blue-500 w-full" 
                style={{ 
                  height: `${(openData[index] / maxValue) * 100}%`,
                  maxHeight: "100%"
                }}
              ></div>
            </div>
            {hour % 3 === 0 && (
              <span className="text-xs mt-1">{hour}:00</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// MARK: 受众细分图表
export const AudienceSegmentChart: React.FC = () => {
  // 模拟的受众细分数据
  const segments = [
    { name: "活跃用户", percent: 42 },
    { name: "偶尔打开", percent: 28 },
    { name: "一次性打开", percent: 18 },
    { name: "从未打开", percent: 12 },
  ];
  
  // 分配各部分的颜色
  const colors = ["bg-green-500", "bg-blue-500", "bg-amber-500", "bg-gray-300"];
  
  return (
    <div className="pt-4">
      {/* 横向条形图 */}
      <div className="h-8 flex rounded-full overflow-hidden mb-4">
        {segments.map((segment, index) => (
          <div 
            key={index}
            className={`${colors[index]} h-full`}
            style={{ width: `${segment.percent}%` }}
          />
        ))}
      </div>
      
      {/* 图例 */}
      <div className="grid grid-cols-2 gap-2">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center">
            <span className={`h-3 w-3 ${colors[index]} rounded-full inline-block mr-2`}></span>
            <span className="text-sm flex-1">{segment.name}</span>
            <span className="text-sm font-medium">{segment.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}; 