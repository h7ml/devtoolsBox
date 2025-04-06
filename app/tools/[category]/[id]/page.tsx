'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, notFound } from 'next/navigation';
import { registerAllTools, getToolById, getRelatedTools } from '../../../lib/tools-registry/register-tools';
import { Tool } from '../../../lib/tools-registry/types';
import NavBar from '../../../components/NavBar';
import ToolCard from '../../../components/ToolCard';
import { FiArrowLeft, FiStar, FiHome, FiChevronRight, FiBox, FiClock, FiInfo } from 'react-icons/fi';
import Link from 'next/link';
import { useFavorites } from '../../../hooks/useFavorites';
import { categoryBadgeColorMap, categoryNameMap } from '../../../lib/tools-registry/categories';
import { motion, AnimatePresence } from 'framer-motion';

export default function ToolPage() {
  const params = useParams();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedTools, setRelatedTools] = useState<Tool[]>([]);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  // 加载工具并记录使用历史，仅在初始化和路由参数变化时执行
  useEffect(() => {
    const loadTool = async () => {
      try {
        // 确保工具已注册
        await registerAllTools();

        if (params.id && params.category) {
          const foundTool = getToolById(params.id as string);
          if (foundTool) {
            setTool(foundTool);
            // 获取相关工具
            const related = getRelatedTools(foundTool.id, 4);
            setRelatedTools(related);

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
      } catch (error) {
        console.error('加载工具失败:', error);
      } finally {
        // 添加轻微延迟以便显示加载动画
        setTimeout(() => setLoading(false), 300);
      }
    };

    loadTool();
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

  // 加载中状态 - 使用骨架屏
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavBar />
        <div className="pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* 骨架屏 - 工具标题 */}
            <div className="flex items-center mb-6 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-4"></div>
              <div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-64"></div>
              </div>
            </div>

            {/* 骨架屏 - 工具内容 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-1/3 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-4/6"></div>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categoryName = categoryNameMap[params.category as string] || params.category as string;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />

      {/* 导航头部 - 采用磨砂玻璃效果 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="pb-2 backdrop-blur-md bg-white/80 dark:bg-gray-800/80 sticky top-16 z-10 shadow-sm border-b border-gray-100 dark:border-gray-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 面包屑导航 */}
          <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 py-3 overflow-x-auto scrollbar-hide">
            <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300 flex items-center shrink-0">
              <FiHome className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">首页</span>
            </Link>
            <FiChevronRight className="h-3 w-3 mx-2 shrink-0" />
            <Link href="/tools" className="hover:text-gray-700 dark:hover:text-gray-300 flex items-center shrink-0">
              <FiBox className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">工具箱</span>
            </Link>
            <FiChevronRight className="h-3 w-3 mx-2 shrink-0" />
            <Link
              href={`/tools?category=${params.category}`}
              className="hover:text-gray-700 dark:hover:text-gray-300 shrink-0"
            >
              {categoryName}
            </Link>
            <FiChevronRight className="h-3 w-3 mx-2 shrink-0" />
            <span className="text-gray-900 dark:text-white font-medium truncate">{tool?.name}</span>
          </nav>

          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-3">
              <Link
                href={`/tools?category=${params.category}`}
                className="shrink-0 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all hover:scale-105 border border-gray-100 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-label="返回"
              >
                <FiArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </Link>
              <div className="overflow-hidden">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {tool?.name}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {tool?.description}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsInfoVisible(!isInfoVisible)}
                className="p-2 rounded-full focus:outline-none transition-all duration-200 border border-gray-100 dark:border-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg hover:scale-105"
                title="工具信息"
              >
                <FiInfo className="h-5 w-5" />
              </button>

              <motion.button
                onClick={handleToggleFavorite}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-full focus:outline-none transition-all duration-200 border shadow-md hover:shadow-lg hover:scale-105 ${tool && isFavorite(tool.id)
                    ? 'text-yellow-500 hover:text-yellow-600 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'
                  }`}
                title={tool && isFavorite(tool.id) ? '取消收藏' : '添加到收藏'}
              >
                <FiStar className="h-5 w-5" fill={tool && isFavorite(tool.id) ? 'currentColor' : 'none'} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 工具信息面板 */}
      <AnimatePresence>
        {isInfoVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-orange-50 dark:bg-orange-900/10 border-b border-orange-100 dark:border-orange-900/20"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center text-sm text-orange-700 dark:text-orange-300">
                <FiClock className="h-4 w-4 mr-2" />
                <span>最后更新: {tool?.meta?.version || '1.0.0'}</span>
                {tool?.meta?.author && (
                  <>
                    <span className="mx-2">•</span>
                    <span>作者: {tool.meta.author}</span>
                  </>
                )}
              </div>
              {tool?.meta?.keywords && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {tool.meta.keywords.map((keyword, index) => (
                    <span key={index} className="px-2 py-1 text-xs rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="px-4 sm:px-6 lg:px-8 pb-16 pt-6"
      >
        <div className="max-w-7xl mx-auto">
          {/* 工具组件 */}
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-100/80 dark:border-gray-700/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden mb-10">
            <div className="backdrop-filter backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 p-4 sm:p-6 md:p-8">
              {tool?.component && <tool.component />}
            </div>
          </div>

          {/* 相关工具 */}
          {relatedTools.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center mb-6">
                <div className={`p-2 rounded-xl bg-gradient-to-r ${categoryBadgeColorMap[tool.category] || 'from-gray-500 to-gray-600'} mr-3 text-white shadow-md`}>
                  <tool.icon className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">相关工具</h2>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {relatedTools.map((relatedTool) => (
                  <ToolCard
                    key={relatedTool.id}
                    tool={relatedTool}
                    isFavorite={isFavorite(relatedTool.id)}
                    onToggleFavorite={() => toggleFavorite(relatedTool.id)}
                  />
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
} 
