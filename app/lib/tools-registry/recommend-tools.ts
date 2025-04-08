/**
 * 工具推荐服务
 * 基于用户行为和工具相似度推荐相关工具
 */

import { Tool, ToolCategory } from './types';
import { getToolById, getAllTools, getToolsByCategory } from './register-tools';

/**
 * 推荐类型
 */
export type RecommendationType = 'similar' | 'popular' | 'related' | 'new' | 'personalized';

/**
 * 推荐选项
 */
export interface RecommendationOptions {
  /**
   * 推荐类型
   */
  type?: RecommendationType;
  
  /**
   * 要排除的工具ID（例如当前正在查看的工具）
   */
  excludeIds?: string[];
  
  /**
   * 限制返回结果数量
   */
  limit?: number;
  
  /**
   * 是否包含热门工具（对于某些推荐类型）
   */
  includePopular?: boolean;
  
  /**
   * 用户历史记录的工具ID数组
   */
  userHistory?: string[];
  
  /**
   * 额外的过滤条件
   */
  filter?: (tool: Tool) => boolean;
}

/**
 * 相似度评分
 */
interface SimilarityScore {
  tool: Tool;
  score: number;
}

/**
 * 获取相似工具
 * @param toolId 工具ID
 * @param category 工具类别
 * @param options 选项
 * @returns Promise<Tool[]> 相似工具数组
 */
export function getSimilarTools(
  toolId: string,
  category: string,
  options: RecommendationOptions = {}
): Tool[] {
  try {
    // 获取目标工具
    const targetTool = getToolById(toolId);
    if (!targetTool) {
      throw new Error(`Tool not found: ${category}/${toolId}`);
    }
    
    // 获取同类别中的其他工具
    const categoryTools = getToolsByCategory(category as ToolCategory);
    
    // 排除指定的工具IDs（包括目标工具自身）
    const excludeIds = [...(options.excludeIds || []), toolId];
    let filteredTools = categoryTools.filter(tool => !excludeIds.includes(tool.id));
    
    // 应用额外过滤条件
    if (options.filter) {
      filteredTools = filteredTools.filter(options.filter as any);
    }
    
    // 计算相似度评分
    const scoredTools = filteredTools.map(tool => ({
      tool,
      score: calculateToolSimilarity(targetTool, tool)
    }));
    
    // 按相似度排序
    scoredTools.sort((a, b) => b.score - a.score);
    
    // 限制结果数量
    const limit = options.limit || 5;
    return scoredTools.slice(0, limit).map(scored => scored.tool);
  } catch (error) {
    console.error('Error getting similar tools:', error);
    return [];
  }
}

/**
 * 获取相关工具
 * @param toolId 工具ID
 * @param category 工具类别
 * @param options 选项
 * @returns Promise<Tool[]> 相关工具数组
 */
export async function getRelatedTools(
  toolId: string,
  category: string,
  options: RecommendationOptions = {}
): Promise<Tool[]> {
  try {
    // 获取目标工具
    const targetTool = await getToolById(toolId);
    if (!targetTool) {
      throw new Error(`Tool not found: ${category}/${toolId}`);
    }
    
    // 获取所有工具
    const allTools = await getAllTools();
    
    // 排除指定的工具IDs（包括目标工具自身）
    const excludeIds = [...(options.excludeIds || []), toolId];
    let filteredTools = allTools.filter(tool => !excludeIds.includes(tool.id));
    
    // 应用额外过滤条件
    if (options.filter) {
      filteredTools = filteredTools.filter(options.filter as any);
    }
    
    // 跨类别相关工具逻辑:
    // 1. 先查找共享相同标签的工具
    // 2. 再查找与当前类别相关的类别中的工具
    // 3. 最后按相关度排序
    
    const scoredTools = filteredTools.map(tool => ({
      tool,
      score: calculateToolRelatedness(targetTool, tool)
    }));
    
    // 按相关度排序
    scoredTools.sort((a, b) => b.score - a.score);
    
    // 限制结果数量
    const limit = options.limit || 5;
    return scoredTools.slice(0, limit).map(scored => scored.tool);
  } catch (error) {
    console.error('Error getting related tools:', error);
    return [];
  }
}

/**
 * 获取热门工具
 * @param options 选项
 * @returns Promise<Tool[]> 热门工具数组
 */
