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