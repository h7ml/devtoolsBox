import Link from 'next/link';
import { FiStar } from 'react-icons/fi';
import { Tool } from '../lib/tools-registry/types';

// 定义工具分类颜色映射
const categoryColorMap: Record<string, string> = {
  'text': 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300',
  'json': 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300',
  'dev': 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300',
  'runtime': 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-300',
  'web': 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-300',
  'misc': 'bg-gray-50 dark:bg-gray-700/30 text-gray-600 dark:text-gray-300',
};

interface ToolCardProps {
  tool: Tool;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function ToolCard({ tool, isFavorite, onToggleFavorite }: ToolCardProps) {
  // 处理收藏按钮点击，阻止事件冒泡
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite();
  };

  return (
    <div className="relative group">
      {/* 整个卡片的链接 */}
      <Link
        href={`/tools/${tool.category}/${tool.id}`}
        className="absolute inset-0 z-0"
        aria-label={`打开${tool.name}工具`}
      >
        <span className="sr-only">打开{tool.name}工具</span>
      </Link>

      {/* 卡片内容 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 block relative z-10 pointer-events-none">
        <div className="flex items-center mb-3">
          <div className={`p-2 rounded-md ${categoryColorMap[tool.category] || categoryColorMap['misc']} mr-3`}>
            <tool.icon className="h-5 w-5" />
          </div>
          <h3 className="font-medium text-gray-900 dark:text-white">{tool.name}</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {tool.description}
        </p>
      </div>

      {/* 收藏按钮 */}
      <button
        onClick={handleFavoriteClick}
        className={`absolute top-2 right-2 p-1.5 bg-white dark:bg-gray-700 rounded-full shadow focus:outline-none z-20 ${isFavorite
            ? 'text-yellow-500 hover:text-yellow-600'
            : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 opacity-0 group-hover:opacity-100'
          } transition-opacity`}
        title={isFavorite ? '取消收藏' : '添加到收藏'}
      >
        <FiStar className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
} 
