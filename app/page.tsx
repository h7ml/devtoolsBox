'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiSearch, FiStar, FiPackage, FiBook, FiTrendingUp, FiChevronRight } from 'react-icons/fi';
import ToolCard from './components/ToolCard';
import { useFavorites } from './hooks/useFavorites';
import NavBarWithModals from './components/NavBarWithModals';
import { registerAllTools, getAllTools, getPopularTools } from './lib/tools-registry/register-tools';
import { Tool } from './lib/tools-registry/types';

// 工具分类
interface ToolCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  color: string;
  tools: Tool[];
}

// 分类映射
const categoryColorMap: Record<string, { bg: string; text: string }> = {
  dev: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-300' },
  text: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-300' },
  web: { bg: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-600 dark:text-teal-300' },
  misc: { bg: 'bg-gray-50 dark:bg-gray-800/30', text: 'text-gray-600 dark:text-gray-300' },
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [popularTools, setPopularTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const [favoriteTools, setFavoriteTools] = useState<Tool[]>([]);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const initTools = async () => {
      try {
        // 注册所有工具
        await registerAllTools();

        // 获取热门工具
        const popular = getPopularTools(4);
        setPopularTools(popular);

        // 获取所有工具
        const allTools = getAllTools();

        // 根据收藏状态筛选工具
        const favTools = allTools.filter(tool => favorites.includes(tool.id));
        setFavoriteTools(favTools);
      } catch (error) {
        console.error('工具初始化失败:', error);
        setInitError('工具加载失败，请刷新页面重试');
      } finally {
        setIsLoading(false);
      }
    };

    initTools();
  }, [favorites]);

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/tools?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  // 工具类别数组
  const toolCategories: ToolCategory[] = [
    {
      id: 'dev',
      name: '开发辅助',
      icon: FiPackage,
      description: '为开发者提供的实用工具集',
      color: 'bg-purple-500',
      tools: [],
    },
    {
      id: 'text',
      name: '文本处理',
      icon: FiBook,
      description: '文本编码、转换与处理工具',
      color: 'bg-blue-500',
      tools: [],
    },
    {
      id: 'web',
      name: '爬虫工具',
      icon: FiTrendingUp,
      description: 'Web请求测试与模拟工具',
      color: 'bg-teal-500',
      tools: [],
    },
    {
      id: 'misc',
      name: '其它工具',
      icon: FiStar,
      description: '更多实用小工具',
      color: 'bg-gray-500',
      tools: [],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBarWithModals />

      <main className="pt-16 pb-8">
        {/* 搜索区域 */}
        <div className="px-4 py-16 flex items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-3xl w-full text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600">
              寻找强大的开发工具
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              一站式工具集，提升您的开发效率
            </p>

            <form onSubmit={handleSearch} className="relative max-w-xl mx-auto mb-8 group">
              <input
                type="text"
                className="w-full px-5 py-4 pl-12 text-base rounded-xl shadow-lg backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 dark:text-white border border-gray-200/80 dark:border-gray-700/80 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all group-hover:shadow-xl"
                placeholder="搜索工具..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-md transition-all transform hover:translate-y-[-1px]"
                disabled={searchQuery.trim() === ''}
              >
                搜索
              </button>
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            </form>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : initError ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-red-500 text-xl mb-2">初始化失败</p>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{initError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              刷新页面
            </button>
          </div>
        ) : (
          <>
            {/* 我的收藏 - 仅当有收藏工具时显示 */}
            {favoriteTools.length > 0 && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 mr-3 text-white shadow-md">
                      <FiStar className="h-5 w-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">我的收藏</h2>
                  </div>
                  <Link href="/tools" className="flex items-center group text-orange-500 hover:text-orange-600 transition-colors">
                    <span className="mr-1">查看全部</span>
                    <FiChevronRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {favoriteTools.slice(0, 4).map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      isFavorite={isFavorite(tool.id)}
                      onToggleFavorite={() => toggleFavorite(tool.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 热门工具 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 mr-3 text-white shadow-md">
                    <FiTrendingUp className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">热门工具</h2>
                </div>
                <Link href="/tools" className="flex items-center group text-orange-500 hover:text-orange-600 transition-colors">
                  <span className="mr-1">查看全部</span>
                  <FiChevronRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {popularTools.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {popularTools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      isFavorite={isFavorite(tool.id)}
                      onToggleFavorite={() => toggleFavorite(tool.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-100/80 dark:border-gray-700/80 backdrop-blur-sm shadow-lg p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    暂无热门工具，请先添加工具
                  </p>
                </div>
              )}
            </div>

            {/* 工具分类 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">浏览工具类别</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {toolCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/tools?category=${category.id}`}
                    className="group block relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-100/80 dark:border-gray-700/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="p-6 backdrop-filter backdrop-blur-sm bg-white/70 dark:bg-gray-800/70">
                      <div className={`inline-flex items-center justify-center p-3.5 rounded-xl mb-4 bg-gradient-to-r ${categoryColorMap[category.id]?.bg || 'bg-gray-50'}`}>
                        <category.icon className={`h-6 w-6 ${categoryColorMap[category.id]?.text || 'text-gray-500'}`} />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 group-hover:text-orange-500 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {category.description}
                      </p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-orange-500/10 dark:to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="bg-white dark:bg-gray-800 py-12 mt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-6">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600">
                DevTools Box
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} DevTools Box. 一站式开发工具集合.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 
