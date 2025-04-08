/**
 * 主题类型定义
 */

/**
 * 主题接口定义
 */
export interface Topic {
  /**
   * 主题唯一标识符
   */
  id: string;
  
  /**
   * 主题标题
   */
  title: string;
  
  /**
   * 用于URL的主题别名
   */
  slug: string;
  
  /**
   * 主题简短描述
   */
  description: string;
  
  /**
   * 主题长描述或介绍文字（支持Markdown）
   */
  longDescription?: string;
  
  /**
   * 主题内容（HTML格式）
   */
  content?: string;
  
  /**
   * 主题封面图片URL
   */
  image?: string;
  
  /**
   * 相关工具的ID数组
   */
  toolIds: string[];
  
  /**
   * 相关工具数量
   */
  toolCount?: number;
  
  /**
   * 主题相关的分类
   */
  categories: string[];
  
  /**
   * 主题关键词，用于搜索
   */
  keywords?: string[];
  
  /**
   * 主题创建日期
   */
  createdAt?: string;
  
  /**
   * 主题发布日期
   */
  publishDate?: string;
  
  /**
   * 主题更新日期
   */
  updatedAt?: string;
  
  /**
   * 相关主题的ID数组
   */
  relatedTopicIds?: string[];
  
  /**
   * 主题是否特别推荐
   */
  featured?: boolean;
  
  /**
   * 主题顺序权重（值越大显示越靠前）
   */
  order?: number;
  
  /**
   * 自定义元数据
   */
  metadata?: Record<string, any>;
}

/**
 * 主题过滤条件
 */
export interface TopicFilter {
  /**
   * 按分类过滤
   */
  category?: string;
  
  /**
   * 是否只包含推荐主题
   */
  featured?: boolean;
  
  /**
   * 按关键词搜索
   */
  search?: string;
  
  /**
   * 按工具ID过滤（返回包含该工具的主题）
   */
  toolId?: string;
  
  /**
   * 排序方式
   */
  sort?: 'newest' | 'popular' | 'order';
  
  /**
   * 限制返回数量
   */
  limit?: number;
}
