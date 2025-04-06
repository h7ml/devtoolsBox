import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiStar } from 'react-icons/fi';
import { Tool } from '../lib/tools-registry/types';
import { Card } from './design-system';
import { categoryColorMap } from '../lib/tools-registry/categories';

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
    <div className="relative group cursor-pointer" onClick={handleCardClick}>
      {/* 卡片内容 */}
      <Card className="h-full transform transition-transform duration-300 group-hover:translate-y-[-3px]">
        <div>
          <div className="flex items-center mb-3">
            <div className={`p-2.5 rounded-xl bg-gradient-to-r ${categoryColorMap[tool.category] || categoryColorMap['misc']} mr-3 text-white shadow-md`}>
              <tool.icon className="h-5 w-5" />
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white">{tool.name}</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {tool.description}
          </p>
        </div>
      </Card>

      {/* 收藏按钮 */}
      <button
        onClick={handleFavoriteClick}
        className={`absolute top-3 right-3 p-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-md focus:outline-none z-20 transition-all duration-200 
          ${isFavorite
            ? 'text-yellow-500 hover:text-yellow-600'
            : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 opacity-0 group-hover:opacity-100'
          }`}
        title={isFavorite ? '取消收藏' : '添加到收藏'}
      >
        <FiStar className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
} 
