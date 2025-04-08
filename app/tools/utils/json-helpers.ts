/**
 * JSON处理工具函数
 */

/**
 * 格式化JSON字符串
 * @param jsonString 要格式化的JSON字符串
 * @param indentSize 缩进大小（数字或'tab'）
 * @param sortKeys 是否对键进行排序
 * @param minify 是否最小化（移除所有空格）
 * @returns 格式化后的JSON字符串和可能的错误
 */
export function formatJSON(
  jsonString: string,
  indentSize: string | number = 2,
  sortKeys: boolean = false,
  minify: boolean = false
): { result: string; error: string | null } {
  try {
    // 解析JSON
    const parsedJson = JSON.parse(jsonString);
    
    // 根据选项格式化
    let indent: number | string = minify ? 0 : indentSize;
    if (indent === 'tab') indent = '\t';
    else if (typeof indent === 'string') indent = Number(indent);
    
    // 处理排序
    const replacer = sortKeys 
      ? (key: string, value: any) => {
          // 如果是对象但不是数组，对其键进行排序
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            return Object.keys(value)
              .sort()
              .reduce((sorted, key) => {
                sorted[key] = value[key];
                return sorted;
              }, {} as Record<string, any>);
          }
          return value;
        }
      : null;
    
    const formattedJson = JSON.stringify(parsedJson, replacer, indent);
    
    return {
      result: formattedJson,
      error: null
    };
  } catch (err) {
    return {
      result: '',
      error: `JSON解析错误: ${(err as Error).message}`
    };
  }
}

/**
 * 验证JSON字符串
 * @param jsonString 要验证的JSON字符串
 * @returns 是否有效以及可能的错误信息
 */
export function validateJSON(jsonString: string): { 
  isValid: boolean; 
  error: string | null;
  parsedJSON?: any;
} {
  try {
    const parsedJSON = JSON.parse(jsonString);
    return {
      isValid: true,
      error: null,
      parsedJSON
    };
  } catch (err) {
    return {
      isValid: false,
      error: `JSON无效: ${(err as Error).message}`
    };
  }
}

/**
 * JSON路径查询
 * @param jsonObject JSON对象
 * @param path JSON路径表达式（如"$.store.book[0].title"）
 * @returns 查询结果和可能的错误
 */
