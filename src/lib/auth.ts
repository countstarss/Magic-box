import { cookies } from "next/headers";

// 模拟用户类型
interface User {
  id: string;
  name: string;
  email: string;
}

/**
 * 检查用户是否已认证
 * 在真实应用中，这里会连接到NextAuth或其他认证系统
 */
export async function checkAuth(): Promise<User | null> {
  // 获取cookie
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("auth_token");

  // 模拟认证：在真实应用中，这里会验证令牌并返回用户信息
  // 目前仅做简单验证，认为有cookie就是已登录
  if (authCookie) {
    return {
      id: "user-1",
      name: "Test User",
      email: "test@example.com",
    };
  }

  // 在开发环境中，始终返回模拟用户
  if (process.env.NODE_ENV === "development") {
    return {
      id: "dev-user",
      name: "Development User",
      email: "dev@example.com",
    };
  }

  // 未认证
  return null;
}

/**
 * 模拟登录过程
 */
export async function login(
  email: string,
  password: string
): Promise<User | null> {
  // 简单验证 - 在真实应用中会连接到认证服务
  if (email && password) {
    // 设置认证cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_token", "mock-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 一周
      path: "/",
    });

    return {
      id: "user-1",
      name: email.split("@")[0],
      email,
    };
  }

  return null;
}

/**
 * 模拟登出过程
 */
export async function logout(): Promise<void> {
  // 清除认证cookie
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
}
