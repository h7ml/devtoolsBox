/**
 * 工具注册
 * 
 * 该文件负责注册所有工具，并提供相关功能
 */
import { Tool, ToolCategory } from './types';
import { ToolAutoRegistrar } from './auto-register';

// 已注册的工具集合
const registeredTools = new Map<string, Tool>();

// 标记是否已经注册过工具
let isRegistered = false;

/**
 * 注册单个工具
 */
export function registerTool(tool: Tool): void {
  if (registeredTools.has(tool.id)) {
    console.warn(`工具 ${tool.id} 已经注册过，将被覆盖`);
  }
  
  registeredTools.set(tool.id, tool);
}

/**
 * 注册所有工具
 */
export async function registerAllTools(): Promise<void> {
  // 避免重复注册
  if (isRegistered) {
    console.log('工具已经注册过，跳过注册');
    return;
  }
  
  console.log('开始注册工具...');
  
  try {
    // 使用自动注册器
    const autoRegistrar = new ToolAutoRegistrar();
    const result = await autoRegistrar.scanAndRegisterTools();
    
    if (result.success) {
      console.log(`自动注册成功，共注册了 ${result.registeredCount} 个工具`);
      
      if (result.failedTools.length > 0) {
        console.warn(`${result.failedTools.length} 个工具自动注册失败`);
      }
    } else {
      console.error('自动注册工具失败:', result.error);
    }
  } catch (error) {
    console.error('自动注册发生错误:', error);
  }
  
  // 标记为已注册
  isRegistered = true;
  console.log(`工具注册完成，共注册了 ${registeredTools.size} 个工具`);
}

/**
 * 获取所有已注册的工具
 */
export function getAllTools(): Tool[] {
  return Array.from(registeredTools.values());
}

/**
 * 根据ID获取工具
 */
export function getToolById(id: string): Tool | undefined {
  return registeredTools.get(id);
}

/**
 * 根据类别获取工具
 */
export function getToolsByCategory(category: ToolCategory): Tool[] {
  return getAllTools().filter(tool => tool.category === category);
}

/**
 * 搜索工具（根据关键词）
 */
export function searchTools(query: string): Tool[] {
  if (!query || query.trim() === '') {
    return getAllTools();
  }
  
  const searchQuery = query.toLowerCase();
  
  return getAllTools().filter(tool => {
    const nameMatch = tool.name.toLowerCase().includes(searchQuery);
    const descMatch = tool.description.toLowerCase().includes(searchQuery);
    
    // 检查meta关键词
    const keywordMatch = tool.meta?.keywords?.some(keyword => 
      keyword.toLowerCase().includes(searchQuery)
    ) || false;
    
    return nameMatch || descMatch || keywordMatch;
  });
}

/**
 * 获取热门工具
 */
export function getPopularTools(limit: number = 5): Tool[] {
  // 这里可以实现基于使用统计的热门工具检索逻辑
  // 目前简单返回前N个工具
  return getAllTools().slice(0, limit);
}

/**
 * 获取收藏工具
 */
export function getFavoriteTools(favoriteIds: string[]): Tool[] {
  if (!favoriteIds || favoriteIds.length === 0) {
    return [];
  }
  
  return favoriteIds
    .map(id => getToolById(id))
    .filter(Boolean) as Tool[];
} 
