'use client';

import { useState, useEffect, useCallback } from 'react';

// 工具使用记录接口
interface ToolUsage {
  id: string;
  count: number;
  lastUsed: number;
}

// 工具使用记录数据接口
interface ToolsUsageData {
  tools: Record<string, ToolUsage>;
  updatedAt: number;
}

/**
 * 工具使用统计 Hook
 * 
 * 用于跟踪工具的使用频率和最近使用情况
 * 支持获取热门工具和最近使用的工具
 */
export function useToolsUsageStats() {
  const STORAGE_KEY = 'tool_usage_stats';
  const [usageData, setUsageData] = useState<ToolsUsageData>(() => {
    // 在客户端尝试从localStorage获取使用统计
    if (typeof window !== 'undefined') {
      try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        
        if (storedData) {
          return JSON.parse(storedData);
        }
      } catch (error) {
        console.error('从本地存储恢复工具使用统计失败:', error);
      }
    }
    
    // 如果没有存储，返回初始状态
    return {
      tools: {},
      updatedAt: Date.now(),
    };
  });
  
  // 保存使用统计到本地存储
  const saveUsageData = useCallback((data: ToolsUsageData) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('保存工具使用统计失败:', error);
      }
    }
  }, []);
  
  // 记录工具使用
  const recordToolUsage = useCallback((toolId: string) => {
    setUsageData(prevData => {
      const now = Date.now();
      const tools = { ...prevData.tools };
      
      if (tools[toolId]) {
        tools[toolId] = {
          ...tools[toolId],
          count: tools[toolId].count + 1,
          lastUsed: now,
        };
      } else {
        tools[toolId] = {
          id: toolId,
          count: 1,
          lastUsed: now,
        };
      }
      
      const newData = {
        tools,
        updatedAt: now,
      };
      
      // 保存到本地存储
      saveUsageData(newData);
      
      return newData;
    });
  }, [saveUsageData]);
  
  // 获取最常用的工具
  const getPopularTools = useCallback((limit: number = 5): string[] => {
    return Object.values(usageData.tools)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map(tool => tool.id);
  }, [usageData.tools]);
  
  // 获取最近使用的工具
  const getRecentlyUsedTools = useCallback((limit: number = 5): string[] => {
    return Object.values(usageData.tools)
      .sort((a, b) => b.lastUsed - a.lastUsed)
      .slice(0, limit)
      .map(tool => tool.id);
  }, [usageData.tools]);
  
  // 获取工具使用次数
  const getToolUsageCount = useCallback((toolId: string): number => {
    return usageData.tools[toolId]?.count || 0;
  }, [usageData.tools]);
  
  // 清除使用统计
  const clearUsageStats = useCallback(() => {
    const newData = {
      tools: {},
      updatedAt: Date.now(),
    };
    
    setUsageData(newData);
    saveUsageData(newData);
  }, [saveUsageData]);
  
  // 初始化时从本地存储加载数据
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        
        if (storedData) {
          setUsageData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('从本地存储加载工具使用统计失败:', error);
      }
    }
  }, []);
  
  return {
    recordToolUsage,
    getPopularTools,
    getRecentlyUsedTools,
    getToolUsageCount,
    clearUsageStats,
  };
} 
