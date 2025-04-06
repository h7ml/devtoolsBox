'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, notFound } from 'next/navigation';
import { registerAllTools, getToolById } from '../../../lib/tools-registry/register-tools';
import { Tool } from '../../../lib/tools-registry/types';
import NavBar from '../../../components/NavBar';
import { FiArrowLeft, FiStar, FiHome, FiChevronRight, FiBox } from 'react-icons/fi';
import Link from 'next/link';
import { useFavorites } from '../../../hooks/useFavorites';

export default function ToolPage() {
  const params = useParams();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();

  // 加载工具并记录使用历史，仅在初始化和路由参数变化时执行
  useEffect(() => {
    // 确保工具已注册
    registerAllTools();

    if (params.id && params.category) {
      const foundTool = getToolById(params.id as string);
      if (foundTool) {
        setTool(foundTool);

        // 记录最近使用
        try {
          const recentTools = JSON.parse(localStorage.getItem('recentTools') || '[]');
          // 移除已存在的相同工具，防止重复
          const filteredRecent = recentTools.filter((id: string) => id !== foundTool.id);
          // 添加到最前面
          filteredRecent.unshift(foundTool.id);
          // 最多保存10个
          localStorage.setItem('recentTools', JSON.stringify(filteredRecent.slice(0, 10)));
        } catch (e) {
          console.error('无法保存最近使用', e);
        }
      }
    }

    setLoading(false);
  }, [params.id, params.category]); // 仅在路由参数变化时重新执行

  // 处理收藏按钮点击
  const handleToggleFavorite = useCallback(() => {
    if (tool) {
      toggleFavorite(tool.id);
    }
  }, [tool, toggleFavorite]);

  // 如果工具不存在，返回404
  if (!loading && !tool) {
    notFound();
  }

  // 加载中状态
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavBar />
        <div className="pt-16 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // 获取类别名称
  const getCategoryName = (category: string) => {
    const categoryMap: Record<string, string> = {
      'dev': '开发工具',
      'text': '文本工具',
      'json': 'JSON工具',
      'web': '网络工具',
      'misc': '其他工具',
      'runtime': '运行时工具'
    };
    return categoryMap[category] || category;
  };

  // 渲染工具组件
  const ToolComponent = tool?.component;
  const categoryName = getCategoryName(params.category as string);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />

      {/* 导航头部 - 采用磨砂玻璃效果 */}
      <div className="pb-2 backdrop-blur-md bg-white/80 dark:bg-gray-800/80 sticky top-16 z-10 shadow-sm border-b border-gray-100 dark:border-gray-700">
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
            <Link
              href={`/tools/${params.category}`}
              className="hover:text-gray-700 dark:hover:text-gray-300"
            >
              {categoryName}
            </Link>
            <FiChevronRight className="h-3 w-3 mx-2" />
            <span className="text-gray-900 dark:text-white font-medium">{tool?.name}</span>
          </nav>

          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center">
              <Link
                href="/"
                className="mr-4 p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700"
                aria-label="返回"
              >
                <FiArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tool?.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {tool?.description}
                </p>
              </div>
            </div>

            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-full focus:outline-none transition-colors duration-200 border ${tool && isFavorite(tool.id)
                ? 'text-yellow-500 hover:text-yellow-600 border-yellow-200 dark:border-yellow-800'
                : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 border-gray-100 dark:border-gray-700'
                }`}
              title={tool && isFavorite(tool.id) ? '取消收藏' : '添加到收藏'}
            >
              <FiStar className="h-6 w-6" fill={tool && isFavorite(tool.id) ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 pb-16 pt-24">
        <div className="max-w-7xl mx-auto">
          {ToolComponent && <ToolComponent />}
        </div>
      </div>
    </div>
  );
} 
