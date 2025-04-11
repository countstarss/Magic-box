<think>我需要创建一个轻量级CRM系统，基于已有的事件管理系统，主要功能包括：

1. 用户信息收集与管理
   - 通过表单收集
   - 支持webhook接入
   - 手动添加用户

2. 用户分类和标记
   - 基于活跃度分类（最后登录时间）
   - 基于付费情况分类
   - 基于注册时间分类
   - 基于消费金额分类

3. 用户数据表格
   - 支持分页加载
   - 支持筛选
   - 支持查看详情

4. 集成到事件管理系统中，用于选择邮件接收人

框架和技术选择：
- 全局状态管理使用Zustand
- UI继续使用已有的组件库
- 数据模型需要设计用户信息结构

我将先创建主要的CRM页面，然后实现Zustand状态管理，最后实现主要的功能组件。</think># CRM 系统设计与实现

我将为您设计一个轻量级的CRM系统，用于客户信息统计和管理，并与现有的事件管理系统集成。这个CRM系统将专注于用户信息收集、分类标记和活跃度追踪。

## 系统设计概述

首先，让我创建基本的页面结构：

```typescript jsx:src/app/(center)/dashboard/(pages)/crm/page.tsx
import React from 'react';
import ContextMenuWrapper from '@/components/ui/ContextMenuWrapper';
import CrmLayout from './_components/CrmLayout';

const CrmPage = () => {
  return (
    <ContextMenuWrapper>
      <div className="p-8 pb-24">
        <CrmLayout />
      </div>
    </ContextMenuWrapper>
  );
};

export default CrmPage;
```
现在创建布局文件：

```typescript jsx:src/app/(center)/dashboard/(pages)/crm/layout.tsx
'use client';
import React from 'react';
import Content from '../../_components/content';
import CrmProvider from './providers';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <CrmProvider>
      <Content title="客户管理">
        <div className="h-[calc(100vh-5rem)] bg-gray-50 dark:bg-transparent overflow-auto">
          {children}
        </div>
      </Content>
    </CrmProvider>
  );
}
```
接下来，让我使用Zustand创建状态管理store：

