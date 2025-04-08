/**
 * 通用类型定义
 */

/**
 * 工具类别
 */
export type ToolCategory = 
  | 'json' 
  | 'text' 
  | 'image' 
  | 'crypto' 
  | 'converter' 
  | 'formatter' 
  | 'validator' 
  | 'generator' 
  | 'security'
  | 'utility';

/**
 * 工具元数据
 */
export interface ToolMetadata {
  /**
   * 创建时间
   */
  createdAt?: string;
  
  /**
   * 最后更新时间
   */
  updatedAt?: string;
  
  /**
   * 浏览量
   */
  views?: number;
  
  /**
   * 使用次数
   */
  usageCount?: number;
  
  /**
   * 评分 (0-5)
   */
  rating?: number;
  
  /**
   * 评分人数
   */
  ratingCount?: number;
  
  /**
   * 作者
   */
  author?: string;
  
  /**
   * 许可证
   */
  license?: string;
  
  /**
   * 版本
   */
  version?: string;
  
  /**
   * 文档URL
   */
  docsUrl?: string;
  
  /**
   * 源代码URL
   */
  sourceUrl?: string;
  
  /**
   * 缩略图URL
   */
  thumbnailUrl?: string;
  
  /**
   * 不同尺寸的缩略图
   */
  thumbnails?: {
    small: string;
    medium: string;
    large: string;
  };
}

/**
 * 工具定义
 */
export interface Tool {
  /**
   * 工具ID
   */
  id: string;
  
  /**
   * 工具类别
   */
  category: ToolCategory;
  
  /**
   * 工具标题
   */
  title: string;
  
  /**
   * 工具描述
   */
  description: string;
  
  /**
   * 工具标签
   */
  tags: string[];
  
  /**
   * 搜索关键词
   */
  keywords?: string[];
  
  /**
   * 工具元数据
   */
  metadata?: ToolMetadata;
  
  /**
   * 示例输入
   */
  examples?: {
    input: string;
    output: string;
    description?: string;
  }[];
  
  /**
   * 相关工具ID
   */
  relatedTools?: string[];
  
  /**
   * 工具组件路径
   */
  component?: string;
  
  /**
   * 工具教程
   */
  tutorial?: {
    steps: {
      title: string;
      content: string;
    }[];
    faqs: {
      question: string;
      answer: string;
    }[];
  };
  
  /**
   * 工具限制
   */
  limitations?: string[];
  
  /**
   * 是否需要认证
   */
  requiresAuth?: boolean;
  
  /**
   * 是否是高级版工具
   */
  isPremium?: boolean;
} 
