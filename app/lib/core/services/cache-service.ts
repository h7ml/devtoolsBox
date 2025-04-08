/**
 * 缓存服务
 * 提供统一的数据缓存管理，支持内存、IndexedDB等缓存策略
 */

'use client';

/**
 * 缓存项类型
 */
interface CacheItem<T> {
  value: T;
  expires: number | null; // null表示永不过期
}

/**
 * 缓存配置选项
 */
export interface CacheOptions {
  /**
   * 过期时间（毫秒），默认为1小时
   */
  ttl?: number;
  
  /**
   * 缓存命名空间，用于隔离不同的缓存数据
   */
  namespace?: string;
}

/**
 * 缓存服务类
 */
export class CacheService {
  private static instance: CacheService;
  private cache: Map<string, CacheItem<any>> = new Map();
  private namespace: string;
  private defaultTTL: number;
  
  private constructor(options: CacheOptions = {}) {
    this.namespace = options.namespace || 'app_cache';
    this.defaultTTL = options.ttl || 3600000; // 默认1小时
  }
  
  /**
   * 获取单例实例
   */
  public static getInstance(options?: CacheOptions): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService(options);
    }
    return CacheService.instance;
  }
  
  /**
   * 设置缓存项
   */
  public set<T>(key: string, value: T, options: CacheOptions = {}): void {
    const ttl = options.ttl ?? this.defaultTTL;
    const namespace = options.namespace ?? this.namespace;
    const fullKey = this.getFullKey(key, namespace);
    
    const item: CacheItem<T> = {
      value,
      expires: ttl > 0 ? Date.now() + ttl : null
    };
    
    this.cache.set(fullKey, item);
  }
  
  /**
   * 获取缓存项
   */
  public get<T>(key: string, namespace?: string): T | null {
    const fullKey = this.getFullKey(key, namespace || this.namespace);
    const item = this.cache.get(fullKey) as CacheItem<T> | undefined;
    
    if (!item) {
      return null;
    }
    
    // 检查是否过期
    if (item.expires !== null && Date.now() > item.expires) {
      this.delete(key, namespace);
      return null;
    }
    
    return item.value;
  }
  
  /**
   * 删除缓存项
   */
  public delete(key: string, namespace?: string): boolean {
    const fullKey = this.getFullKey(key, namespace || this.namespace);
    return this.cache.delete(fullKey);
  }
  
  /**
   * 清除指定命名空间的所有缓存
   */
  public clear(namespace?: string): void {
    const ns = namespace || this.namespace;
    const prefix = `${ns}:`;
    
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * 清除所有缓存
   */
  public clearAll(): void {
    this.cache.clear();
  }
  
  /**
   * 清除所有过期的缓存项
   */
  public clearExpired(): void {
    const now = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (item.expires !== null && now > item.expires) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * 获取完整的缓存键
   */
  private getFullKey(key: string, namespace: string): string {
    return `${namespace}:${key}`;
  }
}

// 导出默认实例
export const cacheService = CacheService.getInstance();
