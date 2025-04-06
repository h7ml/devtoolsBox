#!/usr/bin/env node

/**
 * 工具配置生成器
 * 
 * 该脚本扫描tools目录并自动生成toolConfigs配置
 * 运行方式: node scripts/generate-tool-configs.js
 */

const fs = require('fs');
const path = require('path');

// 工具根目录路径
const TOOLS_DIR = path.resolve(process.cwd(), 'app/tools');

// 目录名到工具类别的映射
const DIR_TO_CATEGORY_MAP = {
  'dev': 'dev',
  'text': 'text',
  'json': 'json',
  'web': 'web',
  'crawler': 'web',
  'other': 'misc',
  'runtime': 'runtime'
};

// 排除的目录（不会被注册）
const EXCLUDED_DIRS = ['[category]', 'node_modules', '.next', 'dist', 'lib'];

// 目标输出文件
const OUTPUT_FILE = path.resolve(process.cwd(), 'app/lib/tools-registry/tools-config.ts');

/**
 * 扫描工具目录
 */
function scanToolsDirectory() {
  console.log('扫描工具目录:', TOOLS_DIR);

  const tools = [];

  // 获取类别目录
  const categoryDirs = fs.readdirSync(TOOLS_DIR)
    .filter(dir => {
      const dirPath = path.join(TOOLS_DIR, dir);
      return fs.statSync(dirPath).isDirectory() && !EXCLUDED_DIRS.includes(dir);
    });

  // 遍历类别目录
  for (const categoryDir of categoryDirs) {
    const category = DIR_TO_CATEGORY_MAP[categoryDir] || 'misc';
    const categoryPath = path.join(TOOLS_DIR, categoryDir);

    console.log(`  扫描类别: ${categoryDir} -> ${category}`);

    // 获取工具目录
    const toolDirs = fs.readdirSync(categoryPath)
      .filter(dir => {
        const dirPath = path.join(categoryPath, dir);
        return fs.statSync(dirPath).isDirectory();
      });

    // 遍历工具目录
    for (const toolDir of toolDirs) {
      const toolPath = path.join(categoryPath, toolDir);
      const indexFile = path.join(toolPath, 'index.tsx');

      // 验证工具是否包含index.tsx文件
      if (fs.existsSync(indexFile)) {
        console.log(`    找到工具: ${toolDir}`);

        tools.push({
          id: toolDir,
          category,
          importPath: `../../tools/${categoryDir}/${toolDir}`
        });
      } else {
        console.warn(`    警告: ${toolDir} 缺少 index.tsx 文件，已跳过`);
      }
    }
  }

  return tools;
}

/**
 * 生成配置文件
 */
function generateConfigFile(tools) {
  // 模板头部
  const header = `/**
 * 工具配置文件
 * 
 * 由脚本自动生成，请勿手动修改
 * 生成时间: ${new Date().toISOString()}
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
export const toolConfigs: ToolConfig[] = `;

  // 生成配置数组
  const categorizedTools = {};

  tools.forEach(tool => {
    if (!categorizedTools[tool.category]) {
      categorizedTools[tool.category] = [];
    }
    categorizedTools[tool.category].push(tool);
  });

  let configArrayContent = '[\n';

  // 按类别排序
  Object.keys(categorizedTools).sort().forEach(category => {
    configArrayContent += `  // ${getCategoryDisplayName(category)}工具\n`;

    categorizedTools[category].forEach(tool => {
      configArrayContent += `  {\n`;
      configArrayContent += `    id: '${tool.id}',\n`;
      configArrayContent += `    category: '${tool.category}',\n`;
      configArrayContent += `    importPath: () => import('${tool.importPath}')\n`;
      configArrayContent += `  },\n`;
    });

    configArrayContent += '\n';
  });

  configArrayContent = configArrayContent.slice(0, -2) + '\n];\n';

  // 工具函数
  const functions = `
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
}`;

  // 完整文件内容
  return header + configArrayContent + functions;
}

/**
 * 获取类别显示名称
 */
function getCategoryDisplayName(category) {
  const nameMap = {
    'dev': '开发辅助',
    'text': '文本处理',
    'json': 'JSON处理',
    'web': '网络',
    'misc': '其他',
    'runtime': '运行时'
  };

  return nameMap[category] || category;
}

/**
 * 主函数
 */
function main() {
  try {
    console.log('开始生成工具配置...');

    // 扫描工具目录
    const tools = scanToolsDirectory();

    if (tools.length === 0) {
      console.warn('警告: 未找到任何工具');
      return;
    }

    console.log(`找到 ${tools.length} 个工具`);

    // 生成配置文件内容
    const configContent = generateConfigFile(tools);

    // 写入文件
    fs.writeFileSync(OUTPUT_FILE, configContent, 'utf8');

    console.log(`配置文件已生成: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('生成工具配置失败:', error);
    process.exit(1);
  }
}

// 执行主函数
main(); 