export function queryJSONPath(jsonObject: any, path: string): { 
  result: any;
  error: string | null;
} {
  try {
    // 简化版的JSON路径解析器
    // 适用于基本的JSON路径表达式
    
    // 如果不是对象，则返回错误
    if (typeof jsonObject !== 'object' || jsonObject === null) {
      return {
        result: null,
        error: '输入不是有效的JSON对象'
      };
    }
    
    // 移除开头的$.
    let normalizedPath = path.trim();
    if (normalizedPath.startsWith('$.')) {
      normalizedPath = normalizedPath.substring(2);
    } else if (normalizedPath.startsWith('$')) {
      normalizedPath = normalizedPath.substring(1);
    }
    
    // 如果路径为空，返回整个对象
    if (!normalizedPath) {
      return {
        result: jsonObject,
        error: null
      };
    }
    
    // 分割路径
    const segments = normalizedPath.split('.');
    let current = jsonObject;
    
    for (let i = 0; i < segments.length; i++) {
      let segment = segments[i];
      
      // 处理数组索引，如book[0]
      const arrayMatch = segment.match(/^([^\[]+)\[(\d+)\]$/);
      
      if (arrayMatch) {
        // 有数组索引
        const arrayName = arrayMatch[1];
        const arrayIndex = parseInt(arrayMatch[2], 10);
        
        // 检查属性存在
        if (!(arrayName in current)) {
          return {
            result: null,
            error: `路径错误: 找不到属性 "${arrayName}"`
          };
        }
        
        current = current[arrayName];
        
        // 检查是否为数组
        if (!Array.isArray(current)) {
          return {
            result: null,
            error: `路径错误: "${arrayName}" 不是数组`
          };
        }
        
        // 检查索引是否在范围内
        if (arrayIndex >= current.length) {
          return {
            result: null,
            error: `路径错误: 索引 ${arrayIndex} 超出了数组范围`
          };
        }
        
        current = current[arrayIndex];
      } else {
        // 简单属性
        if (segment in current) {
          current = current[segment];
        } else {
          return {
            result: null,
            error: `路径错误: 找不到属性 "${segment}"`
          };
        }
      }
    }
    
    return {
      result: current,
      error: null
    };
  } catch (err) {
    return {
      result: null,
      error: `JSON路径查询错误: ${(err as Error).message}`
    };
  }
}

/**
 * 将JSON转换为表格数据
 * @param jsonArray JSON数组
 * @returns 表格数据和列信息
 */
export function jsonToTable(jsonArray: any[]): {
  columns: { key: string; title: string }[];
  data: Record<string, any>[];
  error: string | null;
} {
  try {
    // 验证输入是数组
    if (!Array.isArray(jsonArray)) {
      return {
        columns: [],
        data: [],
        error: '输入必须是JSON数组'
      };
    }
    
    // 如果数组为空，返回空表格
    if (jsonArray.length === 0) {
      return {
        columns: [],
        data: [],
        error: null
      };
    }
    
    // 收集所有可能的列
    const allKeys = new Set<string>();
    
    // 扁平化每个对象的第一级键
    jsonArray.forEach(item => {
      if (typeof item === 'object' && item !== null) {
        Object.keys(item).forEach(key => allKeys.add(key));
      }
    });
    
    // 创建列配置
    const columns = Array.from(allKeys).map(key => ({
      key,
      title: key
    }));
    
    // 转换数据
    const data = jsonArray.map(item => {
      if (typeof item !== 'object' || item === null) {
        // 如果不是对象，创建一个包含单个值的对象
        return { value: item };
      }
      return item;
    });
    
    return {
      columns,
      data,
      error: null
    };
  } catch (err) {
    return {
      columns: [],
      data: [],
      error: `转换表格错误: ${(err as Error).message}`
    };
  }
}

/**
 * 将JSON对象转换为URL查询字符串
 * @param jsonObject JSON对象
 * @returns URL查询字符串
 */
export function jsonToUrlParams(jsonObject: Record<string, any>): {
  result: string;
  error: string | null;
} {
  try {
    const params = new URLSearchParams();
    
    // 扁平化JSON对象并添加到URLSearchParams
    function addParams(obj: Record<string, any>, prefix: string = '') {
      Object.entries(obj).forEach(([key, value]) => {
        const paramKey = prefix ? `${prefix}[${key}]` : key;
        
        if (value === null) {
          params.append(paramKey, '');
        } else if (typeof value === 'object') {
          // 递归处理嵌套对象
          addParams(value, paramKey);
        } else {
          params.append(paramKey, String(value));
        }
      });
    }
    
    addParams(jsonObject);
    
    return {
      result: params.toString(),
      error: null
    };
  } catch (err) {
    return {
      result: '',
      error: `转换URL参数错误: ${(err as Error).message}`
    };
  }
}

/**
 * 将JSON对象转换为XML字符串
 * @param jsonObject JSON对象
 * @param rootName 根元素名称
 * @returns XML字符串
 */
export function jsonToXml(jsonObject: any, rootName: string = 'root'): {
  result: string;
  error: string | null;
} {
  try {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    
    // 将JSON节点转换为XML
    function toXML(obj: any, nodeName: string): string {
      if (obj === null || obj === undefined) {
        return `<${nodeName} />`;
      }
      
      if (typeof obj !== 'object') {
        // 处理简单类型
        return `<${nodeName}>${escapeXml(String(obj))}</${nodeName}>`;
      }
      
      if (Array.isArray(obj)) {
        // 处理数组
        return obj.map(item => toXML(item, nodeName)).join('\n');
      }
      
      // 处理对象
      let result = `<${nodeName}>`;
      
      for (const [key, value] of Object.entries(obj)) {
        // 确保键名是有效的XML标签名
        const validKey = key.replace(/[^a-zA-Z0-9_-]/g, '_');
        result += '\n  ' + toXML(value, validKey);
      }
      
      result += `\n</${nodeName}>`;
      return result;
    }
    
    // 转义XML特殊字符
    function escapeXml(str: string): string {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    }
    
    xml += toXML(jsonObject, rootName);
    
    return {
      result: xml,
      error: null
    };
  } catch (err) {
    return {
      result: '',
      error: `转换XML错误: ${(err as Error).message}`
    };
  }
} 
