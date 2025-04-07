'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { registerAllTools, getAllTools, getToolsByCategory } from '../lib/tools-registry/register-tools';
import { Tool, ToolCategory } from '../lib/tools-registry/types';
import NavBarWithModals from '../components/NavBarWithModals';
import Link from 'next/link';
import { FiSearch, FiArrowLeft, FiStar, FiGrid, FiList, FiTag, FiFilter } from 'react-icons/fi';
import { useFavorites } from '../hooks/useFavorites';
import ToolCard from '../components/ToolCard';
import { categoryNameMap } from '../lib/tools-registry/categories';
import StructuredData from '../components/StructuredData';
import { generateBreadcrumbStructuredData } from '../components/dynamicSEO';

export default function ToolListPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [searchTerm, setSearchTerm] = useState('');
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [initError, setInitError] = useState<string | null>(null);
  const [breadcrumbData, setBreadcrumbData] = useState(null);

  // 只在初始化和分类参数变化时加载工具
  useEffect(() => {
    const loadTools = async () => {
      try {
        // 注册所有工具（异步）
        await registerAllTools();

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
      } catch (error) {
        console.error('加载工具失败:', error);
        setInitError('工具加载失败，请刷新页面重试');
      } finally {
        setLoading(false);
      }
    };

    loadTools();
  }, [categoryParam]); // 仅依赖分类参数

  // 生成面包屑结构化数据
  useEffect(() => {
    const category = searchParams?.get('category');
    if (category) {
      setBreadcrumbData(generateBreadcrumbStructuredData([
        { name: '首页', item: '/' },
        { name: '工具', item: '/tools' },
        { name: categoryNameMap[category] || category, item: `/tools?category=${category}` }
      ]));
    } else {
      setBreadcrumbData(generateBreadcrumbStructuredData([
        { name: '首页', item: '/' },
        { name: '全部工具', item: '/tools' }
      ]));
    }
  }, [searchParams]);

  // 过滤工具
  const filteredTools = useCallback(() => {
    if (searchTerm.trim() === '') return tools;
    return tools.filter(tool =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tool.meta?.keywords || []).some(keyword =>
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
      <NavBarWithModals />

      {/* 添加结构化数据 */}
      {breadcrumbData && <StructuredData data={breadcrumbData} />}

      <main className="container mx-auto px-4 py-8 pt-24">
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
      </main>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : initError ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-500 text-xl mb-2">初始化失败</p>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{initError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            刷新页面
          </button>
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
                      <ToolCard
                        key={tool.id}
                        tool={tool}
                        isFavorite={isFavorite(tool.id)}
                        onToggleFavorite={() => toggleFavorite(tool.id)}
                      />
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
