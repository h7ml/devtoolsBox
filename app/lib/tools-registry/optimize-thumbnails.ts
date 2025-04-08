/**
 * 工具缩略图优化助手
 * 
 * 提供获取和设置工具缩略图的函数
 * 支持工具缩略图、类别默认缩略图和社交媒体分享图片
 */

// 默认缩略图基础路径
const THUMBNAIL_BASE_PATH = '/images/thumbnails';
const CATEGORY_THUMBNAIL_PATH = '/images/categories';
const SOCIAL_IMAGE_PATH = '/images/social';

/**
 * 获取工具缩略图URL
 * 
 * @param toolId 工具ID
 * @param category 工具类别
 * @returns 工具缩略图路径
 */
export function getToolThumbnailUrl(toolId: string, category: string): string {
  // 尝试获取工具专用缩略图
  const toolSpecificPath = `${THUMBNAIL_BASE_PATH}/${category}/${toolId}.webp`;
  
  // 如果没有工具专用缩略图，使用类别默认缩略图
  const categoryDefaultPath = `${CATEGORY_THUMBNAIL_PATH}/${category}.webp`;
  
  // 应该在这里进行文件存在检查，但在客户端无法直接检查文件系统
  // 这里实现简化版本，实际使用时应考虑以下方案：
  // 1. 构建时生成缩略图映射表
  // 2. 使用API端点检查文件是否存在
  // 3. 在服务端组件中使用fs模块检查

  // 这里假设返回工具专用缩略图，实际使用时根据具体情况调整
  return toolSpecificPath;
}

/**
 * 获取类别缩略图URL
 * 
 * @param category 工具类别
 * @returns 类别缩略图路径
 */
export function getCategoryThumbnailUrl(category: string): string {
  return `${CATEGORY_THUMBNAIL_PATH}/${category}.webp`;
}

/**
 * 获取工具社交媒体分享图片URL
 * 
 * @param toolId 工具ID
 * @param category 工具类别
 * @returns 社交媒体分享图片路径
 */
export function getToolSocialImageUrl(toolId: string, category: string): string {
  // 尝试获取工具专用社交图片
  const toolSpecificPath = `${SOCIAL_IMAGE_PATH}/${category}/${toolId}.png`;
  
  // 如果没有工具专用社交图片，使用类别默认社交图片
  const categoryDefaultPath = `${SOCIAL_IMAGE_PATH}/${category}.png`;
  
  // 如果没有类别专用社交图片，使用网站默认社交图片
  const defaultPath = `${SOCIAL_IMAGE_PATH}/default.png`;
  
  // 这里假设返回工具专用社交图片，实际使用时根据具体情况调整
  return toolSpecificPath;
}

/**
 * 缩略图优化服务
 * 用于处理工具缩略图的生成和优化
 */

/**
 * 缩略图格式类型
 */
export type ThumbnailFormat = 'webp' | 'jpeg' | 'png' | 'avif';

/**
 * 缩略图尺寸
 */
export interface ThumbnailSize {
  width: number;
  height: number;
}

/**
 * 缩略图优化选项
 */
export interface ThumbnailOptions {
  /**
   * 输出格式
   */
  format?: ThumbnailFormat;
  
  /**
   * 输出质量 (1-100)
   */
  quality?: number;
  
  /**
   * 输出尺寸
   */
  size?: ThumbnailSize;
  
  /**
   * 是否裁剪以适应尺寸
   */
  crop?: boolean;
  
  /**
   * 缓存时间（秒）
   */
  cacheTime?: number;
}

/**
 * 默认缩略图配置
 */
export const DEFAULT_THUMBNAIL_OPTIONS: ThumbnailOptions = {
  format: 'webp',
  quality: 85,
  size: {
    width: 640,
    height: 360
  },
  crop: true,
  cacheTime: 60 * 60 * 24 * 7 // 7天
};

/**
 * 预定义的缩略图尺寸
 */
export const THUMBNAIL_SIZES = {
  small: { width: 320, height: 180 },
  medium: { width: 640, height: 360 },
  large: { width: 1280, height: 720 },
  thumbnail: { width: 80, height: 80 },
};

/**
 * 生成缩略图URL
 * 
 * @param category 工具类别
 * @param id 工具ID
 * @param options 缩略图选项
 * @returns 缩略图URL
 */