export async function getPopularTools(options: RecommendationOptions = {}): Promise<Tool[]> {
  try {
    // 获取所有工具
    const allTools = await getAllTools();
    
    // 排除指定的工具IDs
    let filteredTools = allTools;
    if (options.excludeIds && options.excludeIds.length > 0) {
      filteredTools = filteredTools.filter(tool => !options.excludeIds!.includes(tool.id));
    }
    
    // 应用额外过滤条件
    if (options.filter) {
      filteredTools = filteredTools.filter(options.filter as any);
    }
    
    // 按热门度排序（这里使用views或rating）
    filteredTools.sort((a, b) => {
      const aPopularity = a.meta?.popularity || 0;
      const bPopularity = b.meta?.popularity || 0;
      return bPopularity - aPopularity;
    });
    
    // 限制结果数量
    const limit = options.limit || 10;
    return filteredTools.slice(0, limit);
  } catch (error) {
    console.error('Error getting popular tools:', error);
    return [];
  }
}

/**
 * 获取新工具
 * @param options 选项
 * @returns Promise<Tool[]> 新工具数组
 */
export async function getNewTools(options: RecommendationOptions = {}): Promise<Tool[]> {
  try {
    // 获取所有工具
    const allTools = await getAllTools();
    
    // 排除指定的工具IDs
    let filteredTools = allTools;
    if (options.excludeIds && options.excludeIds.length > 0) {
      filteredTools = filteredTools.filter(tool => !options.excludeIds!.includes(tool.id));
    }
    
    // 应用额外过滤条件
    if (options.filter) {
      filteredTools = filteredTools.filter(options.filter as any);
    }
    
    // 按创建日期排序（最新的在前）
    filteredTools.sort((a, b) => {
      const aDate = a.meta?.lastUpdated 
        ? new Date(a.meta.lastUpdated).getTime() 
        : 0;
      const bDate = b.meta?.lastUpdated 
        ? new Date(b.meta.lastUpdated).getTime() 
        : 0;
      return bDate - aDate;
    });
    
    // 限制结果数量
    const limit = options.limit || 10;
    return filteredTools.slice(0, limit);
  } catch (error) {
    console.error('Error getting new tools:', error);
    return [];
  }
}

/**
 * 获取个性化推荐工具
 * @param userHistory 用户历史记录的工具ID数组
 * @param options 选项
 * @returns Promise<Tool[]> 个性化推荐工具数组
 */
export async function getPersonalizedTools(
  userHistory: string[] = [],
  options: RecommendationOptions = {}
): Promise<Tool[]> {
  try {
    if (!userHistory || userHistory.length === 0) {
      // 如果没有历史记录，返回热门工具
      return getPopularTools(options);
    }
    
    // 获取所有工具
    const allTools = await getAllTools();
    
    // 获取用户历史记录中的工具
    const historyTools: Tool[] = [];
    for (const toolId of userHistory) {
      // 从ID中提取类别和ID
      const [category, id] = toolId.split('/');
      if (category && id) {
        try {
          const tool = await getToolById(id);
          if (tool) {
            historyTools.push(tool);
          }
        } catch (error) {
          // 忽略获取单个历史工具时的错误
          console.warn(`Could not find tool from history: ${toolId}`);
        }
      }
    }
    
    if (historyTools.length === 0) {
      // 如果无法获取任何历史记录工具，回退到热门工具
      return getPopularTools(options);
    }
    
    // 排除已经在历史记录中的工具
    const historyIds = historyTools.map(tool => tool.id);
    const excludeIds = [...(options.excludeIds || []), ...historyIds];
    let filteredTools = allTools.filter(tool => !excludeIds.includes(tool.id));
    
    // 应用额外过滤条件
    if (options.filter) {
      filteredTools = filteredTools.filter(options.filter as any);
    }
    
    // 基于历史记录计算个性化相似度得分
    const scoredTools = filteredTools.map(tool => {
      // 计算与每个历史工具的相似度，并取最高值
      let maxScore = 0;
      for (const historyTool of historyTools) {
        const similarity = calculateToolSimilarity(historyTool, tool);
        if (similarity > maxScore) {
          maxScore = similarity;
        }
      }
      return { tool, score: maxScore };
    });
    
    // 按相似度排序
    scoredTools.sort((a, b) => b.score - a.score);
    
    // 如果需要混合一些热门工具
    if (options.includePopular) {
      const popularLimit = Math.floor((options.limit || 10) / 2);
      const personalizedLimit = (options.limit || 10) - popularLimit;
      
      // 获取热门工具
      const popularTools = await getPopularTools({
        ...options,
        limit: popularLimit
      });
      
      // 获取个性化推荐（排除热门工具）
      const popularIds = popularTools.map(tool => tool.id);
      const personalizedTools = scoredTools
        .filter(scored => !popularIds.includes(scored.tool.id))
        .slice(0, personalizedLimit)
        .map(scored => scored.tool);
      
      // 合并两种推荐
      return [...personalizedTools, ...popularTools];
    }
    
    // 只返回个性化推荐
    const limit = options.limit || 10;
    return scoredTools.slice(0, limit).map(scored => scored.tool);
  } catch (error) {
    console.error('Error getting personalized tools:', error);
    return [];
  }
}

