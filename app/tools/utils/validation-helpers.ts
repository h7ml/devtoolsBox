/**
 * 数据验证工具函数
 */

/**
 * 验证是否为有效的电子邮箱
 * @param email 电子邮箱地址
 * @returns 是否有效
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

/**
 * 验证是否为有效的URL
 * @param url URL地址
 * @returns 是否有效
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * 验证是否为有效的手机号（中国大陆）
 * @param phone 手机号
 * @returns 是否有效
 */
export function isValidChinesePhone(phone: string): boolean {
  const regex = /^1[3-9]\d{9}$/;
  return regex.test(phone);
}

/**
 * 验证是否为有效的身份证号（中国大陆）
 * @param idNumber 身份证号
 * @returns 是否有效
 */
export function isValidChineseIDNumber(idNumber: string): boolean {
  // 简单长度和格式检查
  const regex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (!regex.test(idNumber)) {
    return false;
  }
  
  // 18位身份证检查
  if (idNumber.length === 18) {
    // 加权因子
    const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    // 校验位
    const parity = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    let sum = 0;
    let ai = 0;
    let wi = 0;
    
    for (let i = 0; i < 17; i++) {
      ai = parseInt(idNumber.charAt(i));
      wi = factor[i];
      sum += ai * wi;
    }
    
    const last = parity[sum % 11];
    return last === idNumber.charAt(17).toUpperCase();
  }
  
  // 15位身份证直接返回true，因为没有校验码
  return true;
}

/**
 * 验证是否为有效的IPv4地址
 * @param ip IP地址
 * @returns 是否有效
 */
export function isValidIPv4(ip: string): boolean {
  const regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return regex.test(ip);
}

/**
 * 验证是否为有效的IPv6地址
 * @param ip IP地址
 * @returns 是否有效
 */
export function isValidIPv6(ip: string): boolean {
  const regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  return regex.test(ip);
}

/**
 * 验证是否为有效的信用卡号
 * @param cardNumber 信用卡号
 * @returns 是否有效
 */
export function isValidCreditCard(cardNumber: string): boolean {
  // 移除所有非数字字符
  const digitsOnly = cardNumber.replace(/\D/g, '');
  
  // 卡号长度检查
  if (digitsOnly.length < 13 || digitsOnly.length > 19) {
    return false;
  }
  
  // Luhn算法检查
  let sum = 0;
  let shouldDouble = false;
  
  for (let i = digitsOnly.length - 1; i >= 0; i--) {
    let digit = parseInt(digitsOnly.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return (sum % 10) === 0;
}

/**
 * 验证字符串是否包含至少一个数字
 * @param str 字符串
 * @returns 是否包含数字
 */
export function containsNumber(str: string): boolean {
  return /\d/.test(str);
}

/**
 * 验证字符串是否包含至少一个字母
 * @param str 字符串
 * @returns 是否包含字母
 */
export function containsLetter(str: string): boolean {
  return /[a-zA-Z]/.test(str);
}

/**
 * 验证字符串是否包含至少一个特殊字符
 * @param str 字符串
 * @returns 是否包含特殊字符
 */
export function containsSpecialChar(str: string): boolean {
  return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(str);
}

/**
 * 验证密码强度
 * @param password 密码
 * @returns 密码强度评级（1-5）和描述
 */
export function checkPasswordStrength(password: string): {
  score: number;
  description: string;
} {
  if (!password) {
    return { score: 0, description: '未输入密码' };
  }
  
  let score = 0;
  
  // 长度检查
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // 复杂度检查
  if (containsNumber(password)) score += 1;
  if (containsLetter(password)) score += 1;
  if (containsSpecialChar(password)) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  
  // 重复字符和序列检查
  if (/(.)\1\1/.test(password)) score -= 1;
  if (/(?:abc|bcd|cde|def|efg|123|234|345|456|567|678|789)/.test(password.toLowerCase())) score -= 1;
  
  // 确保分数在1-5之间
  score = Math.max(1, Math.min(5, score));
  
  const descriptions = [
    '极弱',
    '弱',
    '一般',
    '强',
    '很强',
    '极强'
  ];
  
  return {
    score,
    description: descriptions[score]
  };
} 
