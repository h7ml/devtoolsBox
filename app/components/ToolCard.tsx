import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiStar } from 'react-icons/fi';
import { Tool } from '../lib/tools-registry/types';
import { Card } from './design-system/Card';
import { categoryBadgeColorMap } from '../lib/tools-registry/categories';

interface ToolCardProps {
  tool: Tool;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function ToolCard({ tool, isFavorite, onToggleFavorite }: ToolCardProps) {
  const router = useRouter();

  // 处理卡片点击
  const handleCardClick = () => {
    router.push(`/tools/${tool.category}/${tool.id}`);
  };

  // 处理收藏按钮点击，阻止事件冒泡
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite();
  };

  return (
    <div
      className="relative group cursor-pointer transform transition-all duration-300 hover:-translate-y-1"
      onClick={handleCardClick}
    >
      {/* 卡片内容 */}
      <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-100/80 dark:border-gray-700/80 overflow-hidden shadow-lg hover:shadow-xl transition-all h-[140px]">
        <div className="p-5 backdrop-filter backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 h-full flex flex-col">
          <div className="flex items-center mb-3">
            <div className={`flex-shrink-0 p-2.5 rounded-xl bg-gradient-to-r ${categoryBadgeColorMap[tool.category] || 'from-gray-500 to-gray-600'} mr-3 text-white shadow-md`}>
              <tool.icon className="h-5 w-5" />
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">{tool.name}</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 flex-grow">
            {tool.description}
          </p>
        </div>

        {/* 底部指示条 */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-orange-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </div>

      {/* 收藏按钮 */}
      <button
        onClick={handleFavoriteClick}
        className={`absolute top-3 right-3 p-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-md focus:outline-none z-20 transition-all duration-200 
          ${isFavorite
            ? 'text-yellow-500 hover:text-yellow-600 scale-110'
            : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 opacity-0 group-hover:opacity-100 group-hover:scale-110'
          }`}
        title={isFavorite ? '取消收藏' : '添加到收藏'}
      >
        <FiStar className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
} 
