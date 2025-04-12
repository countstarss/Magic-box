/**
 * 缓存项目接口
 */
interface CacheItem<T> {
  data: T;
  expiry: number;
}

/**
 * 缓存管理器 - 用于缓存API响应
 */
export class CacheManager {
  private cache: Map<string, CacheItem<any>> = new Map();
  private defaultTTL: number = 5 * 60 * 1000; // 5分钟，单位：毫秒

  /**
   * 从缓存获取数据
   * @param key 缓存键
   * @returns 缓存的数据或null
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // 检查缓存是否过期
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  /**
   * 存储数据到缓存
   * @param key 缓存键
   * @param data 要缓存的数据
   * @param ttl 过期时间(毫秒)
   */
  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl,
    });
  }

  /**
   * 使指定前缀的缓存失效
   * @param keyPrefix 缓存键前缀
   */
  invalidate(keyPrefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(keyPrefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * 清除所有缓存
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * 返回缓存大小
   */
  size(): number {
    return this.cache.size;
  }
}

// 创建单例实例
const cacheManager = new CacheManager();
export default cacheManager;
