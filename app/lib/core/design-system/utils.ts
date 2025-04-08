/**
 * 设计系统工具函数
 * 提供UI组件相关的辅助函数
 */

import { Size, Variant } from './types';

/**
 * 合并类名
 * 过滤掉假值，并用空格连接
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * 根据尺寸获取相应的样式类
 */
export function getSizeClasses(size: Size, component: 'button' | 'input' | 'text' | 'icon'): string {
  const sizeMap = {
    button: {
      xs: 'py-1 px-2 text-xs',
      sm: 'py-1.5 px-3 text-xs',
      md: 'py-2.5 px-4 text-sm',
      lg: 'py-3 px-5 text-base',
      xl: 'py-4 px-6 text-lg',
      '2xl': 'py-5 px-8 text-xl',
      '3xl': 'py-6 px-10 text-2xl',
      '4xl': 'py-7 px-12 text-3xl',
      '5xl': 'py-8 px-14 text-4xl',
    },
    input: {
      xs: 'py-1 px-2 text-xs',
      sm: 'py-1.5 px-3 text-xs',
      md: 'py-2.5 px-4 text-sm',
      lg: 'py-3 px-5 text-base',
      xl: 'py-4 px-6 text-lg',
      '2xl': 'py-5 px-8 text-xl',
      '3xl': 'py-6 px-10 text-xl',
      '4xl': 'py-7 px-12 text-2xl',
      '5xl': 'py-8 px-14 text-3xl',
    },
    text: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
    },
    icon: {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-7 h-7',
      '2xl': 'w-8 h-8',
      '3xl': 'w-10 h-10',
      '4xl': 'w-12 h-12',
      '5xl': 'w-16 h-16',
    }
  };

  return sizeMap[component][size] || sizeMap[component].md;
}

/**
 * 获取变体样式类
 */
export function getVariantClasses(
  variant: Variant,
  component: 'button' | 'card' | 'badge',
  isGradient: boolean = false
): string {
  const variantMap = {
    button: {
      primary: isGradient
        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg'
        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg',
      secondary: isGradient
        ? 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300 shadow-md hover:shadow-lg'
        : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 shadow-md hover:shadow-lg',
      outline: 'border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
      ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/80 backdrop-blur-sm',
      success: isGradient
        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg'
        : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg',
      warning: isGradient
        ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg'
        : 'bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-lg',
      error: isGradient
        ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-md hover:shadow-lg'
        : 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg',
    },
    card: {
      primary: 'border border-indigo-100 dark:border-indigo-900/50 bg-white dark:bg-gray-800',
      secondary: 'border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800',
      outline: 'border border-gray-200 dark:border-gray-700 bg-transparent',
      ghost: 'bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm',
      success: 'border border-green-100 dark:border-green-900/50 bg-white dark:bg-gray-800',
      warning: 'border border-amber-100 dark:border-amber-900/50 bg-white dark:bg-gray-800',
      error: 'border border-red-100 dark:border-red-900/50 bg-white dark:bg-gray-800',
    },
    badge: {
      primary: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      outline: 'border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300',
      ghost: 'bg-transparent text-gray-700 dark:text-gray-300',
      success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    }
  };

  return variantMap[component][variant] || variantMap[component].primary;
}

/**
 * 获取圆角样式类
 */
export function getRoundedClasses(rounded: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'): string {
  const roundedMap = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full',
  };

  return roundedMap[rounded] || roundedMap.md;
}

/**
 * 生成唯一ID
 */
export function generateId(prefix: string = 'ui'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 延迟执行
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 检测当前是否为暗色模式
 */
export function isDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  
  if (typeof window.matchMedia !== 'function') return false;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * 计算颜色对比度
 */
export function getContrastRatio(foreground: string, background: string): number {
  // 简化版实现，实际应用中可能需要更复杂的算法
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const getLuminance = (color: string) => {
    const rgb = hexToRgb(color);
    if (!rgb) return 0;
    
    const { r, g, b } = rgb;
    const [R, G, B] = [r, g, b].map(c => {
      const val = c / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  };

  const luminance1 = getLuminance(foreground);
  const luminance2 = getLuminance(background);
  
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  
  return (lighter + 0.05) / (darker + 0.05);
} 
 