```typescript:src/app/(center)/dashboard/(pages)/crm/store/useCrmStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

// 用户来源类型
export type UserSource = 'form' | 'import' | 'webhook' | 'manual';

// 用户标签/分类
export type UserTag = 
  | 'active'    // 活跃用户
  | 'premium'   // 付费会员
  | 'new'       // 新注册用户
  | 'inactive'  // 沉睡用户
  | 'highValue' // 高价值用户
  | 'lead'      // 潜在用户
  | 'custom';   // 自定义标签

// 用户状态
export type UserStatus = 'active' | 'inactive' | 'pending' | 'blocked';

// 用户数据结构
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  source: UserSource;
  status: UserStatus;
  tags: UserTag[];
  customTags?: string[];
  createdAt: Date;
  lastLoginAt: Date;
  totalSpent: number;
  notes?: string;
  avatar?: string;
  metadata?: Record<string, any>;
}

// 分页参数
export interface PaginationParams {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// 筛选参数
export interface FilterParams {
  search: string;
  tags: UserTag[];
  status: UserStatus | 'all';
  dateRange: {
    from?: Date;
    to?: Date;
  };
  spentRange: {
    min?: number;
    max?: number;
  };
}

// 排序类型
export type SortField = 'name' | 'email' | 'createdAt' | 'lastLoginAt' | 'totalSpent';
export type SortDirection = 'asc' | 'desc';

// 排序参数
export interface SortParams {
  field: SortField;
  direction: SortDirection;
}

// CRM Store 状态
interface CrmState {
  // 用户数据
  users: User[];
  selectedUser: User | null;
  isAddingUser: boolean;
  isImportingUsers: boolean;
  
  // 分页和筛选
  pagination: PaginationParams;
  filter: FilterParams;
  sort: SortParams;
  
  // 自定义标签
  availableCustomTags: string[];
  
  // 用户操作
  setSelectedUser: (user: User | null) => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => User;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  importUsers: (users: Omit<User, 'id'>[]) => User[];
  
  // 标签操作
  addCustomTag: (tag: string) => void;
  removeCustomTag: (tag: string) => void;
  addTagToUser: (userId: string, tag: UserTag | string) => void;
  removeTagFromUser: (userId: string, tag: UserTag | string) => void;
  
  // 分页和筛选操作
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilter: (filter: Partial<FilterParams>) => void;
  resetFilter: () => void;
  setSort: (sort: SortParams) => void;
  
  // UI 状态
  setIsAddingUser: (isAdding: boolean) => void;
  setIsImportingUsers: (isImporting: boolean) => void;
  
  // 数据获取
  getFilteredUsers: () => User[];
  getUsersByTag: (tag: UserTag) => User[];
}

// 生成模拟数据
const generateMockUsers = (count: number): User[] => {
  const tags: UserTag[] = ['active', 'premium', 'new', 'inactive', 'highValue', 'lead'];
  const sources: UserSource[] = ['form', 'import', 'webhook', 'manual'];
  const statuses: UserStatus[] = ['active', 'inactive', 'pending', 'blocked'];
  const companies = ['Acme Inc', 'Globex Corp', 'Stark Industries', 'Wayne Enterprises', 'Umbrella Corp'];
  const positions = ['CEO', 'CTO', 'Marketing Manager', 'Developer', 'Designer', 'Sales Representative'];
  
  const now = new Date();
  
  return Array(count)
    .fill(0)
    .map((_, i) => {
      // 随机生成最后登录时间，范围从现在到90天前
      const lastLoginDays = Math.floor(Math.random() * 90);
      const lastLoginAt = new Date(now);
      lastLoginAt.setDate(lastLoginAt.getDate() - lastLoginDays);
      
      // 随机生成创建时间，范围从现在到1年前
      const createdDays = Math.floor(Math.random() * 365);
      const createdAt = new Date(now);
      createdAt.setDate(createdAt.getDate() - createdDays);
      
      // 随机消费金额，0-2000
      const totalSpent = Math.floor(Math.random() * 2000);
      
      // 随机分配标签
      const userTags: UserTag[] = [];
      
      // 根据创建时间决定是否是新用户
      if (createdDays <= 7) {
        userTags.push('new');
      }
      
      // 根据最后登录时间决定是否活跃
      if (lastLoginDays <= 30) {
        userTags.push('active');
      } else if (lastLoginDays > 60) {
        userTags.push('inactive');
      }
      
      // 根据消费金额决定是否是高价值用户
      if (totalSpent > 1000) {
        userTags.push('highValue');
      }
      
      // 随机决定是否是付费会员
      if (Math.random() > 0.7) {
        userTags.push('premium');
      }
      
      // 随机决定是否是潜在用户
      if (userTags.length === 0 || (Math.random() > 0.8 && !userTags.includes('premium'))) {
        userTags.push('lead');
      }
      
      return {
        id: uuidv4(),
        fullName: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        phone: Math.random() > 0.3 ? `+1${Math.floor(1000000000 + Math.random() * 9000000000)}` : undefined,
        company: Math.random() > 0.5 ? companies[Math.floor(Math.random() * companies.length)] : undefined,
        position: Math.random() > 0.6 ? positions[Math.floor(Math.random() * positions.length)] : undefined,
        source: sources[Math.floor(Math.random() * sources.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        tags: userTags,
        createdAt,
        lastLoginAt,
        totalSpent,
        notes: Math.random() > 0.7 ? `Note for user ${i + 1}` : undefined,
      };
    });
};

// 初始化模拟数据
const mockUsers = generateMockUsers(100);

// 创建和导出 Zustand store
export const useCrmStore = create<CrmState>()(
  persist(
    (set, get) => ({
      // 初始状态
      users: mockUsers,
      selectedUser: null,
      isAddingUser: false,
      isImportingUsers: false,
      
      pagination: {
        page: 1,
        pageSize: 10,
        totalItems: mockUsers.length,
        totalPages: Math.ceil(mockUsers.length / 10),
      },
      
      filter: {
        search: '',
        tags: [],
        status: 'all',
        dateRange: {},
        spentRange: {},
      },
      
      sort: {
        field: 'lastLoginAt',
        direction: 'desc',
      },
      
      availableCustomTags: ['VIP', 'Potential', 'Churned'],
      
      // 用户操作
      setSelectedUser: (user) => set({ selectedUser: user }),
      
      addUser: (userData) => {
        const newUser: User = {
          ...userData,
          id: uuidv4(),
          createdAt: new Date(),
        };
        
        set((state) => ({
          users: [newUser, ...state.users],
          pagination: {
            ...state.pagination,
            totalItems: state.users.length + 1,
            totalPages: Math.ceil((state.users.length + 1) / state.pagination.pageSize),
          },
        }));
        
        return newUser;
      },
      
      updateUser: (id, updates) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...updates } : user
          ),
        }));
      },
      
      deleteUser: (id) => {
        set((state) => {
          const newUsers = state.users.filter((user) => user.id !== id);
          return {
            users: newUsers,
            pagination: {
              ...state.pagination,
              totalItems: newUsers.length,
              totalPages: Math.ceil(newUsers.length / state.pagination.pageSize),
            },
            selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
          };
        });
      },
      
      importUsers: (usersData) => {
        const newUsers = usersData.map(userData => ({
          ...userData,
          id: uuidv4(),
        }));
        
        set((state) => {
          const updatedUsers = [...newUsers, ...state.users];
          return {
            users: updatedUsers,
            pagination: {
              ...state.pagination,
              totalItems: updatedUsers.length,
              totalPages: Math.ceil(updatedUsers.length / state.pagination.pageSize),
            },
          };
        });
        
        return newUsers as User[];
      },
      
      // 标签操作
      addCustomTag: (tag) => {
        set((state) => ({
          availableCustomTags: state.availableCustomTags.includes(tag)
            ? state.availableCustomTags
            : [...state.availableCustomTags, tag],
        }));
      },
      
      removeCustomTag: (tag) => {
        set((state) => ({
          availableCustomTags: state.availableCustomTags.filter((t) => t !== tag),
          users: state.users.map((user) => ({
            ...user,
            customTags: user.customTags?.filter((t) => t !== tag),
          })),
        }));
      },
      
      addTagToUser: (userId, tag) => {
        set((state) => ({
          users: state.users.map((user) => {
            if (user.id !== userId) return user;
            
            // 处理预定义标签
            if (
              tag === 'active' ||
              tag === 'premium' ||
              tag === 'new' ||
              tag === 'inactive' ||
              tag === 'highValue' ||
              tag === 'lead'
            ) {
              return {
                ...user,
                tags: user.tags.includes(tag as UserTag)
                  ? user.tags
                  : [...user.tags, tag as UserTag],
              };
            }
            
            // 处理自定义标签
            return {
              ...user,
              customTags: user.customTags?.includes(tag)
                ? user.customTags
                : [...(user.customTags || []), tag],
            };
          }),
        }));
      },
      
      removeTagFromUser: (userId, tag) => {
        set((state) => ({
          users: state.users.map((user) => {
            if (user.id !== userId) return user;
            
            // 处理预定义标签
            if (
              tag === 'active' ||
              tag === 'premium' ||
              tag === 'new' ||
              tag === 'inactive' ||
              tag === 'highValue' ||
              tag === 'lead'
            ) {
              return {
                ...user,
                tags: user.tags.filter((t) => t !== tag),
              };
            }
            
            // 处理自定义标签
            return {
              ...user,
              customTags: user.customTags?.filter((t) => t !== tag),
            };
          }),
        }));
      },
      
      // 分页和筛选操作
      setPage: (page) => {
        set((state) => ({
          pagination: {
            ...state.pagination,
            page,
          },
        }));
      },
      
      setPageSize: (pageSize) => {
        set((state) => {
          const totalPages = Math.ceil(state.pagination.totalItems / pageSize);
          const page = Math.min(state.pagination.page, totalPages);
          
          return {
            pagination: {
              ...state.pagination,
              pageSize,
              totalPages,
              page,
            },
          };
        });
      },
      
      setFilter: (filterUpdates) => {
        set((state) => ({
          filter: {
            ...state.filter,
            ...filterUpdates,
          },
          pagination: {
            ...state.pagination,
            page: 1, // 重置到第一页
          },
        }));
      },
      
      resetFilter: () => {
        set((state) => ({
          filter: {
            search: '',
            tags: [],
            status: 'all',
            dateRange: {},
            spentRange: {},
          },
          pagination: {
            ...state.pagination,
            page: 1,
          },
        }));
      },
      
      setSort: (sort) => {
        set({ sort });
      },
      
      // UI 状态
      setIsAddingUser: (isAdding) => set({ isAddingUser: isAdding }),
      setIsImportingUsers: (isImporting) => set({ isImportingUsers: isImporting }),
      
      // 数据获取和筛选
      getFilteredUsers: () => {
        const { users, filter, sort, pagination } = get();
        
        // 1. 应用筛选
        let filteredUsers = users.filter((user) => {
          // 搜索筛选
          if (filter.search) {
            const searchLower = filter.search.toLowerCase();
            const matchesSearch =
              user.fullName.toLowerCase().includes(searchLower) ||
              user.email.toLowerCase().includes(searchLower) ||
              user.company?.toLowerCase().includes(searchLower) ||
              user.position?.toLowerCase().includes(searchLower) ||
              user.phone?.includes(filter.search);
            
            if (!matchesSearch) return false;
          }
          
          // 标签筛选
          if (filter.tags.length > 0) {
            const hasMatchingTag = filter.tags.some((tag) => user.tags.includes(tag));
            if (!hasMatchingTag) return false;
          }
          
          // 状态筛选
          if (filter.status !== 'all' && user.status !== filter.status) {
            return false;
          }
          
          // 日期范围筛选
          if (filter.dateRange.from && user.createdAt < filter.dateRange.from) {
            return false;
          }
          if (filter.dateRange.to) {
            const endDate = new Date(filter.dateRange.to);
            endDate.setDate(endDate.getDate() + 1); // 包含结束日期
            if (user.createdAt >= endDate) {
              return false;
            }
          }
          
          // 消费金额筛选
          if (
            (filter.spentRange.min !== undefined && user.totalSpent < filter.spentRange.min) ||
            (filter.spentRange.max !== undefined && user.totalSpent > filter.spentRange.max)
          ) {
            return false;
          }
          
          return true;
        });
        
        // 2. 应用排序
        filteredUsers.sort((a, b) => {
          const aValue = a[sort.field];
          const bValue = b[sort.field];
          
          // 根据字段类型进行排序
          if (sort.field === 'totalSpent') {
            return sort.direction === 'asc'
              ? (a.totalSpent || 0) - (b.totalSpent || 0)
              : (b.totalSpent || 0) - (a.totalSpent || 0);
          }
          
          if (sort.field === 'createdAt' || sort.field === 'lastLoginAt') {
            const aDate = new Date(aValue as Date).getTime();
            const bDate = new Date(bValue as Date).getTime();
            return sort.direction === 'asc' ? aDate - bDate : bDate - aDate;
          }
          
          // 字符串排序
          const aStr = String(aValue || '').toLowerCase();
          const bStr = String(bValue || '').toLowerCase();
          return sort.direction === 'asc'
            ? aStr.localeCompare(bStr)
            : bStr.localeCompare(aStr);
        });
        
        return filteredUsers;
      },
      
      getUsersByTag: (tag: UserTag) => {
        return get().users.filter((user) => user.tags.includes(tag));
      },
    }),
    {
      name: 'crm-storage',
      // 选择性持久化，排除大型集合
      partialize: (state) => ({
        availableCustomTags: state.availableCustomTags,
        sort: state.sort,
        pagination: {
          pageSize: state.pagination.pageSize,
        },
      }),
    }
  )
);
```
现在，让我创建CRM系统的提供者组件，用于整合Zustand状态：

