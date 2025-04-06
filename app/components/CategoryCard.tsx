import Link from 'next/link';
import { IconType } from 'react-icons';
import { ToolCategory } from '../lib/tools-registry/types';
import { categoryBadgeColorMap, categoryNameMap } from '../lib/tools-registry/categories';

interface CategoryCardProps {
  id: ToolCategory;
  name: string;
  icon: IconType;
  description: string;
  toolCount?: number;
}

/**
 * 工具分类卡片组件
 * 小米+Apple风格设计
 */
export default function CategoryCard({ id, name, icon: Icon, description, toolCount }: CategoryCardProps) {
  return (
    <Link
      href={`/tools?category=${id}`}
      className="group block relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-100/80 dark:border-gray-700/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="p-6 backdrop-filter backdrop-blur-sm bg-white/70 dark:bg-gray-800/70">
        <div className={`inline-flex items-center justify-center p-3.5 rounded-xl mb-4 bg-gradient-to-r ${categoryBadgeColorMap[id] || 'from-gray-500 to-gray-600'}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 group-hover:text-orange-500 transition-colors">
          {name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {description}
        </p>

        {toolCount !== undefined && (
          <div className="flex items-center mt-4">
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              {toolCount} 个工具
            </span>
          </div>
        )}
      </div>

      {/* 悬停效果 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-orange-500/10 dark:to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      {/* 底部渐变条 */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </Link>
  );
}
