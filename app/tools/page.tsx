'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { registerAllTools, getAllTools, getToolsByCategory } from '../lib/tools-registry/register-tools';
import { Tool, ToolCategory } from '../lib/tools-registry/types';
import NavBar from '../components/NavBar';
import Link from 'next/link';
import { FiSearch, FiArrowLeft, FiStar, FiGrid, FiPackage } from 'react-icons/fi';
import { useFavorites } from '../hooks/useFavorites';
import ToolCard from '../components/ToolCard';
import { Card, CardHeader, Input, Button } from '../components/design-system';

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
  const [initError, setInitError] = useState<string | null>(null);

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
      <NavBar />

      {/* 磨砂玻璃效果标题栏 */}
      <div className="pt-16 pb-8 backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link
              href="/"
              className="mr-4 p-2.5 bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-full border border-gray-100 dark:border-gray-700"
            >
              <FiArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {categoryParam ? categoryNameMap[categoryParam] || categoryParam : '所有工具'}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                浏览并使用各种实用开发工具
              </p>
            </div>
          </div>

          {/* 搜索框 */}
          <div className="max-w-lg mx-auto">
            <Input
              icon={<FiSearch className="h-5 w-5" />}
              placeholder="搜索工具..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="shadow-md"
              gradient
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : initError ? (
        <Card className="mx-auto max-w-md mt-12">
          <CardHeader
            icon={<FiPackage className="h-6 w-6" />}
            title="初始化失败"
            description={initError}
            gradientColors="from-red-500 to-pink-600"
          />
          <Button
            onClick={() => window.location.reload()}
            gradient
            fullWidth
          >
            刷新页面
          </Button>
        </Card>
      ) : (
        <div className="px-4 pb-16">
          <div className="max-w-7xl mx-auto">
            {categories.map(category => {
              const categoryTools = currentToolsByCategory[category] || [];
              if (categoryTools.length === 0) return null;

              return (
                <div key={category} className="mb-10">
                  {!categoryParam && (
                    <div className="sticky top-16 z-10 py-3 backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-700 mb-4">
                      <div className="flex items-center">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                          {categoryNameMap[category] || category}
                        </h2>
                        <Link
                          href={`/tools?category=${category}`}
                          className="ml-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                        >
                          查看全部
                        </Link>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              <Card className="mx-auto max-w-md mt-12">
                <CardHeader
                  icon={<FiGrid className="h-6 w-6" />}
                  title="未找到工具"
                  description="尝试其他搜索词或浏览所有工具"
                  gradientColors="from-amber-500 to-orange-600"
                />
                <Button
                  onClick={() => setSearchTerm('')}
                  gradient
                  fullWidth
                >
                  清除搜索
                </Button>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 
