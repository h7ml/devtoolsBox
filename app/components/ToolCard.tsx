'use client';

import { memo, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiStar } from 'react-icons/fi';
import { Tool } from '../lib/tools-registry/types';

export interface ToolCardProps {
  tool: Tool;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

// 使用 React.memo 避免不必要的重渲染
const ToolCard = memo(({ tool, isFavorite = false, onToggleFavorite }: ToolCardProps) => {
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);

  // 使用 useCallback 缓存事件处理函数
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  // 使用 useCallback 避免每次渲染都创建新函数
  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onToggleFavorite) {
      onToggleFavorite();
    }
  }, [onToggleFavorite]);

  // 使用 useMemo 缓存样式和颜色计算
  const categoryColorClass = useMemo(() => {
    const colorMap: Record<string, string> = {
      dev: 'bg-purple-500',
      text: 'bg-blue-500',
      web: 'bg-teal-500',
      json: 'bg-amber-500',
      misc: 'bg-gray-500',
      formatter: 'bg-green-500',
      crypto: 'bg-red-500',
      conversion: 'bg-cyan-500',
      encoding: 'bg-violet-500',
      datetime: 'bg-yellow-500',
      math: 'bg-orange-500',
    };

    return colorMap[tool.category] || 'bg-gray-500';
  }, [tool.category]);

  // 使用 useMemo 计算卡片样式
  const cardStyle = useMemo(() => ({
    transform: isHovering ? 'translateY(-4px)' : 'translateY(0)',
    boxShadow: isHovering
      ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  }), [isHovering]);

  return (
    <Link
      href={`/tools/${tool.category}/${tool.id}`}
      className="block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="relative rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 h-full transition-all duration-300"
        style={cardStyle}
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2 rounded-lg ${categoryColorClass} text-white`}>
            <tool.icon className="w-5 h-5" />
          </div>
          <button
            onClick={handleFavoriteClick}
            className={`text-lg ${isFavorite ? 'text-yellow-500' : 'text-gray-400 dark:text-gray-600'} hover:text-yellow-500 transition-colors`}
            aria-label={isFavorite ? "从收藏中移除" : "添加到收藏"}
          >
            <FiStar className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{tool.name}</h3>

        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{tool.description}</p>
      </div>
    </Link>
  );
});

// 为组件添加显示名称，方便调试
ToolCard.displayName = 'ToolCard';

export default ToolCard; 
