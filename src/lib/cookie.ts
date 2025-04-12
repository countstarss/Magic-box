import { cookies } from "next/headers";

export class Cookie {
  /**
   * 获取指定名称的cookie值
   * @param name cookie名称
   * @returns cookie值，如果不存在则返回null
   */
  static async get(name: string): Promise<string | null> {
    const cookieStore = await cookies();
    const value = cookieStore.get(name)?.value;
    return value || null;
  }

  /**
   * 设置cookie
   * @param name cookie名称
   * @param value cookie值
   * @param options cookie选项
   */
  static async set(
    name: string,
    value: string,
    options: {
      expires?: Date;
      path?: string;
      domain?: string;
      secure?: boolean;
      httpOnly?: boolean;
    } = {}
  ): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.set(name, value, {
      expires: options.expires,
      path: options.path || "/",
      domain: options.domain,
      secure: options.secure,
      httpOnly: options.httpOnly,
    });
  }

  /**
   * 删除cookie
   * @param name cookie名称
   */
  static async remove(name: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(name);
  }
}
