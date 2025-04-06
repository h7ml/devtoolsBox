'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { FiArrowLeft, FiStar } from 'react-icons/fi';
import Link from 'next/link';
import NavBar from '../../../components/NavBar';
import { useToolsStore } from '../../../store/useToolsStore';
import JsonFormatter from '../../../tools/json/json-formatter';

// 工具组件映射
const toolComponents: Record<string, React.ComponentType<any>> = {
  'json-formatter': JsonFormatter.component,
  // 其他工具组件将在这里添加
};

interface ToolPageProps {
  params: {
    category: string;
    toolId: string;
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  const { category, toolId } = params;
  const { addRecentTool, isFavorite, addFavorite, removeFavorite } = useToolsStore();
  const [mounted, setMounted] = useState(false);

  // 检查工具是否存在
  const toolExists = toolId in toolComponents;
  const ToolComponent = toolExists ? toolComponents[toolId] : null;

  useEffect(() => {
    setMounted(true);
    if (toolExists) {
      // 添加到最近使用的工具
      addRecentTool(toolId);
    }
  }, [toolId, toolExists, addRecentTool]);

  // 如果工具不存在，返回404
  if (!toolExists && mounted) {
    notFound();
  }

  // 处理收藏/取消收藏
  const toggleFavorite = () => {
    if (isFavorite(toolId)) {
      removeFavorite(toolId);
    } else {
      addFavorite(toolId);
    }
  };

  // 等待客户端挂载完成
  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900"></div>;
  }

  // 根据工具ID获取工具名称
  const getToolName = () => {
    switch (toolId) {
      case 'json-formatter':
        return 'JSON 格式化';
      case 'text-diff':
        return '文本对比';
      case 'base64':
        return 'Base64 编解码';
      case 'url-encode':
        return 'URL 编解码';
      case 'regex-tester':
        return '正则表达式测试';
      case 'code-snippet':
        return '代码片段生成器';
      case 'uuid-generator':
        return 'UUID 生成器';
      case 'timestamp':
        return '时间戳转换';
      case 'js-sandbox':
        return 'JavaScript 沙箱';
      case 'python-sandbox':
        return 'Python 沙箱';
      case 'cookie-parser':
        return 'Cookie 解析';
      case 'curl-converter':
        return 'cURL 转换器';
      case 'header-builder':
        return 'HTTP头构造器';
      default:
        return toolId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Link 
              href="/tools" 
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <FiArrowLeft className="h-5 w-5 mr-2" />
              返回工具列表
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {getToolName()}
            </h1>
          </div>
          
          <button
            onClick={toggleFavorite}
            className={`p-2 rounded-md focus:outline-none ${
              isFavorite(toolId)
                ? 'text-yellow-500 hover:text-yellow-600 dark:hover:text-yellow-400'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
            }`}
            aria-label={isFavorite(toolId) ? '取消收藏' : '添加到收藏'}
          >
            <FiStar className="h-6 w-6" fill={isFavorite(toolId) ? 'currentColor' : 'none'} />
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {ToolComponent && <ToolComponent />}
        </div>
      </div>
    </div>
  );
} 