```typescript jsx:src/app/(center)/dashboard/(pages)/crm/providers.tsx
'use client';

import React, { createContext, useContext } from 'react';

// 创建一个上下文，用于向子组件提供全局服务
export const CrmContext = createContext<{
  isReady: boolean;
}>({
  isReady: false,
});

// 自定义钩子，方便组件访问上下文
export const useCrm = () => useContext(CrmContext);

// 创建提供者组件
const CrmProvider = ({ children }: { children: React.ReactNode }) => {
  // 这里可以放置全局服务初始化的逻辑
  const isReady = true;

  return (
    <CrmContext.Provider value={{
      isReady,
    }}>
      {children}
    </CrmContext.Provider>
  );
};

export default CrmProvider;
```
现在，创建主要的CRM布局组件：

```typescript jsx:src/app/(center)/dashboard/(pages)/crm/_components/CrmLayout.tsx
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
```
让我创建用户统计区块：

```typescript jsx:src/app/(center)/dashboard/(pages)/crm/_components/sections/UserStats.tsx
'use client';

import React, { useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useCrmStore, UserTag } from '../../store/useCrmStore';
import { UserCheck, CreditCard, UserPlus, UserMinus, DollarSign } from 'lucide-react';

const UserStats: React.FC = () => {
  const { users, getUsersByTag } = useCrmStore();
  
  // 计算各类用户统计
  const stats = useMemo(() => {
    const now = new Date();
    
    // 获取各类用户
    const activeUsers = getUsersByTag('active');
    const premiumUsers = getUsersByTag('premium');
    const newUsers = getUsersByTag('new');
    const inactiveUsers = getUsersByTag('inactive');
    const highValueUsers = getUsersByTag('highValue');
    
    // 计算百分比
    const totalUsers = users.length;
    const activePercent = totalUsers > 0 ? (activeUsers.length / totalUsers) * 100 : 0;
    const premiumPercent = totalUsers > 0 ? (premiumUsers.length / totalUsers) * 100 : 0;
    const newPercent = totalUsers > 0 ? (newUsers.length / totalUsers) * 100 : 0;
    const inactivePercent = totalUsers > 0 ? (inactiveUsers.length / totalUsers) * 100 : 0;
    const highValuePercent = totalUsers > 0 ? (highValueUsers.length / totalUsers) * 100 : 0;
    
    return {
      total: totalUsers,
      active: {
        count: activeUsers.length,
        percent: activePercent.toFixed(1),
      },
      premium: {
        count: premiumUsers.length,
        percent: premiumPercent.toFixed(1),
      },
      new: {
        count: newUsers.length,
        percent: newPercent.toFixed(1),
      },
      inactive: {
        count: inactiveUsers.length,
        percent: inactivePercent.toFixed(1),
      },
      highValue: {
        count: highValueUsers.length,
        percent: highValuePercent.toFixed(1),
      },
    };
  }, [users, getUsersByTag]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full mr-4">
              <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">活跃用户</p>
              <div className="flex items-baseline gap-1">
                <h4 className="text-2xl font-bold">{stats.active.count}</h4>
                <span className="text-sm text-muted-foreground">
                  {stats.active.percent}%
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="bg-green-500 h-full" 
              style={{ width: `${stats.active.percent}%` }}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-full mr-4">
              <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">付费会员</p>
              <div className="flex items-baseline gap-1">
                <h4 className="text-2xl font-bold">{stats.premium.count}</h4>
                <span className="text-sm text-muted-foreground">
                  {stats.premium.percent}%
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="bg-purple-500 h-full" 
              style={{ width: `${stats.premium.percent}%` }}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full mr-4">
              <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">新注册用户</p>
              <div className="flex items-baseline gap-1">
                <h4 className="text-2xl font-bold">{stats.new.count}</h4>
                <span className="text-sm text-muted-foreground">
                  {stats.new.percent}%
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 h-full" 
              style={{ width: `${stats.new.percent}%` }}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded-full mr-4">
              <UserMinus className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">沉睡用户</p>
              <div className="flex items-baseline gap-1">
                <h4 className="text-2xl font-bold">{stats.inactive.count}</h4>
                <span className="text-sm text-muted-foreground">
                  {stats.inactive.percent}%
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="bg-amber-500 h-full" 
              style={{ width: `${stats.inactive.percent}%` }}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <div className="bg-emerald-100 dark:bg-emerald-900/20 p-2 rounded-full mr-4">
              <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">高价值用户</p>
              <div className="flex items-baseline gap-1">
                <h4 className="text-2xl font-bold">{stats.highValue.count}</h4>
                <span className="text-sm text-muted-foreground">
                  {stats.highValue.percent}%
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full" 
              style={{ width: `${stats.highValue.percent}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStats;
