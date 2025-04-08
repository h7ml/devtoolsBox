/**
 * 分析服务
 * 提供用户行为跟踪和统计分析功能
 */

'use client';

/**
 * 事件类型
 */
export enum EventType {
  PAGE_VIEW = 'page_view',
  TOOL_USED = 'tool_used',
  FEATURE_USED = 'feature_used',
  BUTTON_CLICK = 'button_click',
  ERROR = 'error'
}

/**
 * 事件数据接口
 */
export interface EventData {
  [key: string]: any;
}

/**
 * 分析配置选项
 */
export interface AnalyticsOptions {
  enableTracking?: boolean;
  apiEndpoint?: string;
  sampleRate?: number;
}

/**
 * 分析服务类
 */
export class AnalyticsService {
  private static instance: AnalyticsService;
  private enabled: boolean = false;
  private apiEndpoint: string = '';
  private sampleRate: number = 1.0; // 默认100%采样率
  
  private constructor(options: AnalyticsOptions = {}) {
    this.enabled = options.enableTracking ?? false;
    this.apiEndpoint = options.apiEndpoint ?? '';
    this.sampleRate = options.sampleRate ?? 1.0;
  }
  
  /**
   * 获取单例实例
   */
  public static getInstance(options?: AnalyticsOptions): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService(options);
    }
    return AnalyticsService.instance;
  }
  
  /**
   * 启用跟踪
   */
  public enableTracking(enable: boolean = true): void {
    this.enabled = enable;
  }
  
  /**
   * 设置API端点
   */
  public setApiEndpoint(endpoint: string): void {
    this.apiEndpoint = endpoint;
  }
  
  /**
   * 设置采样率
   */
  public setSampleRate(rate: number): void {
    this.sampleRate = Math.max(0, Math.min(1, rate));
  }
  
  /**
   * 跟踪事件
   */
  public trackEvent(eventType: EventType, data: EventData = {}): void {
    if (!this.enabled || !this.shouldSample()) {
      return;
    }
    
    const eventData = {
      event_type: eventType,
      timestamp: new Date().toISOString(),
      ...data
    };
    
    // 开发环境下仅记录到控制台
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', eventData);
      return;
    }
    
    // 生产环境发送到API
    if (this.apiEndpoint) {
      this.sendToApi(eventData);
    }
  }
  
  /**
   * 跟踪页面访问
   */
  public trackPageView(path: string, title?: string): void {
    this.trackEvent(EventType.PAGE_VIEW, { path, title });
  }
  
  /**
   * 跟踪工具使用
   */
  public trackToolUsage(toolId: string, action: string, metadata: any = {}): void {
    this.trackEvent(EventType.TOOL_USED, { 
      tool_id: toolId, 
      action, 
      ...metadata 
    });
  }
  
  /**
   * 跟踪错误
   */
  public trackError(error: Error, context: any = {}): void {
    this.trackEvent(EventType.ERROR, {
      error_name: error.name,
      error_message: error.message,
      error_stack: error.stack,
      ...context
    });
  }
  
  /**
   * 判断是否应该采样
   */
  private shouldSample(): boolean {
    return Math.random() < this.sampleRate;
  }
  
  /**
   * 发送数据到API
   */
  private sendToApi(data: any): void {
    if (!this.apiEndpoint) return;
    
    try {
      navigator.sendBeacon(this.apiEndpoint, JSON.stringify(data));
    } catch (error) {
      // 降级使用fetch
      fetch(this.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true
      }).catch(e => console.error('发送分析数据失败:', e));
    }
  }
}

// 创建默认实例
export const analyticsService = AnalyticsService.getInstance({
  enableTracking: process.env.NODE_ENV === 'production'
});
