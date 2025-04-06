/**
 * 工具配置文件
 * 
 * 由脚本自动生成，请勿手动修改
 * 生成时间: 2025-04-06T08:32:41.402Z
 */
import { ToolCategory } from './types';

export interface ToolConfig {
  id: string;
  category: ToolCategory;
  importPath: () => Promise<any>;
}

/**
 * 所有工具配置
 */
export const toolConfigs: ToolConfig[] = [
  // 开发辅助工具
  {
    id: 'regex-tester',
    category: 'dev',
    importPath: () => import('../../tools/dev/regex-tester')
  },
  {
    id: 'timestamp',
    category: 'dev',
    importPath: () => import('../../tools/dev/timestamp')
  },
  {
    id: 'uuid',
    category: 'dev',
    importPath: () => import('../../tools/dev/uuid')
  },

  // JSON处理工具
  {
    id: 'json-formatter',
    category: 'json',
    importPath: () => import('../../tools/json/json-formatter')
  },

  // 其他工具
  {
    id: 'password-generator',
    category: 'misc',
    importPath: () => import('../../tools/other/password-generator')
  },

  // 文本处理工具
  {
    id: 'base64',
    category: 'text',
    importPath: () => import('../../tools/text/base64')
  },
  {
    id: 'url-encoder',
    category: 'text',
    importPath: () => import('../../tools/text/url-encoder')
  },

  // 网络工具
  {
    id: 'css-selector',
    category: 'web',
    importPath: () => import('../../tools/crawler/css-selector')
  },
  {
    id: 'http-request',
    category: 'web',
    importPath: () => import('../../tools/crawler/http-request')
  },
];

/**
 * 按类别获取工具配置
 */
export function getToolConfigsByCategory(category: ToolCategory): ToolConfig[] {
  return toolConfigs.filter(config => config.category === category);
}

/**
 * 获取所有工具配置
 */
export function getAllToolConfigs(): ToolConfig[] {
  return toolConfigs;
}

/**
 * 获取工具配置
 */
export function getToolConfigById(id: string): ToolConfig | undefined {
  return toolConfigs.find(config => config.id === id);
}