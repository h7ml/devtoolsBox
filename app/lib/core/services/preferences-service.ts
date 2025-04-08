/**
 * 用户偏好服务
 * 管理用户界面、功能偏好设置
 */

'use client';

/**
 * 用户偏好接口
 */
export interface UserPreferences {
  [key: string]: any;
}

/**
 * 用户偏好服务
 */
export class PreferencesService {
  private static instance: PreferencesService;
  private preferences: UserPreferences = {};
  private readonly storageKey = 'user_preferences';
  
  private constructor() {
    this.loadPreferences();
  }
  
  /**
   * 获取单例实例
   */
  public static getInstance(): PreferencesService {
    if (!PreferencesService.instance) {
      PreferencesService.instance = new PreferencesService();
    }
    return PreferencesService.instance;
  }
  
  /**
   * 获取所有偏好设置
   */
  public getAllPreferences(): UserPreferences {
    return { ...this.preferences };
  }
  
  /**
   * 获取特定偏好设置
   */
  public getPreference<T>(key: string, defaultValue?: T): T {
    return key in this.preferences 
      ? this.preferences[key] 
      : (defaultValue as T);
  }
  
  /**
   * 设置偏好
   */
  public setPreference(key: string, value: any): void {
    this.preferences[key] = value;
    this.savePreferences();
  }
  
  /**
   * 删除偏好
   */
  public removePreference(key: string): void {
    if (key in this.preferences) {
      delete this.preferences[key];
      this.savePreferences();
    }
  }
  
  /**
   * 重置所有偏好
   */
  public resetAllPreferences(): void {
    this.preferences = {};
    this.savePreferences();
  }
  
  /**
   * 加载偏好
   */
  private loadPreferences(): void {
    if (typeof window !== 'undefined') {
      try {
        const savedPreferences = localStorage.getItem(this.storageKey);
        if (savedPreferences) {
          this.preferences = JSON.parse(savedPreferences);
        }
      } catch (error) {
        console.error('加载用户偏好失败:', error);
      }
    }
  }
  
  /**
   * 保存偏好
   */
  private savePreferences(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.preferences));
      } catch (error) {
        console.error('保存用户偏好失败:', error);
      }
    }
  }
}

// 导出默认实例
export const preferencesService = PreferencesService.getInstance();
