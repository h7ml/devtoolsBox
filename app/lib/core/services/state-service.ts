/**
 * 状态管理服务
 * 提供统一的状态管理机制，支持状态持久化、过期清理等功能
 */

'use client';

import { useState as useReactState, useEffect, useCallback } from 'react';

/**
 * 状态存储接口
 */
export interface IStateStorage {
  /**
   * 获取存储项
   */
  getItem: (key: string) => any | null;
  
  /**
   * 设置存储项
   */
  setItem: (key: string, value: any) => void;
  
  /**
   * 删除存储项
   */
  removeItem: (key: string) => void;
  
  /**
   * 清除所有存储
   */
  clear: () => void;
  
  /**
   * 获取指定前缀的所有键
   */
  getKeysWithPrefix: (prefix: string) => string[];
}

/**
 * 本地存储实现
 */
export class LocalStateStorage implements IStateStorage {
  getItem(key: string): any | null {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('从本地存储读取失败:', error);
      return null;
    }
  }

  setItem(key: string, value: any): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('写入本地存储失败:', error);
    }
  }

  removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('删除本地存储项失败:', error);
    }
  }

  clear(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.clear();
    } catch (error) {
      console.error('清除本地存储失败:', error);
    }
  }

  getKeysWithPrefix(prefix: string): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keys.push(key);
        }
      }
      return keys;
    } catch (error) {
      console.error('获取本地存储键失败:', error);
      return [];
    }
  }
}

/**
 * 会话存储实现
 */
export class SessionStateStorage implements IStateStorage {
  getItem(key: string): any | null {
    if (typeof window === 'undefined') return null;
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('从会话存储读取失败:', error);
      return null;
    }
  }

  setItem(key: string, value: any): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('写入会话存储失败:', error);
    }
  }

  removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('删除会话存储项失败:', error);
    }
  }

  clear(): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('清除会话存储失败:', error);
    }
  }

  getKeysWithPrefix(prefix: string): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const keys: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keys.push(key);
        }
      }
      return keys;
    } catch (error) {
      console.error('获取会话存储键失败:', error);
      return [];
    }
  }
}

/**
 * 内存存储实现
 */
export class MemoryStateStorage implements IStateStorage {
  private storage: Map<string, any> = new Map();

  getItem(key: string): any | null {
    return this.storage.has(key) ? this.storage.get(key) : null;
  }

  setItem(key: string, value: any): void {
    this.storage.set(key, value);
  }

  removeItem(key: string): void {
    this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }

  getKeysWithPrefix(prefix: string): string[] {
    return Array.from(this.storage.keys()).filter(key => key.startsWith(prefix));
  }
}

/**
 * 状态服务配置选项
 */
export interface StateServiceOptions {
  /**
   * 存储实现
   */
  storage?: IStateStorage;
  
  /**
   * 默认过期时间（毫秒）
   */
  defaultExpireTime?: number;
  
  /**
   * 状态键前缀
   */
  keyPrefix?: string;
}

/**
 * 状态项
 */
interface StateItem<T> {
  /**
   * 状态数据
   */
  data: T;
  
  /**
   * 创建时间戳
   */
  timestamp: number;
}

/**
 * 状态服务类
 */
export class StateService {
  private static instance: StateService;
  private storage: IStateStorage;
  private defaultExpireTime: number;
  private keyPrefix: string;
  private toolStates: Map<string, any> = new Map();

  private constructor(options: StateServiceOptions = {}) {
    this.storage = options.storage || new LocalStateStorage();
    this.defaultExpireTime = options.defaultExpireTime || 24 * 60 * 60 * 1000; // 默认24小时
    this.keyPrefix = options.keyPrefix || 'app_state_';
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): StateService {
    if (!StateService.instance) {
      StateService.instance = new StateService();
    }
    return StateService.instance;
  }

  /**
   * 保存状态
   */
  setState<T>(key: string, data: T, expireTime?: number): void {
    const stateItem: StateItem<T> = {
      data,
      timestamp: Date.now()
    };
    
    this.storage.setItem(this.getFullKey(key), stateItem);
  }

  /**
   * 获取状态
   */
  getState<T>(key: string, defaultValue: T, expireTime?: number): T {
    const fullKey = this.getFullKey(key);
    const stateItem = this.storage.getItem(fullKey) as StateItem<T> | null;
    
    if (stateItem) {
      const actualExpireTime = expireTime || this.defaultExpireTime;
      
      // 检查是否过期
      if (Date.now() - stateItem.timestamp < actualExpireTime) {
        return stateItem.data;
      } else {
        // 如果过期，清除存储
        this.storage.removeItem(fullKey);
      }
    }
    
    return defaultValue;
  }

  /**
   * 删除状态
   */
  removeState(key: string): void {
    this.storage.removeItem(this.getFullKey(key));
  }

  /**
   * 清理过期状态
   */
  cleanupExpiredStates(expireTime?: number): void {
    const keys = this.storage.getKeysWithPrefix(this.keyPrefix);
    const actualExpireTime = expireTime || this.defaultExpireTime;
    
    for (const key of keys) {
      try {
        const stateItem = this.storage.getItem(key);
        if (stateItem && stateItem.timestamp) {
          // 如果过期，清除存储
          if (Date.now() - stateItem.timestamp >= actualExpireTime) {
            this.storage.removeItem(key);
          }
        }
      } catch (e) {
        // 忽略解析错误
      }
    }
  }

  /**
   * 获取完整键名
   */
  private getFullKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }

  /**
   * 设置工具状态
   * @param toolId 工具ID
   * @param state 工具状态
   */
  public setToolState(toolId: string, state: any): void {
    this.toolStates.set(toolId, { ...this.getToolState(toolId), ...state });
  }
  
  /**
   * 获取工具状态
   * @param toolId 工具ID
   */
  public getToolState(toolId: string): any {
    return this.toolStates.get(toolId) || {};
  }
  
  /**
   * 清除工具状态
   * @param toolId 工具ID
   */
  public clearToolState(toolId: string): void {
    this.toolStates.delete(toolId);
  }
  
  /**
   * 清除所有工具状态
   */
  public clearAllToolStates(): void {
    this.toolStates.clear();
  }
}

/**
 * 状态管理钩子配置选项
 */
export interface UseStateOptions<T> {
  /**
   * 状态键
   */
  key: string;
  
  /**
   * 初始状态
   */
  initialState: T;
  
  /**
   * 过期时间（毫秒）
   */
  expireTime?: number;
  
  /**
   * 状态服务实例
   */
  stateService?: StateService;
}

/**
 * 创建默认状态服务单例
 */
const defaultStateService = StateService.getInstance();

/**
 * 状态管理钩子
 */
export function useState<T>({
  key,
  initialState,
  expireTime,
  stateService = defaultStateService
}: UseStateOptions<T>): [T, (newState: T) => void, () => void] {
  // 初始化状态
  const [state, setStateInternal] = useReactState<T>(() => {
    return stateService.getState(key, initialState, expireTime);
  });
  
  // 更新状态并保存
  const setState = useCallback((newState: T) => {
    setStateInternal(newState);
    stateService.setState(key, newState, expireTime);
  }, [key, expireTime, stateService]);
  
  // 重置状态
  const resetState = useCallback(() => {
    setStateInternal(initialState);
    stateService.removeState(key);
  }, [key, initialState, stateService]);
  
  // 组件卸载时清理过期状态
  useEffect(() => {
    stateService.cleanupExpiredStates(expireTime);
  }, [expireTime, stateService]);
  
  return [state, setState, resetState];
}

/**
 * 导出默认状态服务实例
 */
export default defaultStateService; 
