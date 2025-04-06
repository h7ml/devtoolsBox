'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiCode, FiTool, FiTerminal, FiCpu, FiStar } from 'react-icons/fi';
import Link from 'next/link';
import NavBar from '../components/NavBar';
import { useToolsStore } from '../store/useToolsStore';

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { favoriteTools, isFavorite } = useToolsStore();

  const categories = [
    { id: 'text', name: '文本工具', icon: FiCode },
    { id: 'dev', name: '开发辅助', icon: FiTool },
    { id: 'runtime', name: '在线执行', icon: FiTerminal },
    { id: 'web', name: '爬虫工具', icon: FiCpu },
  ];

  const allTools = [
    {
      id: 'json-formatter',
      name: 'JSON 格式化',
      description: '格式化和验证JSON数据，使其更易于阅读和调试',
      category: 'text',
    },
    {
      id: 'text-diff',
      name: '文本对比',
      description: '比较两个文本之间的差异，突出显示增加和删除的内容',
      category: 'text',
    },
    {
      id: 'base64',
      name: 'Base64 编解码',
      description: '将文本和文件进行Base64编码或解码',
      category: 'text',
    },
    {
      id: 'url-encode',
      name: 'URL 编解码',
      description: '对URL字符串进行编码或解码处理',
      category: 'text',
    },
    {
      id: 'regex-tester',
      name: '正则表达式测试',
      description: '测试和调试正则表达式，实时显示匹配结果',
      category: 'dev',
    },
    {
      id: 'code-snippet',
      name: '代码片段生成器',
      description: '生成常用的代码片段模板和结构',
      category: 'dev',
    },
    {
      id: 'uuid-generator',
      name: 'UUID 生成器',
      description: '生成各种版本的UUID/GUID',
      category: 'dev',
    },
    {
      id: 'timestamp',
      name: '时间戳转换',
      description: '在Unix时间戳和人类可读日期之间转换',
      category: 'dev',
    },
    {
      id: 'js-sandbox',
      name: 'JavaScript 沙箱',
      description: '在安全的环境中运行和测试JavaScript代码',
      category: 'runtime',
    },
    {
      id: 'python-sandbox',
      name: 'Python 沙箱',
      description: '在线执行和测试Python代码',
      category: 'runtime',
    },
    {
      id: 'cookie-parser',
      name: 'Cookie 解析',
      description: '解析和格式化浏览器Cookie字符串',
      category: 'web',
    },
    {
      id: 'curl-converter',
      name: 'cURL 转换器',
      description: '将cURL命令转换为多种编程语言的HTTP请求代码',
      category: 'web',
    },
    {
      id: 'header-builder',
      name: 'HTTP头构造器',
      description: '生成和分析HTTP请求头',
      category: 'web',
    }
  ];

  // 过滤工具
  const filteredTools = allTools.filter(tool => {
    // 类别过滤
    const categoryMatch = !activeCategory || tool.category === activeCategory;

    // 搜索查询过滤
    const searchMatch = !searchQuery ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());

    return categoryMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">开发工具箱</h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              查找并使用各种开发工具来提高您的工作效率
            </p>
          </div>

          <div className="relative max-w-lg w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
              placeholder="搜索工具..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* 类别导航 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-lg font-medium text-sm ${!activeCategory
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              onClick={() => setActiveCategory(null)}
            >
              全部
            </button>

            {categories.map(category => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 ${activeCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <category.icon className="h-4 w-4" />
                {category.name}
              </button>
            ))}

            {favoriteTools.length > 0 && (
              <button
                className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 ${activeCategory === 'favorites'
                  ? 'bg-blue-500 text-white'
                  : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'}`}
                onClick={() => setActiveCategory('favorites')}
              >
                <FiStar className="h-4 w-4" />
                我的收藏
              </button>
            )}
          </div>
        </div>

        {/* 工具列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map(tool => (
            <Link
              key={tool.id}
              href={`/tools/${tool.category}/${tool.id}`}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {tool.name}
                </h3>
                {isFavorite(tool.id) && (
                  <FiStar className="h-5 w-5 text-yellow-500" />
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-2 flex-grow">
                {tool.description}
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {categories.find(c => c.id === tool.category)?.name || tool.category}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 dark:text-gray-500 text-5xl mb-4">
              ¯\_(ツ)_/¯
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              未找到匹配的工具
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              请尝试其他搜索关键词或类别
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 