export function getThumbnailUrl(
  category: string,
  id: string,
  options: Partial<ThumbnailOptions> = {}
): string {
  const baseUrl = `/api/thumbnails`;
  const mergedOptions = { ...DEFAULT_THUMBNAIL_OPTIONS, ...options };
  
  const params = new URLSearchParams();
  params.append('category', category);
  params.append('id', id);
  
  if (mergedOptions.format) {
    params.append('format', mergedOptions.format);
  }
  
  if (mergedOptions.quality) {
    params.append('quality', mergedOptions.quality.toString());
  }
  
  if (mergedOptions.size) {
    params.append('size', `${mergedOptions.size.width}x${mergedOptions.size.height}`);
  }
  
  if (mergedOptions.crop !== undefined) {
    params.append('crop', mergedOptions.crop ? '1' : '0');
  }
  
  return `${baseUrl}?${params.toString()}`;
}

/**
 * 预热缩略图缓存
 * 生成并缓存指定工具的所有预定义尺寸的缩略图
 * 
 * @param category 工具类别
 * @param id 工具ID
 */
export async function prewarmThumbnailCache(category: string, id: string): Promise<void> {
  try {
    const formats: ThumbnailFormat[] = ['webp', 'jpeg'];
    const sizes = Object.values(THUMBNAIL_SIZES);
    
    // 创建所有预定义尺寸和格式的缩略图请求
    const requests = [];
    
    for (const format of formats) {
      for (const size of sizes) {
        const url = getThumbnailUrl(category, id, {
          format,
          size
        });
        
        // 发起请求但不等待结果
        requests.push(
          fetch(url)
            .then(() => console.log(`Prewarmed cache for ${url}`))
            .catch(err => console.warn(`Failed to prewarm cache for ${url}:`, err))
        );
      }
    }
    
    // 等待所有请求完成
    await Promise.all(requests);
  } catch (error) {
    console.error(`Error prewarming thumbnail cache for ${category}/${id}:`, error);
  }
}

/**
 * 获取工具的默认缩略图路径
 * 
 * @param category 工具类别
 * @returns 默认缩略图路径
 */
export function getDefaultThumbnailPath(category: string): string {
  // 返回类别的默认缩略图，如果不存在则返回通用缩略图
  return `/images/thumbnails/default-${category}.jpg`;
}

/**
 * 获取工具的缩略图路径
 * 
 * @param category 工具类别
 * @param id 工具ID
 * @returns 缩略图路径
 */
export function getThumbnailPath(category: string, id: string): string {
  return `/images/thumbnails/${category}/${id}.jpg`;
}

/**
 * 为工具元数据补充缩略图URL
 * 
 * @param toolMetadata 工具元数据对象或数组
 * @returns 带缩略图URL的工具元数据
 */
export function updateToolMetadataWithThumbnails(toolMetadata: any | any[]): any | any[] {
  if (Array.isArray(toolMetadata)) {
    // 处理工具元数据数组
    return toolMetadata.map(tool => addThumbnailsToTool(tool));
  } else {
    // 处理单个工具元数据
    return addThumbnailsToTool(toolMetadata);
  }
}

/**
 * 为单个工具添加缩略图URL
 * 
 * @param tool 工具对象
 * @returns 带缩略图URL的工具对象
 */
function addThumbnailsToTool(tool: any): any {
  if (!tool || typeof tool !== 'object') return tool;
  
  const updatedTool = { ...tool };
  
  // 确保meta对象存在
  if (!updatedTool.meta) updatedTool.meta = {};
  
  // 添加缩略图URL
  updatedTool.meta.thumbnailUrl = getToolThumbnailUrl(updatedTool.id, updatedTool.category);
  
  // 添加社交图片URL
  updatedTool.meta.socialImageUrl = getToolSocialImageUrl(updatedTool.id, updatedTool.category);
  
  // 添加优化后的缩略图URL
  updatedTool.meta.thumbnails = {
    small: getThumbnailUrl(updatedTool.category, updatedTool.id, { size: THUMBNAIL_SIZES.small }),
    medium: getThumbnailUrl(updatedTool.category, updatedTool.id, { size: THUMBNAIL_SIZES.medium }),
    large: getThumbnailUrl(updatedTool.category, updatedTool.id, { size: THUMBNAIL_SIZES.large })
  };
  
  return updatedTool;
}

/**
 * 创建工具缩略图文件路径（用于生成缩略图）
 * 
 * @param toolId 工具ID
 * @param category 工具类别 
 * @returns 缩略图保存路径
 */
export function createToolThumbnailPath(toolId: string, category: string): string {
  return `public${THUMBNAIL_BASE_PATH}/${category}/${toolId}.webp`;
}

/**
 * 创建类别缩略图文件路径（用于生成缩略图）
 * 
 * @param category 工具类别
 * @returns 类别缩略图保存路径
 */
export function createCategoryThumbnailPath(category: string): string {
  return `public${CATEGORY_THUMBNAIL_PATH}/${category}.webp`;
} 
