/**
 * Base64编解码工具 - 解码器
 */

import { Base64Options, Base64Result } from '../types';
import { validateBase64Input } from './validation';

/**
 * 将URL安全格式还原为标准Base64
 */
export function restoreFromUrlSafe(urlSafeBase64: string): string {
  // 还原替换的字符
  let base64 = urlSafeBase64.replace(/-/g, '+').replace(/_/g, '/');
  
  // 补全等号
  while (base64.length % 4) {
    base64 += '=';
  }
  
  return base64;
}

/**
 * Base64文本解码
 * @param base64 要解码的Base64字符串
 * @param options 解码选项
 * @returns 解码结果
 */
export async function decodeText(base64: string, options: Partial<Base64Options> = {}): Promise<Base64Result> {
  const startTime = performance.now();
  const originalSize = base64.length;
  
  try {
    // 验证输入
    if (options.validateInput !== false) {
      const validationResult = validateBase64Input(base64, !!options.urlSafe);
      if (!validationResult.valid) {
        return {
          success: false,
          error: validationResult.error,
          meta: {
            originalSize,
            resultSize: 0,
            processingTime: performance.now() - startTime
          }
        };
      }
    }
    
    // 如果是URL安全模式，先还原为标准Base64
    const standardBase64 = options.urlSafe ? restoreFromUrlSafe(base64) : base64;
    
    // 使用内置方法解码
    let decodedText: string;
    try {
      decodedText = decodeURIComponent(escape(atob(standardBase64)));
    } catch (error) {
      // 尝试直接解码（可能是二进制数据）
      decodedText = atob(standardBase64);
    }
    
    // 检查是否是压缩数据并解压
    if (options.compress) {
      try {
        decodedText = await decompressText(decodedText);
      } catch (error) {
        console.warn('解压失败，返回原始解码结果', error);
      }
    }
    
    return {
      success: true,
      data: decodedText,
      meta: {
        originalSize,
        resultSize: new TextEncoder().encode(decodedText).length,
        processingTime: performance.now() - startTime
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `解码失败: ${(error as Error).message}`,
      meta: {
        originalSize,
        resultSize: 0,
        processingTime: performance.now() - startTime
      }
    };
  }
}

/**
 * Base64解码为二进制数据
 * @param base64 要解码的Base64字符串
 * @param options 解码选项
 * @returns 解码结果（ArrayBuffer）
 */
export async function decodeToBinary(base64: string, options: Partial<Base64Options> = {}): Promise<Base64Result> {
  const startTime = performance.now();
  const originalSize = base64.length;
  
  try {
    // 验证输入
    if (options.validateInput !== false) {
      const validationResult = validateBase64Input(base64, !!options.urlSafe);
      if (!validationResult.valid) {
        return {
          success: false,
          error: validationResult.error,
          meta: {
            originalSize,
            resultSize: 0,
            processingTime: performance.now() - startTime
          }
        };
      }
    }
    
    // 如果是URL安全模式，先还原为标准Base64
    const standardBase64 = options.urlSafe ? restoreFromUrlSafe(base64) : base64;
    
    // 解码为二进制
    const binaryString = atob(standardBase64);
    const bytes = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const buffer = bytes.buffer;
    
    // 检测MIME类型
    const detectedType = detectMimeType(buffer, options.outputType as any);
    
    return {
      success: true,
      data: buffer,
      meta: {
        originalSize,
        resultSize: buffer.byteLength,
        processingTime: performance.now() - startTime,
        detectedType
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `解码为二进制失败: ${(error as Error).message}`,
      meta: {
        originalSize,
        resultSize: 0,
        processingTime: performance.now() - startTime
      }
    };
  }
}

/**
 * 解码Base64为Blob/File
 * @param base64 要解码的Base64字符串
 * @param options 解码选项
 * @param filename 可选的文件名
 * @returns 解码结果（Blob/File）
 */
export async function decodeToFile(base64: string, options: Partial<Base64Options> = {}, filename?: string): Promise<Base64Result> {
  try {
    // 先解码为二进制
    const binaryResult = await decodeToBinary(base64, options);
    
    if (!binaryResult.success) {
      return binaryResult;
    }
    
    const buffer = binaryResult.data as ArrayBuffer;
    const mimeType = binaryResult.meta?.detectedType || 'application/octet-stream';
    
    // 创建Blob
    const blob = new Blob([buffer], { type: mimeType });
    
    // 如果提供了文件名，则创建File对象
    const result = filename 
      ? new File([blob], filename, { type: mimeType })
      : blob;
    
    return {
      success: true,
      data: result,
      meta: {
        originalSize: base64.length,
        resultSize: blob.size,
        processingTime: binaryResult.meta?.processingTime || 0,
        detectedType: mimeType
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `解码为文件失败: ${(error as Error).message}`,
      meta: {
        originalSize: base64.length,
        resultSize: 0,
        processingTime: 0
      }
    };
  }
}

/**
 * 从DataURL中提取Base64部分
 * @param dataUrl DataURL字符串
 * @returns 提取的Base64部分和MIME类型
 */
export function extractFromDataUrl(dataUrl: string): { base64: string; mimeType: string } {
  const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  
  if (!matches || matches.length !== 3) {
    throw new Error('无效的DataURL格式');
  }
  
  return {
    mimeType: matches[1],
    base64: matches[2]
  };
}

/**
 * 尝试根据二进制内容检测MIME类型
 * @param buffer 二进制数据
 * @param defaultType 默认MIME类型
 * @returns 检测到的MIME类型
 */
function detectMimeType(buffer: ArrayBuffer, defaultType: string = 'file'): string {
  const arr = new Uint8Array(buffer).subarray(0, 4);
  let header = '';
  for (let i = 0; i < arr.length; i++) {
    header += arr[i].toString(16);
  }
  
  // 根据文件头检测类型
  switch (header) {
    case '89504e47': return 'image/png';
    case '47494638': return 'image/gif';
    case 'ffd8ffe0':
    case 'ffd8ffe1':
    case 'ffd8ffe2': return 'image/jpeg';
    case '25504446': return 'application/pdf';
    case '504b0304': return 'application/zip';
    default: return 'application/octet-stream';
  }
}

/**
 * 解压缩文本
 * @param compressedText 压缩的文本
 * @returns 解压后的文本
 */
async function decompressText(compressedText: string): Promise<string> {
  if ('DecompressionStream' in window) {
    // 转换为Uint8Array
    const bytes = new Uint8Array(compressedText.length);
    for (let i = 0; i < compressedText.length; i++) {
      bytes[i] = compressedText.charCodeAt(i);
    }
    
    const blob = new Blob([bytes]);
    const decompressedStream = blob.stream().pipeThrough(new DecompressionStream('gzip'));
    const decompressedBlob = await new Response(decompressedStream).blob();
    return await decompressedBlob.text();
  } else {
    console.warn('您的浏览器不支持DecompressionStream API，无法解压');
    return compressedText;
  }
}

/**
 * 主解码入口函数
 * @param input 要解码的Base64字符串
 * @param options 解码选项
 * @returns 解码结果
 */
export async function decode(
  input: string,
  options: Partial<Base64Options> = {}
): Promise<Base64Result> {
  // 如果输入是DataURL格式，提取Base64部分
  if (input.startsWith('data:') && input.includes(';base64,')) {
    try {
      const { base64, mimeType } = extractFromDataUrl(input);
      
      // 更新options里的检测类型
      options = { 
        ...options, 
        outputType: options.outputType || 'binary'
      };
      
      input = base64;
    } catch (error) {
      return {
        success: false,
        error: `DataURL解析失败: ${(error as Error).message}`,
        meta: { originalSize: input.length, resultSize: 0, processingTime: 0 }
      };
    }
  }
  
  // 根据输出类型选择解码方法
  switch (options.outputType) {
    case 'binary':
      return decodeToBinary(input, options);
    case 'file':
      return decodeToFile(input, options);
    case 'text':
    default:
      return decodeText(input, options);
  }
} 
