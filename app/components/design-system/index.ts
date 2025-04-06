// 卡片组件
export { Card, CardHeader, CardContent, CardFooter } from './Card';

// 按钮组件
export { default as Button } from './Button';

// 输入框组件
export { default as Input, TextArea } from './Input';

// 主题定义
export const THEME = {
  colors: {
    primary: {
      light: '#6366f1', // indigo-500
      dark: '#818cf8', // indigo-400
    },
    secondary: {
      light: '#9333ea', // purple-600
      dark: '#a855f7', // purple-500
    },
    gradient: {
      primary: 'from-indigo-600 to-purple-600',
      secondary: 'from-pink-500 to-rose-500',
      success: 'from-emerald-500 to-teal-500',
      warning: 'from-amber-500 to-orange-500',
      error: 'from-rose-500 to-red-500',
      info: 'from-sky-500 to-blue-500',
    },
  },
  shadows: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  },
  border: {
    radius: {
      sm: 'rounded-md',
      DEFAULT: 'rounded-xl',
      lg: 'rounded-2xl',
      full: 'rounded-full',
    },
  },
}; 
