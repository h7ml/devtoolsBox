import React from 'react';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
  variant?: 'rectangle' | 'circle' | 'text';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * 骨架屏组件
 * 用于内容加载状态的占位显示
 */
const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  style = {},
  variant = 'rectangle',
  width,
  height,
  animation = 'pulse',
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'circle':
        return 'rounded-full';
      case 'text':
        return 'rounded-md';
      default:
        return 'rounded-md';
    }
  };

  const getAnimationClasses = () => {
    switch (animation) {
      case 'pulse':
        return 'animate-pulse';
      case 'wave':
        return 'relative overflow-hidden after:absolute after:inset-0 after:translate-x-[-100%] after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent after:animate-wave';
      default:
        return '';
    }
  };

  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 ${getVariantClasses()} ${getAnimationClasses()} ${className}`}
      style={{
        width,
        height,
        ...style,
      }}
    />
  );
};

/**
 * 工具卡片骨架屏
 */
export const ToolCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden shadow-md p-5">
      <div className="flex items-center mb-3">
        <Skeleton variant="circle" width={40} height={40} className="mr-3" />
        <Skeleton variant="text" width={120} height={20} />
      </div>
      <Skeleton variant="text" className="mb-2" height={16} />
      <Skeleton variant="text" width="80%" height={16} />
    </div>
  );
};

/**
 * 工具网格骨架屏
 */
export const ToolGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <ToolCardSkeleton key={index} />
        ))}
    </div>
  );
};

/**
 * 工具详情骨架屏
 */
export const ToolDetailSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Skeleton variant="circle" width={48} height={48} className="mr-4" />
        <div>
          <Skeleton variant="text" width={200} height={24} className="mb-2" />
          <Skeleton variant="text" width={300} height={16} />
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <Skeleton variant="text" width={200} height={32} className="mb-6" />
        <div className="space-y-4">
          <Skeleton variant="text" height={16} />
          <Skeleton variant="text" width="90%" height={16} />
          <Skeleton variant="text" width="80%" height={16} />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Skeleton height={40} />
          <Skeleton height={40} />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
