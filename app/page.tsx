import Link from 'next/link';
import { FiSearch, FiTool, FiCode, FiTerminal, FiCpu } from 'react-icons/fi';
import NavBar from './components/NavBar';

export default function Home() {
  const toolCategories = [
    {
      id: 'text',
      name: '文本工具',
      description: 'JSON格式化、Diff比较、Base64、URL编码等',
      icon: FiCode,
      tools: ['json-formatter', 'text-diff', 'base64', 'url-encode']
    },
    {
      id: 'dev',
      name: '开发辅助',
      description: '正则测试、代码片段生成器、UUID/时间戳',
      icon: FiTool,
      tools: ['regex-tester', 'code-snippet', 'uuid-generator', 'timestamp']
    },
    {
      id: 'runtime',
      name: '在线执行',
      description: 'JavaScript/Python代码在线执行环境',
      icon: FiTerminal,
      tools: ['js-sandbox', 'python-sandbox']
    },
    {
      id: 'web',
      name: '爬虫工具',
      description: 'Cookie解析、cURL转代码、Header构造器',
      icon: FiCpu,
      tools: ['cookie-parser', 'curl-converter', 'header-builder']
    },
  ];

  return (
    <main className="min-h-screen">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 英雄区域 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            DevTools<span className="text-blue-500">Box</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            为开发者打造的一站式在线工具箱，提升您的开发效率
          </p>

          <div className="mt-8 flex justify-center">
            <div className="relative rounded-full w-full max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full 
                         bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="搜索工具..."
              />
            </div>
          </div>
        </div>

        {/* 工具分类 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {toolCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden 
                       shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <category.icon className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {category.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {category.tools.map((toolId) => (
                    <Link
                      href={`/tools/${category.id}/${toolId}`}
                      key={toolId}
                      className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900 
                               text-blue-700 dark:text-blue-200 rounded-md text-sm
                               hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                    >
                      {toolId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 功能优势 */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-10">
            为什么选择 DevToolsBox？
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                高效开发
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                所有工具集中在一处，告别标签页切换困扰
              </p>
            </div>

            <div className="p-6">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                安全隐私
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                所有处理均在本地进行，无需担心数据泄露风险
              </p>
            </div>

            <div className="p-6">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                个性化体验
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                自定义收藏工具，打造专属开发环境
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 
