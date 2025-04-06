import { Tool, ToolCategory, ToolRegistryInterface } from './types';

class ToolRegistry implements ToolRegistryInterface {
  private tools: Map<string, Tool> = new Map();
  
  register(tool: Tool): void {
    if (this.tools.has(tool.id)) {
      console.warn(`工具 ${tool.id} 已经注册，将被覆盖。`);
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
    if (!query.trim()) {
      return this.getAllTools();
    }
    
    const lowerQuery = query.toLowerCase();
    return this.getAllTools().filter(tool => {
      return (
        tool.name.toLowerCase().includes(lowerQuery) || 
        tool.description.toLowerCase().includes(lowerQuery) ||
        tool.meta.keywords.some(keyword => 
          keyword.toLowerCase().includes(lowerQuery)
        )
      );
    });
  }
}

// 单例模式
const toolRegistry = new ToolRegistry();

export default toolRegistry; 
