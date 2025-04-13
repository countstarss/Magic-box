'use client';

import React, { useState } from 'react';
import { useCrmStore } from '../store/useCrmStore';
import UsersTable from './sections/UsersTable';
import UserStats from './sections/UserStats';
import UserFilters from './sections/UserFilters';
import AddUserDialog from './dialogs/AddUserDialog';
import ImportUsersDialog from './dialogs/ImportUsersDialog';
import UserDetailsSidebar from './sidebars/UserDetailsSidebar';
import { Button } from '@/components/ui/button';
import { PlusCircle, Upload, RefreshCw } from 'lucide-react';

// 导入自定义Tabs组件
import { 
  CustomTabs, 
  CustomTabsContent, 
  CustomTabsList, 
  CustomTabsTrigger,
  CustomTabsIndicator
} from "@/components/ui/custom-tabs";

const CrmLayout = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [showSidebar, setShowSidebar] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  
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
  const handleTabChange = (value: string) => {
    // 根据当前和新标签页的位置决定滑动方向
    const tabOrder = ['all', 'active', 'premium', 'new', 'inactive', 'highValue'];
    const currentIndex = tabOrder.indexOf(activeTab);
    const newIndex = tabOrder.indexOf(value);
    
    // 如果新标签在当前标签右侧，则从右向左滑动；否则从左向右滑动
    if (newIndex > currentIndex) {
      setSlideDirection('right');
    } else {
      setSlideDirection('left');
    }
    
    resetFilter();
    setActiveTab(value);
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
      <CustomTabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="mt-6">
        <div className="flex justify-between items-center mb-6">
          <CustomTabsList className="grid grid-cols-6 w-fit">
            <CustomTabsTrigger value="all">所有用户</CustomTabsTrigger>
            <CustomTabsTrigger value="active">活跃用户</CustomTabsTrigger>
            <CustomTabsTrigger value="premium">付费会员</CustomTabsTrigger>
            <CustomTabsTrigger value="new">新用户</CustomTabsTrigger>
            <CustomTabsTrigger value="inactive">沉睡用户</CustomTabsTrigger>
            <CustomTabsTrigger value="highValue">高价值用户</CustomTabsTrigger>
            <CustomTabsIndicator />
          </CustomTabsList>
          
          {/* 筛选面板 */}
          <UserFilters activeTab={activeTab} />
        </div>
        
        <CustomTabsContent value="all" className="mt-0" slideDirection={slideDirection}>
          <UsersTable 
            users={getUsersForTab()} 
            pagination={pagination}
            onPageChange={setPage}
            onUserSelect={openUserDetails}
          />
        </CustomTabsContent>
        
        <CustomTabsContent value="active" className="mt-0" slideDirection={slideDirection}>
          <UsersTable 
            users={getUsersForTab()} 
            pagination={pagination}
            onPageChange={setPage}
            onUserSelect={openUserDetails}
          />
        </CustomTabsContent>
        
        <CustomTabsContent value="premium" className="mt-0" slideDirection={slideDirection}>
          <UsersTable 
            users={getUsersForTab()} 
            pagination={pagination}
            onPageChange={setPage}
            onUserSelect={openUserDetails}
          />
        </CustomTabsContent>
        
        <CustomTabsContent value="new" className="mt-0" slideDirection={slideDirection}>
          <UsersTable 
            users={getUsersForTab()} 
            pagination={pagination}
            onPageChange={setPage}
            onUserSelect={openUserDetails}
          />
        </CustomTabsContent>
        
        <CustomTabsContent value="inactive" className="mt-0" slideDirection={slideDirection}>
          <UsersTable 
            users={getUsersForTab()} 
            pagination={pagination}
            onPageChange={setPage}
            onUserSelect={openUserDetails}
          />
        </CustomTabsContent>
        
        <CustomTabsContent value="highValue" className="mt-0" slideDirection={slideDirection}>
          <UsersTable 
            users={getUsersForTab()} 
            pagination={pagination}
            onPageChange={setPage}
            onUserSelect={openUserDetails}
          />
        </CustomTabsContent>
      </CustomTabs>
      
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