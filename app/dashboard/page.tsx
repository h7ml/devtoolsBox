'use client';

import { useEffect, useState } from 'react';
import { getAllTools } from '../lib/tools-registry/register-tools';
import { Tool } from '../lib/tools-registry/types';
import { useFavorites } from '../hooks/useFavorites';
import { useRecentTools } from '../hooks/useRecentTools';
import { FiStar, FiClock, FiBarChart2, FiSettings, FiTool } from 'react-icons/fi';
import Link from 'next/link';
import NavBarWithModals from '../components/NavBarWithModals';
import React from 'react';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const { getFavoriteTools } = useFavorites();
  const { getRecentTools } = useRecentTools();
  const [favoriteTools, setFavoriteTools] = useState<Tool[]>([]);
  const [recentTools, setRecentTools] = useState<Tool[]>([]);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const tools = getAllTools();
        setAllTools(tools);
        setFavoriteTools(getFavoriteTools(tools));
        setRecentTools(getRecentTools(tools));
        setLoading(false);
      } catch (error) {
        console.error('工具加载失败:', error);
        setLoading(false);
      }
    };

    fetchTools();
  }, [getFavoriteTools, getRecentTools]);

  // 处理收藏点击，阻止事件冒泡
  const handleFavoriteClick = (e: React.MouseEvent, toolId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(toolId);

    // 更新收藏工具列表
    setFavoriteTools(getFavoriteTools(allTools));
  };

  const getToolUsageStatistics = () => {
    return {
      total: allTools.length,
      favorite: favoriteTools.length,
      recent: recentTools.length
    };
  };

  const stats = getToolUsageStatistics();

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavBarWithModals />
        <div className="pt-24 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBarWithModals />

      <div className="max-w-6xl mx-auto pt-24 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">我的工具箱</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">管理您的工具和首选项</p>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100/50 dark:border-gray-700/50">
            <div className="flex items-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 mr-4">
                <FiTool className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">工具总数</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100/50 dark:border-gray-700/50">
            <div className="flex items-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400 mr-4">
                <FiStar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">收藏工具</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.favorite}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100/50 dark:border-gray-700/50">
            <div className="flex items-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-400 mr-4">
                <FiClock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">最近使用</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.recent}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* 最近使用的工具 */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-sm border border-gray-100/50 dark:border-gray-700/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <FiClock className="mr-2 text-gray-500 dark:text-gray-400" />
            最近使用
          </h2>

          {recentTools.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
              {recentTools.map((tool) => (
                <div key={tool.id} className="relative group">
                  <Link
                    href={`/tools/${tool.category}/${tool.id}`}
                    className="absolute inset-0 z-0"
                    aria-label={`打开${tool.name}工具`}
                  >
                    <span className="sr-only">打开{tool.name}工具</span>
                  </Link>
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-5 text-center shadow-sm hover:shadow transition-shadow flex flex-col items-center relative z-10 pointer-events-none border border-gray-100/50 dark:border-gray-700/50">
                    <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 mb-4 shadow-sm">
                      {React.createElement(tool.icon, { className: "h-6 w-6" })}
                    </div>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {tool.name}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleFavoriteClick(e, tool.id)}
                    className={`absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none z-20 ${isFavorite(tool.id)
                      ? 'text-orange-500 hover:text-orange-600'
                      : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
                      }`}
                    title={isFavorite(tool.id) ? '取消收藏' : '添加到收藏'}
                  >
                    <FiStar className="w-4 h-4" fill={isFavorite(tool.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50/70 dark:bg-gray-800/30 rounded-xl">
              您还没有使用过任何工具
            </div>
          )}
        </div>

        {/* 收藏的工具 */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100/50 dark:border-gray-700/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <FiStar className="mr-2 text-orange-500" />
            我的收藏
          </h2>

          {favoriteTools.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
              {favoriteTools.map((tool) => (
                <div key={tool.id} className="relative group">
                  <Link
                    href={`/tools/${tool.category}/${tool.id}`}
                    className="absolute inset-0 z-0"
                    aria-label={`打开${tool.name}工具`}
                  >
                    <span className="sr-only">打开{tool.name}工具</span>
                  </Link>
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-5 text-center shadow-sm hover:shadow transition-shadow flex flex-col items-center relative z-10 pointer-events-none border border-gray-100/50 dark:border-gray-700/50">
                    <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-orange-500 text-white mb-4 shadow-sm">
                      {React.createElement(tool.icon, { className: "h-6 w-6" })}
                    </div>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {tool.name}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleFavoriteClick(e, tool.id)}
                    className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none text-orange-500 hover:text-orange-600 z-20"
                    title="取消收藏"
                  >
                    <FiStar className="w-4 h-4" fill="currentColor" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50/70 dark:bg-gray-800/30 rounded-xl">
              您还没有收藏任何工具
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 
