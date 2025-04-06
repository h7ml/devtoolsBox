import { IconType } from 'react-icons';

export type ToolCategory = 
  | 'text'       // 文本处理
  | 'dev'        // 开发工具
  | 'runtime'    // 运行时工具
  | 'web'        // 网络/爬虫工具
  | 'json'       // JSON工具
  | 'misc'       // 其他工具
  | 'formatter'  // 数据格式化
  | 'conversion' // 数据转换
  | 'encoding'   // 编码解码
  | 'datetime'   // 日期与时间
  | 'time'       // 日期与时间
  | 'crypto'     // 加密解密
  | 'image'      // 图像工具
  | 'calculator' // 计算工具
  | 'generator'  // 生成工具
  | 'network'    // 网络工具 
  | 'frontend'   // 前端助手
  | 'password'   // 密码工具
  | 'testing'    // 测试工具
  | 'color'      // 颜色工具
  | 'geo'        // 地理工具
  | 'unit'       // 单位转换
  | 'format'     // 格式化工具
  | 'math';      // 数学工具

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
