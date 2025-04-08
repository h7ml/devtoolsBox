/**
 * 工具注册服务
 * 提供统一的工具注册、获取和管理机制
 */

import { Tool, ToolCategory } from '../../types';

/**
 * 工具注册服务选项
 */
export interface ToolRegistryOptions {
  /**
   * 是否启用工具使用统计
   */
  enableUsageStats?: boolean;
}

/**
 * 工具注册服务类
 */
export class ToolRegistryService {
  /**
   * 工具映射表
   */
  private toolsMap: Map<string, Tool> = new Map();
  
  /**
   * 分类工具映射表
   */
  private categoryToolsMap: Map<ToolCategory, Tool[]> = new Map();

  /**
   * 关键词索引映射
   */
  private keywordIndexMap: Map<string, Set<string>> = new Map();

  /**
   * 配置选项
   */
  private options: ToolRegistryOptions;

  /**
   * 使用统计
   */
  private usageStats: Map<string, number> = new Map();

  /**
   * 构造函数
   */
  constructor(options: ToolRegistryOptions = {}) {
    this.options = {
      enableUsageStats: true,
      ...options
    };
  }

  /**
   * 注册工具
   */
  registerTool(tool: Tool): void {
    // 确保工具有效
    if (!tool.id || !tool.title || !tool.category) {
      console.error('注册工具失败: 缺少必要属性', tool);
      return;
    }

    // 存储工具
    this.toolsMap.set(tool.id, tool);

    // 更新分类映射
    const categoryTools = this.categoryToolsMap.get(tool.category) || [];
    categoryTools.push(tool);
    this.categoryToolsMap.set(tool.category, categoryTools);

    // 更新关键词索引
    this.indexToolKeywords(tool);
  }

  /**
   * 批量注册工具
   */
  registerTools(tools: Tool[]): void {
    tools.forEach(tool => this.registerTool(tool));
  }

  /**
   * 获取工具
   */
  getTool(id: string): Tool | undefined {
    return this.toolsMap.get(id);
  }

  /**
   * 获取分类工具
   */
  getToolsByCategory(category: ToolCategory): Tool[] {
    return this.categoryToolsMap.get(category) || [];
  }

  /**
   * 获取所有工具
   */
  getAllTools(): Tool[] {
    return Array.from(this.toolsMap.values());
  }

  /**
   * 获取所有分类
   */
  getAllCategories(): ToolCategory[] {
    return Array.from(this.categoryToolsMap.keys());
  }

  /**
   * 搜索工具
   */
  searchTools(query: string): Tool[] {
    if (!query.trim()) {
      return this.getAllTools();
    }

    const normalizedQuery = query.toLowerCase().trim();
    const words = normalizedQuery.split(/\s+/);
    const toolIds = new Set<string>();

    // 通过每个单词寻找匹配的工具
    words.forEach(word => {
      // 使用Array.from将Map转换为数组再进行迭代
      Array.from(this.keywordIndexMap.entries()).forEach(([keyword, ids]) => {
        if (keyword.includes(word)) {
          ids.forEach(id => toolIds.add(id));
        }
      });
    });

    // 通过标题和描述进行额外匹配
    this.toolsMap.forEach((tool, id) => {
      const title = tool.title.toLowerCase();
      const description = tool.description.toLowerCase();

      if (title.includes(normalizedQuery) || description.includes(normalizedQuery)) {
        toolIds.add(id);
      }
    });

    // 转换ID为工具对象
    return Array.from(toolIds)
      .map(id => this.toolsMap.get(id))
      .filter(Boolean) as Tool[];
  }

  /**
   * 记录工具使用
   */
  recordToolUsage(id: string): void {
    if (!this.options.enableUsageStats) return;

    const tool = this.toolsMap.get(id);
    if (!tool) return;

    // 更新内存中的使用次数
    const currentCount = this.usageStats.get(id) || 0;
    this.usageStats.set(id, currentCount + 1);

    // 更新工具元数据
    if (tool.metadata) {
      tool.metadata.usageCount = (tool.metadata.usageCount || 0) + 1;
      tool.metadata.updatedAt = new Date().toISOString();
    }
  }

  /**
   * 获取热门工具
   */
  getPopularTools(limit: number = 10): Tool[] {
    const toolsWithUsage = Array.from(this.toolsMap.values())
      .filter(tool => tool.metadata?.usageCount && tool.metadata.usageCount > 0)
      .sort((a, b) => {
        const aCount = a.metadata?.usageCount || 0;
        const bCount = b.metadata?.usageCount || 0;
        return bCount - aCount;
      });

    return toolsWithUsage.slice(0, limit);
  }

  /**
   * 获取最近更新的工具
   */
  getRecentlyUpdatedTools(limit: number = 10): Tool[] {
    const toolsWithDate = Array.from(this.toolsMap.values())
      .filter(tool => tool.metadata?.updatedAt)
      .sort((a, b) => {
        const aDate = a.metadata?.updatedAt ? new Date(a.metadata.updatedAt).getTime() : 0;
        const bDate = b.metadata?.updatedAt ? new Date(b.metadata.updatedAt).getTime() : 0;
        return bDate - aDate;
      });

    return toolsWithDate.slice(0, limit);
  }

  /**
   * 清除注册表
   */
  clear(): void {
    this.toolsMap.clear();
    this.categoryToolsMap.clear();
    this.keywordIndexMap.clear();
    this.usageStats.clear();
  }

  /**
   * 索引工具关键词
   */
  private indexToolKeywords(tool: Tool): void {
    // 索引ID
    this.addToKeywordIndex(tool.id.toLowerCase(), tool.id);

    // 索引标题
    const titleWords = tool.title.toLowerCase().split(/\s+/);
    titleWords.forEach(word => this.addToKeywordIndex(word, tool.id));

    // 索引标签
    if (tool.tags && tool.tags.length) {
      tool.tags.forEach(tag => this.addToKeywordIndex(tag.toLowerCase(), tool.id));
    }

    // 索引关键词
    if (tool.keywords && tool.keywords.length) {
      tool.keywords.forEach(keyword => this.addToKeywordIndex(keyword.toLowerCase(), tool.id));
    }
  }

  /**
   * 添加到关键词索引
   */
  private addToKeywordIndex(keyword: string, toolId: string): void {
    if (!keyword) return;

    const ids = this.keywordIndexMap.get(keyword) || new Set();
    ids.add(toolId);
    this.keywordIndexMap.set(keyword, ids);
  }
}

/**
 * 创建默认工具注册服务单例
 */
const defaultToolRegistry = new ToolRegistryService();

/**
 * 导出默认工具注册服务实例
 */
export default defaultToolRegistry; 
