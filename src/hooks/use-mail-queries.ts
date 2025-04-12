import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EmailMessage } from "@/lib/types/nylas-types";
import enhancedMailService, {
  MailQueryOptions,
} from "@/lib/services/enhanced-mail-service";

/**
 * 邮件API请求错误
 */
export class MailApiError extends Error {
  status: number;

  constructor(message: string, status: number = 500) {
    super(message);
    this.name = "MailApiError";
    this.status = status;
  }
}

/**
 * 邮件查询选项
 */
export interface EmailQueryOptions {
  limit?: number;
  offset?: number;
  unread?: boolean;
}

//=========================================================
// 基础API邮件查询功能
//=========================================================

/**
 * 获取邮件列表
 */
export async function fetchEmails(
  options: EmailQueryOptions = {}
): Promise<EmailMessage[]> {
  const { limit = 20, offset = 0, unread } = options;

  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });

  if (unread) {
    queryParams.append("unread", "true");
  }

  const response = await fetch(`/api/mail/inbox?${queryParams.toString()}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new MailApiError(
      errorData?.message || `获取邮件失败: ${response.status}`,
      response.status
    );
  }

  const data = await response.json();

  // 格式化邮件数据
  if (data.data && Array.isArray(data.data)) {
    return data.data.map((message: any) => ({
      id: message.id,
      subject: message.subject || "(无主题)",
      snippet: message.snippet || "",
      body: message.body,
      sender: {
        name: message.from?.[0]?.name || "未知",
        email: message.from?.[0]?.email || "unknown@email.com",
      },
      recipients: (message.to || []).map((to: any) => ({
        name: to.name || "未知",
        email: to.email || "",
      })),
      date: new Date(message.date * 1000),
      unread: message.unread || false,
      hasAttachments: !!message.attachments?.length,
      attachments: message.attachments?.map((att: any) => ({
        id: att.id,
        filename: att.filename,
        contentType: att.content_type,
        size: att.size,
        contentId: att.content_id,
      })),
    }));
  }

  return [];
}

/**
 * 获取单个邮件详情
 */
export async function fetchEmailDetail(
  emailId: string
): Promise<EmailMessage | null> {
  if (!emailId) {
    throw new MailApiError("邮件ID不能为空", 400);
  }

  const response = await fetch(`/api/mail/message/${emailId}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new MailApiError(
      errorData?.message || `获取邮件详情失败: ${response.status}`,
      response.status
    );
  }

  const message = await response.json();

  // 格式化邮件数据
  return {
    id: message.id,
    subject: message.subject || "(无主题)",
    snippet: message.snippet || "",
    body: message.body,
    sender: {
      name: message.from?.[0]?.name || "未知",
      email: message.from?.[0]?.email || "unknown@email.com",
    },
    recipients: (message.to || []).map((to: any) => ({
      name: to.name || "未知",
      email: to.email || "",
    })),
    date: new Date(message.date * 1000),
    unread: message.unread || false,
    hasAttachments: !!message.attachments?.length,
    attachments: message.attachments?.map((att: any) => ({
      id: att.id,
      filename: att.filename,
      contentType: att.content_type,
      size: att.size,
      contentId: att.content_id,
    })),
  };
}

//=========================================================
// 增强版邮件查询功能 - 基于增强服务的实现
//=========================================================

/**
 * 获取邮件列表 (增强版)
 */
export async function fetchEnhancedEmails(
  options: MailQueryOptions = {}
): Promise<EmailMessage[]> {
  try {
    return await enhancedMailService.getEmails(options);
  } catch (error) {
    console.error("获取邮件列表失败:", error);
    throw new MailApiError(
      error instanceof Error ? error.message : "获取邮件失败",
      500
    );
  }
}

/**
 * 获取单封邮件详情 (增强版)
 */
export async function fetchEnhancedEmailDetail(
  emailId: string | null,
  forceRefresh: boolean = false
): Promise<EmailMessage | null> {
  if (!emailId) {
    throw new MailApiError("邮件ID不能为空", 400);
  }

  try {
    return await enhancedMailService.getEmail(emailId, forceRefresh);
  } catch (error) {
    console.error(`获取邮件 ${emailId} 详情失败:`, error);
    throw new MailApiError(
      error instanceof Error ? error.message : "获取邮件详情失败",
      500
    );
  }
}

//=========================================================
// React Query Hooks - 基础版
//=========================================================

/**
 * 邮件列表React Query Hook
 */
export function useEmails(
  options: EmailQueryOptions = {},
  queryOptions: { initialData?: EmailMessage[] } = {}
) {
  return useQuery({
    queryKey: ["emails", options],
    queryFn: () => fetchEmails(options),
    staleTime: 1000 * 60 * 5, // 增加到5分钟内不重新获取
    gcTime: 1000 * 60 * 10, // 缓存10分钟
    retry: 2, // 失败时最多重试2次
    refetchOnMount: false, // 组件挂载时不自动重新获取
    refetchOnWindowFocus: false, // 窗口获取焦点时不自动重新获取
    ...queryOptions, // 传递额外的查询选项，如initialData
  });
}

/**
 * 邮件详情React Query Hook
 */
