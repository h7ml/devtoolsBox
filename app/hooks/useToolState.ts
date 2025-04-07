'use client';

import { useState, useEffect, useCallback } from 'react';

interface ToolStateOptions<T> {
  toolId: string;
  initialState: T;
  storageKey?: string;
  expireTime?: number; // 过期时间（毫秒），默认24小时
}

/**
 * 工具状态持久化 Hook
 * 
 * 用于保存和恢复工具的状态，在页面刷新后仍能保持
 * 
 * @param options 配置选项
 * @returns [state, setState, resetState] 状态、设置状态和重置状态的函数
 */
export function useToolState<T>({
  toolId,
  initialState,
  storageKey,
  expireTime = 24 * 60 * 60 * 1000, // 默认24小时
}: ToolStateOptions<T>): [T, (newState: T) => void, () => void] {
  // 生成存储键
  const key = storageKey || `tool_state_${toolId}`;
  
  // 初始化状态
  const [state, setState] = useState<T>(() => {
    // 在客户端尝试从localStorage获取状态
    if (typeof window !== 'undefined') {
      try {
        const storedItem = localStorage.getItem(key);
        
        if (storedItem) {
          const { data, timestamp } = JSON.parse(storedItem);
          
          // 检查是否过期
          if (Date.now() - timestamp < expireTime) {
            return data;
          } else {
            // 如果过期，清除存储
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        console.error('从本地存储恢复工具状态失败:', error);
      }
    }
    
    // 如果没有存储或过期，返回初始状态
    return initialState;
  });
  
  // 更新状态并保存到本地存储
  const updateState = useCallback((newState: T) => {
    setState(newState);
    
    // 保存到localStorage
    if (typeof window !== 'undefined') {
      try {
        const itemToStore = {
          data: newState,
          timestamp: Date.now(),
        };
        
        localStorage.setItem(key, JSON.stringify(itemToStore));
      } catch (error) {
        console.error('保存工具状态失败:', error);
      }
    }
  }, [key]);
  
  // 重置状态为初始值
  const resetState = useCallback(() => {
    setState(initialState);
    
    // 从localStorage中移除
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('重置工具状态失败:', error);
      }
    }
  }, [initialState, key]);
  
  // 组件卸载时清理过期的状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 清理所有过期的工具状态
      const cleanupExpiredStates = () => {
        try {
          for (let i = 0; i < localStorage.length; i++) {
            const itemKey = localStorage.key(i);
            
            if (itemKey?.startsWith('tool_state_')) {
              try {
                const storedItem = localStorage.getItem(itemKey);
                if (storedItem) {
                  const { timestamp } = JSON.parse(storedItem);
                  
                  // 如果过期，清除存储
                  if (Date.now() - timestamp >= expireTime) {
                    localStorage.removeItem(itemKey);
                  }
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        } catch (error) {
          console.error('清理过期工具状态失败:', error);
        }
      };
      
      // 执行清理
      cleanupExpiredStates();
    }
  }, [expireTime]);
  
  return [state, updateState, resetState];
} 
