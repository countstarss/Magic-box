'use client';

import { 
  useMutation, 
  useQuery, 
  useQueryClient,
  UseQueryOptions
} from '@tanstack/react-query';
import { 
  mailService, 
  MailFilterParams, 
  PaginatedResponse 
} from '@/lib/api/mail-service';
import { Email } from '@/lib/data';

// 查询键常量
export const MAIL_KEYS = {
  all: ['mails'] as const,
  lists: () => [...MAIL_KEYS.all, 'list'] as const,
  list: (filters: MailFilterParams) => [...MAIL_KEYS.lists(), filters] as const,
  details: () => [...MAIL_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...MAIL_KEYS.details(), id] as const,
};

// 获取邮件列表
export function useMailsQuery(
  params: MailFilterParams = {},
  options?: Omit<UseQueryOptions<PaginatedResponse<Email>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: MAIL_KEYS.list(params),
    queryFn: () => mailService.getMails(params),
    ...options,
  });
}

// 获取单个邮件
export function useMailQuery(
  id: string,
  options?: Omit<UseQueryOptions<Email>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: MAIL_KEYS.detail(id),
    queryFn: () => mailService.getMail(id),
    ...options,
  });
}

// 发送邮件
export function useSendMailMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (mailData: Partial<Email>) => mailService.sendMail(mailData),
    onSuccess: () => {
      // 发送成功后，使所有邮件列表查询失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: MAIL_KEYS.lists() });
    },
  });
}

// 更新邮件
export function useUpdateMailMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Email> }) => 
      mailService.updateMail(id, updates),
    onSuccess: (updatedMail) => {
      // 更新成功后，更新缓存中的邮件数据
      queryClient.setQueryData(MAIL_KEYS.detail(updatedMail.id), updatedMail);
      // 同时使所有列表查询失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: MAIL_KEYS.lists() });
    },
  });
}

// 删除邮件
export function useDeleteMailMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => mailService.deleteMail(id),
    onSuccess: (_, id) => {
      // 删除成功后，从缓存中移除该邮件
      queryClient.removeQueries({ queryKey: MAIL_KEYS.detail(id) });
      // 同时使所有列表查询失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: MAIL_KEYS.lists() });
    },
  });
}

// 将邮件移至垃圾箱
export function useTrashMailMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => mailService.trashMail(id),
    onSuccess: (updatedMail) => {
      // 更新缓存中的邮件数据
      queryClient.setQueryData(MAIL_KEYS.detail(updatedMail.id), updatedMail);
      // 使所有列表查询失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: MAIL_KEYS.lists() });
    },
  });
}

// 将邮件归档
export function useArchiveMailMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => mailService.archiveMail(id),
    onSuccess: (updatedMail) => {
      // 更新缓存中的邮件数据
      queryClient.setQueryData(MAIL_KEYS.detail(updatedMail.id), updatedMail);
      // 使所有列表查询失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: MAIL_KEYS.lists() });
    },
  });
}

// 标记邮件为已读/未读
export function useMarkMailAsReadMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, read }: { id: string; read: boolean }) => 
      mailService.markMailAsRead(id, read),
    onSuccess: (updatedMail) => {
      // 更新缓存中的邮件数据
      queryClient.setQueryData(MAIL_KEYS.detail(updatedMail.id), updatedMail);
      // 使所有列表查询失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: MAIL_KEYS.lists() });
    },
  });
} 