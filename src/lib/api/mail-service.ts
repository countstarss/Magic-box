// 导入Email类型
import { Email } from '@/lib/data';

// 基础API URL
const API_BASE_URL = '/api';

// API响应类型
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// 分页响应类型
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 邮件过滤参数
export interface MailFilterParams {
  folder?: string;
  search?: string;
  category?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 邮件服务
export const mailService = {
  // 获取邮件列表
  async getMails(params: MailFilterParams = {}): Promise<PaginatedResponse<Email>> {
    // 构建查询字符串
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    // 发起请求
    const response = await fetch(`${API_BASE_URL}/mails?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch mails: ${response.statusText}`);
    }
    
    return await response.json();
  },

  // 获取单个邮件
  async getMail(id: string): Promise<Email> {
    const response = await fetch(`${API_BASE_URL}/mails/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch mail: ${response.statusText}`);
    }
    
    return await response.json();
  },

  // 发送邮件
  async sendMail(mailData: Partial<Email>): Promise<Email> {
    const response = await fetch(`${API_BASE_URL}/mails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mailData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to send mail: ${response.statusText}`);
    }
    
    return await response.json();
  },

  // 更新邮件（例如标记为已读、添加标签等）
  async updateMail(id: string, updates: Partial<Email>): Promise<Email> {
    const response = await fetch(`${API_BASE_URL}/mails/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update mail: ${response.statusText}`);
    }
    
    return await response.json();
  },

  // 删除邮件
  async deleteMail(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/mails/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete mail: ${response.statusText}`);
    }
  },

  // 将邮件移动到垃圾箱
  async trashMail(id: string): Promise<Email> {
    return this.updateMail(id, { isTrash: true });
  },

  // 将邮件移动到归档
  async archiveMail(id: string): Promise<Email> {
    return this.updateMail(id, { isArchive: true });
  },

  // 将邮件标记为已读/未读
  async markMailAsRead(id: string, read: boolean = true): Promise<Email> {
    return this.updateMail(id, { read });
  },
}; 