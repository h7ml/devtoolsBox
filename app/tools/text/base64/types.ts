/**
 * Base64编解码工具 - 类型定义
 */

// 基础操作模式
export type Base64Mode = 'encode' | 'decode';

// 输入类型
export type InputType = 'text' | 'file' | 'binary';

// 输出类型
export type OutputType = 'text' | 'file' | 'binary' | 'dataUrl';

// 处理选项
export interface Base64Options {
  // 基本选项
  mode: Base64Mode;
  urlSafe: boolean;
  
  // 输入输出选项
  inputType: InputType;
  outputType: OutputType;
  
  // 高级选项
  paddingEnabled: boolean; // 是否保留末尾的=
  chunkSize: number;       // 分块处理大小 (字节)
  useWorker: boolean;      // 是否使用 Web Worker
  compress: boolean;       // 是否使用 gzip 压缩
  
  // 安全选项
  validateInput: boolean;  // 是否验证输入
  detectSensitive: boolean; // 是否检测敏感信息
}

// 操作结果
export interface Base64Result {
  success: boolean;
  data?: string | Blob | ArrayBuffer;
  error?: string;
  meta?: {
    originalSize: number;   // 原始大小 (字节)
    resultSize: number;     // 结果大小 (字节)
    processingTime: number; // 处理时间 (毫秒)
    detectedType?: string;  // 检测到的类型 (如 "image/jpeg")
    warnings?: string[];    // 警告信息
  };
}

// 历史记录项
export interface HistoryItem {
  id: string;
  timestamp: number;
  mode: Base64Mode;
  inputPreview: string;    // 输入的前缀预览
  outputPreview: string;   // 输出的前缀预览
  inputType: InputType;
  outputType: OutputType;
  options: Partial<Base64Options>;
}

// Web Worker 消息类型
export interface WorkerMessage {
  type: 'encode' | 'decode';
  data: string | ArrayBuffer;
  options: Partial<Base64Options>;
}

// Web Worker 响应类型
export interface WorkerResponse {
  success: boolean;
  result?: any;
  error?: string;
  meta?: Record<string, any>;
} 
