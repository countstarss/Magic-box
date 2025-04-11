import React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  Search, SlidersHorizontal, CalendarIcon, Check, 
  PlusCircle
} from 'lucide-react';
import { SortType, FilterOptions } from '../hooks/useTemplateFilters';
import { ViewMode, ViewModeToggle } from './ViewModeToggle';

interface SearchAndFilterBarProps {
  // 搜索相关
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // 分类相关
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  templateCategories: string[];
  onCreateCategory?: () => void; // 新增：创建类别回调
  
  // 排序相关
  sortBy: SortType;
  setSortBy: (sort: SortType) => void;
  
  // 高级筛选相关
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (show: boolean) => void;
  advancedFilters: FilterOptions;
  resetAdvancedFilters: () => void;
  selectDateRange: (days: number) => void;
  toggleCategory: (category: string) => void;
  setDateRange: (from?: Date, to?: Date) => void;
  toggleFeatureFilter: (feature: "showFeatured" | "showStarred") => void;
  
  // 视图相关
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export function SearchAndFilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  templateCategories,
  onCreateCategory,
  sortBy,
  setSortBy,
  showAdvancedFilters,
  setShowAdvancedFilters,
  advancedFilters,
  resetAdvancedFilters,
  selectDateRange,
  toggleCategory,
  setDateRange,
  toggleFeatureFilter,
  viewMode,
  setViewMode,
}: SearchAndFilterBarProps) {
  
  // 检查筛选器是否有active状态
  const hasActiveAdvancedFilters = 
    advancedFilters.categories.length > 0 || 
    advancedFilters.dateRange.from || 
    advancedFilters.dateRange.to ||
    advancedFilters.showFeatured ||
    advancedFilters.showStarred;
  
  return (
    <div className="flex gap-2 flex-wrap md:flex-nowrap">
      {/* 搜索框 */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="搜索模板..."
          className="pl-8 w-[200px] md:w-[260px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* 分类筛选与创建类别 */}
      <div className="flex items-center gap-1">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="全部类别" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>系统分类</SelectLabel>
              {templateCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {onCreateCategory && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9"
            onClick={onCreateCategory}
            title="创建新类别"
          >
            <PlusCircle size={16} />
          </Button>
        )}
      </div>
      
      {/* 排序方式 */}
      <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortType)}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="排序方式" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">最新优先</SelectItem>
          <SelectItem value="oldest">最早优先</SelectItem>
          <SelectItem value="name">按名称</SelectItem>
        </SelectContent>
      </Select>
      
      {/* 高级筛选 */}
      <Popover open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal size={16} />
            高级筛选
            {hasActiveAdvancedFilters && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                <Check size={12} />
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-4" align="end">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">更新日期</h4>
              <div className="flex gap-2 flex-wrap mb-2">
                <Button variant="outline" size="sm" onClick={() => selectDateRange(7)}>近7天</Button>
                <Button variant="outline" size="sm" onClick={() => selectDateRange(30)}>近30天</Button>
                <Button variant="outline" size="sm" onClick={() => selectDateRange(90)}>近90天</Button>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <Label>从</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {advancedFilters.dateRange.from ? (
                          format(advancedFilters.dateRange.from, 'yyyy-MM-dd')
                        ) : (
                          <span>选择日期</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={advancedFilters.dateRange.from}
                        onSelect={(date) => setDateRange(date, undefined)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-center gap-2">
                  <Label>至</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {advancedFilters.dateRange.to ? (
                          format(advancedFilters.dateRange.to, 'yyyy-MM-dd')
                        ) : (
                          <span>选择日期</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={advancedFilters.dateRange.to}
                        onSelect={(date) => setDateRange(undefined, date)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">多选分类</h4>
              <div className="grid grid-cols-2 gap-2">
                {templateCategories.filter(c => c !== '全部').map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <div
                      className={cn(
                        "h-4 w-4 rounded border flex items-center justify-center cursor-pointer",
                        advancedFilters.categories.includes(category) 
                          ? "bg-primary border-primary" 
                          : "border-input"
                      )}
                      onClick={() => toggleCategory(category)}
                    >
                      {advancedFilters.categories.includes(category) && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <label 
                      className="text-sm leading-none cursor-pointer"
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">特殊状态</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div
                    className={cn(
                      "h-4 w-4 rounded border flex items-center justify-center cursor-pointer",
                      advancedFilters.showFeatured ? "bg-primary border-primary" : "border-input"
                    )}
                    onClick={() => toggleFeatureFilter('showFeatured')}
                  >
                    {advancedFilters.showFeatured && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <label 
                    className="text-sm leading-none cursor-pointer"
                    onClick={() => toggleFeatureFilter('showFeatured')}
                  >
                    精选模板
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={cn(
                      "h-4 w-4 rounded border flex items-center justify-center cursor-pointer",
                      advancedFilters.showStarred ? "bg-primary border-primary" : "border-input"
                    )}
                    onClick={() => toggleFeatureFilter('showStarred')}
                  >
                    {advancedFilters.showStarred && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <label 
                    className="text-sm leading-none cursor-pointer"
                    onClick={() => toggleFeatureFilter('showStarred')}
                  >
                    已收藏
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between pt-2">
              <Button variant="outline" size="sm" onClick={resetAdvancedFilters}>
                重置
              </Button>
              <Button size="sm" onClick={() => setShowAdvancedFilters(false)}>
                应用筛选
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* 使用视图模式切换组件 */}
      <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
    </div>
  );
} 