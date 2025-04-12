import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EmailMessage } from "@/lib/types/nylas-types";

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

/**
 * 邮件列表React Query Hook
 */
export function useEmails(options: EmailQueryOptions = {}) {
  return useQuery({
    queryKey: ["emails", options],
    queryFn: () => fetchEmails(options),
    staleTime: 1000 * 60 * 2, // 2分钟内不重新获取
    retry: 2, // 失败时最多重试2次
  });
}

/**
 * 邮件详情React Query Hook
 */
export function useEmailDetail(emailId: string | null) {
  return useQuery({
    queryKey: ["email", emailId],
    queryFn: () => fetchEmailDetail(emailId as string),
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
