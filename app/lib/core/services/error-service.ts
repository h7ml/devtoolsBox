/**
 * 错误处理服务
 * 提供统一的错误处理、记录和分析机制
 */

/**
 * 应用错误类型
 */
export enum ErrorType {
  /**
   * 验证错误
   */
  VALIDATION = 'validation',
  
  /**
   * 网络错误
   */
  NETWORK = 'network',
  
  /**
   * 权限错误
   */
  PERMISSION = 'permission',
  
  /**
   * 认证错误
   */
  AUTHENTICATION = 'authentication',
  
  /**
   * 服务器错误
   */
  SERVER = 'server',
  
  /**
   * 客户端错误
   */
  CLIENT = 'client',
  
  /**
   * 未知错误
   */
  UNKNOWN = 'unknown'
}

/**
 * 错误处理配置选项
 */
export interface ErrorServiceOptions {
  /**
   * 是否在控制台记录错误
   */
  enableConsoleLogging?: boolean;
  
  /**
   * 是否启用远程错误报告
   */
  enableRemoteReporting?: boolean;
  
  /**
   * 远程报告端点
   */
  remoteReportingEndpoint?: string;
  
  /**
   * 最大记录错误数
   */
  maxErrorsToStore?: number;
}

/**
 * 应用错误结构
 */
export interface AppError {
  /**
   * 错误ID
   */
  id: string;
  
  /**
   * 错误类型
   */
  type: ErrorType;
  
  /**
   * 错误消息
   */
  message: string;
  
  /**
   * 错误详情
   */
  details?: any;
  
  /**
   * 错误栈
   */
  stack?: string;
  
  /**
   * 发生时间
   */
  timestamp: number;
  
  /**
   * 用户ID，如果已登录
   */
  userId?: string;
  
  /**
   * 会话ID
   */
  sessionId?: string;
}

/**
 * 错误处理器类型
 */
export type ErrorHandler = (error: AppError) => void;

/**
 * 生成唯一ID
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * 错误处理服务类
 */
export class ErrorService {
  /**
   * 错误处理器集合
   */
  private handlers: ErrorHandler[] = [];
  
  /**
   * 配置选项
   */
  private options: ErrorServiceOptions;
  
  /**
   * 存储的错误
   */
  private errors: AppError[] = [];
  
  /**
   * 会话ID
   */
  private sessionId: string;

  /**
   * 构造函数
   */
  constructor(options: ErrorServiceOptions = {}) {
    this.options = {
      enableConsoleLogging: true,
      enableRemoteReporting: false,
      maxErrorsToStore: 100,
      ...options
    };
    
    // 生成会话ID
    this.sessionId = generateId();
    
    // 添加默认处理器
    if (this.options.enableConsoleLogging) {
      this.addHandler(this.consoleLogHandler);
    }
    
    if (this.options.enableRemoteReporting) {
      this.addHandler(this.remoteReportHandler);
    }
    
    // 捕获全局错误
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.captureError({
          type: ErrorType.CLIENT,
          message: event.message || 'Unknown Error',
          details: {
            lineno: event.lineno,
            colno: event.colno,
            filename: event.filename,
          },
          stack: event.error?.stack
        });
      });
      
      window.addEventListener('unhandledrejection', (event) => {
        this.captureError({
          type: ErrorType.CLIENT,
          message: 'Unhandled Promise Rejection',
          details: event.reason,
          stack: event.reason?.stack
        });
      });
    }
  }

  /**
   * 添加错误处理器
   */
  addHandler(handler: ErrorHandler): void {
    this.handlers.push(handler);
  }

  /**
   * 移除错误处理器
   */
  removeHandler(handler: ErrorHandler): void {
    this.handlers = this.handlers.filter(h => h !== handler);
  }

  /**
   * 捕获错误
   */
  captureError(errorData: Partial<AppError>): AppError {
    const error: AppError = {
      id: generateId(),
      type: errorData.type || ErrorType.UNKNOWN,
      message: errorData.message || 'An unknown error occurred',
      details: errorData.details,
      stack: errorData.stack,
      timestamp: Date.now(),
      userId: errorData.userId,
      sessionId: this.sessionId
    };
    
    // 存储错误
    this.storeError(error);
    
    // 处理错误
    this.handlers.forEach(handler => {
      try {
        handler(error);
      } catch (e) {
        console.error('Error handler failed:', e);
      }
    });
    
    return error;
  }

  /**
   * 捕获异常
   */
  captureException(error: Error, type: ErrorType = ErrorType.CLIENT, details?: any): AppError {
    return this.captureError({
      type,
      message: error.message,
      stack: error.stack,
      details
    });
  }

  /**
   * 获取所有错误
   */
  getErrors(): AppError[] {
    return [...this.errors];
  }

  /**
   * 清除错误
   */
  clearErrors(): void {
    this.errors = [];
  }

  /**
   * 设置用户ID
   */
  setUserId(userId: string | null): void {
    this.userId = userId;
  }

  /**
   * 控制台日志处理器
   */
  private consoleLogHandler = (error: AppError): void => {
    console.error('[ErrorService]', error.type.toUpperCase(), error.message, error);
  };

  /**
   * 远程报告处理器
   */
  private remoteReportHandler = (error: AppError): void => {
    if (!this.options.remoteReportingEndpoint) return;
    
    try {
      // 发送到远程端点
      fetch(this.options.remoteReportingEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(error),
        // 使用 keepalive 确保即使页面关闭也能发送
        keepalive: true
      }).catch(() => {
        // 忽略远程报告失败
      });
    } catch (e) {
      // 忽略错误
    }
  };

  /**
   * 存储错误
   */
  private storeError(error: AppError): void {
    this.errors.push(error);
    
    // 如果超过最大存储数量，删除最旧的
    if (this.errors.length > (this.options.maxErrorsToStore || 100)) {
      this.errors.shift();
    }
  }
  
  /**
   * 用户ID
   */
  private userId: string | null = null;
}

/**
 * 创建默认错误服务单例
 */
const defaultErrorService = new ErrorService();

/**
 * 导出默认错误服务实例
 */
export default defaultErrorService; 
 