/**
 * 根据推荐类型获取工具
 * @param type 推荐类型
 * @param options 选项
 * @returns Promise<Tool[]> 推荐工具数组
 */
export async function getRecommendedTools(
  type: RecommendationType = 'popular',
  options: RecommendationOptions = {}
): Promise<Tool[]> {
  switch (type) {
    case 'similar':
      if (!options.userHistory || options.userHistory.length === 0) {
        throw new Error('Similar recommendations require a tool ID');
      }
      const [category, id] = options.userHistory[0].split('/');
      return getSimilarTools(id, category, options);
      
    case 'related':
      if (!options.userHistory || options.userHistory.length === 0) {
        throw new Error('Related recommendations require a tool ID');
      }
      const [relCategory, relId] = options.userHistory[0].split('/');
      return getRelatedTools(relId, relCategory, options);
      
    case 'new':
      return getNewTools(options);
      
    case 'personalized':
      return getPersonalizedTools(options.userHistory, options);
      
    case 'popular':
    default:
      return getPopularTools(options);
  }
}

/**
 * 计算两个工具之间的相似度
 * @param tool1 工具1
 * @param tool2 工具2
 * @returns 相似度评分 (0-1)
 */
function calculateToolSimilarity(tool1: Tool, tool2: Tool): number {
  // 基础分值
  let score = 0;
  
  // 同类别加分
  if (tool1.category === tool2.category) {
    score += 0.4;
  }
  
  // 标签匹配加分
  const tags1 = tool1.meta.keywords || [];
  const tags2 = tool2.meta.keywords || [];
  
  const commonTags = tags1.filter(tag => tags2.includes(tag));
  if (commonTags.length > 0) {
    // 匹配标签数量越多，分值越高
    score += 0.3 * (commonTags.length / Math.max(tags1.length, tags2.length));
  }
  
  // 关键词匹配
  const keywords1 = [...(tool1.meta.keywords || []), tool1.name, tool1.description];
  const keywords2 = [...(tool2.meta.keywords || []), tool2.name, tool2.description];
  
  // 简化的文本相似度检查
  let textMatchScore = 0;
  keywords1.forEach(k1 => {
    keywords2.forEach(k2 => {
      if (k1.toLowerCase().includes(k2.toLowerCase()) || 
          k2.toLowerCase().includes(k1.toLowerCase())) {
        textMatchScore += 0.05;
      }
    });
  });
  
  // 文本匹配最多加0.3分
  score += Math.min(textMatchScore, 0.3);
  
  // 确保分值在0-1之间
  return Math.min(Math.max(score, 0), 1);
}

/**
 * 计算两个工具之间的相关度（跨类别）
 * @param tool1 工具1
 * @param tool2 工具2
 * @returns 相关度评分 (0-1)
 */
function calculateToolRelatedness(tool1: Tool, tool2: Tool): number {
  // 相关度计算与相似度类似，但权重不同
  let score = 0;
  
  // 相关类别加分（不同于相似度，这里权重较低）
  if (tool1.category === tool2.category) {
    score += 0.2;
  } else {
    // 相关类别检查
    const relatedCategories: Record<string, string[]> = {
      'json': ['formatter', 'validator', 'converter'],
      'formatter': ['json', 'text', 'converter'],
      'converter': ['json', 'text', 'formatter', 'image'],
      'crypto': ['validator', 'generator', 'security'],
      'image': ['converter', 'generator'],
      'text': ['formatter', 'converter', 'generator']
    };
    
    const relatedToTool1 = relatedCategories[tool1.category] || [];
    if (relatedToTool1.includes(tool2.category)) {
      score += 0.15;
    }
  }
  
  // 标签匹配得分权重更高
  const tags1 = tool1.meta.keywords || [];
  const tags2 = tool2.meta.keywords || [];
  
  const commonTags = tags1.filter(tag => tags2.includes(tag));
  if (commonTags.length > 0) {
    score += 0.4 * (commonTags.length / Math.max(tags1.length, 1));
  }
  
  // 用途相关性（从描述和标题中提取）
  const keywords1 = [...(tool1.meta.keywords || []), tool1.name, tool1.description];
  const keywords2 = [...(tool2.meta.keywords || []), tool2.name, tool2.description];
  
  let textMatchScore = 0;
  keywords1.forEach(k1 => {
    keywords2.forEach(k2 => {
      if (k1.toLowerCase().includes(k2.toLowerCase()) || 
          k2.toLowerCase().includes(k1.toLowerCase())) {
        textMatchScore += 0.05;
      }
    });
  });
  
  // 文本匹配最多加0.4分
  score += Math.min(textMatchScore, 0.4);
  
  // 确保分值在0-1之间
  return Math.min(Math.max(score, 0), 1);
} 
