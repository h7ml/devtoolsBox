import { useState, useEffect, useCallback } from 'react';
import { Tool } from '../lib/tools-registry/types';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // 初始化时从localStorage加载收藏工具
  useEffect(() => {
    try {
      const savedFavorites = JSON.parse(localStorage.getItem('favoriteTools') || '[]');
      setFavorites(savedFavorites);
    } catch (e) {
      console.error('无法加载收藏工具', e);
      setFavorites([]);
    }
  }, []);
  
  // 检查工具是否已收藏
  const isFavorite = useCallback((toolId: string): boolean => {
    return favorites.includes(toolId);
  }, [favorites]);
  
  // 切换工具的收藏状态
  const toggleFavorite = useCallback((toolId: string) => {
    try {
      let newFavorites: string[];
      
      if (favorites.includes(toolId)) {
        // 移除收藏
        newFavorites = favorites.filter(id => id !== toolId);
      } else {
        // 添加收藏
        newFavorites = [...favorites, toolId];
      }
      
      // 更新状态和localStorage
      setFavorites(newFavorites);
      localStorage.setItem('favoriteTools', JSON.stringify(newFavorites));
    } catch (e) {
      console.error('无法更新收藏状态', e);
    }
  }, [favorites]);
  
  // 获取收藏的工具ID列表
  const getFavoriteToolIds = useCallback((): string[] => {
    return favorites;
  }, [favorites]);
  
  // 获取收藏的工具列表
  const getFavoriteTools = useCallback((allTools: Tool[]): Tool[] => {
    return allTools.filter(tool => favorites.includes(tool.id));
  }, [favorites]);
  
  return {
    favorites,
    isFavorite,
    toggleFavorite,
    getFavoriteToolIds,
    getFavoriteTools
  };
} 
