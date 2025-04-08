/**
 * JSON格式化工具 - 工具函数
 */

import { formatJSON as formatJSONUtil } from '@/app/tools/utils/json-helpers';

/**
 * 格式化JSON字符串
 * @param jsonString 要格式化的JSON字符串
 * @param indentSize 缩进大小（数字或'tab'）
 * @param sortKeys 是否对键进行排序
 * @param minify 是否最小化（移除所有空格）
 * @returns 格式化后的JSON字符串
 */
export function formatJSON(
  jsonString: string,
  indentSize: string | number = 2,
  sortKeys: boolean = false,
  minify: boolean = false
): { result: string; error: string | null } {
  return formatJSONUtil(jsonString, indentSize, sortKeys, minify);
} 
