'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiStar, FiPackage, FiBook, FiTrendingUp, FiChevronRight,
  FiCode, FiClock, FiFileText, FiLock, FiImage, FiPieChart,
  FiGrid, FiCpu, FiDatabase, FiTerminal, FiGlobe, FiHash,
  FiLayers, FiRepeat, FiKey, FiSliders, FiMapPin, FiMove
} from 'react-icons/fi';
import ToolCard from './components/ToolCard';
import { useFavorites } from './hooks/useFavorites';
import NavBarWithModals from './components/NavBarWithModals';
import { registerAllTools, getAllTools, getPopularTools, getToolsByCategory } from './lib/tools-registry/register-tools';
import { Tool, ToolCategory } from './lib/tools-registry/types';
import { categoryNameMap, categoryBadgeColorMap } from './lib/tools-registry/categories';

// 类别图标映射
const categoryIconMap: Record<string, React.ElementType> = {
  'text': FiFileText,
  'dev': FiTerminal,
  'runtime': FiCpu,
  'web': FiGlobe,
  'json': FiCode,
  'misc': FiStar,
  'formatter': FiSliders,
  'conversion': FiRepeat,
  'encoding': FiHash,
  'datetime': FiClock,
  'time': FiClock,
  'crypto': FiLock,
  'image': FiImage,
  'calculator': FiPieChart,
  'generator': FiGrid,
  'network': FiGlobe,
  'frontend': FiLayers,
  'password': FiKey,
  'testing': FiTerminal,
  'color': FiImage,
  'geo': FiMapPin,
  'unit': FiMove,
  'format': FiSliders,
  'math': FiPieChart
};

// 工具分类接口
interface ToolCategoryItem {
  id: ToolCategory;
  name: string;
  icon: React.ElementType;
  description: string;
  toolCount: number;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const [popularTools, setPopularTools] = useState<Tool[]>([]);
  const [favoriteTools, setFavoriteTools] = useState<Tool[]>([]);
  const [initError, setInitError] = useState<string | null>(null);
  const [toolCategories, setToolCategories] = useState<ToolCategoryItem[]>([]);

  useEffect(() => {
    const initTools = async () => {
      try {
        // 注册所有工具
        await registerAllTools();

        // 获取热门工具
        const popular = getPopularTools(8);
        setPopularTools(popular);

        // 获取所有工具
        const allTools = getAllTools();

        // 根据收藏状态筛选工具
        const favTools = allTools.filter(tool => favorites.includes(tool.id));
        setFavoriteTools(favTools);

        // 构建类别数组
        const categories: ToolCategoryItem[] = [];
        Object.keys(categoryNameMap).forEach((categoryId) => {
          const id = categoryId as ToolCategory;
          const categoryTools = getToolsByCategory(id);

          // 只展示有工具的类别
          if (categoryTools.length > 0) {
            categories.push({
              id,
              name: categoryNameMap[id] || id,
              // 使用映射的图标或默认图标
              icon: categoryIconMap[id] || FiStar,
              description: getCategoryDescription(id),
              toolCount: categoryTools.length
            });
          }
        });

        // 将分类按工具数量排序
        categories.sort((a, b) => b.toolCount - a.toolCount);

        // 只展示前8个类别
        setToolCategories(categories.slice(0, 8));
      } catch (error) {
        console.error('工具初始化失败:', error);
        setInitError('工具加载失败，请刷新页面重试');
      } finally {
        setIsLoading(false);
      }
    };

    initTools();
  }, [favorites]);

