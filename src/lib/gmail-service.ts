import { supabase } from './supabase';

export class GmailService {
  private accessToken: string | null = null;
  private expiresAt: Date | null = null;
  private userId: string | null = null;

  constructor(userId: string) {
    this.userId = userId;
  }

  /**
   * // MARK:初始化Gmail服务，加载访问令牌
   */
  async initialize(): Promise<boolean> {
    if (!this.userId) return false;

    try {
      // 从数据库加载Gmail账户信息
      const { data: account, error } = await supabase
        .from('email_accounts')
        .select('*')
        .eq('user_id', this.userId)
        .eq('provider', 'gmail')
        .single();

      if (error || !account) {
        console.error('加载Gmail账户信息失败:', error);
        return false;
      }

      this.accessToken = account.access_token;
      this.expiresAt = new Date(account.expires_at);

      // 检查令牌是否过期
      if (this.isTokenExpired()) {
        await this.refreshToken();
      }

      return true;
    } catch (error) {
      console.error('初始化Gmail服务失败:', error);
      return false;
    }
  }

  /**
   * // MARK:检查访问令牌是否过期
   */
  private isTokenExpired(): boolean {
    if (!this.expiresAt) return true;
    
    // 提前5分钟刷新令牌，以防止在使用过程中过期
    const bufferTime = 5 * 60 * 1000; // 5分钟
    return Date.now() + bufferTime > this.expiresAt.getTime();
  }

  /**
   * // MARK:刷新访问令牌
   */
  private async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/gmail/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('刷新Gmail令牌失败:', error);
        return false;
      }

      const data = await response.json();
      
      // 重新获取最新的令牌
      const { data: account, error } = await supabase
        .from('email_accounts')
        .select('access_token, expires_at')
        .eq('user_id', this.userId)
        .eq('provider', 'gmail')
        .single();
        
      if (error || !account) {
        console.error('获取更新后的令牌失败:', error);
        return false;
      }
      
      this.accessToken = account.access_token;
      this.expiresAt = new Date(account.expires_at);
      
      return true;
    } catch (error) {
      console.error('刷新Gmail令牌过程中出错:', error);
      return false;
    }
  }

  /**
   * // MARK:获取邮件列表
   */
  async getMessages(maxResults: number = 10, query: string = ""): Promise<any> {
    if (!this.accessToken) {
      const initialized = await this.initialize();
      if (!initialized) throw new Error('Gmail服务未初始化');
    }

    if (this.isTokenExpired()) {
      const refreshed = await this.refreshToken();
      if (!refreshed) throw new Error('刷新Gmail令牌失败');
    }

    try {
      const url = new URL('/api/gmail', window.location.origin);
      url.searchParams.append('maxResults', maxResults.toString());
      if (query) {
        url.searchParams.append('q', query);
      }
      
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`获取邮件失败: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('获取邮件列表失败:', error);
      throw error;
    }
  }

  /**
   * // MARK:获取单个邮件详情
   */
  async getMessage(messageId: string): Promise<any> {
    if (!this.accessToken) {
      const initialized = await this.initialize();
      if (!initialized) throw new Error('Gmail服务未初始化');
    }

    if (this.isTokenExpired()) {
      const refreshed = await this.refreshToken();
      if (!refreshed) throw new Error('刷新Gmail令牌失败');
    }

    try {
      const response = await fetch(`/api/gmail/${messageId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`获取邮件详情失败: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`获取邮件 ${messageId} 详情失败:`, error);
      throw error;
    }
  }

  /**
   * // MARK:发送邮件
   */
  async sendEmail(to: string, subject: string, body: string): Promise<any> {
    if (!this.accessToken) {
      const initialized = await this.initialize();
      if (!initialized) throw new Error('Gmail服务未初始化');
    }

    if (this.isTokenExpired()) {
      const refreshed = await this.refreshToken();
      if (!refreshed) throw new Error('刷新Gmail令牌失败');
    }

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify({ to, subject, body }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`发送邮件失败: ${errorData.error || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('发送邮件失败:', error);
      throw error;
    }
  }

  /**
   * // MARK:标记邮件为已读
   */
  async markAsRead(messageId: string): Promise<any> {
    if (!this.accessToken) {
      const initialized = await this.initialize();
      if (!initialized) throw new Error('Gmail服务未初始化');
    }

    if (this.isTokenExpired()) {
      const refreshed = await this.refreshToken();
      if (!refreshed) throw new Error('刷新Gmail令牌失败');
    }

    try {
      const response = await fetch(`/api/gmail/${messageId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`标记邮件为已读失败: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`标记邮件 ${messageId} 为已读失败:`, error);
      throw error;
    }
  }

  /**
   * // MARK:标记邮件为未读
   */
  async markAsUnread(messageId: string): Promise<any> {
    if (!this.accessToken) {
      const initialized = await this.initialize();
      if (!initialized) throw new Error('Gmail服务未初始化');
    }

    if (this.isTokenExpired()) {
      const refreshed = await this.refreshToken();
      if (!refreshed) throw new Error('刷新Gmail令牌失败');
    }

    try {
      const response = await fetch(`/api/gmail/${messageId}/unread`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`标记邮件为未读失败: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`标记邮件 ${messageId} 为未读失败:`, error);
      throw error;
    }
  }

  /**
   * // MARK:归档邮件
   */
  async archiveEmail(messageId: string): Promise<any> {
    if (!this.accessToken) {
      const initialized = await this.initialize();
      if (!initialized) throw new Error('Gmail服务未初始化');
    }

    if (this.isTokenExpired()) {
      const refreshed = await this.refreshToken();
      if (!refreshed) throw new Error('刷新Gmail令牌失败');
    }

    try {
      const response = await fetch(`/api/gmail/${messageId}/archive`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`归档邮件失败: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`归档邮件 ${messageId} 失败:`, error);
      throw error;
    }
  }

  /**
   * // MARK:将邮件移至垃圾箱
   */
  async trashEmail(messageId: string): Promise<any> {
    if (!this.accessToken) {
      const initialized = await this.initialize();
      if (!initialized) throw new Error('Gmail服务未初始化');
    }

    if (this.isTokenExpired()) {
      const refreshed = await this.refreshToken();
      if (!refreshed) throw new Error('刷新Gmail令牌失败');
    }

    try {
      const response = await fetch(`/api/gmail/${messageId}/trash`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`将邮件移至垃圾箱失败: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`将邮件 ${messageId} 移至垃圾箱失败:`, error);
      throw error;
    }
  }

  /**
   * // MARK:修改邮件标签
   */
  async modifyLabels(messageId: string, labelsToAdd: string[] = [], labelsToRemove: string[] = []): Promise<any> {
    if (!this.accessToken) {
      const initialized = await this.initialize();
      if (!initialized) throw new Error('Gmail服务未初始化');
    }

    if (this.isTokenExpired()) {
      const refreshed = await this.refreshToken();
      if (!refreshed) throw new Error('刷新Gmail令牌失败');
    }

    try {
      const response = await fetch(`/api/gmail/${messageId}/labels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify({ labelsToAdd, labelsToRemove }),
      });

      if (!response.ok) {
        throw new Error(`修改邮件标签失败: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`修改邮件 ${messageId} 标签失败:`, error);
      throw error;
    }
  }
} 