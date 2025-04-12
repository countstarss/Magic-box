import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EmailMessage } from "@/lib/types/nylas-types";
import enhancedMailService, {
  MailQueryOptions,
} from "@/lib/services/enhanced-mail-service";

/**
 * 邮件API错误
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
 * 获取邮件列表
 */
export async function fetchEmails(
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
 * 获取单封邮件详情
 */
export async function fetchEmailDetail(
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

/**
 * 邮件列表React Query Hook
 */
export function useEmails(options: MailQueryOptions = {}) {
  return useQuery({
    queryKey: ["enhanced-emails", options],
    queryFn: () => fetchEmails(options),
    staleTime: 1000 * 60 * 2, // 2分钟内不重新获取
    retry: 2, // 失败时最多重试2次
  });
}

/**
 * 邮件详情React Query Hook
 */
export function useEmailDetail(
  emailId: string | null,
  forceRefresh: boolean = false
) {
  return useQuery({
    queryKey: ["enhanced-email", emailId, forceRefresh],
    queryFn: () => fetchEmailDetail(emailId, forceRefresh),
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
 * 标记邮件为未读的Mutation
 */
export function useMarkEmailAsUnread() {
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
 * 刷新邮件列表的Mutation
 */
export function useRefreshEmails() {
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
 * 清理过期缓存的Mutation
 */
export function useCleanupCache() {
  return useMutation({
    mutationFn: async () => {
      const count = await enhancedMailService.cleanupCache();
      return { count };
    },
  });
}
