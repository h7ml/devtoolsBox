/**
 * 缩略图API路由
 * 
 * 处理工具缩略图的获取和优化
 * 支持按尺寸、格式和质量调整图片
 */

import { NextRequest, NextResponse } from 'next/server';
import { ThumbnailFormat } from '@/app/lib/tools-registry/optimize-thumbnails';

/**
 * 默认图片处理配置
 */
const DEFAULT_CONFIG = {
  quality: 85,
  format: 'webp' as ThumbnailFormat,
  cacheMaxAge: 60 * 60 * 24 * 7, // 7天缓存
  sizes: {
    small: { width: 320, height: 180 },
    medium: { width: 640, height: 360 },
    large: { width: 1280, height: 720 },
    thumbnail: { width: 80, height: 80 },
  }
};

/**
 * 处理缩略图请求
 * 
 * @param request 请求对象
 * @returns 响应对象
 */
export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const id = searchParams.get('id');
    const sizeParam = searchParams.get('size') || 'medium';
    const format = (searchParams.get('format') || DEFAULT_CONFIG.format) as ThumbnailFormat;
    const quality = parseInt(searchParams.get('quality') || String(DEFAULT_CONFIG.quality), 10);
    
    // 验证必要参数
    if (!category || !id) {
      return NextResponse.json(
        { error: 'Missing required parameters: category and id' },
        { status: 400 }
      );
    }
    
    // 解析尺寸参数
    let width, height;
    if (sizeParam.includes('x')) {
      // 格式如 "640x360"
      const [w, h] = sizeParam.split('x').map(s => parseInt(s, 10));
      width = w;
      height = h;
    } else {
      // 预定义尺寸如 "small", "medium", "large", "thumbnail"
      const sizeKey = sizeParam in DEFAULT_CONFIG.sizes
        ? sizeParam
        : 'medium';
      width = DEFAULT_CONFIG.sizes[sizeKey as keyof typeof DEFAULT_CONFIG.sizes].width;
      height = DEFAULT_CONFIG.sizes[sizeKey as keyof typeof DEFAULT_CONFIG.sizes].height;
    }
    
    // 限制尺寸范围
    width = Math.min(Math.max(width, 16), 1920);
    height = Math.min(Math.max(height, 16), 1080);
    
    // 限制质量范围
    const safeQuality = Math.min(Math.max(quality, 10), 100);
    
    // 构造图片路径
    // 注意：在实际应用中，这里可能会调用图片处理服务或CDN
    const imageBasePath = `/images/thumbnails/${category}`;
    
    // 检查是否有特定工具的缩略图
    const specificImagePath = `${imageBasePath}/${id}.jpg`;
    
    // 模拟图片处理
    // 在实际项目中，这里应该使用sharp或其他图像处理库处理图片
    
    // 设置缓存头部
    const headers = new Headers();
    headers.set('Content-Type', `image/${format}`);
    headers.set('Cache-Control', `public, max-age=${DEFAULT_CONFIG.cacheMaxAge}`);
    
    // 模拟图片处理的异步操作
    // 在实际应用中，我们会返回处理后的图片
    try {
      // 这里只是一个示例，实际项目中需要替换为真实的图片处理逻辑
      // 例如，可以使用sharp库按指定尺寸和格式处理图片，然后返回
      
      // 为了示例目的，我们简单地返回一个重定向到静态资源
      const fallbackImage = `/images/thumbnails/default-${category}.jpg`;
      
      // 使用ResponseInit来设置状态码和头部
      return NextResponse.redirect(new URL(fallbackImage, request.url), {
        headers,
        status: 302
      });
    } catch (processError) {
      console.error('Error processing image:', processError);
      
      // 如果图片处理失败，返回默认图片
      return NextResponse.redirect(new URL('/images/thumbnail-placeholder.jpg', request.url), {
        headers,
        status: 302
      });
    }
  } catch (error) {
    console.error('Error handling thumbnail request:', error);
    return NextResponse.json(
      { error: 'Failed to process thumbnail request' },
      { status: 500 }
    );
  }
}

/**
 * 配置缓存控制
 */
export const dynamic = 'force-dynamic'; // 默认为动态路由，但可以配合revalidate使用
export const revalidate = 3600; // 1小时后重新验证缓存 
