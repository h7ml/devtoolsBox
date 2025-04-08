/**
 * 文本处理工具函数
 */

/**
 * 转换文本大小写
 * @param text 要转换的文本
 * @param caseType 大小写类型
 * @returns 转换后的文本
 */
export function convertCase(
  text: string,
  caseType: 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'pascal' | 'snake' | 'kebab'
): string {
  if (!text) return '';
  
  switch (caseType) {
    case 'upper':
      return text.toUpperCase();
      
    case 'lower':
      return text.toLowerCase();
      
    case 'title':
      return text
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
    case 'sentence':
      return text
        .split(/\.\s+/)
        .map(sentence => {
          if (!sentence) return '';
          return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
        })
        .join('. ')
        .replace(/\.\s+$/, '.');
      
    case 'camel':
      return text
        .split(/[\s_-]+/)
        .map((word, index) => {
          if (!word) return '';
          return index === 0
            ? word.toLowerCase()
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join('');
      
    case 'pascal':
      return text
        .split(/[\s_-]+/)
        .map(word => {
          if (!word) return '';
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join('');
      
    case 'snake':
      return text
        .replace(/([A-Z])/g, '_$1')
        .toLowerCase()
        .replace(/^_/, '')
        .replace(/[\s-]+/g, '_');
      
    case 'kebab':
      return text
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase()
        .replace(/^-/, '')
        .replace(/[\s_]+/g, '-');
      
    default:
      return text;
  }
}

/**
 * 计算字符串统计信息
 * @param text 要分析的文本
 * @returns 文本统计信息
 */
export function getTextStats(text: string): {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  paragraphs: number;
} {
  if (!text) {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      lines: 0,
      paragraphs: 0
    };
  }
  
  // 移除首尾空白字符
  const trimmedText = text.trim();
  
  // 计算字符数（包含空格）
  const characters = trimmedText.length;
  
  // 计算字符数（不包含空格）
  const charactersNoSpaces = trimmedText.replace(/\s/g, '').length;
  
  // 计算单词数
  const words = trimmedText
    ? trimmedText.split(/\s+/).filter(word => word.length > 0).length
    : 0;
  
  // 计算行数
  const lines = trimmedText ? trimmedText.split(/\r\n|\r|\n/).length : 0;
  
  // 计算段落数
  const paragraphs = trimmedText
    ? trimmedText.split(/\r\n\r\n|\r\r|\n\n/).filter(p => p.trim().length > 0).length
    : 0;
  
  return {
    characters,
    charactersNoSpaces,
    words,
    lines,
    paragraphs
  };
}

/**
 * 转义HTML特殊字符
 * @param html HTML字符串
 * @returns 转义后的字符串
 */
export function escapeHtml(html: string): string {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * 反转义HTML特殊字符
 * @param html 转义后的HTML字符串
 * @returns 原始字符串
 */
export function unescapeHtml(html: string): string {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, '\'');
}

/**
 * Base64编码
 * @param text 要编码的文本
 * @returns Base64编码后的字符串
 */
export function encodeBase64(text: string): string {
  try {
    return btoa(
      encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (_, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      })
    );
  } catch (e) {
    console.error('Base64编码失败:', e);
    return '';
  }
}

/**
 * Base64解码
 * @param base64 Base64编码的字符串
 * @returns 解码后的文本
 */
export function decodeBase64(base64: string): string {
  try {
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(base64), (c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  } catch (e) {
    console.error('Base64解码失败:', e);
    return '';
  }
}

/**
 * URL编码
 * @param text 要编码的文本
 * @returns URL编码后的字符串
 */
export function encodeUrl(text: string): string {
  try {
    return encodeURIComponent(text);
  } catch (e) {
    console.error('URL编码失败:', e);
    return '';
  }
}

/**
 * URL解码
 * @param url URL编码的字符串
 * @returns 解码后的文本
 */
export function decodeUrl(url: string): string {
  try {
    return decodeURIComponent(url);
  } catch (e) {
    console.error('URL解码失败:', e);
    return '';
  }
} 
