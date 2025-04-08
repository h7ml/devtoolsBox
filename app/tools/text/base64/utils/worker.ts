/**
 * Base64编解码工具 - Web Worker 实现
 * 
 * 此文件在后台线程中运行，处理大型Base64编解码任务
 */

import { WorkerMessage, WorkerResponse } from '../types';

/**
 * 创建一个Web Worker实例
 * @returns 工作线程实例及控制方法
 */
export function createBase64Worker() {
  // 将worker代码转换为Blob URL
  const workerCode = `
    /**
     * Base64编解码工作线程
     */
    
    // 将Base64转换为URL安全格式
    function makeUrlSafe(base64) {
      return base64.replace(/\\+/g, '-').replace(/\\//g, '_');
    }
    
    // 将URL安全格式还原为标准Base64
    function restoreFromUrlSafe(urlSafeBase64) {
      let base64 = urlSafeBase64.replace(/-/g, '+').replace(/_/g, '/');
      
      // 补全等号
      while (base64.length % 4) {
        base64 += '=';
      }
      
      return base64;
    }
    
    // 处理文本编码为Base64
    function encodeText(text, options = {}) {
      try {
        // 使用内置方法编码
        const encoded = btoa(unescape(encodeURIComponent(text)));
        
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
          result: result,
          meta: {
            resultSize: result.length
          }
        };
      } catch (error) {
        return {
          success: false,
          error: \`编码失败: \${error.message}\`
        };
      }
    }
    
    // Base64解码为文本
    function decodeText(base64, options = {}) {
      try {
        // 如果是URL安全模式，先还原为标准Base64
        const standardBase64 = options.urlSafe ? restoreFromUrlSafe(base64) : base64;
        
        // 使用内置方法解码
        let decodedText;
        try {
          decodedText = decodeURIComponent(escape(atob(standardBase64)));
        } catch (error) {
          // 尝试直接解码（可能是二进制数据）
          decodedText = atob(standardBase64);
        }
        
        return {
          success: true,
          result: decodedText,
          meta: {
            resultSize: decodedText.length
          }
        };
      } catch (error) {
        return {
          success: false,
          error: \`解码失败: \${error.message}\`
        };
      }
    }
    
    // 处理二进制数据编码为Base64
    function encodeArrayBuffer(buffer, options = {}) {
      try {
        const bytes = new Uint8Array(buffer);
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
        
        return {
          success: true,
          result: result,
          meta: {
            resultSize: result.length
          }
        };
      } catch (error) {
        return {
          success: false,
          error: \`二进制编码失败: \${error.message}\`
        };
      }
    }
    
    // 处理Base64解码为二进制
    function decodeToArrayBuffer(base64, options = {}) {
      try {
        // 如果是URL安全模式，先还原为标准Base64
        const standardBase64 = options.urlSafe ? restoreFromUrlSafe(base64) : base64;
        
        // 解码为二进制
        const binaryString = atob(standardBase64);
        const bytes = new Uint8Array(binaryString.length);
        
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Web Worker中无法直接传输ArrayBuffer，需要使用transferable对象
        return {
          success: true,
          result: bytes.buffer,
          meta: {
            resultSize: bytes.length
          },
          transferables: [bytes.buffer]
        };
      } catch (error) {
        return {
          success: false,
          error: \`解码为二进制失败: \${error.message}\`
        };
      }
    }
    
    // 处理消息
    self.onmessage = function(e) {
      const { type, data, options } = e.data;
      let response;
      
      switch (type) {
        case 'encode':
          if (data instanceof ArrayBuffer) {
            response = encodeArrayBuffer(data, options);
          } else {
            response = encodeText(data, options);
          }
          break;
        case 'decode':
          if (options.outputType === 'binary') {
            response = decodeToArrayBuffer(data, options);
            // 转移二进制数据所有权到主线程
            if (response.success && response.transferables) {
              self.postMessage(response, response.transferables);
              return;
            }
          } else {
            response = decodeText(data, options);
          }
          break;
        default:
          response = {
            success: false,
            error: '未知操作类型'
          };
      }
      
      self.postMessage(response);
    };
  `;
  
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  const workerUrl = URL.createObjectURL(blob);
  
  // 创建Worker
  let worker: Worker | null = new Worker(workerUrl);
  
  // 包装方法
  const encode = (data: string | ArrayBuffer, options = {}): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!worker) {
        reject(new Error('Worker已终止'));
        return;
      }
      
      const onMessage = (e: MessageEvent) => {
        worker?.removeEventListener('message', onMessage);
        if (e.data.success) {
          resolve(e.data);
        } else {
          reject(new Error(e.data.error));
        }
      };
      
      worker.addEventListener('message', onMessage);
      
      const message: WorkerMessage = {
        type: 'encode',
        data,
        options
      };
      
      // 如果是ArrayBuffer，使用transferable对象
      if (data instanceof ArrayBuffer) {
        worker.postMessage(message, [data]);
      } else {
        worker.postMessage(message);
      }
    });
  };
  
  const decode = (data: string, options = {}): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!worker) {
        reject(new Error('Worker已终止'));
        return;
      }
      
      const onMessage = (e: MessageEvent) => {
        worker?.removeEventListener('message', onMessage);
        if (e.data.success) {
          resolve(e.data);
        } else {
          reject(new Error(e.data.error));
        }
      };
      
      worker.addEventListener('message', onMessage);
      
      worker.postMessage({
        type: 'decode',
        data,
        options
      });
    });
  };
  
  // 终止Worker
  const terminate = () => {
    if (worker) {
      worker.terminate();
      worker = null;
      URL.revokeObjectURL(workerUrl);
    }
  };
  
  return {
    encode,
    decode,
    terminate
  };
}

/**
 * 使用Web Worker编码
 * @param input 输入数据
 * @param options 选项
 * @returns 编码结果
 */
export async function encodeWithWorker(input: string | ArrayBuffer, options: any = {}): Promise<any> {
  const startTime = performance.now();
  
  try {
    const worker = createBase64Worker();
    const result = await worker.encode(input, options);
    worker.terminate();
    
    return {
      success: true,
      data: result.result,
      meta: {
        ...result.meta,
        processingTime: performance.now() - startTime
      }
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
      meta: {
        processingTime: performance.now() - startTime
      }
    };
  }
}

/**
 * 使用Web Worker解码
 * @param input Base64字符串
 * @param options 选项
 * @returns 解码结果
 */
export async function decodeWithWorker(input: string, options: any = {}): Promise<any> {
  const startTime = performance.now();
  
  try {
    const worker = createBase64Worker();
    const result = await worker.decode(input, options);
    worker.terminate();
    
    return {
      success: true,
      data: result.result,
      meta: {
        ...result.meta,
        processingTime: performance.now() - startTime
      }
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
      meta: {
        processingTime: performance.now() - startTime
      }
    };
  }
}