export function useEmailDetail(emailId: string | null) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["email", emailId],
    queryFn: () => {
      // 1. 首先尝试从缓存中获取详细信息
      const cachedData = queryClient.getQueryData<EmailMessage[]>(["emails"]);
      if (cachedData) {
        const emailInCache = cachedData.find((email) => email.id === emailId);
        if (emailInCache && emailInCache.body) {
          // 如果缓存中已有完整数据（包含正文），直接返回
          console.log(`[Query] 从缓存获取邮件详情: ${emailId}`);
          return emailInCache;
        }
      }

      // 2. 尝试从邮件查询缓存中查找所有匹配的查询键
      const emailQueries = queryClient.getQueriesData<EmailMessage[]>({
        queryKey: ["emails"],
      });

      // 遍历所有email查询结果
      for (const [, data] of emailQueries) {
        if (data) {
          const emailInQueries = data.find((email) => email.id === emailId);
          if (emailInQueries && emailInQueries.body) {
            console.log(`[Query] 从查询缓存获取邮件详情: ${emailId}`);
            return emailInQueries;
          }
        }
      }

      // 3. 如果缓存中没有找到或没有完整数据，则发起API请求
      console.log(`[Query] 通过API获取邮件详情: ${emailId}`);
      return fetchEmailDetail(emailId as string);
    },
    enabled: !!emailId, // 只有当emailId存在时才执行查询
    staleTime: 1000 * 60 * 5, // 5分钟内不重新获取
    retry: 2, // 失败时最多重试2次
  });
}

/**
 * 标记邮件为已读的Mutation
 */
export function useMarkEmailAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (emailId: string) => {
      // 这里可以添加真实的标记已读API调用
      // const response = await fetch(`/api/mail/message/${emailId}/read`, { method: 'POST' });
      // if (!response.ok) throw new MailApiError('标记邮件已读失败', response.status);
      // return response.json();

      // 暂时只返回成功
      return { success: true };
    },
    onSuccess: (_, emailId) => {
      // 标记成功后，更新缓存中的邮件信息
      queryClient.setQueryData(
        ["email", emailId],
        (oldData: EmailMessage | undefined) => {
          if (!oldData) return oldData;
          return { ...oldData, unread: false };
        }
      );

      // 同时更新邮件列表缓存
      queryClient.invalidateQueries({ queryKey: ["emails"] });
    },
  });
}

/**
 * 刷新邮件列表的Mutation
 */
export function useRefreshEmails() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // 这是一个虚拟操作，实际上不需要API调用
      return { success: true };
    },
    onSuccess: () => {
      // 使所有邮件查询失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: ["emails"] });
    },
  });
}

//=========================================================
// React Query Hooks - 增强版
//=========================================================

/**
 * 邮件列表React Query Hook (增强版)
 */
export function useEnhancedEmails(options: MailQueryOptions = {}) {
  return useQuery({
    queryKey: ["enhanced-emails", options],
    queryFn: () => fetchEnhancedEmails(options),
    staleTime: 1000 * 60 * 2, // 2分钟内不重新获取
    retry: 2, // 失败时最多重试2次
  });
}

/**
 * 邮件详情React Query Hook (增强版)
 */
export function useEnhancedEmailDetail(
  emailId: string | null,
  forceRefresh: boolean = false
) {
  return useQuery({
    queryKey: ["enhanced-email", emailId, forceRefresh],
    queryFn: () => fetchEnhancedEmailDetail(emailId, forceRefresh),
    enabled: !!emailId, // 只有当emailId存在时才执行查询
    staleTime: 1000 * 60 * 5, // 5分钟内不重新获取
    retry: 2, // 失败时最多重试2次
  });
}

/**
 * 标记邮件为已读的Mutation (增强版)
 */
export function useEnhancedMarkEmailAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (emailId: string) => {
      const success = await enhancedMailService.markAsRead(emailId);
      if (!success) {
        throw new Error("标记邮件已读失败");
      }
      return { success };
    },
    onSuccess: (_, emailId) => {
      // 标记成功后，更新缓存中的邮件信息
      queryClient.setQueryData(
        ["enhanced-email", emailId],
        (oldData: EmailMessage | undefined) => {
          if (!oldData) return oldData;
          return { ...oldData, unread: false };
        }
      );

      // 同时更新邮件列表缓存
      queryClient.invalidateQueries({ queryKey: ["enhanced-emails"] });
    },
  });
}

/**
 * 标记邮件为未读的Mutation (增强版)
 */
export function useEnhancedMarkEmailAsUnread() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (emailId: string) => {
      const success = await enhancedMailService.markAsUnread(emailId);
      if (!success) {
        throw new Error("标记邮件未读失败");
      }
      return { success };
    },
    onSuccess: (_, emailId) => {
      // 标记成功后，更新缓存中的邮件信息
      queryClient.setQueryData(
        ["enhanced-email", emailId],
        (oldData: EmailMessage | undefined) => {
          if (!oldData) return oldData;
          return { ...oldData, unread: true };
        }
      );

      // 同时更新邮件列表缓存
      queryClient.invalidateQueries({ queryKey: ["enhanced-emails"] });
    },
  });
}

/**
 * 刷新邮件列表的Mutation (增强版)
 */
export function useEnhancedRefreshEmails() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (options: MailQueryOptions = {}) => {
      const success = await enhancedMailService.refreshCache(options);
      if (!success) {
        throw new Error("刷新邮件列表失败");
      }
      return { success };
    },
    onSuccess: () => {
      // 使所有邮件查询失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: ["enhanced-emails"] });
    },
  });
}

/**
 * 清理过期缓存的Mutation (增强版)
 */
export function useEnhancedCleanupCache() {
  return useMutation({
    mutationFn: async () => {
      const count = await enhancedMailService.cleanupCache();
      return { count };
    },
  });
}
