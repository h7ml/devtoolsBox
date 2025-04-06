'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { registerAllTools, getAllTools, getToolsByCategory } from '../lib/tools-registry/register-tools';
import { Tool, ToolCategory } from '../lib/tools-registry/types';
import NavBar from '../components/NavBar';
import Link from 'next/link';
import { FiSearch, FiArrowLeft, FiStar } from 'react-icons/fi';
import { useFavorites } from '../hooks/useFavorites';

// 定义工具分类颜色映射
const categoryColorMap: Record<string, string> = {
  'text': 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300',
  'json': 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300',
  'dev': 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300',
  'runtime': 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-300',
  'web': 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-300',
  'misc': 'bg-gray-50 dark:bg-gray-700/30 text-gray-600 dark:text-gray-300',
};

// 分类名称映射
const categoryNameMap: Record<string, string> = {
  'text': '文本工具',
  'json': 'JSON工具',
  'dev': '开发辅助',
  'runtime': '在线执行',
  'web': '爬虫工具',
  'misc': '其它工具',
};

export default function ToolListPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [searchTerm, setSearchTerm] = useState('');
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const { isFavorite, toggleFavorite } = useFavorites();

  // 只在初始化和分类参数变化时加载工具
  useEffect(() => {
    // 确保工具已注册
    registerAllTools();

    // 获取工具
    let filteredTools: Tool[];
    if (categoryParam) {
      filteredTools = getToolsByCategory(categoryParam as ToolCategory);
      setCategories([categoryParam]);
    } else {
      filteredTools = getAllTools();

      // 获取所有分类
      const uniqueCategories = Array.from(
        new Set(filteredTools.map(tool => tool.category))
      );
      setCategories(uniqueCategories);
    }

    setTools(filteredTools);
    setLoading(false);
  }, [categoryParam]); // 仅依赖分类参数

  // 过滤工具
  const filteredTools = useCallback(() => {
    if (searchTerm.trim() === '') return tools;
    return tools.filter(tool =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.meta.keywords.some(keyword =>
        keyword.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [tools, searchTerm]);

  // 按分类分组工具
  const toolsByCategory = useCallback(() => {
    const filteredToolsList = filteredTools();
    return categories.reduce((acc, category) => {
      acc[category] = filteredToolsList.filter(tool => tool.category === category);
      return acc;
    }, {} as Record<string, Tool[]>);
  }, [categories, filteredTools]);

  // 处理收藏点击，阻止事件冒泡
  const handleFavoriteClick = useCallback((e: React.MouseEvent, toolId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(toolId);
    // 强制刷新状态以更新UI
    setTools(prevTools => [...prevTools]);
  }, [toggleFavorite]);

  // 获取当前分类的工具
  const currentToolsByCategory = toolsByCategory();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />

      <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <Link
              href="/"
              className="mr-4 p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FiArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {categoryParam ? categoryNameMap[categoryParam] || categoryParam : '所有工具'}
            </h1>
          </div>

          {/* 搜索框 */}
          <div className="relative max-w-lg mx-auto mb-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-800 dark:text-white
                     shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        <div className="px-4 pb-16">
          <div className="max-w-7xl mx-auto">
            {categories.map(category => {
              const categoryTools = currentToolsByCategory[category] || [];
              if (categoryTools.length === 0) return null;

              return (
                <div key={category} className="mb-10">
                  {!categoryParam && (
                    <div className="flex items-center mb-4">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {categoryNameMap[category] || category}
                      </h2>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categoryTools.map(tool => (
                      <div key={tool.id} className="relative group">
                        <Link
                          href={`/tools/${tool.category}/${tool.id}`}
                          className="absolute inset-0 z-0"
                          aria-label={`打开${tool.name}工具`}
                        >
                          <span className="sr-only">打开{tool.name}工具</span>
                        </Link>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 block relative z-10 pointer-events-none">
                          <div className="flex items-center mb-3">
                            <div className={`p-2 rounded-md ${categoryColorMap[tool.category] || categoryColorMap['misc']} mr-3`}>
                              <tool.icon className="h-5 w-5" />
                            </div>
                            <h3 className="font-medium text-gray-900 dark:text-white">{tool.name}</h3>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {tool.description}
                          </p>
                        </div>
                        <button
                          onClick={(e) => handleFavoriteClick(e, tool.id)}
                          className={`absolute top-2 right-2 p-1.5 bg-white dark:bg-gray-700 rounded-full shadow focus:outline-none z-20 ${isFavorite(tool.id)
                            ? 'text-yellow-500 hover:text-yellow-600'
                            : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 opacity-0 group-hover:opacity-100'
                            } transition-opacity`}
                          title={isFavorite(tool.id) ? '取消收藏' : '添加到收藏'}
                        >
                          <FiStar className="w-4 h-4" fill={isFavorite(tool.id) ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {filteredTools().length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-xl mb-2">未找到工具</p>
                <p className="text-gray-500 dark:text-gray-400">
                  尝试其他搜索词或浏览所有工具
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 
