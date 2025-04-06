import { Tool, ToolCategory, ToolRegistryInterface } from './types';

class ToolRegistry implements ToolRegistryInterface {
  private tools: Map<string, Tool> = new Map();
  
  register(tool: Tool): void {
    if (this.tools.has(tool.id)) {
      console.warn(`Tool with id "${tool.id}" is already registered. It will be overridden.`);
    }
    this.tools.set(tool.id, tool);
  }
  
  getTool(id: string): Tool | undefined {
    return this.tools.get(id);
  }
  
  getAllTools(): Tool[] {
    return Array.from(this.tools.values());
  }
  
  getToolsByCategory(category: ToolCategory): Tool[] {
    return this.getAllTools().filter(tool => tool.category === category);
  }
  
  searchTools(query: string): Tool[] {
    if (!query || query.trim() === '') {
      return this.getAllTools();
    }
    
    const normalizedQuery = query.toLowerCase().trim();
    
    return this.getAllTools().filter(tool => {
      // 搜索名称、描述和关键词
      const nameMatch = tool.name.toLowerCase().includes(normalizedQuery);
      const descriptionMatch = tool.description.toLowerCase().includes(normalizedQuery);
      const keywordMatch = tool.meta.keywords.some(keyword => 
        keyword.toLowerCase().includes(normalizedQuery)
      );
      
      return nameMatch || descriptionMatch || keywordMatch;
    });
  }
}

// 创建单例实例
export const toolRegistry = new ToolRegistry();

// 辅助函数，用于加载所有工具
export async function loadAllTools() {
  // 这里将来会动态导入所有工具模块
  // 例如：
  // const jsonFormatter = await import('../../tools/json/json-formatter');
  // toolRegistry.register(jsonFormatter.default);
  
  console.log('加载所有工具...');
} 
