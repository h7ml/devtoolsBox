/**
 * 主题服务
 * 提供主题相关功能
 */

'use client';

/**
 * 主题模式
 */
export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

/**
 * 主题服务类
 */
export class ThemeService {
  private static instance: ThemeService;
  private currentTheme: ThemeMode = ThemeMode.SYSTEM;
  
  private constructor() {
    // 私有构造函数
  }
  
  /**
   * 获取单例实例
   */
  public static getInstance(): ThemeService {
    if (!ThemeService.instance) {
      ThemeService.instance = new ThemeService();
    }
    return ThemeService.instance;
  }
  
  /**
   * 设置主题
   */
  public setTheme(theme: ThemeMode): void {
    this.currentTheme = theme;
    
    // 将主题应用到文档
    if (typeof document !== 'undefined') {
      const isDark = theme === ThemeMode.DARK || 
        (theme === ThemeMode.SYSTEM && this.isSystemDarkMode());
      
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // 存储主题到本地存储
      localStorage.setItem('theme', theme);
    }
  }
  
  /**
   * 获取当前主题
   */
  public getTheme(): ThemeMode {
    return this.currentTheme;
  }
  
  /**
   * 初始化主题
   */
  public initTheme(): void {
    if (typeof window !== 'undefined') {
      // 从本地存储获取主题
      const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
      
      if (savedTheme) {
        this.currentTheme = savedTheme;
      }
      
      // 应用主题
      this.setTheme(this.currentTheme);
    }
  }
  
  /**
   * 检查系统是否为暗色模式
   */
  private isSystemDarkMode(): boolean {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  }
}

// 导出默认实例
export const themeService = ThemeService.getInstance();
