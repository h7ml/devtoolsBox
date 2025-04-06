import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  noPadding?: boolean;
}

/**
 * 磨砂玻璃效果卡片组件
 * 采用小米+Apple设计风格
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  noPadding = false,
}) => {
  return (
    <div
      className={`
        bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 
        shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 
        transition-all duration-300 ${hoverEffect ? 'hover:shadow-2xl' : ''} ${className}
      `}
    >
      <div
        className={`
          backdrop-blur-sm backdrop-filter bg-white/70 dark:bg-gray-800/70
          ${noPadding ? '' : 'p-6'}
        `}
      >
        {children}
      </div>
    </div>
  );
};

/**
 * 卡片标题区域组件
 */
export const CardHeader: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
  iconClassName?: string;
  gradientColors?: string;
}> = ({
  icon,
  title,
  description,
  className = '',
  iconClassName = '',
  gradientColors = 'from-indigo-500 to-purple-600',
}) => {
    return (
      <div className={`flex items-center gap-4 mb-6 ${className}`}>
        {icon && (
          <div className={`p-3 bg-gradient-to-r ${gradientColors} rounded-2xl text-white shadow-md ${iconClassName}`}>
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      </div>
    );
  };

/**
 * 卡片内容区域组件
 */
export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

/**
 * 卡片底部区域组件
 */
export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
};

export default Card; 
