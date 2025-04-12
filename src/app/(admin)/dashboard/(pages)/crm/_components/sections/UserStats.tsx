'use client';

import React, { useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useCrmStore, UserTag } from '../../store/useCrmStore';
import { UserCheck, CreditCard, UserPlus, UserMinus, DollarSign } from 'lucide-react';

const UserStats: React.FC = () => {
  const { users, getUsersByTag } = useCrmStore();
  
  // 计算各类用户统计
  const stats = useMemo(() => {
    // 如果没有用户数据，返回默认值
    if (users.length === 0) {
      return {
        total: 0,
        active: { count: 0, percent: '0.0' },
        premium: { count: 0, percent: '0.0' },
        new: { count: 0, percent: '0.0' },
        inactive: { count: 0, percent: '0.0' },
        highValue: { count: 0, percent: '0.0' },
      };
    }
    
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