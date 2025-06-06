/**
 * 工具配置文件
 * 
 * 由脚本自动生成，请勿手动修改
 * 生成时间: 2025-04-08T03:30:53.015Z
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
    id: 'code-share',
    category: 'dev',
    importPath: () => import('../../tools/dev/code-share')
  },
  {
    id: 'curl-converter',
    category: 'dev',
    importPath: () => import('../../tools/dev/curl-converter')
  },
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
  {
    id: 'json-to-sql',
    category: 'json',
    importPath: () => import('../../tools/json/json-to-sql')
  },
  {
    id: 'json-to-types',
    category: 'json',
    importPath: () => import('../../tools/json/json-to-types')
  },

  // 其他工具
  {
    id: 'base64-to-image',
    category: 'misc',
    importPath: () => import('../../tools/conversion/base64-to-image')
  },
  {
    id: 'color-converter',
    category: 'misc',
    importPath: () => import('../../tools/conversion/color-converter')
  },
  {
    id: 'encryption-decryption',
    category: 'misc',
    importPath: () => import('../../tools/crypto/encryption-decryption')
  },
  {
    id: 'time-converter',
    category: 'misc',
    importPath: () => import('../../tools/datetime/time-converter')
  },
  {
    id: 'url-codec',
    category: 'misc',
    importPath: () => import('../../tools/encoding/url-codec')
  },
  {
    id: 'dict-formatter',
    category: 'misc',
    importPath: () => import('../../tools/format/dict-formatter')
  },
  {
    id: 'diff-checker',
    category: 'misc',
    importPath: () => import('../../tools/format/diff-checker')
  },
  {
    id: 'html-formatter',
    category: 'misc',
    importPath: () => import('../../tools/formatter/html-formatter')
  },
  {
    id: 'json-formatter',
    category: 'misc',
    importPath: () => import('../../tools/formatter/json-formatter')
  },
  {
    id: 'expression-evaluator',
    category: 'misc',
    importPath: () => import('../../tools/math/expression-evaluator')
  },
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
    id: 'case-converter',
    category: 'text',
    importPath: () => import('../../tools/text/case-converter')
  },
  {
    id: 'text-decoder',
    category: 'text',
    importPath: () => import('../../tools/text/text-decoder')
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
  {
    id: 'cookie-formatter',
    category: 'web',
    importPath: () => import('../../tools/web/cookie-formatter')
  },
  {
    id: 'curl-to-feapder',
    category: 'web',
    importPath: () => import('../../tools/web/curl-to-feapder')
  },
  {
    id: 'curl-to-requests',
    category: 'web',
    importPath: () => import('../../tools/web/curl-to-requests')
  },
  {
    id: 'header-formatter',
    category: 'web',
    importPath: () => import('../../tools/web/header-formatter')
  },
  {
    id: 'html-renderer',
    category: 'web',
    importPath: () => import('../../tools/web/html-renderer')
  },
  {
    id: 'js-formatter',
    category: 'web',
    importPath: () => import('../../tools/web/js-formatter')
  },
  {
    id: 'url-params-extractor',
    category: 'web',
    importPath: () => import('../../tools/web/url-params-extractor')
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