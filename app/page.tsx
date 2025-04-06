'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  FiSearch, FiCode, FiTerminal, FiCpu, FiStar,
  FiType, FiImage, FiFileText, FiHelpCircle, FiClock
} from 'react-icons/fi';
import { registerAllTools, getAllTools, getToolsByCategory } from './lib/tools-registry/register-tools';
import { Tool, ToolCategory } from './lib/tools-registry/types';
import Link from 'next/link';
import NavBar from './components/NavBar';
import { useFavorites } from './hooks/useFavorites';

// 定义工具分类
const toolCategories = [
  {
    id: 'text',
    name: '文本工具',
    icon: FiType,
    description: '文本处理、编解码、格式化等工具',
    color: 'blue',
  },
  {
    id: 'json',
    name: 'JSON工具',
    icon: FiCode,
    description: 'JSON格式化、校验、转换等工具',
    color: 'green',
  },
  {
    id: 'dev',
    name: '开发辅助',
    icon: FiTerminal,
    description: '为开发者准备的日常辅助工具',
    color: 'purple',
  },
  {
    id: 'runtime',
    name: '在线执行',
    icon: FiCpu,
    description: '在线运行和测试各种编程语言代码',
    color: 'orange',
  },
  {
    id: 'web',
    name: '爬虫工具',
    icon: FiFileText,
    description: '网络请求、数据提取的辅助工具',
    color: 'teal',
  },
  {
    id: 'misc',
    name: '其它工具',
    icon: FiHelpCircle,
    description: '实用的辅助工具集合',
    color: 'gray',
  },
];

