import { 
  QueryClient, 
  DefaultOptions
} from '@tanstack/react-query';

// 全局默认选项
const defaultOptions: DefaultOptions = {
  queries: {
    // 默认缓存时间为5分钟
    staleTime: 5 * 60 * 1000,
    // 默认启用重试，最多重试3次
    retry: 3,
    // 默认启用refetchOnWindowFocus，当用户回到窗口时重新获取数据
    refetchOnWindowFocus: true,
    // 默认启用refetchOnReconnect，当网络重新连接时重新获取数据
    refetchOnReconnect: true,
  },
  mutations: {
    // 默认不重试失败的mutations
    retry: false,
  },
};

// 创建客户端实例
export const queryClient = new QueryClient({
  defaultOptions,
}); 