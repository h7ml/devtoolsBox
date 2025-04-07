/**
 * 工具注册
 * 
 * 该文件负责注册所有工具，并提供相关功能
 */
import { Tool, ToolCategory } from './types';
import { ToolAutoRegistrar } from './auto-register';

// 已注册的工具集合
const registeredTools = new Map<string, Tool>();
// 工具加载状态缓存
const toolLoadingPromises = new Map<string, Promise<Tool>>();

// 标记是否已经注册过工具
let isRegistered = false;

// 添加一个Promise来跟踪注册过程
let registrationPromise: Promise<void> | null = null;

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
 * 优化注册过程，防止重复注册，提高性能
 */
export async function registerAllTools(): Promise<void> {
  // 如果已经注册过，直接返回
  if (isRegistered) {
    console.log('工具已经注册过，跳过注册');
    return;
  }
  
  // 如果正在注册中，返回现有的Promise
  if (registrationPromise) {
    console.log('工具正在注册中，复用现有注册过程');
    return registrationPromise;
  }
  
  console.log('开始注册工具...');
  
  // 创建注册Promise并保存
  registrationPromise = (async () => {
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
      // 出错时重置注册状态，允许下次重试
      isRegistered = false;
      registrationPromise = null;
      throw error;
    }
    
    // 标记为已注册
    isRegistered = true;
    console.log(`工具注册完成，共注册了 ${registeredTools.size} 个工具`);
  })();
  
  // 等待注册完成
  await registrationPromise;
  
  // 注册完成后清理Promise引用
  registrationPromise = null;
  
  return;
}

/**
 * 懒加载单个工具
 * 优化性能，只在需要使用时才加载
 */
export async function lazyLoadTool(toolId: string): Promise<Tool | undefined> {
  // 如果工具已注册，直接返回
  if (registeredTools.has(toolId)) {
    return registeredTools.get(toolId);
  }
  
  // 如果工具正在加载中，复用现有的Promise
  if (toolLoadingPromises.has(toolId)) {
    return toolLoadingPromises.get(toolId);
  }
  
  console.log(`懒加载工具: ${toolId}`);
  
  // 从配置中获取工具导入路径
  const { getToolConfigById } = await import('./tools-config');
  const toolConfig = getToolConfigById(toolId);
  
  if (!toolConfig) {
    console.error(`找不到工具配置: ${toolId}`);
    return undefined;
  }
  
  // 创建加载Promise
  const loadPromise = (async () => {
    try {
      const module = await toolConfig.importPath();
      
      if (!module.default) {
        throw new Error('工具模块未提供默认导出');
      }
      
      const tool = module.default;
      
      // 确保工具具有正确的类别
      if (!tool.category) {
        tool.category = toolConfig.category;
      }
      
      // 注册工具
      registerTool(tool);
      console.log(`✅ 懒加载成功: ${tool.name} (${tool.id})`);
      
      return tool;
    } catch (error) {
      console.error(`❌ 懒加载失败: ${toolId}`, error);
      // 移除失败的加载Promise，允许下次重试
      toolLoadingPromises.delete(toolId);
      throw error;
    }
  })();
  
  // 保存加载Promise
  toolLoadingPromises.set(toolId, loadPromise);
  
  return loadPromise;
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

/**
 * 获取与指定工具相关的工具
 * @param toolId 工具ID
 * @param limit 限制返回的相关工具数量
 * @returns 相关工具数组
 */
export function getRelatedTools(toolId: string, limit: number = 4): Tool[] {
  const currentTool = getToolById(toolId);
  if (!currentTool) return [];

  // 1. 获取同类别的工具
  const sameCategoryTools = getToolsByCategory(currentTool.category)
    .filter(tool => tool.id !== toolId);

  // 2. 如果同类别工具不足，添加其他类别的工具
  if (sameCategoryTools.length < limit) {
    const otherTools = getAllTools()
      .filter(tool => 
        tool.id !== toolId && 
        tool.category !== currentTool.category &&
        // 如果有关键词匹配，优先选择
        (currentTool.meta.keywords?.some(keyword => 
          tool.meta.keywords?.includes(keyword)
        ) || true)
      );
    
    // 随机排序其他工具以增加推荐多样性
    const shuffledOtherTools = otherTools.sort(() => 0.5 - Math.random());
    
    // 将同类别工具和其他类别工具合并，确保结果中没有重复
    return [...sameCategoryTools, ...shuffledOtherTools]
      .slice(0, limit);
  }

  // 如果同类别工具够了，随机选择同类别中的工具
  return sameCategoryTools
    .sort(() => 0.5 - Math.random())
    .slice(0, limit);
} 
