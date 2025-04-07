import { getAllTools, getToolsByCategory } from './lib/tools-registry/register-tools';
import { categoryNameMap } from './lib/tools-registry/categories';

export default async function sitemap() {
  // 确保所有工具已注册
  try {
    const { registerAllTools } = await import('./lib/tools-registry/register-tools');
    await registerAllTools();
  } catch (error) {
    console.error('生成站点地图时注册工具失败:', error);
  }

  // 基础URL
  const baseUrl = 'https://devtool.h7ml.cn';

  // 静态页面
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // 获取所有工具
  const allTools = getAllTools();

  // 获取所有工具路由
  const toolUrls = allTools.map(tool => ({
    url: `${baseUrl}/tools/${tool.category}/${tool.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 获取所有分类路由
  const categoryUrls = Object.keys(categoryNameMap).map(category => ({
    url: `${baseUrl}/tools?category=${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // 合并所有URL
  return [...staticPages, ...categoryUrls, ...toolUrls];
} 
