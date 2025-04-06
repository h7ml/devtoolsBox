'use client';

import { FiGithub, FiCode, FiPackage, FiStar, FiUsers, FiHeart } from 'react-icons/fi';
import NavBar from '../components/NavBar';

export default function About() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />

      <div className="max-w-5xl mx-auto pt-28 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white inline-flex items-center">
            关于<span className="text-orange-500 ml-2">工具盒子</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            一个为开发者精心打造的在线工具集合
          </p>
        </div>

        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-8 shadow-sm mb-10 border border-gray-100/50 dark:border-gray-700/50">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            项目简介
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            工具盒子是一款针对程序员与开发者设计的多功能工具集合。我们的目标是提供一站式解决方案，
            集成各种常用开发工具，让您在日常工作中提高效率，减少在不同平台间切换的时间成本。
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            我们的特色在于简洁的界面设计、快速的工具访问以及完全免费的使用体验。无论您是前端开发者、
            后端工程师还是全栈开发人员，都能在这里找到适合您的工具。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-md bg-orange-100 dark:bg-orange-900/30 text-orange-500">
                  <FiPackage className="w-6 h-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">丰富的工具集</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  包含开发辅助、文本处理、爬虫工具等多个分类，满足各种开发需求
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-500">
                  <FiCode className="w-6 h-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">本地化处理</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  所有工具在浏览器本地运行，无需担心数据泄露风险
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-500">
                  <FiStar className="w-6 h-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">收藏和历史</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  支持收藏常用工具和记录最近使用，让您操作更便捷
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-md bg-green-100 dark:bg-green-900/30 text-green-500">
                  <FiUsers className="w-6 h-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">开源项目</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  完全开源，欢迎社区贡献和改进，共同打造更好的开发工具集
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-8 shadow-sm mb-10 border border-gray-100/50 dark:border-gray-700/50">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            技术栈
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30">
              <img src="https://nextjs.org/favicon.ico" alt="Next.js" className="w-12 h-12 mx-auto mb-3" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Next.js</span>
            </div>
            <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30">
              <img src="https://reactjs.org/favicon.ico" alt="React" className="w-12 h-12 mx-auto mb-3" />
              <span className="font-medium text-gray-700 dark:text-gray-300">React</span>
            </div>
            <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30">
              <img src="https://www.typescriptlang.org/favicon-32x32.png" alt="TypeScript" className="w-12 h-12 mx-auto mb-3" />
              <span className="font-medium text-gray-700 dark:text-gray-300">TypeScript</span>
            </div>
            <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30">
              <img src="https://tailwindcss.com/favicons/favicon-32x32.png" alt="Tailwind CSS" className="w-12 h-12 mx-auto mb-3" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Tailwind CSS</span>
            </div>
          </div>
        </div>

        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-gray-100/50 dark:border-gray-700/50">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            开发团队
          </h2>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                工具盒子由一群热爱编程的开发者共同贡献和维护。
                如果您也有兴趣参与本项目，欢迎通过以下方式加入我们。
              </p>
              <div className="flex items-center space-x-6 mt-6">
                <a
                  href="https://github.com/h7ml/devtoolsBox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500"
                >
                  <FiGithub className="mr-2 h-5 w-5" />
                  <span>GitHub 仓库</span>
                </a>
                <a
                  href="https://github.com/h7ml/devtoolsBox/issues/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500"
                >
                  <FiCode className="mr-2 h-5 w-5" />
                  <span>提交问题</span>
                </a>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-24 h-24 flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-500">
                <FiHeart className="w-12 h-12" />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12 text-sm text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} 工具盒子 - 帮助开发者提高工作效率</p>
          <p className="mt-2">
            <a
              href="https://github.com/h7ml/devtoolsBox"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-600"
            >
              开源项目
            </a> · 由
            <a
              href="https://github.com/h7ml"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-600 ml-1"
            >
              h7ml
            </a>
            设计和开发
          </p>
        </div>
      </div>
    </main>
  );
} 
