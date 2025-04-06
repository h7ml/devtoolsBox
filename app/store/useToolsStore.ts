'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tool } from '../lib/tools-registry/types';

interface ToolsState {
  favoriteTools: string[];
  recentTools: { id: string; timestamp: number }[];
  addFavorite: (toolId: string) => void;
  removeFavorite: (toolId: string) => void;
  addRecentTool: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;
}

export const useToolsStore = create<ToolsState>()(
  persist(
    (set, get) => ({
      favoriteTools: [],
      recentTools: [],
      
      addFavorite: (toolId: string) => 
        set(state => ({
          favoriteTools: [...state.favoriteTools, toolId]
        })),
      
      removeFavorite: (toolId: string) => 
        set(state => ({
          favoriteTools: state.favoriteTools.filter(id => id !== toolId)
        })),
      
      addRecentTool: (toolId: string) => 
        set(state => {
          const newRecentTools = [
            { id: toolId, timestamp: Date.now() },
            ...state.recentTools.filter(tool => tool.id !== toolId)
          ].slice(0, 10); // 只保留最近的10个工具
          
          return { recentTools: newRecentTools };
        }),
      
      isFavorite: (toolId: string) => 
        get().favoriteTools.includes(toolId),
    }),
    {
      name: 'tools-storage', // 本地存储的键名
    }
  )
); 
