'use client';

import React from 'react';
import Logo from './Logo';

interface LogoDisplayProps {
  showText?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const LogoDisplay: React.FC<LogoDisplayProps> = ({
  showText = true,
  size = 'medium',
  className = '',
}) => {
  // 根据尺寸确定logo和文字大小
  const sizes = {
    small: { logo: 30, fontSize: 'text-lg' },
    medium: { logo: 50, fontSize: 'text-2xl' },
    large: { logo: 80, fontSize: 'text-4xl' }
  };

  const { logo, fontSize } = sizes[size];

  return (
    <div className={`flex items-center ${className}`}>
      <Logo
        width={logo}
        height={logo}
        className="flex-shrink-0 dark:text-white text-gray-800 transition-colors"
      />

      {showText && (
        <div className="ml-3 flex flex-col">
          <span className={`font-bold ${fontSize} bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-500`}>
            DevTools<span className="text-gray-800 dark:text-white">Box</span>
          </span>
          <span className="text-xs text-gray-600 dark:text-gray-300">
            开发者工具集合
          </span>
        </div>
      )}
    </div>
  );
};

export default LogoDisplay; 
