'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiHome, FiArrowLeft, FiSearch } from 'react-icons/fi';
import NavBar from './components/NavBar';

export default function NotFound() {
  // 动画变量
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <div className="flex-grow flex items-center justify-center p-4">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="relative mx-auto w-64 h-64 mb-8">
            <div className="absolute inset-0 bg-blue-500 rounded-full opacity-10 animate-pulse"></div>
            <div className="absolute inset-4 bg-blue-500 rounded-full opacity-20 animate-pulse animation-delay-150"></div>
            <div className="absolute inset-8 bg-blue-500 rounded-full opacity-30 animate-pulse animation-delay-300"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-9xl font-bold text-blue-500">404</span>
            </div>
          </motion.div>

          <motion.h1 variants={item} className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            页面未找到
          </motion.h1>

          <motion.p variants={item} className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            抱歉，您要查找的页面不存在或已被移动。
          </motion.p>

          <motion.div
            variants={item}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiHome className="w-5 h-5" />
              <span>返回首页</span>
            </Link>

            <Link
              href="/tools"
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <FiSearch className="w-5 h-5" />
              <span>查看工具</span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>返回上页</span>
            </button>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-12 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800"
          >
            <p className="text-blue-800 dark:text-blue-200">
              正在寻找开发工具？您可以前往 <Link href="/tools" className="font-medium underline">工具箱</Link> 探索我们的工具集合。
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 
