 /**
 * Base64编解码工具 - 文件处理工具
 */

import { Base64Result } from '../types';

/**
 * 创建并下载文件
 * @param data 文件数据（字符串、Blob或ArrayBuffer）
 * @param filename 文件名
 * @param mimeType 文件类型
 */
export function downloadFile(data: string | Blob | ArrayBuffer, filename: string, mimeType?: string): void {
  let blob: Blob;
  
  // 根据数据类型创建Blob
  if (data instanceof Blob) {
    blob = data;
  } else if (data instanceof ArrayBuffer) {
    blob = new Blob([data], { type: mimeType || 'application/octet-stream' });
  } else {
    // 字符串
    blob = new Blob([data], { type: mimeType || 'text/plain' });
  }
  
  // 创建下载链接
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  
  // 模拟点击下载
  document.body.appendChild(a);
  a.click();
  
  // 清理
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * 从Base64创建下载
 * @param base64 Base64字符串
 * @param filename 文件名
 * @param mimeType 文件类型
 */
export function downloadBase64(base64: string, filename: string, mimeType?: string): void {
  try {
    // 如果是DataURL格式，提取数据部分
    if (base64.startsWith('data:')) {
      const matches = base64.match(/^data:([^;]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        mimeType = mimeType || matches[1];
        base64 = matches[2];
      }
    }
    
    // 解码Base64
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    // 创建Blob并下载
    const blob = new Blob([bytes], { type: mimeType || 'application/octet-stream' });
    downloadFile(blob, filename, mimeType);
    
  } catch (error) {
    console.error('下载Base64文件失败', error);
    throw error;
  }
}

/**
 * 从结果创建下载
 * @param result Base64处理结果
 * @param filename 下载文件名
 */
export function downloadFromResult(result: Base64Result, filename: string): void {
  if (!result.success || !result.data) {
    throw new Error('没有可下载的数据');
  }
  
  const mimeType = result.meta?.detectedType;
  
  if (typeof result.data === 'string') {
    // 检查是否为Base64
    if (/^[A-Za-z0-9+\/=\-_]+$/.test(result.data)) {
      downloadBase64(result.data, filename, mimeType);
    } else {
      // 普通文本
      downloadFile(result.data, filename, 'text/plain');
    }
  } else if (result.data instanceof Blob) {
    downloadFile(result.data, filename, mimeType);
  } else if (result.data instanceof ArrayBuffer) {
    downloadFile(result.data, filename, mimeType);
  }
}

/**
 * 从File或Blob读取文本内容
 * @param file 文件对象
 * @returns 文件文本内容
 */
export async function readFileAsText(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result as string);
    };
    
    reader.onerror = () => {
      reject(new Error('读取文件失败'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * 从File或Blob读取为DataURL
 * @param file 文件对象
 * @returns DataURL
 */
export async function readFileAsDataURL(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result as string);
    };
    
    reader.onerror = () => {
      reject(new Error('读取文件失败'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * 从File或Blob读取为ArrayBuffer
 * @param file 文件对象
 * @returns ArrayBuffer
 */
export async function readFileAsArrayBuffer(file: File | Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result as ArrayBuffer);
    };
    
    reader.onerror = () => {
      reject(new Error('读取文件失败'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

/**
 * 生成随机文件名
 * @param extension 文件扩展名
 * @returns 随机文件名
 */
export function generateFileName(extension: string = 'txt'): string {
  const date = new Date();
  const timestamp = date.toISOString().replace(/[:.]/g, '-');
  const random = Math.floor(Math.random() * 10000);
  
  return `base64-${timestamp}-${random}.${extension}`;
}

/**
 * 根据MIME类型猜测文件扩展名
 * @param mimeType MIME类型
 * @returns 文件扩展名
 */
export function getExtensionFromMimeType(mimeType?: string): string {
  if (!mimeType) return 'bin';
  
  const map: Record<string, string> = {
    'text/plain': 'txt',
    'text/html': 'html',
    'text/css': 'css',
    'text/javascript': 'js',
    'text/csv': 'csv',
    'application/json': 'json',
    'application/xml': 'xml',
    'application/pdf': 'pdf',
    'application/zip': 'zip',
    'application/x-gzip': 'gz',
    'application/octet-stream': 'bin',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'audio/mpeg': 'mp3',
    'audio/ogg': 'ogg',
    'audio/wav': 'wav',
    'video/mp4': 'mp4',
    'video/webm': 'webm'
  };
  
  return map[mimeType] || 'bin';
}