// 色彩映射
const colorMap: Record<string, string> = {
  'blue': 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300',
  'green': 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300',
  'purple': 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300',
  'orange': 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-300',
  'teal': 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-300',
  'pink': 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-300',
  'gray': 'bg-gray-50 dark:bg-gray-700/30 text-gray-600 dark:text-gray-300',
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [registeredTools, setRegisteredTools] = useState<Record<string, Tool[]>>({});
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite, getFavoriteTools } = useFavorites();
  const [favoriteTools, setFavoriteTools] = useState<Tool[]>([]);

  // 初始化时只加载一次工具
  useEffect(() => {
    // 确保注册了所有工具
    registerAllTools();

    // 按类别组织工具
    const toolsByCategory: Record<string, Tool[]> = {};
    const allTools = getAllTools();

    toolCategories.forEach(category => {
      const categoryTools = getToolsByCategory(category.id as ToolCategory);
      if (categoryTools.length > 0) {
        toolsByCategory[category.id] = categoryTools;
      }
    });

    setRegisteredTools(toolsByCategory);

    // 加载收藏工具
    setFavoriteTools(getFavoriteTools(allTools));

    setLoading(false);
  }, []); // 空依赖数组，只在组件挂载时执行一次

  // 筛选分类和工具
  const filterTools = useCallback((tools: Tool[]) => {
    if (!searchTerm.trim()) return tools;
    return tools.filter(tool =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.meta.keywords.some(keyword =>
        keyword.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  // 处理收藏点击，阻止事件冒泡
  const handleFavoriteClick = useCallback((e: React.MouseEvent, toolId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(toolId);

    // 更新收藏工具列表
    const allTools = getAllTools();
    setFavoriteTools(getFavoriteTools(allTools));
  }, [toggleFavorite, getFavoriteTools]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />

      {/* 搜索区域 */}
      <div className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-500 to-blue-600 dark:from-blue-800 dark:to-blue-900">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-6">
            程序员在线工具箱
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            提供各种开发工具，提升您的开发效率和体验
          </p>

          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-3 border border-blue-400 rounded-full
                       bg-white dark:bg-gray-800 dark:border-blue-700 dark:text-white
                       shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="搜索工具..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* 工具分类 */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {toolCategories.map((category) => {
                const categoryTools = registeredTools[category.id] || [];
                const filteredCategoryTools = filterTools(categoryTools);

                // 如果搜索时没有匹配的工具，则不显示该分类
                if (searchTerm && filteredCategoryTools.length === 0) {
                  return null;
                }

                return (
                  <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-5">
                      <div className={`w-12 h-12 flex items-center justify-center rounded-full mb-4 ${colorMap[category.color]}`}>
                        <category.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 h-12">
                        {category.description}
                      </p>

                      <div className="space-y-2">
                        {filteredCategoryTools.slice(0, 4).map((tool) => (
                          <div key={tool.id} className="flex items-start p-2 -mx-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors relative">
                            <Link
                              href={`/tools/${tool.category}/${tool.id}`}
                              className="absolute inset-0 z-0"
                              aria-label={`打开${tool.name}工具`}
                            >
                              <span className="sr-only">打开{tool.name}工具</span>
                            </Link>
                            <span className="flex-grow font-medium text-gray-800 dark:text-gray-200 z-10 relative">
                              {tool.name}
                            </span>
                            <button
                              onClick={(e) => handleFavoriteClick(e, tool.id)}
                              className={`p-1 rounded-full focus:outline-none z-10 relative ${isFavorite(tool.id)
                                ? 'text-yellow-500 hover:text-yellow-600'
                                : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
                                }`}
                              title={isFavorite(tool.id) ? '取消收藏' : '添加到收藏'}
                            >
                              <FiStar className="w-4 h-4" fill={isFavorite(tool.id) ? 'currentColor' : 'none'} />
                            </button>
                          </div>
                        ))}

                        {filteredCategoryTools.length > 4 && (
                          <Link
                            href={`/tools/?category=${category.id}`}
                            className="block text-center text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 mt-4"
                          >
                            查看所有 {category.name}
                          </Link>
                        )}

                        {filteredCategoryTools.length === 0 && (
                          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                            暂无工具
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 热门工具 */}
          {favoriteTools.length > 0 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
              <div className="border-t border-gray-200 dark:border-gray-700 pt-10 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">我的收藏</h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {favoriteTools.map((tool) => (
                    <div key={tool.id} className="relative group">
                      <Link
                        href={`/tools/${tool.category}/${tool.id}`}
                        className="absolute inset-0 z-0"
                        aria-label={`打开${tool.name}工具`}
                      >
                        <span className="sr-only">打开{tool.name}工具</span>
                      </Link>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow hover:shadow-md transition-shadow flex flex-col items-center relative z-10 pointer-events-none">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 mb-3">
                          <tool.icon className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {tool.name}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleFavoriteClick(e, tool.id)}
                        className="absolute top-1 right-1 p-1.5 bg-white dark:bg-gray-700 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none text-yellow-500 hover:text-yellow-600 z-20"
                        title="取消收藏"
                      >
                        <FiStar className="w-4 h-4" fill="currentColor" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 热门工具 */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="border-t border-gray-200 dark:border-gray-700 pt-10 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">热门工具</h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {getAllTools().slice(0, 6).map((tool) => (
                  <div key={tool.id} className="relative group">
                    <Link
                      href={`/tools/${tool.category}/${tool.id}`}
                      className="absolute inset-0 z-0"
                      aria-label={`打开${tool.name}工具`}
                    >
                      <span className="sr-only">打开{tool.name}工具</span>
                    </Link>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow hover:shadow-md transition-shadow flex flex-col items-center relative z-10 pointer-events-none">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 mb-3">
                        <tool.icon className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {tool.name}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleFavoriteClick(e, tool.id)}
                      className={`absolute top-1 right-1 p-1.5 bg-white dark:bg-gray-700 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none z-20 ${isFavorite(tool.id)
                          ? 'text-yellow-500 hover:text-yellow-600'
                          : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
                        }`}
                      title={isFavorite(tool.id) ? '取消收藏' : '添加到收藏'}
                    >
                      <FiStar className="w-4 h-4" fill={isFavorite(tool.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                ))}

                {getAllTools().length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                    暂无工具，请先添加工具
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
} 
