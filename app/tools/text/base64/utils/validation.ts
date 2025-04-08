/**
 * Base64编解码工具 - 验证工具
 */

/**
 * 验证Base64输入是否有效
 * @param input 要验证的Base64字符串
 * @param isUrlSafe 是否为URL安全模式
 * @returns 验证结果
 */
export function validateBase64Input(input: string, isUrlSafe = false): { valid: boolean; error?: string } {
  if (!input || input.trim() === '') {
    return { valid: false, error: '输入不能为空' };
  }
  
  // 移除可能的换行符等空白字符
  const cleanedInput = input.replace(/[\s\r\n]+/g, '');
  
  // 验证长度是否为4的倍数或差1-2个等号
  const validLength = cleanedInput.length % 4 <= 2;
  if (!validLength) {
    return { valid: false, error: 'Base64长度无效，应为4的倍数或末尾缺少1-2个等号' };
  }
  
  // 检查字符集
  const regex = isUrlSafe 
    ? /^[A-Za-z0-9\-_]*=*$/
    : /^[A-Za-z0-9+\/]*=*$/;
    
  if (!regex.test(cleanedInput)) {
    return { 
      valid: false, 
      error: `包含无效字符。${isUrlSafe ? 'URL安全Base64仅允许A-Z、a-z、0-9、-、_和=' : 'Base64仅允许A-Z、a-z、0-9、+、/和='}`
    };
  }
  
  return { valid: true };
}

/**
 * 检测标准Base64格式
 * @param input 要检测的字符串
 * @returns 是否为标准Base64格式
 */
export function isStandardBase64(input: string): boolean {
  const cleanedInput = input.replace(/[\s\r\n]+/g, '');
  return /^[A-Za-z0-9+\/]*={0,2}$/.test(cleanedInput);
}

/**
 * 检测URL安全Base64格式
 * @param input 要检测的字符串
 * @returns 是否为URL安全Base64格式
 */
export function isUrlSafeBase64(input: string): boolean {
  const cleanedInput = input.replace(/[\s\r\n]+/g, '');
  return /^[A-Za-z0-9\-_]*={0,2}$/.test(cleanedInput);
}

/**
 * 检测敏感数据
 * @param input 要检测的字符串
 * @returns 发现的敏感信息警告
 */
export function detectSensitiveData(input: string): string[] {
  const warnings: string[] = [];
  
  // 检测JWT令牌
  if (/^eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/.test(input)) {
    warnings.push('检测到可能的JWT令牌，请注意安全风险');
  }
  
  // 检测API密钥模式
  const apiKeyPatterns = [
    /key[-_]?[0-9a-zA-Z]{20,}/i,  // 常见API密钥模式
    /sk[-_][a-zA-Z0-9]{20,}/i,    // 私钥前缀
    /access[-_]token[-_][a-zA-Z0-9]/i,   // 访问令牌
    /auth[-_]?token[-_]?[a-zA-Z0-9]/i,   // 认证令牌
    /password[-_]?[a-zA-Z0-9]/i,   // 密码
    /secret[-_]?[a-zA-Z0-9]/i,     // 密钥
  ];
  
  for (const pattern of apiKeyPatterns) {
    if (pattern.test(input)) {
      warnings.push('检测到可能包含API密钥、令牌或密码，请注意安全风险');
      break; // 只添加一次这类警告
    }
  }
  
  // 检测私钥格式
  if (/BEGIN (RSA |)PRIVATE KEY/.test(input)) {
    warnings.push('检测到可能包含私钥，请勿在不安全的环境中共享');
  }
  
  // 检测证书
  if (/BEGIN CERTIFICATE/.test(input)) {
    warnings.push('检测到可能包含证书数据');
  }
  
  return warnings;
}

/**
 * 自动检测输入类型
 * @param input 输入字符串
 * @returns 检测到的类型
 */
export function detectInputType(input: string): 'base64' | 'text' | 'dataUrl' | 'unknown' {
  // 检测是否为DataURL
  if (/^data:.*;base64,/.test(input)) {
    return 'dataUrl';
  }
  
  // 去除空白字符
  const cleanedInput = input.replace(/[\s\r\n]+/g, '');
  
  // 检查是否为标准Base64
  if (isStandardBase64(cleanedInput)) {
    return 'base64';
  }
  
  // 检查是否为URL安全Base64
  if (isUrlSafeBase64(cleanedInput)) {
    return 'base64';
  }
  
  // 如果有明显的非Base64字符
  if (/[^A-Za-z0-9+\/=\-_\s\r\n]/.test(input)) {
    return 'text';
  }
  
  // 不确定的情况
  return 'unknown';
} 
