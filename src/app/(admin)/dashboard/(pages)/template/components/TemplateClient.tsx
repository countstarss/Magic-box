"use client";

import { useState } from 'react';
import { templates, templateCategories as defaultCategories, Template } from './template-data';
import { PreviewDialog } from './dialog/PreviewDialog';
import { CreateTemplateDialog } from './dialog/CreateTemplateDialog';
import { CreateCategoryDialog } from './dialog/CreateCategoryDialog';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, Search
} from 'lucide-react';

// 导入视图组件
import { CardView } from './views/CardView';
import { ListView } from './views/ListView';
import { BoardView } from './views/BoardView';

// 导入自定义hook
import { useTemplateActions } from './hooks/useTemplateActions';
import { useTemplateFilters } from './hooks/useTemplateFilters';

// 导入筛选组件
import { TabsFilter } from './filters/TabsFilter';
import { SearchAndFilterBar } from './filters/SearchAndFilterBar';
import { ViewMode } from './filters/ViewModeToggle';
import NoResult from './views/NoResult';

// 分类管理弹窗类型
type CategoryDialogMode = 'create' | 'edit' | null;

export default function TemplateClient() {
  // 视图状态
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [templateCategories, setTemplateCategories] = useState<string[]>(defaultCategories);
  
  // 分类管理状态
  const [categoryDialogMode, setCategoryDialogMode] = useState<CategoryDialogMode>(null);
  
  // 创建对话框状态
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  // 使用筛选Hook
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    activeTab,
    setActiveTab,
    sortBy,
    setSortBy,
    showAdvancedFilters,
    setShowAdvancedFilters,
    advancedFilters,
    filteredTemplates,
    resetAdvancedFilters,
    resetAllFilters,
    selectDateRange,
    toggleCategory,
    setDateRange,
    toggleFeatureFilter
  } = useTemplateFilters({
    templates
  });
  
  // 使用模板操作Hook
  const {
    selectedTemplate,
    previewDialogOpen,
    setPreviewDialogOpen,
    openPreview,
    toggleStar,
    updateTemplateCategory,
    prepareForCategoryChange,
    selectedTemplateForCategory
  } = useTemplateActions({
    activeTab,
    onUpdateTemplates: () => {} // 不再需要更新模板列表，由useTemplateFilters处理
  });
  
  // MARK: 添加分类
  const addCategory = (categoryName: string) => {
    if (categoryName && !templateCategories.includes(categoryName)) {
      setTemplateCategories([...templateCategories, categoryName]);
      
      // 如果有选中的模板需要改分类，那么也更新它的分类
      if (selectedTemplateForCategory) {
        updateTemplateCategory(categoryName, templates);
      }
    }
  };
  
  // MARK: 打开创建类别对话框
  const handleOpenCreateCategory = () => {
    // 不需要选择特定模板来创建类别
    setCategoryDialogMode('create');
  };
  
  // MARK: Handlers
  const handleOpenPreview = (template: Template) => {
    openPreview(template);
  };
  
  const handleToggleStar = (template: Template) => {
    toggleStar(template, templates);
  };
  
  const handleUpdateCategory = (category: string) => {
    updateTemplateCategory(category, templates);
  };
  
  const handlePrepareNewCategory = (template: Template) => {
    prepareForCategoryChange(template);
    setCategoryDialogMode('create');
  };
  
  // 检查筛选器是否有active状态
  const hasActiveAdvancedFilters = 
    advancedFilters.categories.length > 0 || 
    advancedFilters.dateRange.from || 
    advancedFilters.dateRange.to ||
    advancedFilters.showFeatured ||
    advancedFilters.showStarred;
  
  return (
    <div className="py-6 w-full px-8 overflow-y-auto h-full pb-24">
      {/* 页面标题和操作栏 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">邮件模板</h1>
          <p className="text-muted-foreground">管理您的邮件模板</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <PlusCircle size={16} />
            新建模板
          </Button>
        </div>
      </div>
      
      {/* 筛选和搜索栏 */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        {/* 使用Tab筛选组件 */}
        <TabsFilter activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* 使用搜索和筛选栏组件 */}
        <SearchAndFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          templateCategories={templateCategories}
          onCreateCategory={handleOpenCreateCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          showAdvancedFilters={showAdvancedFilters}
          setShowAdvancedFilters={setShowAdvancedFilters}
          advancedFilters={advancedFilters}
          resetAdvancedFilters={resetAdvancedFilters}
          selectDateRange={selectDateRange}
          toggleCategory={toggleCategory}
          setDateRange={setDateRange}
          toggleFeatureFilter={toggleFeatureFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
      </div>
      
      {/* 没有结果的空状态 */}
      {filteredTemplates.length === 0 && (
        <NoResult 
          onResetFilters={resetAllFilters}
        />
      )}
      
      {/* 视图切换 */}
      {filteredTemplates.length > 0 && (
        <>
          {viewMode === 'card' && (
            <CardView 
              templates={filteredTemplates}
              templateCategories={templateCategories}
              onOpenPreview={handleOpenPreview}
              onToggleStar={handleToggleStar}
              onUpdateCategory={handleUpdateCategory}
              onPrepareNewCategory={handlePrepareNewCategory}
            />
          )}
          
          {viewMode === 'list' && (
            <ListView
              templates={filteredTemplates}
              onOpenPreview={handleOpenPreview}
              onToggleStar={handleToggleStar}
            />
          )}
          
          {viewMode === 'board' && (
            <BoardView
              templates={filteredTemplates}
              onOpenPreview={handleOpenPreview}
              onToggleStar={handleToggleStar}
            />
          )}
        </>
      )}
      
      {/* 对话框组件 */}
      <PreviewDialog 
        isOpen={previewDialogOpen} 
        onOpenChange={setPreviewDialogOpen} 
        template={selectedTemplate} 
      />
      
      <CreateTemplateDialog
        isOpen={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
      
      <CreateCategoryDialog
        isOpen={categoryDialogMode === 'create'}
        onOpenChange={(open) => !open && setCategoryDialogMode(null)}
        onAddCategory={addCategory}
        templateForCategory={selectedTemplateForCategory}
      />
    </div>
  );
} 