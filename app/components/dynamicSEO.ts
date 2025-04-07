import { Metadata } from 'next';
import { Tool } from '../lib/tools-registry/types';

/**
 * 生成基本元数据
 * @returns 基本SEO元数据
 */
export function generateBaseMetadata(): Metadata {
  return {
    title: 'DevTools Box - 程序员在线工具箱',
    description: '为开发者提供的一站式在线工具集合，包括JSON格式化、正则测试、编码解码、加密解密、图片处理等常用开发工具',
    keywords: '开发者工具,JSON格式化,正则表达式,编码解码,加密解密,前端工具,程序员工具箱,开发工具集,在线工具',
    metadataBase: new URL('https://devtool.h7ml.cn'),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      locale: 'zh_CN',
      url: 'https://devtool.h7ml.cn',
      title: 'DevTools Box - 程序员必备在线工具箱',
      description: '为开发者提供的一站式在线工具集合，提升开发效率，简化工作流程',
      siteName: 'DevTools Box',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'DevTools Box - 程序员必备在线工具箱',
      description: '为开发者提供的一站式在线工具集合，提升开发效率，简化工作流程',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}

/**
 * 生成分类页面的元数据
 * @param category 分类名称
 * @param description 分类描述
 * @returns 分类页面元数据
 */
export function generateCategoryMetadata(category: string, description: string): Metadata {
  const baseMetadata = generateBaseMetadata();
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
  
  return {
    ...baseMetadata,
    title: `${categoryName}工具集合 - DevTools Box`,
    description: description || `各种${categoryName}开发工具集合，提高开发效率的利器`,
    keywords: `${category},${baseMetadata.keywords}`,
    alternates: {
      canonical: `/tools?category=${category}`,
    },
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${categoryName}工具集合 - DevTools Box`,
      description: description || `各种${categoryName}开发工具集合，提高开发效率的利器`,
      url: `https://devtool.h7ml.cn/tools?category=${category}`,
    },
    twitter: {
      ...baseMetadata.twitter,
      title: `${categoryName}工具集合 - DevTools Box`,
      description: description || `各种${categoryName}开发工具集合，提高开发效率的利器`,
    },
  };
}

/**
 * 生成工具详情页的元数据
 * @param tool 工具对象
 * @param category 分类
 * @returns 工具详情页元数据
 */
export function generateToolMetadata(tool: Tool, category: string): Metadata {
  const baseMetadata = generateBaseMetadata();
  const keywords = tool.meta.keywords?.join(',') || '';
  
  return {
    ...baseMetadata,
    title: `${tool.name} - DevTools Box`,
    description: tool.description || '开发者工具集 - 提升开发效率的在线工具',
    keywords: `${tool.name},${keywords},开发工具,在线工具,devtools`,
    alternates: {
      canonical: `/tools/${category}/${tool.id}`,
    },
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${tool.name} - 在线开发工具 | DevTools Box`,
      description: tool.description,
      url: `https://devtool.h7ml.cn/tools/${category}/${tool.id}`,
      type: 'website',
      images: [
        {
          url: `/images/tools/${tool.id}.jpg`,
          width: 1200,
          height: 630,
          alt: tool.name,
        },
      ],
    },
    twitter: {
      ...baseMetadata.twitter,
      title: `${tool.name} - 在线开发工具 | DevTools Box`,
      description: tool.description,
      images: [`/images/tools/${tool.id}.jpg`],
    },
  };
}

/**
 * 生成博客文章的元数据
 * @param title 文章标题
 * @param description 文章描述
 * @param slug 文章URL路径
 * @param publishDate 发布日期
 * @param tags 标签数组
 * @returns 文章页面元数据
 */
export function generateArticleMetadata(
  title: string, 
  description: string, 
  slug: string, 
  publishDate: string,
  tags: string[]
): Metadata {
  const baseMetadata = generateBaseMetadata();
  
  return {
    ...baseMetadata,
    title: `${title} - DevTools Box博客`,
    description: description,
    keywords: tags.join(','),
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${title} - DevTools Box博客`,
      description: description,
      url: `https://devtool.h7ml.cn/blog/${slug}`,
      type: 'article',
      publishedTime: publishDate,
      tags: tags,
    },
    twitter: {
      ...baseMetadata.twitter,
      title: `${title} - DevTools Box博客`,
      description: description,
    },
  };
}

/**
 * 生成结构化数据JSON字符串
 * @param data 结构化数据对象
 * @returns JSON字符串
 */
export function generateStructuredDataString(data: any): string {
  return JSON.stringify(data);
}

/**
 * 生成工具的结构化数据
 * @param tool 工具对象
 * @returns 结构化数据对象
 */
export function generateToolStructuredData(tool: Tool): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CNY',
      availability: 'https://schema.org/InStock',
    },
    keywords: tool.meta.keywords?.join(',') || '',
  };
}

/**
 * 生成网站的结构化数据
 * @returns 结构化数据对象
 */
export function generateWebsiteStructuredData(): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DevTools Box',
    url: 'https://devtool.h7ml.cn',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://devtool.h7ml.cn/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };
}

/**
 * 生成面包屑导航的结构化数据
 * @param items 面包屑项数组，每项包含name和item(URL)
 * @returns 结构化数据对象
 */
export function generateBreadcrumbStructuredData(items: {name: string, item: string}[]): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://devtool.h7ml.cn${item.item}`
    }))
  };
}

/**
 * 生成文章的结构化数据
 * @param title 文章标题
 * @param description 文章描述
 * @param slug 文章路径
 * @param publishDate 发布日期
 * @param modifiedDate 修改日期
 * @param imageUrl 图片URL
 * @returns 结构化数据对象
 */
export function generateArticleStructuredData(
  title: string,
  description: string,
  slug: string,
  publishDate: string,
  modifiedDate: string,
  imageUrl: string
): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: imageUrl,
    datePublished: publishDate,
    dateModified: modifiedDate,
    author: {
      '@type': 'Organization',
      name: 'DevTools Box',
      url: 'https://devtool.h7ml.cn'
    },
    publisher: {
      '@type': 'Organization',
      name: 'DevTools Box',
      logo: {
        '@type': 'ImageObject',
        url: 'https://devtool.h7ml.cn/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://devtool.h7ml.cn/blog/${slug}`
    }
  };
} 