```
接下来创建用户表格组件：

```typescript jsx:src/app/(center)/dashboard/(pages)/crm/_components/sections/UsersTable.tsx
'use client';

import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  MoreHorizontal, 
  Mail, 
  Trash2, 
  Edit, 
  Tag, 
  ChevronsLeft, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsRight
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { User, PaginationParams, useCrmStore } from '../../store/useCrmStore';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// 用户标签颜色
const tagColorMap: Record<string, string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  premium: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  inactive: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  highValue: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  lead: "bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-400",
};

// 用户标签中文名称
const tagNameMap: Record<string, string> = {
  active: "活跃",
  premium: "付费",
  new: "新用户",
  inactive: "沉睡",
  highValue: "高价值",
  lead: "潜在",
};

// 用户来源中文名称
const sourceNameMap: Record<string, string> = {
  form: "表单",
  import: "导入",
  webhook: "Webhook",
  manual: "手动",
};

interface UsersTableProps {
  users: User[];
  pagination: PaginationParams;
  onPageChange: (page: number) => void;
  onUserSelect: (userId: string) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ 
  users,
  pagination,
  onPageChange,
  onUserSelect
}) => {
  const { deleteUser } = useCrmStore();
  
  // 计算当前页显示的用户
  const startIndex = (pagination.page - 1) * pagination.pageSize;
  const endIndex = Math.min(startIndex + pagination.pageSize, users.length);
  const displayedUsers = users.slice(startIndex, endIndex);
  
  // 处理分页
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      onPageChange(newPage);
    }
  };
  
  // 获取用户头像
  const getUserAvatar = (user: User) => {
    const initials = user.fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
    
    return (
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.avatar} alt={user.fullName} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
    );
  };
  
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[300px]">用户信息</TableHead>
            <TableHead>标签</TableHead>
            <TableHead>来源</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead>最后活动</TableHead>
            <TableHead>消费金额</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                没有找到匹配的用户
              </TableCell>
            </TableRow>
          ) : (
            displayedUsers.map((user) => (
              <TableRow 
                key={user.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onUserSelect(user.id)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    {getUserAvatar(user)}
                    <div>
                      <div className="font-medium">{user.fullName}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                      {user.company && (
                        <div className="text-xs text-muted-foreground">{user.company}</div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className={tagColorMap[tag] || ""}
                      >
                        {tagNameMap[tag] || tag}
                      </Badge>
                    ))}
                    {user.customTags?.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                    {sourceNameMap[user.source] || user.source}
                  </Badge>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-sm">
                          {formatDistanceToNow(new Date(user.createdAt), { 
                            addSuffix: true,
                            locale: zhCN
                          })}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {format(new Date(user.createdAt), 'yyyy年MM月dd日 HH:mm', {
                          locale: zhCN
                        })}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-sm">
                          {formatDistanceToNow(new Date(user.lastLoginAt), { 
                            addSuffix: true,
                            locale: zhCN
                          })}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {format(new Date(user.lastLoginAt), 'yyyy年MM月dd日 HH:mm', {
                          locale: zhCN
                        })}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium">
                    ¥{user.totalSpent.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>操作</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `mailto:${user.email}`;
                      }}>
                        <Mail className="h-4 w-4 mr-2" />
                        发送邮件
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onUserSelect(user.id);
                      }}>
                        <Edit className="h-4 w-4 mr-2" />
                        编辑用户
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        // 这里可以打开标签管理对话框
                      }}>
                        <Tag className="h-4 w-4 mr-2" />
                        管理标签
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`确定要删除用户"${user.fullName}"吗？`)) {
                            deleteUser(user.id);
                          }
                        }}
                        className="text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        删除用户
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* 分页控制 */}
      {users.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2 border-t">
          <div className="text-sm text-muted-foreground">
            显示 {startIndex + 1}-{endIndex} 条，共 {users.length} 条
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handlePageChange(1)}
              disabled={pagination.page <= 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="mx-2 text-sm">
              {pagination.page} / {pagination.totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={pagination.page >= pagination.totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
```
创建用户筛选组件：

```typescript jsx:src/app/(center)/dashboard/(pages)/crm/_components/sections/UserFilters.tsx
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
                      initialFocus
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
                      initialFocus
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
```
创建用户详情侧边栏：

```typescript jsx:src/app/(center)/dashboard/(pages)/crm/_components/sidebars/UserDetailsSidebar.tsx
'use client';

import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow, format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Edit2, Save, User, Mail, Phone, Briefcase, Tag, Clock, DollarSign, Calendar } from 'lucide-react';
import { User as UserType, useCrmStore } from '../../store/useCrmStore';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// 用户标签颜色
const tagColorMap: Record<string, string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  premium: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  inactive: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  highValue: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  lead: "bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-400",
};

// 用户标签中文名称
const tagNameMap: Record<string, string> = {
  active: "活跃",
  premium: "付费",
  new: "新用户",
  inactive: "沉睡",
  highValue: "高价值",
  lead: "潜在",
};

// 用户来源中文名称
const sourceNameMap: Record<string, string> = {
  form: "表单",
  import: "导入",
  webhook: "Webhook",
  manual: "手动",
};

interface UserDetailsSidebarProps {
  open: boolean;
  onClose: () => void;
  user: UserType | null;
}

const UserDetailsSidebar: React.FC<UserDetailsSidebarProps> = ({
  open,
  onClose,
  user
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<UserType>>({});
  const { updateUser } = useCrmStore();
  
  // 如果没有用户数据，返回null
  if (!user) {
    return null;
  }
  
  // 处理编辑模式切换
  const handleEditToggle = () => {
    if (isEditing) {
      // 保存更改
      updateUser(user.id, editedUser);
      setIsEditing(false);
      setEditedUser({});
    } else {
      // 进入编辑模式
      setIsEditing(true);
      setEditedUser({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        company: user.company,
        position: user.position,
        notes: user.notes,
      });
    }
  };
  
  // 处理输入变化
  const handleInputChange = (field: string, value: string) => {
    setEditedUser({
      ...editedUser,
      [field]: value
    });
  };
  
  // 获取用户头像
  const getUserAvatar = () => {
    const initials = user.fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
    
    return (
      <Avatar className="h-20 w-20">
        <AvatarImage src={user.avatar} alt={user.fullName} />
        <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
      </Avatar>
    );
  };
  
  return (
    <Sheet open={open} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>客户详情</SheetTitle>
          <SheetDescription>
            查看和编辑客户信息
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-8">
          {/* 用户基本信息区域 */}
          <div className="flex flex-col items-center text-center py-4">
            {getUserAvatar()}
            
            {isEditing ? (
              <div className="mt-4 w-full space-y-2">
                <Input
                  value={editedUser.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="text-center font-bold text-lg"
                />
                <Input
                  value={editedUser.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="text-center text-sm text-muted-foreground"
                />
              </div>
            ) : (
              <div className="mt-4">
                <h3 className="font-bold text-lg">{user.fullName}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            )}
            
            <div className="flex flex-wrap justify-center gap-1 mt-3">
              {user.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className={tagColorMap[tag] || ""}
                >
                  {tagNameMap[tag] || tag}
                </Badge>
              ))}
              {user.customTags?.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* 编辑按钮 */}
          <div className="flex justify-end">
            <Button onClick={handleEditToggle} className="gap-2">
              {isEditing ? (
                <>
                  <Save className="h-4 w-4" />
                  保存更改
                </>
              ) : (
                <>
                  <Edit2 className="h-4 w-4" />
                  编辑信息
                </>
              )}
            </Button>
          </div>
          
          {/* 用户详细信息 */}
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">基本信息</TabsTrigger>
              <TabsTrigger value="activity">活动记录</TabsTrigger>
              <TabsTrigger value="notes">备注</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <Label>电话</Label>
                  </div>
                  {isEditing ? (
                    <Input
                      value={editedUser.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  ) : (
                    <div>{user.phone || '未设置'}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <Label>公司</Label>
                  </div>
                  {isEditing ? (
                    <Input
                      value={editedUser.company || ''}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                    />
                  ) : (
                    <div>{user.company || '未设置'}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <Label>职位</Label>
                  </div>
                  {isEditing ? (
                    <Input
                      value={editedUser.position || ''}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                    />
                  ) : (
                    <div>{user.position || '未设置'}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <Label>累计消费</Label>
                  </div>
                  <div className="text-lg font-medium">
                    ¥{user.totalSpent.toLocaleString()}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    <Label>数据来源</Label>
                  </div>
                  <div>
                    <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                      {sourceNameMap[user.source] || user.source}
                    </Badge>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="activity" className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <Label>注册时间</Label>
                  </div>
                  <div>
                    {format(new Date(user.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
                    <div className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true, locale: zhCN })}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <Label>最后活动</Label>
                  </div>
                  <div>
                    {format(new Date(user.lastLoginAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
                    <div className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(user.lastLoginAt), { addSuffix: true, locale: zhCN })}
                    </div>
                  </div>
                </div>
                
                {/* 这里可以添加更多的活动记录，如邮件打开记录等 */}
                <div className="rounded-md border p-4">
                  <div className="text-muted-foreground text-center">
                    暂无详细活动记录
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notes" className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label>客户备注</Label>
                {isEditing ? (
                  <Textarea
                    value={editedUser.notes || ''}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="添加客户备注..."
                    className="min-h-[150px]"
                  />
                ) : (
                  <div className="rounded-md border p-4 min-h-[150px]">
                    {user.notes || '暂无备注'}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserDetailsSidebar;
```
创建添加用户对话框：

```typescript jsx:src/app/(center)/dashboard/(pages)/crm/_components/dialogs/AddUserDialog.tsx
'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCrmStore, UserSource, UserStatus } from '../../store/useCrmStore';
import { BadgePlus, BadgeCheck, User, Mail, Phone, Briefcase, Tag, MessageSquare } from 'lucide-react';

// 用户来源选项
const sourceOptions: { value: UserSource; label: string }[] = [
  { value: 'form', label: '表单' },
  { value: 'import', label: '导入' },
  { value: 'webhook', label: 'Webhook' },
  { value: 'manual', label: '手动' },
];

// 用户状态选项
const statusOptions: { value: UserStatus; label: string }[] = [
  { value: 'active', label: '正常' },
  { value: 'inactive', label: '不活跃' },
  { value: 'pending', label: '待激活' },
  { value: 'blocked', label: '已封禁' },
];

const AddUserDialog: React.FC = () => {
  const { isAddingUser, setIsAddingUser, addUser } = useCrmStore();
  
  // 初始表单状态
  const initialFormState = {
    fullName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    source: 'manual' as UserSource,
    status: 'active' as UserStatus,
    notes: '',
    totalSpent: 0,
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // 处理输入变化
  const handleInputChange = (field: string, value: string | number) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // 清除相关字段的错误
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };
  
  // 验证表单
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = '请输入姓名';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }
    
    if (formData.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone)) {
      newErrors.phone = '请输入有效的电话号码';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 提交表单
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    
    // 创建用户对象
    const newUser = {
      ...formData,
      tags: [],
      lastLoginAt: new Date(),
    };
    
    // 调用添加用户方法
    addUser(newUser);
    
    // 重置表单和关闭对话框
    setFormData(initialFormState);
    setIsAddingUser(false);
  };
  
  // 关闭对话框
  const handleClose = () => {
    setFormData(initialFormState);
    setErrors({});
    setIsAddingUser(false);
  };
  
  return (
    <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>添加新客户</DialogTitle>
          <DialogDescription>
            手动添加新客户信息
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="fullName">姓名</Label>
            </div>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="输入客户姓名"
              className={errors.fullName ? "border-red-500" : ""}
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="email">邮箱</Label>
            </div>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="输入客户邮箱"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="phone">电话</Label>
            </div>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="输入客户电话"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="company">公司</Label>
              </div>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="输入公司名称"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="position">职位</Label>
              </div>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="输入职位"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="source">数据来源</Label>
              </div>
              <Select 
                value={formData.source} 
                onValueChange={(value) => handleInputChange('source', value as UserSource)}
              >
                <SelectTrigger id="source">
                  <SelectValue placeholder="选择来源" />
                </SelectTrigger>
                <SelectContent>
                  {sourceOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BadgePlus className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="status">状态</Label>
              </div>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleInputChange('status', value as UserStatus)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="notes">备注</Label>
            </div>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="添加客户备注..."
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>取消</Button>
          <Button onClick={handleSubmit}>添加客户</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
```
创建导入用户对话框：

```typescript jsx:src/app/(center)/dashboard/(pages)/crm/_components/dialogs/AddUserDialog.tsx
'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCrmStore, UserSource, UserStatus } from '../../store/useCrmStore';
import { BadgePlus, BadgeCheck, User, Mail, Phone, Briefcase, Tag, MessageSquare } from 'lucide-react';

// 用户来源选项
const sourceOptions: { value: UserSource; label: string }[] = [
  { value: 'form', label: '表单' },
  { value: 'import', label: '导入' },
  { value: 'webhook', label: 'Webhook' },
  { value: 'manual', label: '手动' },
];

// 用户状态选项
const statusOptions: { value: UserStatus; label: string }[] = [
  { value: 'active', label: '正常' },
  { value: 'inactive', label: '不活跃' },
  { value: 'pending', label: '待激活' },
  { value: 'blocked', label: '已封禁' },
];

const AddUserDialog: React.FC = () => {
  const { isAddingUser, setIsAddingUser, addUser } = useCrmStore();
  
  // 初始表单状态
  const initialFormState = {
    fullName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    source: 'manual' as UserSource,
    status: 'active' as UserStatus,
    notes: '',
    totalSpent: 0,
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // 处理输入变化
  const handleInputChange = (field: string, value: string | number) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // 清除相关字段的错误
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };
  
  // 验证表单
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = '请输入姓名';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }
    
    if (formData.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone)) {
      newErrors.phone = '请输入有效的电话号码';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 提交表单
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    
    // 创建用户对象
    const newUser = {
      ...formData,
      tags: [],
      lastLoginAt: new Date(),
    };
    
    // 调用添加用户方法
    addUser(newUser);
    
    // 重置表单和关闭对话框
    setFormData(initialFormState);
    setIsAddingUser(false);
  };
  
  // 关闭对话框
  const handleClose = () => {
    setFormData(initialFormState);
    setErrors({});
    setIsAddingUser(false);
  };
  
  return (
    <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>添加新客户</DialogTitle>
          <DialogDescription>
            手动添加新客户信息
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="fullName">姓名</Label>
            </div>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="输入客户姓名"
              className={errors.fullName ? "border-red-500" : ""}
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="email">邮箱</Label>
            </div>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="输入客户邮箱"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="phone">电话</Label>
            </div>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="输入客户电话"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="company">公司</Label>
              </div>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="输入公司名称"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="position">职位</Label>
              </div>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="输入职位"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="source">数据来源</Label>
              </div>
              <Select 
                value={formData.source} 
                onValueChange={(value) => handleInputChange('source', value as UserSource)}
              >
                <SelectTrigger id="source">
                  <SelectValue placeholder="选择来源" />
                </SelectTrigger>
                <SelectContent>
                  {sourceOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BadgePlus className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="status">状态</Label>
              </div>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleInputChange('status', value as UserStatus)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="notes">备注</Label>
            </div>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="添加客户备注..."
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>取消</Button>
          <Button onClick={handleSubmit}>添加客户</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
```

```typescript jsx:src/app/(center)/dashboard/(pages)/crm/_components/dialogs/ImportUsersDialog.tsx
'use client';

import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCrmStore, User, UserSource } from '../../store/useCrmStore';
import { Upload, FileText, Database, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// 示例数据格式
const SAMPLE_CSV = `fullName,email,phone,company,position,source,status,totalSpent
John Doe,john@example.com,+1234567890,Acme Inc,CEO,import,active,1500
Jane Smith,jane@example.com,+1987654321,Globex,CTO,import,active,850
`;

// 示例JSON数据格式
const SAMPLE_JSON = `[
  {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Acme Inc",
    "position": "CEO",
    "source": "import",
    "status": "active",
    "totalSpent": 1500
  },
  {
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1987654321",
    "company": "Globex",
    "position": "CTO",
    "source": "import",
    "status": "active",
    "totalSpent": 850
  }
]`;

const ImportUsersDialog: React.FC = () => {
  const { isImportingUsers, setIsImportingUsers, importUsers } = useCrmStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<string>('file');
  const [csvData, setCsvData] = useState<string>('');
  const [jsonData, setJsonData] = useState<string>('');
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // 检查文件类型
    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (fileType !== 'csv' && fileType !== 'json') {
      setError('请上传CSV或JSON格式的文件');
      return;
    }
    
    // 模拟上传进度
    setIsUploading(true);
    setUploadProgress(0);
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        
        if (fileType === 'csv') {
          setCsvData(content);
          setActiveTab('csv');
          parseCSV(content);
        } else {
          setJsonData(content);
          setActiveTab('json');
          parseJSON(content);
        }
        
        // 模拟上传完成
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(100);
        }, 1000);
      } catch (err) {
        setError('文件解析失败，请检查文件格式');
        setIsUploading(false);
      }
    };
    
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
      }
    };
    
    reader.onerror = () => {
      setError('文件读取失败');
      setIsUploading(false);
    };
    
    reader.readAsText(file);
  };
  
  // 解析CSV数据
  const parseCSV = (data: string) => {
    try {
      const lines = data.trim().split('\n');
      const headers = lines[0].split(',');
      
      const result = [];
      
      for (let i = 1; i < lines.length; i++) {
        const obj: Record<string, any> = {};
        const currentLine = lines[i].split(',');
        
        for (let j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentLine[j];
        }
        
        result.push(obj);
      }
      
      setPreviewData(result);
      setError(null);
    } catch (err) {
      setError('CSV解析失败，请检查格式');
      setPreviewData([]);
    }
  };
  
  // 解析JSON数据
  const parseJSON = (data: string) => {
    try {
      const parsedData = JSON.parse(data);
      if (Array.isArray(parsedData)) {
        setPreviewData(parsedData);
        setError(null);
      } else {
        setError('JSON数据必须是数组格式');
        setPreviewData([]);
      }
    } catch (err) {
      setError('JSON解析失败，请检查格式');
      setPreviewData([]);
    }
  };
  
  // 处理CSV文本输入变化
  const handleCsvInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCsvData(value);
    parseCSV(value);
  };
  
  // 处理JSON文本输入变化
  const handleJsonInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonData(value);
    parseJSON(value);
  };
  
  // 处理导入
  const handleImport = () => {
    try {
      if (previewData.length === 0) {
        setError('没有可导入的数据');
        return;
      }
      
      // 处理数据，确保格式正确
      const processedData = previewData.map(item => {
        const user: Partial<User> = {
          fullName: String(item.fullName || '未命名用户'),
          email: String(item.email || `unknown-${Math.random().toString(36).substring(2, 9)}@example.com`),
          phone: item.phone ? String(item.phone) : undefined,
          company: item.company ? String(item.company) : undefined,
          position: item.position ? String(item.position) : undefined,
          source: (item.source as UserSource) || 'import',
          status: item.status || 'active',
          tags: [], 
          totalSpent: Number(item.totalSpent || 0),
          lastLoginAt: new Date(), 
        };
        
        return user;
      });
      
      // 导入用户
      importUsers(processedData as any);
      
      // 显示成功
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsImportingUsers(false);
        // 重置状态
        setCsvData('');
        setJsonData('');
        setPreviewData([]);
        setActiveTab('file');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 2000);
    } catch (err) {
      setError('导入失败，请检查数据格式');
    }
  };
  
  // 关闭对话框
  const handleClose = () => {
    setIsImportingUsers(false);
    setCsvData('');
    setJsonData('');
    setPreviewData([]);
    setError(null);
    setSuccess(false);
    setActiveTab('file');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <Dialog open={isImportingUsers} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>导入用户</DialogTitle>
          <DialogDescription>
            通过上传CSV或JSON文件批量导入用户数据
          </DialogDescription>
        </DialogHeader>
        
        {success ? (
          <div className="py-8">
            <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle>导入成功</AlertTitle>
              <AlertDescription>
                已成功导入 {previewData.length} 位用户
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <Tabs defaultValue="file" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="file">文件上传</TabsTrigger>
              <TabsTrigger value="csv">CSV</TabsTrigger>
              <TabsTrigger value="json">JSON</TabsTrigger>
            </TabsList>
            
            <TabsContent value="file" className="pt-4">
              <div className="py-6">
                <div className="border-2 border-dashed rounded-md p-8 text-center">
                  <Upload className="h-8 w-8 mb-2 mx-auto text-muted-foreground" />
                  <div className="text-lg mb-2">上传CSV或JSON文件</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    拖放文件到此处或点击选择文件
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button onClick={() => fileInputRef.current?.click()}>
                    选择文件
                  </Button>
                </div>
                
                {isUploading && (
                  <div className="mt-4">
                    <div className="flex justify-between mb-1">
                      <Label>上传进度</Label>
                      <span className="text-sm">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="csv" className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <Label>CSV数据 (一行一条记录，逗号分隔)</Label>
                </div>
                <Textarea
                  value={csvData}
                  onChange={handleCsvInputChange}
                  placeholder={SAMPLE_CSV}
                  className="min-h-[200px] font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  必须包含 fullName、email 字段，其他字段可选
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="json" className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <Label>JSON数据 (用户对象数组)</Label>
                </div>
                <Textarea
                  value={jsonData}
                  onChange={handleJsonInputChange}
                  placeholder={SAMPLE_JSON}
                  className="min-h-[200px] font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  JSON必须是对象数组格式，每个对象代表一个用户
                </p>
              </div>
            </TabsContent>
            
            {/* 数据预览 */}
            {previewData.length > 0 && (
              <div className="mt-4 border rounded-md p-4">
                <h3 className="text-sm font-medium mb-2">预览数据 ({previewData.length} 条记录)</h3>
                <div className="max-h-[200px] overflow-auto">
                  <pre className="text-xs text-muted-foreground">
                    {JSON.stringify(previewData.slice(0, 3), null, 2)}
                    {previewData.length > 3 && '\n...'}
                  </pre>
                </div>
              </div>
            )}
            
            {/* 错误提示 */}
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>发生错误</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </Tabs>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            取消
          </Button>
          <Button 
            onClick={handleImport}
            disabled={isUploading || previewData.length === 0 || success}
          >
            导入 {previewData.length} 位用户
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportUsersDialog;
```
最后，更新侧边栏导航以包含CRM链接：

Ran tool

Ran tool

Ran tool

Read file: src/app/(center)/dashboard/_components/Sidebar.tsx

Read file: src/lib/data/constant.ts

Read file: src/components/icons/crm.tsx

```typescript:src/lib/data/constant.ts
// 替换menuOptions数组，添加CRM选项
export const menuOptions = [
  { name: "Home", Component: Home, href: "/dashboard" },
  { name: "Template", Component: Category, href: "/dashboard/template" },
  { name: "Notification", Component: User, href: "/dashboard/notification" },
  { name: "Security", Component: User, href: "/dashboard/security" },
  { name: "Team", Component: Chat, href: "/dashboard/team" },
  { name: "Event", Component: Envelope, href: "/dashboard/event" },
  { name: "CRM", Component: CRM, href: "/dashboard/crm" },
  { name: "Data", Component: CRM, href: "/dashboard/data" },
  { name: "Billing", Component: Payment, href: "/dashboard/billing" },
  { name: "Settings", Component: Settings, href: "/dashboard/settings" },
];
```
# 轻量级CRM系统设计与实现

我已经为您创建了一个完整的轻量级CRM系统，集成到现有的邮件营销平台中。这个系统使用Zustand进行全局状态管理，专注于用户信息统计、分类和活跃度标记，以支持营销活动的受众选择。

## 系统功能

### 1. 用户数据管理

- **多种数据来源**：支持通过表单、webhook或手动添加用户信息
- **批量导入**：支持CSV或JSON格式的批量用户导入
- **数据完整性**：完整记录用户信息、活动历史和消费记录
- **分页加载**：大量数据的高效渲染和管理

### 2. 智能用户分类

系统会根据不同条件自动对用户进行分类：

- **活跃用户**：最近30天内有活动的用户
- **付费会员**：已订阅付费服务的用户
- **新注册用户**：最近7天注册的新用户
- **沉睡用户**：超过60天未活动的用户
- **高价值用户**：累计消费超过1000元的用户

### 3. 高级筛选功能

- **多维度筛选**：支持按标签、状态、注册日期、消费金额等筛选
- **搜索功能**：支持全文搜索用户信息
- **组合筛选**：可组合多种筛选条件精准定位目标用户群体

### 4. 用户详情管理

- **完整用户资料**：展示用户的详细信息和历史记录
- **标签管理**：可为用户添加或移除多种标签
- **活跃度追踪**：清晰展示用户最近的活动情况

## 技术亮点

1. **Zustand状态管理**：使用Zustand实现高效的全局状态管理
2. **响应式设计**：适配各种屏幕尺寸的现代化界面
3. **数据分析展示**：通过直观的图表展示用户分布情况
4. **高性能列表**：采用虚拟滚动和分页技术处理大量数据
5. **实时过滤**：用户操作时实时过滤和更新数据
6. **模块化设计**：组件高度解耦，易于维护和扩展

## 系统集成

CRM系统与现有的事件管理系统无缝集成，可以轻松地选择特定用户群体作为邮件活动的接收者，提高邮件营销的精准度和效率。

## 使用场景

1. **定向营销**：针对特定用户群体发送定制化邮件
2. **客户召回**：识别并激活沉睡用户
3. **会员推广**：向高活跃度非付费用户推广会员权益
4. **数据分析**：分析不同用户群体的行为和需求特点
5. **客户服务**：快速查找用户信息，提供精准服务

这个CRM系统为您的营销邮件平台提供了强大的用户管理和细分能力，帮助您更有效地开展邮件营销活动。
