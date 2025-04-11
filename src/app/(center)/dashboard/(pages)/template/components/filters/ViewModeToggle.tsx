import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, LayoutList, Kanban } from 'lucide-react';

// 视图类型定义
export type ViewMode = 'card' | 'list' | 'board';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export function ViewModeToggle({ viewMode, setViewMode }: ViewModeToggleProps) {
  return (
    <div className="rounded-md flex ring-1 ring-gray-200">
      <Button 
        variant={viewMode === 'card' ? "default" : "ghost"} 
        size="icon" 
        className="h-9 rounded-none rounded-l-md"
        onClick={() => setViewMode('card')}
      >
        <LayoutGrid size={16} />
      </Button>
      <Button 
        variant={viewMode === 'list' ? "default" : "ghost"} 
        size="icon" 
        className="h-9 rounded-none border-x"
        onClick={() => setViewMode('list')}
      >
        <LayoutList size={16} />
      </Button>
      <Button 
        variant={viewMode === 'board' ? "default" : "ghost"} 
        size="icon" 
        className="h-9 rounded-none rounded-r-md"
        onClick={() => setViewMode('board')}
      >
        <Kanban size={16} />
      </Button>
    </div>
  );
} 