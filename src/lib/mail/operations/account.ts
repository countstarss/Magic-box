import { EmailAccount } from "../types/mail-types";
import nylasService from "../nylas-service";
import memoryCacheManager from "../cache/memory-cache";
import mailDB from "../cache/db-cache";

// 是否在服务器环境
const isServer = typeof window === "undefined";

/**
 * 获取账户信息
 */
export async function getAccount(): Promise<EmailAccount | null> {
  // 获取默认账户ID
  const accountId = process.env.NYLAS_GRANT_ID || "c6zfpqxupbtdx0f5jn9efbwj8";

  // 服务器端和客户端使用不同的缓存策略
  if (isServer) {
    return await getAccountServer(accountId);
  } else {
    return await getAccountClient(accountId);
  }
}

/**
 * 服务器端获取账户信息（使用内存缓存）
 */
async function getAccountServer(
  accountId: string
): Promise<EmailAccount | null> {
  const cacheKey = `account:${accountId}`;

  // 尝试从缓存获取
  const cachedData = memoryCacheManager.get<EmailAccount>(cacheKey);
  if (cachedData) {
    console.log(`[MailService] 服务器缓存命中: ${cacheKey}`);
    return cachedData;
  }

  // 缓存未命中，从API获取
  console.log(`[MailService] 服务器缓存未命中: ${cacheKey}`);
  try {
    const account = await nylasService.getEmailAccountInfo(accountId);

    // 缓存结果
    memoryCacheManager.set(cacheKey, account, 30 * 60 * 1000); // 缓存30分钟

    return account;
  } catch (error) {
    console.error("[MailService] 获取账户信息失败:", error);
    return null;
  }
}

/**
 * 客户端获取账户信息（使用IndexedDB缓存）
 */
async function getAccountClient(
  accountId: string
): Promise<EmailAccount | null> {
  try {
    // 尝试从缓存获取
    const accounts = await mailDB.getCachedAccounts();
    if (accounts.length > 0) {
      // 返回第一个账户的账户信息
      const account =
        accounts.find((a) => a.grantId === accountId) || accounts[0];
      return account.account;
    }

    // 缓存不可用，从API获取
    console.log(
      `[MailService] 客户端缓存未命中，从API获取账户信息: ${accountId}`
    );
    const account = await nylasService.getEmailAccountInfo(accountId);

    // 缓存账户信息
    if (account) {
      await mailDB.cacheAccounts([
        {
          grantId: accountId,
          account: account,
          addedAt: Date.now(),
        },
      ]);
    }

    return account;
  } catch (error) {
    console.error("[MailService] 获取账户信息失败:", error);
    return null;
  }
}

/**
 * 获取授权URL
 * @param emailHint 邮箱提示
 */
export function getAuthUrl(emailHint?: string): string {
  return nylasService.getAuthUrl(emailHint);
}

/**
 * 使用授权码获取访问令牌
 * @param code 授权码
 */
export async function exchangeCodeForToken(
  code: string
): Promise<{ grantId: string; emailAccount: EmailAccount } | null> {
  try {
    return await nylasService.exchangeCodeForToken(code);
  } catch (error) {
    console.error("[MailService] 交换授权码获取令牌失败:", error);
    return null;
  }
}
