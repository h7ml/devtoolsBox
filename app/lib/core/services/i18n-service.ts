/**
 * 国际化服务
 * 提供多语言支持和文本翻译功能
 */

'use client';

/**
 * 支持的语言
 */
export enum Language {
  ZH_CN = 'zh-CN',
  EN_US = 'en-US',
  JA_JP = 'ja-JP',
  KO_KR = 'ko-KR'
}

/**
 * 翻译资源类型
 */
export type TranslationResources = {
  [key: string]: string | TranslationResources;
};

/**
 * 国际化服务类
 */
export class I18nService {
  private static instance: I18nService;
  private currentLanguage: Language = Language.ZH_CN;
  private translations: Record<Language, TranslationResources> = {} as Record<Language, TranslationResources>;
  private readonly storageKey = 'app_language';
  
  private constructor() {
    this.loadLanguagePreference();
  }
  
  /**
   * 获取单例实例
   */
  public static getInstance(): I18nService {
    if (!I18nService.instance) {
      I18nService.instance = new I18nService();
    }
    return I18nService.instance;
  }
  
  /**
   * 添加翻译资源
   */
  public addTranslation(language: Language, resources: TranslationResources): void {
    this.translations[language] = {
      ...this.translations[language],
      ...resources
    };
  }
  
  /**
   * 设置当前语言
   */
  public setLanguage(language: Language): void {
    this.currentLanguage = language;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, language);
      document.documentElement.lang = language;
    }
  }
  
  /**
   * 获取当前语言
   */
  public getLanguage(): Language {
    return this.currentLanguage;
  }
  
  /**
   * 获取翻译文本
   */
  public t(key: string, params: Record<string, string> = {}): string {
    // 根据路径获取翻译项
    const path = key.split('.');
    let value: any = this.translations[this.currentLanguage];
    
    // 沿路径查找翻译
    for (const segment of path) {
      if (!value || typeof value !== 'object') {
        return key; // 未找到翻译，返回键名
      }
      value = value[segment];
    }
    
    // 如果找不到翻译，尝试使用默认语言
    if (value === undefined && this.currentLanguage !== Language.ZH_CN) {
      value = this.getTranslationFromDefaultLanguage(path);
    }
    
    // 如果仍然找不到翻译，返回键名
    if (typeof value !== 'string') {
      return key;
    }
    
    // 替换参数
    return this.replaceParams(value, params);
  }
  
  /**
   * 从默认语言获取翻译
   */
  private getTranslationFromDefaultLanguage(path: string[]): string | undefined {
    let value: any = this.translations[Language.ZH_CN];
    
    for (const segment of path) {
      if (!value || typeof value !== 'object') {
        return undefined;
      }
      value = value[segment];
    }
    
    return typeof value === 'string' ? value : undefined;
  }
  
  /**
   * 替换参数
   */
  private replaceParams(text: string, params: Record<string, string>): string {
    return Object.entries(params).reduce(
      (result, [key, value]) => result.replace(new RegExp(`{{${key}}}`, 'g'), value),
      text
    );
  }
  
  /**
   * 加载语言偏好
   */
  private loadLanguagePreference(): void {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem(this.storageKey) as Language | null;
      
      if (savedLanguage && Object.values(Language).includes(savedLanguage)) {
        this.currentLanguage = savedLanguage;
      } else {
        // 尝试从浏览器语言设置中获取
        const browserLang = navigator.language;
        if (browserLang.startsWith('zh')) this.currentLanguage = Language.ZH_CN;
        else if (browserLang.startsWith('en')) this.currentLanguage = Language.EN_US;
        else if (browserLang.startsWith('ja')) this.currentLanguage = Language.JA_JP;
        else if (browserLang.startsWith('ko')) this.currentLanguage = Language.KO_KR;
      }
      
      document.documentElement.lang = this.currentLanguage;
    }
  }
}

// 导出默认实例
export const i18nService = I18nService.getInstance();
