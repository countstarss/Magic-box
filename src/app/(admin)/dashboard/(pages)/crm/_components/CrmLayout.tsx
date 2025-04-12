'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCrmStore } from '../store/useCrmStore';
import UsersTable from './sections/UsersTable';
import UserStats from './sections/UserStats';
import UserFilters from './sections/UserFilters';
import AddUserDialog from './dialogs/AddUserDialog';
import ImportUsersDialog from './dialogs/ImportUsersDialog';
import UserDetailsSidebar from './sidebars/UserDetailsSidebar';
import { Button } from '@/components/ui/button';
import { PlusCircle, Upload, RefreshCw } from 'lucide-react';

const CrmLayout = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [showSidebar, setShowSidebar] = useState(false);
  
  // 从Zustand获取全局状态和方法
  const { 
    setIsAddingUser, 
    setIsImportingUsers, 
    selectedUser,
    setSelectedUser,
    resetFilter,
    pagination,
    setPage,
    getFilteredUsers,
    getUsersByTag
  } = useCrmStore();
  
  // 根据当前标签页获取适当的用户列表
  const getUsersForTab = () => {
    switch (activeTab) {
      case 'active':
        return getUsersByTag('active');
      case 'premium':
        return getUsersByTag('premium');
      case 'new':
        return getUsersByTag('new');
      case 'inactive':
        return getUsersByTag('inactive');
      case 'highValue':
        return getUsersByTag('highValue');
      default:
        return getFilteredUsers();
    }
  };
  
  // 处理标签页切换
  const handleTabChange = (tab: string) => {
    resetFilter();
    setActiveTab(tab);
  };
  
  // 打开用户详情侧边栏
  const openUserDetails = (userId: string) => {
    const user = getFilteredUsers().find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setShowSidebar(true);
    }
  };
  
  // 关闭用户详情侧边栏
  const closeSidebar = () => {
    setShowSidebar(false);
    setTimeout(() => setSelectedUser(null), 300); // 动画结束后清除选中用户
  };
  
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 页面标题和操作按钮 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">客户管理</h1>
          <p className="text-muted-foreground">管理您的客户信息和分类</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => resetFilter()}
            className="gap-2"
          >
            <RefreshCw size={16} />
            重置筛选
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsImportingUsers(true)}
            className="gap-2"
          >
            <Upload size={16} />
            导入用户
          </Button>
          <Button 
            onClick={() => setIsAddingUser(true)}
            className="gap-2"
          >
            <PlusCircle size={16} />
            添加用户
          </Button>
        </div>
      </div>
      
      {/* 用户统计卡片 */}
      <UserStats />
      
      {/* 标签页和内容 */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="mt-6">
        <div className="flex justify-between items-center mb-6">
          <TabsList className="grid grid-cols-6 w-fit">
            <TabsTrigger value="all">所有用户</TabsTrigger>
            <TabsTrigger value="active">活跃用户</TabsTrigger>
            <TabsTrigger value="premium">付费会员</TabsTrigger>
            <TabsTrigger value="new">新用户</TabsTrigger>
            <TabsTrigger value="inactive">沉睡用户</TabsTrigger>
            <TabsTrigger value="highValue">高价值用户</TabsTrigger>
          </TabsList>
          
          {/* 筛选面板 */}
          <UserFilters activeTab={activeTab} />
        </div>
        
        <TabsContent value="all" className="mt-0">
          <UsersTable 
            users={getUsersForTab()} 
            pagination={pagination}
            onPageChange={setPage}
            onUserSelect={openUserDetails}
          />
        </TabsContent>
        
        <TabsContent value="active" className="mt-0">
          <UsersTable 
            users={getUsersForTab()} 
            pagination={pagination}
            onPageChange={setPage}
            onUserSelect={openUserDetails}
          />
        </TabsContent>
        
        <TabsContent value="premium" className="mt-0">
          <UsersTable 
            users={getUsersForTab()} 
            pagination={pagination}
            onPageChange={setPage}
            onUserSelect={openUserDetails}
          />
        </TabsContent>
        
        <TabsContent value="new" className="mt-0">
          <UsersTable 
            users={getUsersForTab()} 
            pagination={pagination}
            onPageChange={setPage}
            onUserSelect={openUserDetails}
          />
        </TabsContent>
        
        <TabsContent value="inactive" className="mt-0">
          <UsersTable 
            users={getUsersForTab()} 
            pagination={pagination}
            onPageChange={setPage}
            onUserSelect={openUserDetails}
          />
        </TabsContent>
        
        <TabsContent value="highValue" className="mt-0">
          <UsersTable 
            users={getUsersForTab()} 
            pagination={pagination}
            onPageChange={setPage}
            onUserSelect={openUserDetails}
          />
        </TabsContent>
      </Tabs>
      
      {/* 用户详情侧边栏 */}
      <UserDetailsSidebar 
        open={showSidebar} 
        onClose={closeSidebar}
        user={selectedUser}
      />
      
      {/* 对话框组件 */}
      <AddUserDialog />
      <ImportUsersDialog />
    </div>
  );
};

export default CrmLayout; 