  // 获取类别描述
  const getCategoryDescription = (category: ToolCategory): string => {
    const descriptions: Record<ToolCategory, string> = {
      'text': '文本编码、转换与处理工具',
      'dev': '为开发者提供的实用工具集',
      'runtime': '运行时环境相关工具',
      'web': 'Web请求测试与模拟工具',
      'json': 'JSON格式化与转换工具',
      'misc': '更多实用小工具',
      'formatter': '各种数据格式化工具',
      'conversion': '数据格式转换工具',
      'encoding': '各种编码解码工具',
      'datetime': '日期时间处理工具',
      'time': '时间转换与计算工具',
      'crypto': '加密解密相关工具',
      'image': '图像处理与转换工具',
      'calculator': '各种计算器工具',
      'generator': '代码与数据生成工具',
      'network': '网络请求与分析工具',
      'frontend': '前端开发辅助工具',
      'password': '密码生成与验证工具',
      'testing': '测试与调试工具',
      'color': '颜色选择与转换工具',
      'geo': '地理位置工具',
      'unit': '单位换算工具',
      'format': '代码格式化工具',
      'math': '数学计算工具'
    };

    return descriptions[category] || '实用工具';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBarWithModals />

      <main className="pt-16 pb-8">
        {/* Hero 区域 - 增强暗色模式视觉效果 */}
        <div className="relative px-4 py-20 overflow-hidden bg-gradient-to-br from-orange-500/90 to-orange-600 dark:from-orange-600/90 dark:to-orange-700 dark:border-b dark:border-orange-800/50 shadow-lg">
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              强大的开发工具集
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              一站式开发工具集，提升您的开发效率，为您的工作流程赋能
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/tools"
                className="px-6 py-3 text-orange-600 dark:text-orange-700 bg-white dark:bg-white/95 rounded-lg font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                浏览所有工具
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-3 text-white border border-white/60 dark:border-white/80 rounded-lg font-medium hover:bg-white/10 dark:hover:bg-white/20 transition-all"
              >
                我的工具箱
              </Link>
            </div>
          </div>
          {/* 装饰图形 - 增强暗色模式下的装饰效果 */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/10 dark:bg-white/15"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-white/10 dark:bg-white/15"></div>
            <div className="absolute top-1/4 right-1/3 w-16 h-16 rounded-full bg-white/10 dark:bg-white/15"></div>
            {/* 暗色模式特有装饰 */}
            <div className="hidden dark:block absolute bottom-1/3 left-1/4 w-24 h-24 rounded-full bg-orange-800/30 blur-xl"></div>
            <div className="hidden dark:block absolute top-1/2 right-1/4 w-20 h-20 rounded-full bg-orange-800/30 blur-xl"></div>
          </div>
          {/* 暗色模式特有光效 */}
          <div className="hidden dark:block absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent mix-blend-overlay"></div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 dark:border-orange-400"></div>
          </div>
        ) : initError ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-red-500 dark:text-red-400 text-xl mb-2">初始化失败</p>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{initError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-orange-500 dark:bg-orange-600 text-white rounded-md hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors"
            >
              刷新页面
            </button>
          </div>
        ) : (
          <>
            {/* 工具分类卡片 - 增强暗色模式样式 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">浏览工具类别</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {toolCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/tools?category=${category.id}`}
                    className="group block relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-100/80 dark:border-gray-700/50 dark:hover:border-gray-600/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="p-6 backdrop-filter backdrop-blur-sm bg-white/70 dark:bg-gray-800/80">
                      <div className={`inline-flex items-center justify-center p-3.5 rounded-xl mb-4 bg-gradient-to-r ${categoryBadgeColorMap[category.id] || 'from-gray-500 to-gray-600'}`}>
                        <category.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {category.description}
                      </p>
                      <div className="flex items-center mt-4">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                          {category.toolCount} 个工具
                        </span>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-orange-500/10 dark:to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-400 to-orange-500 dark:via-orange-500 dark:to-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    {/* 暗色模式特有光效 */}
                    <div className="hidden dark:block absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 我的收藏 - 增强暗色模式样式 */}
            {favoriteTools.length > 0 && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700 mr-3 text-white shadow-md">
                      <FiStar className="h-5 w-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">我的收藏</h2>
                  </div>
                  <Link href="/dashboard" className="flex items-center group text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 transition-colors">
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

            {/* 热门工具 - 增强暗色模式样式 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 mr-3 text-white shadow-md">
                    <FiTrendingUp className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">热门工具</h2>
                </div>
                <Link href="/tools" className="flex items-center group text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 transition-colors">
                  <span className="mr-1">查看全部</span>
                  <FiChevronRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {popularTools.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {popularTools.slice(0, 8).map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      isFavorite={isFavorite(tool.id)}
                      onToggleFavorite={() => toggleFavorite(tool.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-100/80 dark:border-gray-700/50 backdrop-blur-sm shadow-lg p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    暂无热门工具，请先添加工具
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <footer className="bg-white dark:bg-gray-800 py-12 mt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-6">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500">
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
