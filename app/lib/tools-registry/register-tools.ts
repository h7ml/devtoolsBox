import toolRegistry from './index';
import base64Tool from '../../tools/text/base64';
import jsonFormatterTool from '../../tools/json/json-formatter';

// 添加注册状态标记
let isRegistered = false;

// 注册所有工具
export function registerAllTools() {
  // 如果已经注册过，直接返回
  if (isRegistered) {
    return;
  }

  // 文本类工具
  toolRegistry.register(base64Tool);
  
  // JSON类工具
  toolRegistry.register(jsonFormatterTool);
  
  // 待添加更多工具...
  
  console.log(`已成功注册 ${toolRegistry.getAllTools().length} 个工具`);

  // 设置注册状态为已完成
  isRegistered = true;
}

// 获取所有工具
export function getAllTools() {
  // 确保工具已注册
  registerAllTools();
  return toolRegistry.getAllTools();
}

// 获取指定类别的工具
export function getToolsByCategory(category: string) {
  // 确保工具已注册
  registerAllTools();
  return toolRegistry.getToolsByCategory(category as any);
}

// 搜索工具
export function searchTools(query: string) {
  // 确保工具已注册
  registerAllTools();
  return toolRegistry.searchTools(query);
}

// 获取工具详情
export function getTool(id: string) {
  // 确保工具已注册
  registerAllTools();
  return toolRegistry.getTool(id);
} 
