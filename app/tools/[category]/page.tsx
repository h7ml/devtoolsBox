'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { registerAllTools, getToolsByCategory } from '../../lib/tools-registry/register-tools';
import { Tool, ToolCategory } from '../../lib/tools-registry/types';
import { categoryNameMap } from '../../lib/tools-registry/categories';
import NavBarWithModals from '../../components/NavBarWithModals';
import Link from 'next/link';
import { FiSearch, FiArrowLeft, FiBox, FiChevronRight, FiHome, FiGrid, FiPackage } from 'react-icons/fi';
import { useFavorites } from '../../hooks/useFavorites';
import ToolCard from '../../components/ToolCard';
import { Card, CardHeader, Input, Button } from '../../components/design-system';

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const [searchTerm, setSearchTerm] = useState('');
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [initError, setInitError] = useState<string | null>(null);

  // 加载特定类别的工具
  useEffect(() => {
    const loadTools = async () => {
      try {
        setLoading(true);
        // 注册所有工具（异步）
        await registerAllTools();

        // 获取特定类别的工具
        const categoryTools = getToolsByCategory(category as ToolCategory);
        setTools(categoryTools);
      } catch (error) {
        console.error('加载工具失败:', error);
        setInitError('工具加载失败，请刷新页面重试');
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      loadTools();
    }
  }, [category]); // 仅依赖分类参数

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

  // 获取分类的显示名称
  const categoryDisplayName = categoryNameMap[category] || category;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBarWithModals />

      <div className="pt-4 pb-2 backdrop-blur-md bg-white/80 dark:bg-gray-800/80 sticky top-16 z-10 shadow-sm border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 面包屑导航 */}
          <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 py-2">
            <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300 flex items-center">
              <FiHome className="h-4 w-4 mr-1" />
              <span>首页</span>
            </Link>
            <FiChevronRight className="h-3 w-3 mx-2" />
            <Link href="/tools" className="hover:text-gray-700 dark:hover:text-gray-300 flex items-center">
              <FiBox className="h-4 w-4 mr-1" />
              <span>工具箱</span>
            </Link>
            <FiChevronRight className="h-3 w-3 mx-2" />
            <span className="text-gray-900 dark:text-white font-medium">{categoryDisplayName}</span>
          </nav>

          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center">
              <Link
                href="/tools"
                className="mr-4 p-2.5 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700"
                aria-label="返回"
              >
                <FiArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {categoryDisplayName}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  浏览所有{categoryDisplayName}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 搜索框 */}
      <div className="pt-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          <Input
            icon={<FiSearch className="h-5 w-5" />}
            placeholder={`搜索${categoryDisplayName}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="shadow-md"
            gradient
          />
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="max-w-7xl mx-auto">
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
            <>
              {filteredTools().length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredTools().map(tool => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      isFavorite={isFavorite(tool.id)}
                      onToggleFavorite={() => toggleFavorite(tool.id)}
                    />
                  ))}
                </div>
              ) : (
                <Card className="mx-auto max-w-md mt-12">
                  <CardHeader
                    icon={<FiGrid className="h-6 w-6" />}
                    title="未找到工具"
                    description={
                      searchTerm.trim() !== ''
                        ? `没有与"${searchTerm}"匹配的${categoryDisplayName}`
                        : `此分类下暂无工具`
                    }
                    gradientColors="from-amber-500 to-orange-600"
                  />
                  {searchTerm.trim() !== '' && (
                    <Button
                      onClick={() => setSearchTerm('')}
                      gradient
                      fullWidth
                    >
                      清除搜索
                    </Button>
                  )}
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 
