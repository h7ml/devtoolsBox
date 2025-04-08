/**
 * Base64编解码工具 - 编码器
 */

import { Base64Options, Base64Result } from '../types';
import { detectSensitiveData } from './validation';

/**
 * 文本编码为Base64
 * @param text 要编码的文本
 * @param options 编码选项
 * @returns 编码结果
 */
export async function encodeText(text: string, options: Partial<Base64Options> = {}): Promise<Base64Result> {
  const startTime = performance.now();
  const originalSize = new TextEncoder().encode(text).length;
  
  try {
    // 检测敏感信息
    const warnings = options.detectSensitive ? detectSensitiveData(text) : [];
    
    // 压缩数据（如果启用）
    let processedText = text;
    if (options.compress) {
      processedText = await compressText(text);
    }
    
    // 使用内置方法编码
    const encoded = btoa(unescape(encodeURIComponent(processedText)));
    
    // URL安全处理
    let result = encoded;
    if (options.urlSafe) {
      result = makeUrlSafe(encoded);
      
      // 移除填充（如果不需要）
      if (options.paddingEnabled === false) {
        result = result.replace(/=+$/, '');
      }
    }
    
    return {
      success: true,
      data: result,
      meta: {
        originalSize,
        resultSize: result.length,
        processingTime: performance.now() - startTime,
        warnings: warnings.length ? warnings : undefined
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `编码失败: ${(error as Error).message}`,
      meta: {
        originalSize,
        resultSize: 0,
        processingTime: performance.now() - startTime
      }
    };
  }
}

/**
 * 文件编码为Base64
 * @param file 要编码的文件
 * @param options 编码选项
 * @returns 编码结果，根据选项可能是字符串或DataURL
 */
export async function encodeFile(file: File, options: Partial<Base64Options> = {}): Promise<Base64Result> {
  const startTime = performance.now();
  const originalSize = file.size;
  
  try {
    // 检查文件大小
    if (file.size > 50 * 1024 * 1024) { // 50MB
      return {
        success: false,
        error: '文件过大，请使用小于50MB的文件',
        meta: {
          originalSize,
          resultSize: 0,
          processingTime: performance.now() - startTime
        }
      };
    }
    
    // 读取文件内容
    const arrayBuffer = await file.arrayBuffer();
    
    // 创建结果
    let result: string;
    
    // 如果选择DataURL输出
    if (options.outputType === 'dataUrl') {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      result = dataUrl;
    } else {
      // 普通Base64输出
      result = await encodeArrayBuffer(arrayBuffer, options);
    }
    
    return {
      success: true,
      data: result,
      meta: {
        originalSize,
        resultSize: result.length,
        processingTime: performance.now() - startTime,
        detectedType: file.type
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `文件编码失败: ${(error as Error).message}`,
      meta: {
        originalSize,
        resultSize: 0,
        processingTime: performance.now() - startTime
      }
    };
  }
}

/**
 * 二进制数据编码为Base64
 * @param data 二进制数据（ArrayBuffer）
 * @param options 编码选项
 * @returns 编码结果
 */
export async function encodeArrayBuffer(data: ArrayBuffer, options: Partial<Base64Options> = {}): Promise<string> {
  const bytes = new Uint8Array(data);
  let binary = '';
  const len = bytes.byteLength;
  
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  
  let result = btoa(binary);
  
  // URL安全处理
  if (options.urlSafe) {
    result = makeUrlSafe(result);
    
    // 移除填充（如果不需要）
    if (options.paddingEnabled === false) {
      result = result.replace(/=+$/, '');
    }
  }
  
  return result;
}

/**
 * 分块处理大文件
 * @param file 要处理的文件
 * @param options 编码选项
 * @param chunkSize 分块大小（字节）
 * @returns 编码结果
 */
export async function processLargeFile(
  file: File, 
  options: Partial<Base64Options> = {},
  chunkSize: number = 1024 * 1024 // 默认1MB
): Promise<Base64Result> {
  const startTime = performance.now();
  const totalChunks = Math.ceil(file.size / chunkSize);
  let result = '';
  
  try {
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(file.size, start + chunkSize);
      const chunk = file.slice(start, end);
      
      const chunkArrayBuffer = await chunk.arrayBuffer();
      const encodedChunk = await encodeArrayBuffer(chunkArrayBuffer, options);
      
      result += encodedChunk;
      
      // 这里可以添加进度回调
    }
    
    return {
      success: true,
      data: result,
      meta: {
        originalSize: file.size,
        resultSize: result.length,
        processingTime: performance.now() - startTime,
        detectedType: file.type
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `大文件处理失败: ${(error as Error).message}`,
      meta: {
        originalSize: file.size,
        resultSize: result.length,
        processingTime: performance.now() - startTime
      }
    };
  }
}

/**
 * 使用gzip压缩文本
 * @param text 要压缩的文本
 * @returns 压缩后的文本
 */
async function compressText(text: string): Promise<string> {
  // 注意：这里需要使用CompressionStream API，需要现代浏览器支持
  if ('CompressionStream' in window) {
    const blob = new Blob([text], { type: 'text/plain' });
    const compressedStream = blob.stream().pipeThrough(new CompressionStream('gzip'));
    const compressedBlob = await new Response(compressedStream).blob();
    
    // 转换为二进制字符串
    const arrayBuffer = await compressedBlob.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    
    return binary;
  } else {
    // 降级处理：不压缩，返回原文本
    console.warn('您的浏览器不支持CompressionStream API，无法启用压缩');
    return text;
  }
}

/**
 * 将Base64转换为URL安全格式
 */
export function makeUrlSafe(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_');
}

/**
 * 主编码入口函数
 */
export async function encode(
  input: string | File | ArrayBuffer,
  options: Partial<Base64Options> = {}
): Promise<Base64Result> {
  // 根据输入类型选择编码方法
  if (typeof input === 'string') {
    return encodeText(input, options);
  } else if (input instanceof File) {
    // 如果文件大小超过阈值，使用分块处理
    if (input.size > (options.chunkSize || 1024 * 1024)) {
      return processLargeFile(input, options, options.chunkSize);
    }
    return encodeFile(input, options);
  } else if (input instanceof ArrayBuffer) {
    const result = await encodeArrayBuffer(input, options);
    return {
      success: true,
      data: result,
      meta: {
        originalSize: input.byteLength,
        resultSize: result.length,
        processingTime: 0
      }
    };
  } else {
    return {
      success: false,
      error: '不支持的输入类型',
      meta: {
        originalSize: 0,
        resultSize: 0,
        processingTime: 0
      }
    };
  }
}
