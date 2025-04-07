'use client';

import React, { useEffect, useState, forwardRef } from 'react';
import Logo from './Logo';

interface AnimatedLogoProps {
  width?: number;
  height?: number;
  className?: string;
  onAnimationComplete?: () => void;
}

const AnimatedLogo = forwardRef<SVGSVGElement, AnimatedLogoProps>(({
  width = 120,
  height = 120,
  className = '',
  onAnimationComplete
}, ref) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Logo 先显示
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 600);

    // 动画完成
    const animationTimer = setTimeout(() => {
      setIsAnimating(false);
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 2000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(animationTimer);
    };
  }, [onAnimationComplete]);

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`
        transform transition-all duration-1000 ease-out
        ${isAnimating ? 'scale-110' : 'scale-100'}
      `}>
        <Logo
          ref={ref}
          width={width}
          height={height}
          className={`
            transition-all duration-700
            ${isAnimating ? 'animate-pulse' : ''}
          `}
        />
      </div>

      <div className={`
        mt-4 text-center transform transition-all duration-500 
        ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-500">
          DevTools<span className="text-gray-800 dark:text-white">Box</span>
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          开发者的工具宝库
        </p>
      </div>
    </div>
  );
});

AnimatedLogo.displayName = 'AnimatedLogo';

export default AnimatedLogo;
