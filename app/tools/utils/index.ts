/**
 * 工具函数入口文件
 * 统一导出所有工具函数
 */

// 通用工具函数
export * from './common-functions';

// 文本处理工具函数
export * from './text-helpers';

// 日期处理工具函数
export * from './date-helpers';

// 对象处理工具函数
export * from './object-helpers';

// 验证相关工具函数
export * from './validation-helpers';

/**
 * 工具函数分类
 */
export const UTIL_CATEGORIES = {
  COMMON: 'common',
  TEXT: 'text',
  DATE: 'date',
  OBJECT: 'object',
  VALIDATION: 'validation',
} as const;

export type UtilCategoryType = typeof UTIL_CATEGORIES[keyof typeof UTIL_CATEGORIES];

/**
 * 工具函数元数据
 */
export interface UtilFunction {
  name: string;
  category: UtilCategoryType;
  description: string;
  example?: string;
  code: (...args: any[]) => any;
}

/**
 * 工具函数注册表
 */
export const utilFunctions: Record<string, UtilFunction> = {
  // 通用工具函数
  copyToClipboard: {
    name: 'copyToClipboard',
    category: UTIL_CATEGORIES.COMMON,
    description: '复制文本到剪贴板',
    example: "copyToClipboard('要复制的文本')",
    code: require('./common-functions').copyToClipboard,
  },
  downloadAsFile: {
    name: 'downloadAsFile',
    category: UTIL_CATEGORIES.COMMON,
    description: '将数据下载为文件',
    example: "downloadAsFile('Hello World', 'hello.txt', 'text/plain')",
    code: require('./common-functions').downloadAsFile,
  },
  readFile: {
    name: 'readFile',
    category: UTIL_CATEGORIES.COMMON,
    description: '读取文件内容',
    example: "readFile(fileObject, 'text')",
    code: require('./common-functions').readFile,
  },
  formatFileSize: {
    name: 'formatFileSize',
    category: UTIL_CATEGORIES.COMMON,
    description: '格式化文件大小',
    example: "formatFileSize(1024)",
    code: require('./common-functions').formatFileSize,
  },
  debounce: {
    name: 'debounce',
    category: UTIL_CATEGORIES.COMMON,
    description: '创建一个防抖函数',
    example: "const debouncedFn = debounce(() => {}, 300)",
    code: require('./common-functions').debounce,
  },
  throttle: {
    name: 'throttle',
    category: UTIL_CATEGORIES.COMMON,
    description: '创建一个节流函数',
    example: "const throttledFn = throttle(() => {}, 300)",
    code: require('./common-functions').throttle,
  },

  // 文本处理工具函数
  convertCase: {
    name: 'convertCase',
    category: UTIL_CATEGORIES.TEXT,
    description: '转换文本大小写类型',
    example: "convertCase('hello world', 'title')",
    code: require('./text-helpers').convertCase,
  },
  getTextStats: {
    name: 'getTextStats',
    category: UTIL_CATEGORIES.TEXT,
    description: '获取文本统计信息',
    example: "getTextStats('Hello\\nWorld')",
    code: require('./text-helpers').getTextStats,
  },
  escapeHtml: {
    name: 'escapeHtml',
    category: UTIL_CATEGORIES.TEXT,
    description: '转义HTML特殊字符',
    example: "escapeHtml('<div>Hello</div>')",
    code: require('./text-helpers').escapeHtml,
  },
  unescapeHtml: {
    name: 'unescapeHtml',
    category: UTIL_CATEGORIES.TEXT,
    description: '解除HTML特殊字符转义',
    example: "unescapeHtml('&lt;div&gt;Hello&lt;/div&gt;')",
    code: require('./text-helpers').unescapeHtml,
  },
  encodeBase64: {
    name: 'encodeBase64',
    category: UTIL_CATEGORIES.TEXT,
    description: '将文本编码为Base64',
    example: "encodeBase64('Hello World')",
    code: require('./text-helpers').encodeBase64,
  },
  decodeBase64: {
    name: 'decodeBase64',
    category: UTIL_CATEGORIES.TEXT,
    description: '将Base64解码为文本',
    example: "decodeBase64('SGVsbG8gV29ybGQ=')",
    code: require('./text-helpers').decodeBase64,
  },
  encodeUrl: {
    name: 'encodeUrl',
    category: UTIL_CATEGORIES.TEXT,
    description: '编码URL',
    example: "encodeUrl('https://example.com?query=hello world')",
    code: require('./text-helpers').encodeUrl,
  },
  decodeUrl: {
    name: 'decodeUrl',
    category: UTIL_CATEGORIES.TEXT,
    description: '解码URL',
    example: "decodeUrl('https%3A%2F%2Fexample.com%3Fquery%3Dhello%20world')",
    code: require('./text-helpers').decodeUrl,
  },

  // 日期处理工具函数
  formatDate: {
    name: 'formatDate',
    category: UTIL_CATEGORIES.DATE,
    description: '格式化日期',
    example: "formatDate(new Date(), 'YYYY-MM-DD')",
    code: require('./date-helpers').formatDate,
  },
  getCurrentUnixTimestamp: {
    name: 'getCurrentUnixTimestamp',
    category: UTIL_CATEGORIES.DATE,
    description: '获取当前Unix时间戳',
    example: "getCurrentUnixTimestamp()",
    code: require('./date-helpers').getCurrentUnixTimestamp,
  },
  timestampToDate: {
    name: 'timestampToDate',
    category: UTIL_CATEGORIES.DATE,
    description: '将时间戳转换为日期对象',
    example: "timestampToDate(1609459200)",
    code: require('./date-helpers').timestampToDate,
  },
  dateDiff: {
    name: 'dateDiff',
    category: UTIL_CATEGORIES.DATE,
    description: '计算两个日期之间的差值',
    example: "dateDiff(new Date('2020-01-01'), new Date('2021-01-01'))",
    code: require('./date-helpers').dateDiff,
  },
  getRelativeTimeDescription: {
    name: 'getRelativeTimeDescription',
    category: UTIL_CATEGORIES.DATE,
    description: '获取相对时间描述',
    example: "getRelativeTimeDescription(new Date('2020-01-01'))",
    code: require('./date-helpers').getRelativeTimeDescription,
  },

  // 对象处理工具函数
  deepClone: {
    name: 'deepClone',
    category: UTIL_CATEGORIES.OBJECT,
    description: '深度克隆对象',
    example: "deepClone({ a: 1, b: { c: 2 } })",
    code: require('./object-helpers').deepClone,
  },
  deepMerge: {
    name: 'deepMerge',
    category: UTIL_CATEGORIES.OBJECT,
    description: '深度合并对象',
    example: "deepMerge({ a: 1 }, { b: 2 })",
    code: require('./object-helpers').deepMerge,
  },
  isObject: {
    name: 'isObject',
    category: UTIL_CATEGORIES.OBJECT,
    description: '判断是否为对象',
    example: "isObject({})",
    code: require('./object-helpers').isObject,
  },
  flattenObject: {
    name: 'flattenObject',
    category: UTIL_CATEGORIES.OBJECT,
    description: '扁平化对象',
    example: "flattenObject({ a: { b: { c: 1 } } })",
    code: require('./object-helpers').flattenObject,
  },
  pick: {
    name: 'pick',
    category: UTIL_CATEGORIES.OBJECT,
    description: '从对象中提取指定的键',
    example: "pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])",
    code: require('./object-helpers').pick,
  },
  omit: {
    name: 'omit',
    category: UTIL_CATEGORIES.OBJECT,
    description: '从对象中排除指定的键',
    example: "omit({ a: 1, b: 2, c: 3 }, ['b'])",
    code: require('./object-helpers').omit,
  },
  isEqual: {
    name: 'isEqual',
    category: UTIL_CATEGORIES.OBJECT,
    description: '比较两个对象是否深度相等',
    example: "isEqual({ a: 1 }, { a: 1 })",
    code: require('./object-helpers').isEqual,
  },

  // 验证工具函数
  isValidEmail: {
    name: 'isValidEmail',
    category: UTIL_CATEGORIES.VALIDATION,
    description: '验证是否为有效的电子邮箱',
    example: "isValidEmail('user@example.com')",
    code: require('./validation-helpers').isValidEmail,
  },
  isValidUrl: {
    name: 'isValidUrl',
    category: UTIL_CATEGORIES.VALIDATION,
    description: '验证是否为有效的URL',
    example: "isValidUrl('https://example.com')",
    code: require('./validation-helpers').isValidUrl,
  },
  isValidChinesePhone: {
    name: 'isValidChinesePhone',
    category: UTIL_CATEGORIES.VALIDATION,
    description: '验证是否为有效的中国大陆手机号',
    example: "isValidChinesePhone('13800138000')",
    code: require('./validation-helpers').isValidChinesePhone,
  },
  isValidChineseIDNumber: {
    name: 'isValidChineseIDNumber',
    category: UTIL_CATEGORIES.VALIDATION,
    description: '验证是否为有效的中国大陆身份证号',
    example: "isValidChineseIDNumber('110101199001011234')",
    code: require('./validation-helpers').isValidChineseIDNumber,
  },
  isValidIPv4: {
    name: 'isValidIPv4',
    category: UTIL_CATEGORIES.VALIDATION,
    description: '验证是否为有效的IPv4地址',
    example: "isValidIPv4('192.168.1.1')",
    code: require('./validation-helpers').isValidIPv4,
  },
  isValidIPv6: {
    name: 'isValidIPv6',
    category: UTIL_CATEGORIES.VALIDATION,
    description: '验证是否为有效的IPv6地址',
    example: "isValidIPv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334')",
    code: require('./validation-helpers').isValidIPv6,
  },
  isValidCreditCard: {
    name: 'isValidCreditCard',
    category: UTIL_CATEGORIES.VALIDATION,
    description: '验证是否为有效的信用卡号',
    example: "isValidCreditCard('4111111111111111')",
    code: require('./validation-helpers').isValidCreditCard,
  },
  containsNumber: {
    name: 'containsNumber',
    category: UTIL_CATEGORIES.VALIDATION,
    description: '验证字符串是否包含数字',
    example: "containsNumber('abc123')",
    code: require('./validation-helpers').containsNumber,
  },
  containsLetter: {
    name: 'containsLetter',
    category: UTIL_CATEGORIES.VALIDATION,
    description: '验证字符串是否包含字母',
    example: "containsLetter('abc123')",
    code: require('./validation-helpers').containsLetter,
  },
  containsSpecialChar: {
    name: 'containsSpecialChar',
    category: UTIL_CATEGORIES.VALIDATION,
    description: '验证字符串是否包含特殊字符',
    example: "containsSpecialChar('abc123!@#')",
    code: require('./validation-helpers').containsSpecialChar,
  },
  checkPasswordStrength: {
    name: 'checkPasswordStrength',
    category: UTIL_CATEGORIES.VALIDATION,
    description: '检查密码强度',
    example: "checkPasswordStrength('P@ssw0rd')",
    code: require('./validation-helpers').checkPasswordStrength,
  },
};

/**
 * 获取指定分类的工具函数
 * @param category 工具函数分类
 * @returns 工具函数列表
 */
export function getUtilsByCategory(category: UtilCategoryType): UtilFunction[] {
  return Object.values(utilFunctions).filter(util => util.category === category);
}

/**
 * 获取所有工具函数
 * @returns 工具函数列表
 */
export function getAllUtils(): UtilFunction[] {
  return Object.values(utilFunctions);
}

/**
 * 获取某个工具函数
 * @param name 工具函数名称
 * @returns 工具函数
 */
export function getUtil(name: string): UtilFunction | undefined {
  return utilFunctions[name];
}

/**
 * 获取所有工具函数分类
 * @returns 分类列表
 */
export function getAllCategories(): UtilCategoryType[] {
  return Object.values(UTIL_CATEGORIES);
}

/**
 * 执行工具函数
 * @param name 工具函数名称
 * @param args 参数
 * @returns 执行结果
 */
export function executeUtil(name: string, ...args: any[]): any {
  const util = getUtil(name);
  if (!util) {
    throw new Error(`工具函数 ${name} 不存在`);
  }
  return util.code(...args);
} 
