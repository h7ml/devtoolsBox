'use client';

import Link from 'next/link';
import { FiHome, FiSearch, FiArrowLeft } from 'react-icons/fi';
import NavBar from './components/NavBar';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />

      <div className="pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-center py-16">
          {/* 404 图标 */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-blue-500 dark:bg-blue-600 rounded-full opacity-20 animate-pulse"></div>
            <div className="relative bg-blue-100 dark:bg-blue-900/30 rounded-full w-40 h-40 flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 text-6xl font-bold">404</span>
            </div>
          </div>

          {/* 错误信息 */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            页面未找到
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 text-center max-w-md">
            抱歉，您要查找的页面不存在或已被移动。
          </p>

          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/"
              className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-md hover:shadow-lg"
            >
              <FiHome className="mr-2 h-5 w-5" />
              返回首页
            </Link>

            <Link
              href="/tools"
              className="flex items-center px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl transition-colors shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <FiSearch className="mr-2 h-5 w-5" />
              查看工具
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex items-center px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl transition-colors shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <FiArrowLeft className="mr-2 h-5 w-5" />
              返回上页
            </button>
          </div>
        </div>

        {/* 帮助提示 */}
        <div className="max-w-xl mx-auto mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">
            正在寻找开发工具？
          </h3>
          <p className="text-blue-600 dark:text-blue-400 mb-4">
            您可以前往 <Link href="/tools/dev" className="text-blue-700 dark:text-blue-300 underline">工具箱</Link> 探索我们的工具集合。
          </p>
        </div>
      </div>
    </div>
  );
} 
