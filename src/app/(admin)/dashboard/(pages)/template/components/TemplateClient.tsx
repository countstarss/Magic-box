"use client";

import { useState, useEffect } from 'react';
import { PreviewDialog } from './dialog/PreviewDialog';
import { CreateTemplateDialog } from './dialog/CreateTemplateDialog';
import { CreateCategoryDialog } from './dialog/CreateCategoryDialog';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

// 导入视图组件
import { CardView } from './views/CardView';
import { ListView } from './views/ListView';
import { BoardView } from './views/BoardView';

// 导入筛选组件
import { TabsFilter } from './filters/TabsFilter';
import { SearchAndFilterBar } from './filters/SearchAndFilterBar';
import { ViewMode } from './filters/ViewModeToggle';
import NoResult from './views/NoResult';
import { useTemplates } from '@/contexts/TemplateContext';
import { useToast } from '@/hooks/use-toast';

// 分类管理弹窗类型
type CategoryDialogMode = 'create' | 'edit' | null;

export default function TemplateClient() {
  // 使用模板上下文
  const { 
    templates, 
    categories, 
    isLoading, 
    error, 
    setFilters, 
    resetFilters, 
    filters,
    toggleStar,
    toggleFeatured,
    togglePublic,
    createCategory,
    selectTemplate,
    selectedTemplate,
    updateTemplate,
    createTemplate,
    deleteTemplate
  } = useTemplates();
  
  const { toast } = useToast();
  
  // 视图状态
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  
  // 分类管理状态
  const [categoryDialogMode, setCategoryDialogMode] = useState<CategoryDialogMode>(null);
  const [selectedTemplateForCategory, setSelectedTemplateForCategory] = useState<number | null>(null);
  
  // 创建对话框状态
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  // 预览对话框状态
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  
  // 搜索状态
  const [searchQuery, setSearchQuery] = useState('');
  
  // 排序状态
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");
  
  // 高级筛选状态
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    categories: [] as string[],
    dateRange: { from: undefined as Date | undefined, to: undefined as Date | undefined },
    showFeatured: false,
    showStarred: false,
    showPublic: false
  });
  
  // 当搜索查询改变时，更新筛选器
  useEffect(() => {
    // 避免重复设置相同的搜索值
    if (filters.search !== searchQuery) {
      setFilters({ search: searchQuery });
    }
  }, [searchQuery, filters.search, setFilters]);
  
  // 根据排序设置更新模板顺序
  const sortedTemplates = [...templates].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    } else {
      return a.name.localeCompare(b.name);
    }
  });
  
  // MARK: 添加分类
  const addCategory = async (categoryName: string) => {
    if (categoryName) {
      try {
        await createCategory(categoryName);
        
        // 如果有选中的模板需要改分类，那么也更新它的分类
        if (selectedTemplateForCategory !== null) {
          const templateToUpdate = templates.find(t => t.id === selectedTemplateForCategory);
          if (templateToUpdate) {
            // 更新模板分类
            const updatedTemplate = {
              ...templateToUpdate,
              category: categoryName
            };
            
            try {
              await updateTemplate(updatedTemplate);
            } catch (error) {
              console.error("更新模板分类失败:", error);
            }
          }
        }
        
        setCategoryDialogMode(null);
        setSelectedTemplateForCategory(null);
      } catch (error) {
        console.error("创建分类失败:", error);
      }
    }
  };
  
  // MARK: 打开创建类别对话框
  const handleOpenCreateCategory = () => {
    setCategoryDialogMode('create');
  };
  
  // MARK: Handlers
  const handleOpenPreview = (templateId: number) => {
    console.log(`准备预览模板(ID:${templateId})`, templates.length);
    
    // 查找模板的基本信息和完整信息
    const templateBasic = templates.find(t => t.id === templateId);
    
    if (templateBasic) {
      // 确保我们已经有完整的信息，包括htmlContent
      const hasFullContent = !!templateBasic.htmlContent;
      console.log(`模板(ID:${templateId})找到，是否有完整内容:`, hasFullContent);
      
      // 先关闭当前预览，确保状态重置
      if (previewDialogOpen) {
        setPreviewDialogOpen(false);
        // 使用setTimeout确保状态更新
        setTimeout(() => {
          selectTemplate(templateBasic);
          setPreviewDialogOpen(true);
        }, 100);
      } else {
        // 即使暂时没有完整内容，也先选中并打开预览框 
        // PreviewDialog会尝试从不同来源获取完整内容
        selectTemplate(templateBasic);
        // 显示预览对话框
        setPreviewDialogOpen(true);
      }
    } else {
      console.error(`找不到模板(ID:${templateId})`);
      toast({
        title: "预览失败",
        description: "找不到指定的模板",
        variant: "destructive"
      });
    }
  };
  
  const handleToggleStar = async (templateId: number) => {
    try {
      await toggleStar(templateId);
    } catch (error) {
      console.error("切换收藏状态失败:", error);
    }
  };
  
  // 复制模板
  const handleDuplicateTemplate = async (templateId: number) => {
    try {
      const templateToDuplicate = templates.find(t => t.id === templateId);
      if (templateToDuplicate) {
        // 创建新的模板副本，但不包含id, createdAt, updatedAt字段
        const newTemplate = {
          name: `${templateToDuplicate.name} (副本)`,
          description: templateToDuplicate.description,
          category: templateToDuplicate.category,
          thumbnail: templateToDuplicate.thumbnail,
          htmlContent: templateToDuplicate.htmlContent,
          design: templateToDuplicate.design,
          isFeatured: false, // 副本不继承精选状态
          isStarred: false, // 副本不继承收藏状态
          isPublic: false, // 副本不继承公开状态
          tags: templateToDuplicate.tags || [],
          userId: templateToDuplicate.userId,
        };
        
        await createTemplate(newTemplate);
        toast({
          title: "模板已复制",
          description: `已创建"${newTemplate.name}"`,
        });
      }
    } catch (error) {
      console.error("复制模板失败:", error);
      toast({
        title: "复制失败",
        description: error instanceof Error ? error.message : "操作失败",
        variant: "destructive"
      });
    }
  };
  
  // 删除模板
  const handleDeleteTemplate = async (templateId: number) => {
    if (confirm("确定要删除此模板吗？此操作无法撤销。")) {
      try {
        const templateToDelete = templates.find(t => t.id === templateId);
        if (templateToDelete) {
          await deleteTemplate(templateId);
          toast({
            title: "模板已删除",
            description: `"${templateToDelete.name}"已被删除`,
          });
        }
      } catch (error) {
        console.error("删除模板失败:", error);
        toast({
          title: "删除失败",
          description: error instanceof Error ? error.message : "操作失败",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleUpdateCategory = (templateId: number, category: string) => {
    // TODO: 更新模板分类
    const templateToUpdate = templates.find(t => t.id === templateId);
    if (templateToUpdate) {
      const updatedTemplate = {
        ...templateToUpdate,
        category: category
      };
      
      try {
        updateTemplate(updatedTemplate);
        toast({
          title: "更新模板分类成功",
        });
      } catch (error) {
        toast({
          title: "更新模板分类失败",
          description: error instanceof Error ? error.message : "操作失败",
          variant: "destructive"
        });
        console.error("更新模板分类失败:", error);
      }
    }
  };
  
  const handlePrepareNewCategory = (templateId: number) => {
    setSelectedTemplateForCategory(templateId);
    setCategoryDialogMode('create');
  };
  
  // 检查是否有激活的筛选器
  const hasActiveFilters = !!filters.search || !!filters.category || 
    filters.featured !== undefined || filters.starred !== undefined || 
    (filters.tags && filters.tags.length > 0);
  
  // 选择分类
  const handleSelectCategory = (category: string) => {
    // 避免重复设置相同的值触发无限更新
    if (filters.category !== category) {
      setFilters({ category });
    }
  };
  
  // 设置活动标签
  const handleSetActiveTab = (tab: 'all' | 'featured' | 'starred') => {
    // 检查当前状态，避免重复更新
    if (tab === 'all' && !filters.featured && !filters.starred) {
      return;
    } else if (tab === 'featured' && filters.featured === true && !filters.starred) {
      return;
    } else if (tab === 'starred' && !filters.featured && filters.starred === true) {
      return;
    }

    if (tab === 'all') {
      setFilters({ featured: undefined, starred: undefined });
    } else if (tab === 'featured') {
      setFilters({ featured: true, starred: undefined });
    } else if (tab === 'starred') {
      setFilters({ featured: undefined, starred: true });
    }
  };
  
  // 获取当前活动的标签
  const getActiveTab = () => {
    if (filters.featured) return 'featured';
    if (filters.starred) return 'starred';
    return 'all';
  };
  
  // 高级筛选器 handlers
  const resetAdvancedFilters = () => {
    setAdvancedFilters({
      categories: [],
      dateRange: { from: undefined, to: undefined },
      showFeatured: false,
      showStarred: false,
      showPublic: false
    });
    // 避免重复重置
    if (filters.featured !== undefined || filters.starred !== undefined || 
        filters.public !== undefined || filters.tags !== undefined || 
        filters.search !== undefined || filters.category !== undefined) {
      resetFilters();
    }
  };
  
  const selectDateRange = () => {
    // 暂时不实现
  };
  
  const toggleCategory = (category: string) => {
    const updatedCategories = advancedFilters.categories.includes(category)
      ? advancedFilters.categories.filter(c => c !== category)
      : [...advancedFilters.categories, category];
    
    setAdvancedFilters({
      ...advancedFilters,
      categories: updatedCategories
    });
    
    setFilters({ tags: updatedCategories.length > 0 ? updatedCategories : undefined });
  };
  
  const setDateRange = () => {
    // 暂时不实现
  };
  
  const toggleFeatureFilter = (feature: 'showFeatured' | 'showStarred' | 'showPublic') => {
    const newValue = !advancedFilters[feature];
    setAdvancedFilters({
      ...advancedFilters,
      [feature]: newValue
    });
    
    // 避免重复更新相同的值
    if (feature === 'showFeatured' && filters.featured !== (newValue || undefined)) {
      setFilters({ featured: newValue || undefined });
    } else if (feature === 'showStarred' && filters.starred !== (newValue || undefined)) {
      setFilters({ starred: newValue || undefined });
    } else if (feature === 'showPublic' && filters.public !== (newValue || undefined)) {
      setFilters({ public: newValue || undefined });
    }
  };
  
  // 处理无结果时的重置操作
  const handleResetFilters = () => {
    if (hasActiveFilters) {
      resetFilters();
    }
  };
  
  // 切换公开状态
  const handleTogglePublic = async (templateId: number) => {
    try {
      await togglePublic(templateId);
      toast({
        title: "模板状态已更新",
        description: "模板公开状态已改变",
      });
    } catch (error) {
      console.error("切换公开状态失败:", error);
      toast({
        title: "操作失败",
        description: error instanceof Error ? error.message : "更新模板状态时出错",
        variant: "destructive"
      });
    }
  };
  
  const router = useRouter();
  
  return (
    <div className="py-6 w-full px-8 overflow-y-auto h-full pb-24">
      {/* 页面标题和操作栏 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">邮件模板</h1>
          <p className="text-muted-foreground">管理您的邮件模板</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push('/dashboard/template/library')} variant="outline" className="gap-2">
            <Star size={16} />
            公开模板库
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <PlusCircle size={16} />
            新建模板
          </Button>
        </div>
      </div>
      
      {/* 筛选和搜索栏 */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        {/* 使用Tab筛选组件 */}
        <TabsFilter 
          activeTab={getActiveTab()} 
          setActiveTab={handleSetActiveTab}
        />
        
        {/* 使用搜索和筛选栏组件 */}
        <SearchAndFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={filters.category || "全部"}
          setSelectedCategory={handleSelectCategory}
          templateCategories={["全部", ...categories.map(c => c.name)]}
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
      
      {/* 加载状态 */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">加载模板中...</p>
          </div>
        </div>
      )}
      
      {/* 错误状态 */}
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <h3 className="font-medium">加载失败</h3>
          <p>{error.message}</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            重试
          </Button>
        </div>
      )}
      
      {/* 没有结果的空状态 */}
      {!isLoading && !error && sortedTemplates.length === 0 && (
        <NoResult 
          onResetFilters={handleResetFilters}
        />
      )}
      
      {/* 视图切换 */}
      {!isLoading && !error && sortedTemplates.length > 0 && (
        <>
          {viewMode === 'card' && (
            <CardView 
              templates={sortedTemplates.map(t => ({
                id: t.id as number,
                name: t.name,
                description: t.description,
                category: t.category,
                thumbnail: t.thumbnail,
                isFeatured: t.isFeatured,
                isStarred: t.isStarred,
                isPublic: t.isPublic,
                lastModified: t.updatedAt.toISOString(),
                htmlContent: t.htmlContent
              }))}
              templateCategories={categories.map(c => c.name)}
              onOpenPreview={(template) => handleOpenPreview(template.id)}
              onToggleStar={(template) => handleToggleStar(template.id)}
              onTogglePublic={(template) => handleTogglePublic(template.id)}
              onUpdateCategory={(category, templateId) => handleUpdateCategory(templateId, category)}
              onPrepareNewCategory={(template) => handlePrepareNewCategory(template.id)}
              onDuplicateTemplate={(template) => handleDuplicateTemplate(template.id)}
              onDeleteTemplate={(template) => handleDeleteTemplate(template.id)}
            />
          )}
          
          {viewMode === 'list' && (
            <ListView
              templates={sortedTemplates.map(t => ({
                id: t.id as number,
                name: t.name,
                description: t.description,
                category: t.category,
                thumbnail: t.thumbnail,
                isFeatured: t.isFeatured,
                isStarred: t.isStarred,
                isPublic: t.isPublic,
                lastModified: t.updatedAt.toISOString(),
                htmlContent: t.htmlContent
              }))}
              onOpenPreview={(template) => handleOpenPreview(template.id)}
              onToggleStar={(template) => handleToggleStar(template.id)}
              onTogglePublic={(template) => handleTogglePublic(template.id)}
              onDuplicateTemplate={(template) => handleDuplicateTemplate(template.id)}
              onDeleteTemplate={(template) => handleDeleteTemplate(template.id)}
              onUpdateCategory={(category, templateId) => handleUpdateCategory(templateId, category)}
            />
          )}
          
          {viewMode === 'board' && (
            <BoardView
              templates={sortedTemplates.map(t => ({
                id: t.id as number,
                name: t.name,
                description: t.description,
                category: t.category,
                thumbnail: t.thumbnail,
                isFeatured: t.isFeatured,
                isStarred: t.isStarred,
                isPublic: t.isPublic,
                lastModified: t.updatedAt.toISOString(),
                htmlContent: t.htmlContent
              }))}
              onOpenPreview={(template) => handleOpenPreview(template.id)}
              onToggleStar={(template) => handleToggleStar(template.id)}
              onTogglePublic={(template) => handleTogglePublic(template.id)}
              onDuplicateTemplate={(template) => handleDuplicateTemplate(template.id)}
              onDeleteTemplate={(template) => handleDeleteTemplate(template.id)}
              onUpdateCategory={(category, templateId) => handleUpdateCategory(templateId, category)}
              onPrepareNewCategory={(template) => handlePrepareNewCategory(template.id)}
            />
          )}
        </>
      )}
      
      {/* 对话框组件 */}
      <PreviewDialog 
        isOpen={previewDialogOpen} 
        onOpenChange={setPreviewDialogOpen} 
        template={selectedTemplate ? {
          id: selectedTemplate.id as number,
          name: selectedTemplate.name,
          description: selectedTemplate.description,
          category: selectedTemplate.category,
          thumbnail: selectedTemplate.thumbnail,
          isFeatured: selectedTemplate.isFeatured,
          isStarred: selectedTemplate.isStarred,
          isPublic: selectedTemplate.isPublic,
          lastModified: selectedTemplate.updatedAt.toISOString()
        } : null} 
      />
      
      <CreateTemplateDialog
        isOpen={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
      
      <CreateCategoryDialog
        isOpen={categoryDialogMode === 'create'}
        onOpenChange={(open) => !open && setCategoryDialogMode(null)}
        onAddCategory={addCategory}
        templateForCategory={selectedTemplateForCategory ? 
          templates.find(t => t.id === selectedTemplateForCategory) as any : null}
      />
    </div>
  );
} 