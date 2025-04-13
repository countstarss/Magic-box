'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useLocalSettings } from "@/hooks/use-local-storage";
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Trash, 
  Plus, 
  Search, 
  Layout, 
  Eye,
  EyeOff,
  FileText,
  SearchIcon,
  Clock
} from "lucide-react";

export default function DashboardPanel() {
  // 模拟用户ID
  const userId = 'user-123';
  const { 
    isReady,
    
    // UI偏好
    uiPreferences,
    setDarkMode,
    setSidebarCollapsed,
    setFontSize,
    setDensity,
    setAccentColor,
    resetToDefaults,
    
    // 仪表盘配置
    dashboardLayout,
    hiddenWidgets,
    
    // 最近查看的项目
    recentItems,
    addRecentItem,
    
    // 草稿
    drafts,
    saveDraft,
    updateDraft,
    deleteDraft,
    
    // 搜索历史
    searchHistory,
    addSearchHistory,
    clearSearchHistory
  } = useLocalSettings({ userId });
  
  // 新草稿状态
  const [newDraft, setNewDraft] = useState({
    title: '',
    content: '',
    draftType: 'note' as const
  });
  
  // 草稿对话框状态
  const [draftDialogOpen, setDraftDialogOpen] = useState(false);
  
  // 搜索查询状态
  const [searchQuery, setSearchQuery] = useState('');
  
  // 模拟添加最近项目
  const handleAddRecentItem = () => {
    addRecentItem({
      userId,
      itemType: 'document',
      itemId: `doc-${Date.now()}`,
      title: `示例文档 ${new Date().toLocaleTimeString()}`,
      icon: 'file'
    });
  };
  
  // 保存草稿
  const handleSaveDraft = () => {
    if (newDraft.title.trim() && newDraft.content.trim()) {
      saveDraft({
        title: newDraft.title,
        content: newDraft.content,
        draftType: newDraft.draftType,
        userId
      });
      
      setNewDraft({
        title: '',
        content: '',
        draftType: 'note'
      });
      
      setDraftDialogOpen(false);
    }
  };
  
  // 搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      addSearchHistory({
        userId,
        searchArea: 'global',
        query: searchQuery,
        filters: {}
      });
      
      setSearchQuery('');
    }
  };
  
  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">加载中...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-4">本地存储功能演示</h1>
      <p className="text-muted-foreground mb-8">
        这个页面展示了使用IndexedDB进行本地存储的功能，包括UI偏好、草稿和搜索历史等
      </p>
      
      <Tabs defaultValue="ui-preferences">
        <TabsList className="mb-4">
          <TabsTrigger value="ui-preferences">界面偏好</TabsTrigger>
          <TabsTrigger value="recent-items">最近查看</TabsTrigger>
          <TabsTrigger value="drafts">草稿</TabsTrigger>
          <TabsTrigger value="search-history">搜索历史</TabsTrigger>
        </TabsList>
        
        {/* 界面偏好 */}
        <TabsContent value="ui-preferences">
          <Card>
            <CardHeader>
              <CardTitle>界面偏好设置</CardTitle>
              <CardDescription>
                这些设置保存在本地IndexedDB中，无需服务器存储
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">暗黑模式</Label>
                  <p className="text-sm text-muted-foreground">
                    切换深色和浅色主题
                  </p>
                </div>
                <Switch 
                  checked={uiPreferences.darkMode} 
                  onCheckedChange={setDarkMode}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">折叠侧边栏</Label>
                  <p className="text-sm text-muted-foreground">
                    设置侧边栏的默认折叠状态
                  </p>
                </div>
                <Switch 
                  checked={uiPreferences.sidebarCollapsed} 
                  onCheckedChange={setSidebarCollapsed}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-base">字体大小</Label>
                <div className="flex space-x-4">
                  <Button
                    variant={uiPreferences.fontSize === 'small' ? "default" : "outline"}
                    onClick={() => setFontSize('small')}
                  >
                    小
                  </Button>
                  <Button
                    variant={uiPreferences.fontSize === 'medium' ? "default" : "outline"}
                    onClick={() => setFontSize('medium')}
                  >
                    中
                  </Button>
                  <Button
                    variant={uiPreferences.fontSize === 'large' ? "default" : "outline"}
                    onClick={() => setFontSize('large')}
                  >
                    大
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-base">界面密度</Label>
                <div className="flex space-x-4">
                  <Button
                    variant={uiPreferences.density === 'compact' ? "default" : "outline"}
                    onClick={() => setDensity('compact')}
                  >
                    紧凑
                  </Button>
                  <Button
                    variant={uiPreferences.density === 'comfortable' ? "default" : "outline"}
                    onClick={() => setDensity('comfortable')}
                  >
                    舒适
                  </Button>
                  <Button
                    variant={uiPreferences.density === 'spacious' ? "default" : "outline"}
                    onClick={() => setDensity('spacious')}
                  >
                    宽松
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-base">强调色</Label>
                <div className="grid grid-cols-5 gap-2">
                  {['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ef4444'].map(color => (
                    <div
                      key={color}
                      className={`h-10 rounded-md cursor-pointer ${
                        uiPreferences.accentColor === color ? 'ring-2 ring-offset-2 ring-black dark:ring-white' : ''
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setAccentColor(color)}
                    />
                  ))}
                </div>
              </div>
              
              <Button variant="outline" onClick={resetToDefaults} className="w-full">
                <RotateCcw className="mr-2 h-4 w-4" />
                重置为默认设置
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 最近查看 */}
        <TabsContent value="recent-items">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>最近查看的项目</CardTitle>
                <CardDescription>
                  保存在本地IndexedDB中的最近访问记录
                </CardDescription>
              </div>
              <Button variant="outline" onClick={handleAddRecentItem}>
                <Plus className="mr-2 h-4 w-4" />
                添加测试项目
              </Button>
            </CardHeader>
            <CardContent>
              {recentItems.length > 0 ? (
                <div className="space-y-4">
                  {recentItems.map((item) => (
                    <div 
                      key={`${item.itemType}-${item.itemId}`}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div className="flex items-center">
                        <div className="p-2 rounded-md bg-primary/10 mr-3">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.itemType}</p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(item.viewedAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>没有最近查看的项目</p>
                  <Button 
                    variant="outline" 
                    onClick={handleAddRecentItem}
                    className="mt-4"
                  >
                    添加测试项目
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 草稿 */}
        <TabsContent value="drafts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>本地草稿</CardTitle>
                <CardDescription>
                  保存在IndexedDB中的草稿内容
                </CardDescription>
              </div>
              <Button onClick={() => setDraftDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                新建草稿
              </Button>
            </CardHeader>
            <CardContent>
              {drafts.note.length > 0 ? (
                <div className="space-y-4">
                  {drafts.note.map((draft) => (
                    <div 
                      key={draft.id}
                      className="border rounded-md p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{draft.title}</h3>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => draft.id && deleteDraft(draft.id)}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {typeof draft.content === 'string' 
                          ? draft.content.substring(0, 100) + (draft.content.length > 100 ? '...' : '')
                          : JSON.stringify(draft.content).substring(0, 100) + '...'
                        }
                      </p>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>创建于: {new Date(draft.createdAt).toLocaleString()}</span>
                        <span>更新于: {new Date(draft.updatedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>没有保存的草稿</p>
                  <Button 
                    onClick={() => setDraftDialogOpen(true)}
                    className="mt-4"
                  >
                    创建新草稿
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* 草稿创建对话框 */}
          <Dialog open={draftDialogOpen} onOpenChange={setDraftDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>创建新草稿</DialogTitle>
                <DialogDescription>
                  草稿将保存在本地IndexedDB中
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">标题</Label>
                  <Input
                    id="title"
                    value={newDraft.title}
                    onChange={(e) => setNewDraft({ ...newDraft, title: e.target.value })}
                    placeholder="输入草稿标题"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">内容</Label>
                  <Textarea
                    id="content"
                    value={newDraft.content}
                    onChange={(e) => setNewDraft({ ...newDraft, content: e.target.value })}
                    placeholder="输入草稿内容"
                    rows={6}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDraftDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleSaveDraft}>
                  <Save className="mr-2 h-4 w-4" />
                  保存草稿
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        {/* 搜索历史 */}
        <TabsContent value="search-history">
          <Card>
            <CardHeader>
              <CardTitle>搜索历史</CardTitle>
              <CardDescription>
                保存在IndexedDB中的搜索记录
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 搜索表单 */}
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="输入搜索查询..."
                  className="flex-1"
                />
                <Button type="submit">
                  <SearchIcon className="mr-2 h-4 w-4" />
                  搜索
                </Button>
              </form>
              
              {/* 搜索历史列表 */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">全局搜索历史</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => clearSearchHistory('global')}
                  >
                    清除历史
                  </Button>
                </div>
                
                {searchHistory.global?.length > 0 ? (
                  <div className="space-y-2">
                    {searchHistory.global.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 border rounded-md"
                      >
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                          <span>{item.query}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>无搜索历史</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 