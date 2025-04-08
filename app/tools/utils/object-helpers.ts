/**
 * 对象处理工具函数
 */

/**
 * 深度克隆对象
 * @param obj 需要克隆的对象
 * @returns 克隆后的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 处理日期对象
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }

  // 处理对象
  const clonedObj = {} as Record<string, any>;
  Object.keys(obj as Record<string, any>).forEach(key => {
    clonedObj[key] = deepClone((obj as Record<string, any>)[key]);
  });

  return clonedObj as T;
}

/**
 * 深度合并对象
 * @param target 目标对象
 * @param source 源对象
 * @returns 合并后的对象
 */
export function deepMerge<T extends Record<string, any>, U extends Record<string, any>>(
  target: T, 
  source: U
): T & U {
  const output = { ...target } as T & U;
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
}

/**
 * 判断是否为对象
 * @param item 要检查的项
 * @returns 是否为对象
 */
export function isObject(item: any): item is Record<string, any> {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * 扁平化对象（将嵌套对象转换为单层对象，键使用点符号表示层级）
 * @param obj 嵌套对象
 * @param prefix 前缀
 * @returns 扁平化后的对象
 */
export function flattenObject(
  obj: Record<string, any>, 
  prefix: string = ''
): Record<string, any> {
  return Object.keys(obj).reduce((acc, key) => {
    const prefixedKey = prefix ? `${prefix}.${key}` : key;
    
    if (isObject(obj[key]) && Object.keys(obj[key]).length > 0) {
      Object.assign(acc, flattenObject(obj[key], prefixedKey));
    } else {
      acc[prefixedKey] = obj[key];
    }
    
    return acc;
  }, {} as Record<string, any>);
}

/**
 * 取出对象中的指定键
 * @param obj 源对象
 * @param keys 要提取的键列表
 * @returns 提取后的对象
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T, 
  keys: K[]
): Pick<T, K> {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {} as Pick<T, K>);
}

/**
 * 从对象中排除指定键
 * @param obj 源对象
 * @param keys 要排除的键列表
 * @returns 排除后的对象
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T, 
  keys: K[]
): Omit<T, K> {
  return Object.keys(obj)
    .filter(key => !keys.includes(key as K))
    .reduce((result, key) => {
      result[key as keyof Omit<T, K>] = obj[key as keyof T];
      return result;
    }, {} as Omit<T, K>);
}

/**
 * 比较两个对象是否深度相等
 * @param obj1 第一个对象
 * @param obj2 第二个对象
 * @returns 是否相等
 */
export function isEqual(obj1: any, obj2: any): boolean {
  // 如果类型不同，直接返回false
  if (typeof obj1 !== typeof obj2) {
    return false;
  }
  
  // 处理简单类型
  if (obj1 === null || obj2 === null || typeof obj1 !== 'object') {
    return obj1 === obj2;
  }
  
  // 处理日期类型
  if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.getTime() === obj2.getTime();
  }
  
  // 处理数组
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) {
      return false;
    }
    
    for (let i = 0; i < obj1.length; i++) {
      if (!isEqual(obj1[i], obj2[i])) {
        return false;
      }
    }
    
    return true;
  }
  
  // 处理对象
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) {
    return false;
  }
  
  return keys1.every(key => 
    keys2.includes(key) && isEqual(obj1[key], obj2[key])
  );
}
