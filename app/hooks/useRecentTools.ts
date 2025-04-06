import { useState, useEffect, useCallback } from 'react';
import { Tool } from '../lib/tools-registry/types';

interface RecentTool {
  id: string;
  timestamp: number;
}

const MAX_RECENT_TOOLS = 10;

export function useRecentTools() {
  const [recentTools, setRecentTools] = useState<RecentTool[]>([]);
  
  // 初始化时从localStorage加载最近使用的工具
  useEffect(() => {
    try {
      const savedRecentTools = JSON.parse(localStorage.getItem('recentTools') || '[]');
      setRecentTools(savedRecentTools);
    } catch (e) {
      console.error('无法加载最近使用的工具', e);
      setRecentTools([]);
    }
  }, []);
  
  // 添加工具到最近使用列表
  const addRecentTool = useCallback((toolId: string) => {
    try {
      // 创建新的最近工具数组
      let newRecentTools = [...recentTools];
      
      // 移除已存在的相同工具（如果存在）
      newRecentTools = newRecentTools.filter(tool => tool.id !== toolId);
      
      // 添加新工具到列表开头
      newRecentTools.unshift({
        id: toolId,
        timestamp: Date.now()
      });
      
      // 限制列表长度
      if (newRecentTools.length > MAX_RECENT_TOOLS) {
        newRecentTools = newRecentTools.slice(0, MAX_RECENT_TOOLS);
      }
      
      // 更新状态和localStorage
      setRecentTools(newRecentTools);
      localStorage.setItem('recentTools', JSON.stringify(newRecentTools));
    } catch (e) {
      console.error('无法更新最近使用的工具', e);
    }
  }, [recentTools]);
  
  // 清除最近使用的工具
  const clearRecentTools = useCallback(() => {
    setRecentTools([]);
    localStorage.removeItem('recentTools');
  }, []);
  
  // 获取最近使用的工具ID列表
  const getRecentToolIds = useCallback((): string[] => {
    return recentTools.map(tool => tool.id);
  }, [recentTools]);
  
  // 获取最近使用的工具列表
  const getRecentTools = useCallback((allTools: Tool[]): Tool[] => {
    // 创建ID到Tool的映射
    const toolMap = new Map<string, Tool>();
    allTools.forEach(tool => toolMap.set(tool.id, tool));
    
    // 按最近使用顺序返回工具
    return recentTools
      .map(recent => toolMap.get(recent.id))
      .filter((tool): tool is Tool => tool !== undefined);
  }, [recentTools]);
  
  return {
    addRecentTool,
    clearRecentTools,
    getRecentToolIds,
    getRecentTools
  };
} 
