import {
  EmailAccount,
  EmailMessage,
  NylasAuthData,
} from "../types/nylas-types";
import nylasService from "./nylas-service";

// 本地存储键
const NYLAS_ACCOUNTS_KEY = "nylas_accounts";
const CURRENT_ACCOUNT_KEY = "current_nylas_account";

class MailAccountService {
  private accounts: NylasAuthData[] = [];
  private currentAccountId: string | null = null;
  private isInitialized = false;

  // 初始化，从本地存储加载账户信息
  private initialize(): void {
    if (this.isInitialized) return;

    try {
      if (typeof window !== "undefined") {
        // 从localStorage加载授权账户
        const accountsJson = localStorage.getItem(NYLAS_ACCOUNTS_KEY);
        if (accountsJson) {
          this.accounts = JSON.parse(accountsJson);
        }

        // 加载当前账户ID
        const currentId = localStorage.getItem(CURRENT_ACCOUNT_KEY);
        if (currentId) {
          this.currentAccountId = currentId;
        }
      }
    } catch (error) {
      console.error("Error initializing mail account service:", error);
    }

    this.isInitialized = true;
  }

  // 保存账户信息到本地存储
  private saveAccounts(): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(NYLAS_ACCOUNTS_KEY, JSON.stringify(this.accounts));
    }
  }

  // 保存当前账户ID到本地存储
  private saveCurrentAccountId(): void {
    if (typeof window !== "undefined" && this.currentAccountId) {
      localStorage.setItem(CURRENT_ACCOUNT_KEY, this.currentAccountId);
    } else if (typeof window !== "undefined") {
      localStorage.removeItem(CURRENT_ACCOUNT_KEY);
    }
  }

  // 添加新授权账户
  public addAccount(grantId: string, account: EmailAccount): void {
    this.initialize();

    const existingIndex = this.accounts.findIndex((a) => a.grantId === grantId);
    const authData: NylasAuthData = {
      grantId,
      account,
      addedAt: Date.now(),
    };

    if (existingIndex >= 0) {
      // 更新现有账户
      this.accounts[existingIndex] = authData;
    } else {
      // 添加新账户
      this.accounts.push(authData);
    }

    // 如果这是第一个账户，设置为当前账户
    if (!this.currentAccountId || this.accounts.length === 1) {
      this.currentAccountId = grantId;
      this.saveCurrentAccountId();
    }

    this.saveAccounts();
  }

  // 移除授权账户
  public removeAccount(grantId: string): void {
    this.initialize();

    this.accounts = this.accounts.filter((a) => a.grantId !== grantId);
    this.saveAccounts();

    // 如果删除的是当前账户，重置当前账户
    if (this.currentAccountId === grantId) {
      this.currentAccountId =
        this.accounts.length > 0 ? this.accounts[0].grantId : null;
      this.saveCurrentAccountId();
    }
  }

  // 获取所有授权账户
  public getAccounts(): NylasAuthData[] {
    this.initialize();
    return [...this.accounts];
  }

  // 获取当前账户
  public getCurrentAccount(): NylasAuthData | null {
    this.initialize();

    if (!this.currentAccountId) {
      return null;
    }

    const account = this.accounts.find(
      (a) => a.grantId === this.currentAccountId
    );
    return account || null;
  }

  // 设置当前账户
  public setCurrentAccount(grantId: string): boolean {
    this.initialize();

    const account = this.accounts.find((a) => a.grantId === grantId);
    if (account) {
      this.currentAccountId = grantId;
      this.saveCurrentAccountId();
      return true;
    }
    return false;
  }

  // 检查是否有授权账户
  public hasAccounts(): boolean {
    this.initialize();
    return this.accounts.length > 0;
  }

  // 获取当前账户的邮件
  public async getEmails(
    limit: number = 20,
    offset: number = 0
  ): Promise<EmailMessage[]> {
    this.initialize();

    const currentAccount = this.getCurrentAccount();
    if (!currentAccount) {
      return [];
    }

    try {
      return await nylasService.getEmails(currentAccount.grantId, {
        limit,
        offset,
      });
    } catch (error) {
      console.error("Error getting emails for account:", error);
      return [];
    }
  }

  // 获取邮件详情
  public async getEmail(messageId: string): Promise<EmailMessage | null> {
    this.initialize();

    const currentAccount = this.getCurrentAccount();
    if (!currentAccount) {
      return null;
    }

    try {
      return await nylasService.getEmail(currentAccount.grantId, messageId);
    } catch (error) {
      console.error("Error getting email details:", error);
      return null;
    }
  }
}

// 创建单例
const mailAccountService = new MailAccountService();
export default mailAccountService;
