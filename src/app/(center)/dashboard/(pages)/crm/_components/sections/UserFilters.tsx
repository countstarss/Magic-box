'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarIcon, SlidersHorizontal, Filter, X, Search } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from '@/components/ui/drawer';
import { Slider } from '@/components/ui/slider';
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from '@/lib/utils';
import { useCrmStore, UserTag, UserStatus } from '../../store/useCrmStore';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 用户标签中文名称
const tagOptions: { value: UserTag; label: string }[] = [
  { value: 'active', label: '活跃用户' },
  { value: 'premium', label: '付费会员' },
  { value: 'new', label: '新用户' },
  { value: 'inactive', label: '沉睡用户' },
  { value: 'highValue', label: '高价值用户' },
  { value: 'lead', label: '潜在用户' },
];

// 用户状态中文名称
const statusOptions: { value: UserStatus | 'all'; label: string }[] = [
  { value: 'all', label: '所有状态' },
  { value: 'active', label: '正常' },
  { value: 'inactive', label: '不活跃' },
  { value: 'pending', label: '待激活' },
  { value: 'blocked', label: '已封禁' },
];

interface UserFiltersProps {
  activeTab: string;
}

const UserFilters: React.FC<UserFiltersProps> = ({ activeTab }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [spentRange, setSpentRange] = useState<[number, number]>([0, 2000]);
  
  const {
    filter,
    setFilter,
    resetFilter,
  } = useCrmStore();
  
  // 处理标签切换
  const toggleTag = (tag: UserTag) => {
    const currentTags = [...filter.tags];
    const tagIndex = currentTags.indexOf(tag);
    
    if (tagIndex >= 0) {
      currentTags.splice(tagIndex, 1);
    } else {
      currentTags.push(tag);
    }
    
    setFilter({ tags: currentTags });
  };
  
  // 处理搜索
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ search: e.target.value });
  };
  
  // 处理状态变更
  const handleStatusChange = (value: string) => {
    setFilter({ status: value as UserStatus | 'all' });
  };
  
  // 处理金额范围变化
  const handleSpentRangeChange = (value: number[]) => {
    setSpentRange(value as [number, number]);
  };
  
  // 应用金额范围筛选
  const applySpentRange = () => {
    setFilter({
      spentRange: {
        min: spentRange[0],
        max: spentRange[1]
      }
    });
  };
  
  // 重置所有筛选
  const handleResetFilters = () => {
    resetFilter();
    setSpentRange([0, 2000]);
  };
  
  // 将日期对象转换为字符串
  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return format(date, 'yyyy-MM-dd', { locale: zhCN });
  };
  
  // 检查是否有活跃的筛选条件
  const hasActiveFilters = filter.search || 
    filter.tags.length > 0 || 
    filter.status !== 'all' || 
    filter.dateRange.from || 
    filter.dateRange.to ||
    filter.spentRange.min !== undefined ||
    filter.spentRange.max !== undefined;
  
  return (
    <div className="flex items-center gap-2">
      {/* 搜索框 */}
      <div className="relative w-64">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="搜索用户"
          className="pl-8"
          value={filter.search}
          onChange={handleSearch}
        />
        {filter.search && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1.5 h-6 w-6"
            onClick={() => setFilter({ search: '' })}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* 状态筛选下拉框 */}
      <Select
        value={filter.status}
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="状态筛选" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* 筛选按钮 */}
      <Drawer open={showFilters} onOpenChange={setShowFilters}>
        <DrawerTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className={cn(hasActiveFilters && "bg-primary/10")}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>高级筛选</DrawerTitle>
            <DrawerDescription>
              通过多种条件筛选客户列表
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">用户标签</h4>
              <div className="flex flex-wrap gap-2">
                {tagOptions.map(option => (
                  <Badge
                    key={option.value}
                    variant={filter.tags.includes(option.value) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(option.value)}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <h4 className="text-sm font-medium">注册日期</h4>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal w-full"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filter.dateRange.from ? (
                        formatDate(filter.dateRange.from)
                      ) : (
                        <span className="text-muted-foreground">开始日期</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filter.dateRange.from}
                      onSelect={(date) => setFilter({
                        dateRange: {
                          ...filter.dateRange,
                          from: date
                        }
                      })}
                    />
                  </PopoverContent>
                </Popover>
                <span className="self-center">至</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal w-full"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filter.dateRange.to ? (
                        formatDate(filter.dateRange.to)
                      ) : (
                        <span className="text-muted-foreground">结束日期</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filter.dateRange.to}
                      onSelect={(date) => setFilter({
                        dateRange: {
                          ...filter.dateRange,
                          to: date
                        }
                      })}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <h4 className="text-sm font-medium">消费金额范围</h4>
                <span className="text-sm">
                  ¥{spentRange[0]} - ¥{spentRange[1]}
                </span>
              </div>
              <Slider
                defaultValue={spentRange}
                min={0}
                max={2000}
                step={50}
                value={spentRange}
                onValueChange={handleSpentRangeChange}
                onValueCommit={applySpentRange}
                className="py-4"
              />
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={handleResetFilters} variant="outline">重置筛选</Button>
            <DrawerClose asChild>
              <Button>应用筛选</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      
      {/* 活跃筛选标识 */}
      {hasActiveFilters && (
        <Badge variant="outline" className="gap-1 bg-primary/10">
          <Filter className="h-3 w-3" />
          <span>已筛选</span>
        </Badge>
      )}
    </div>
  );
};

export default UserFilters; 