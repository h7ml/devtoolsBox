import { useState, useEffect } from 'react';

export type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * 断点定义（对应Tailwind默认断点）
 */
export const breakpoints: Record<BreakpointKey, number> = {
  'xs': 0,     // 移动设备 
  'sm': 640,   // 小型平板
  'md': 768,   // 平板
  'lg': 1024,  // 笔记本
  'xl': 1280,  // 桌面显示器
  '2xl': 1536  // 大屏幕
};

/**
 * 响应式断点Hook，用于在React组件中响应屏幕大小变化
 * @returns 当前屏幕宽度、断点和检查函数
 */
export default function useResponsive() {
  const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [currentBreakpoint, setCurrentBreakpoint] = useState<BreakpointKey>('xs');

  useEffect(() => {
    // 只在客户端执行
    if (typeof window === 'undefined') return;

    // 设置初始值
    handleResize();

    // 添加窗口大小变化监听器
    window.addEventListener('resize', handleResize);
    
    // 清理监听器
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /**
   * 处理窗口大小变化
   */
  const handleResize = () => {
    const newWidth = window.innerWidth;
    setWidth(newWidth);

    // 确定当前断点
    if (newWidth >= breakpoints['2xl']) {
      setCurrentBreakpoint('2xl');
    } else if (newWidth >= breakpoints.xl) {
      setCurrentBreakpoint('xl');
    } else if (newWidth >= breakpoints.lg) {
      setCurrentBreakpoint('lg');
    } else if (newWidth >= breakpoints.md) {
      setCurrentBreakpoint('md');
    } else if (newWidth >= breakpoints.sm) {
      setCurrentBreakpoint('sm');
    } else {
      setCurrentBreakpoint('xs');
    }
  };

  /**
   * 检查当前视窗是否小于等于指定断点
   * @param breakpoint 检查的断点
   * @returns 是否小于等于断点
   */
  const down = (breakpoint: BreakpointKey): boolean => {
    return width <= breakpoints[breakpoint];
  };

  /**
   * 检查当前视窗是否大于等于指定断点
   * @param breakpoint 检查的断点
   * @returns 是否大于等于断点
   */
  const up = (breakpoint: BreakpointKey): boolean => {
    return width >= breakpoints[breakpoint];
  };

  /**
   * 检查当前视窗是否在两个断点之间
   * @param start 起始断点
   * @param end 结束断点
   * @returns 是否在断点之间
   */
  const between = (start: BreakpointKey, end: BreakpointKey): boolean => {
    return width >= breakpoints[start] && width <= breakpoints[end];
  };

  /**
   * 检查当前视窗是否匹配指定断点
   * @param breakpoint 检查的断点
   * @returns 是否匹配断点
   */
  const only = (breakpoint: BreakpointKey): boolean => {
    if (breakpoint === 'xs') {
      return width < breakpoints.sm;
    }
    
    if (breakpoint === '2xl') {
      return width >= breakpoints['2xl'];
    }
    
    const nextBreakpoint = getNextBreakpoint(breakpoint);
    return width >= breakpoints[breakpoint] && width < breakpoints[nextBreakpoint];
  };

  /**
   * 获取下一个更大的断点
   * @param breakpoint 当前断点
   * @returns 下一个断点
   */
  const getNextBreakpoint = (breakpoint: BreakpointKey): BreakpointKey => {
    const keys = Object.keys(breakpoints) as BreakpointKey[];
    const index = keys.indexOf(breakpoint);
    return index < keys.length - 1 ? keys[index + 1] : keys[index];
  };

  return {
    width,
    breakpoint: currentBreakpoint,
    breakpoints,
    down,
    up,
    between,
    only,
    isMobile: down('sm'),
    isTablet: between('sm', 'lg'),
    isDesktop: up('lg')
  };
} 
