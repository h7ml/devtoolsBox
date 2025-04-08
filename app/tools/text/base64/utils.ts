/**
 * Base64编解码工具 - 工具函数
 */

/**
 * Base64编码
 * @param text 要编码的文本
 * @param urlSafe 是否使用URL安全模式
 * @returns 编码结果
 */
export function encodeBase64(text: string, urlSafe: boolean = false): string {
  try {
    // 使用浏览器内置的btoa函数进行Base64编码
    const encoded = btoa(unescape(encodeURIComponent(text)));
    
    // 如果需要URL安全模式，进行替换
    return urlSafe ? makeUrlSafe(encoded) : encoded;
  } catch (error) {
    throw new Error(`编码失败: ${(error as Error).message}`);
  }
}

/**
 * Base64解码
 * @param base64 要解码的Base64字符串
 * @param urlSafe 是否使用URL安全模式
 * @returns 解码结果
 */
export function decodeBase64(base64: string, urlSafe: boolean = false): string {
  try {
    // 如果是URL安全模式，先还原为标准Base64
    const standardBase64 = urlSafe ? restoreFromUrlSafe(base64) : base64;
    
    // 使用浏览器内置的atob函数进行Base64解码
    return decodeURIComponent(escape(atob(standardBase64)));
  } catch (error) {
    throw new Error(`解码失败: ${(error as Error).message}`);
  }
}

/**
 * 将Base64转换为URL安全格式
 */
function makeUrlSafe(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * 将URL安全格式还原为标准Base64
 */
function restoreFromUrlSafe(urlSafeBase64: string): string {
  // 还原替换的字符
  let base64 = urlSafeBase64.replace(/-/g, '+').replace(/_/g, '/');
  
  // 补全等号
  while (base64.length % 4) {
    base64 += '=';
  }
  
  return base64;
}

/**
 * 处理Base64编解码操作
 */
export function processBase64(
  input: string,
  mode: 'encode' | 'decode',
  urlSafe: boolean
): { result: string; error: string | null } {
  try {
    if (!input) {
      return { result: '', error: null };
    }
    
    const result = mode === 'encode'
      ? encodeBase64(input, urlSafe)
      : decodeBase64(input, urlSafe);
      
    return { result, error: null };
  } catch (error) {
    return { result: '', error: (error as Error).message };
  }
}
