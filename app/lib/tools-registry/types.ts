import { IconType } from 'react-icons';

export type ToolCategory = 
  | 'text'   // 文本工具
  | 'dev'    // 开发辅助
  | 'runtime' // 运行时工具
  | 'web'    // 网络/爬虫工具
  | 'json'   // JSON工具
  | 'misc';  // 其他工具

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: IconType;
  component: React.ComponentType<any>;
  meta: {
    keywords: string[];
    examples?: string[];
    author?: string;
    version?: string;
  };
}

export interface ToolRegistryInterface {
  register(tool: Tool): void;
  getTool(id: string): Tool | undefined;
  getAllTools(): Tool[];
  getToolsByCategory(category: ToolCategory): Tool[];
  searchTools(query: string): Tool[];
}

export interface ToolCardProps {
  tool: Tool;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
} 
