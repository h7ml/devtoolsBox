import { Topic, TopicFilter } from './types';

/**
 * 示例主题数据
 */
const sampleTopics: Topic[] = [
  {
    id: 'developer-tools',
    title: '开发者工具集合',
    slug: 'developer-tools',
    description: '为开发者提供的实用工具集合，包括编码、调试和优化工具',
    image: '/images/topics/developer-tools.jpg',
    content: '<p>这是面向开发者的实用工具集合，涵盖了编码、调试和优化等各个方面。</p><h2>为什么需要开发工具？</h2><p>开发者工具可以极大地提升开发效率，减少重复工作，降低错误率。通过使用专业工具，开发者可以更专注于创造性工作，而不是陷入繁琐的细节中。</p>',
    toolIds: ['json-formatter', 'diff-checker', 'code-beautifier', 'regex-tester'],
    categories: ['开发', '编程', '调试'],
    keywords: ['开发工具', '代码', '编程辅助', '开发者'],
    featured: true,
    order: 100,
    toolCount: 4,
    createdAt: '2023-11-01',
    publishDate: '2023-11-15',
    updatedAt: '2024-01-20'
  },
  {
    id: 'data-processing',
    title: '数据处理工具',
    slug: 'data-processing',
    description: '专注于数据转换、分析和可视化的工具集合',
    image: '/images/topics/data-processing.jpg',
    toolIds: ['csv-converter', 'json-formatter', 'xml-viewer', 'data-visualizer'],
    categories: ['数据', '转换', '分析'],
    keywords: ['数据处理', '数据转换', '数据分析', 'CSV', 'JSON'],
    featured: true,
    order: 90,
    toolCount: 4
  },
  {
    id: 'seo-optimization',
    title: 'SEO优化工具',
    slug: 'seo-optimization',
    description: '帮助优化网站搜索引擎排名的专业工具集',
    image: '/images/topics/seo-tools.jpg',
    toolIds: ['keyword-density', 'meta-tag-analyzer', 'sitemap-generator'],
    categories: ['SEO', '网站优化', '营销'],
    keywords: ['搜索引擎优化', 'SEO工具', '网站排名', '关键词分析'],
    featured: true,
    order: 80,
    toolCount: 3
  },
  {
    id: 'encryption-security',
    title: '加密与安全',
    slug: 'encryption-security',
    description: '保护数据安全的加密、哈希和安全测试工具',
    image: '/images/topics/security-tools.jpg',
    toolIds: ['password-generator', 'hash-generator', 'encryption-tool'],
    categories: ['安全', '加密', '隐私'],
    keywords: ['数据加密', '密码安全', '哈希工具', '安全测试'],
    order: 70,
    toolCount: 3
  },
  {
    id: 'image-processing',
    title: '图像处理工具',
    slug: 'image-processing',
    description: '图像编辑、优化和转换的实用工具集',
    image: '/images/topics/image-tools.jpg',
    toolIds: ['image-compressor', 'image-converter', 'color-picker'],
    categories: ['图像', '编辑', '优化'],
    keywords: ['图像处理', '图片编辑', '图像优化', '图像转换'],
    order: 60,
    toolCount: 3
  }
];

/**
 * 获取所有主题
 * @returns 所有主题的数组
 */
export async function getAllTopics(): Promise<Topic[]> {
  // 在实际应用中，这里可能会从API或数据库获取数据
  return Promise.resolve(sampleTopics);
}

/**
 * 根据slug获取单个主题
 * @param slug 主题的slug标识符
 * @returns 找到的主题或undefined
 */
export async function getTopicBySlug(slug: string): Promise<Topic | undefined> {
  // 在实际应用中，这里可能会从API或数据库获取数据
  const topic = sampleTopics.find(t => t.slug === slug);
  return Promise.resolve(topic);
}

/**
 * 根据过滤条件获取主题
 * @param filter 过滤条件
 * @returns 符合条件的主题数组
 */
export async function getFilteredTopics(filter: TopicFilter): Promise<Topic[]> {
  // 复制数组，避免修改原始数据
  let filteredTopics = [...sampleTopics];
  
  // 应用过滤条件
  if (filter.category) {
    filteredTopics = filteredTopics.filter(topic => 
      topic.categories.includes(filter.category!)
    );
  }
  
  if (filter.featured) {
    filteredTopics = filteredTopics.filter(topic => topic.featured);
  }
  
  if (filter.search) {
    const searchLower = filter.search.toLowerCase();
    filteredTopics = filteredTopics.filter(topic => 
      topic.title.toLowerCase().includes(searchLower) ||
      topic.description.toLowerCase().includes(searchLower) ||
      (topic.keywords && topic.keywords.some(k => k.toLowerCase().includes(searchLower)))
    );
  }
  
  if (filter.toolId) {
    filteredTopics = filteredTopics.filter(topic => 
      topic.toolIds.includes(filter.toolId!)
    );
  }
  
  // 应用排序
  if (filter.sort) {
    switch (filter.sort) {
      case 'newest':
        filteredTopics.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        break;
      case 'popular':
        filteredTopics.sort((a, b) => (b.toolCount || 0) - (a.toolCount || 0));
        break;
      case 'order':
        filteredTopics.sort((a, b) => (b.order || 0) - (a.order || 0));
        break;
    }
  }
  
  // 应用限制
  if (filter.limit && filter.limit > 0) {
    filteredTopics = filteredTopics.slice(0, filter.limit);
  }
  
  return Promise.resolve(filteredTopics);
}

/**
 * 获取推荐主题
 * @param limit 限制返回数量
 * @returns 推荐主题数组
 */
export async function getFeaturedTopics(limit = 3): Promise<Topic[]> {
  return getFilteredTopics({ featured: true, limit, sort: 'order' });
}

/**
 * 获取相关主题
 * @param currentTopicId 当前主题ID
 * @param limit 限制返回数量
 * @returns 相关主题数组
 */
export async function getRelatedTopics(currentTopicId: string, limit = 3): Promise<Topic[]> {
  const currentTopic = sampleTopics.find(t => t.id === currentTopicId);
  if (!currentTopic) return Promise.resolve([]);
  
  // 查找具有相同分类的其他主题
  const relatedTopics = sampleTopics.filter(topic => 
    topic.id !== currentTopicId && 
    topic.categories.some(cat => currentTopic.categories.includes(cat))
  );
  
  // 排序并限制结果
  return Promise.resolve(
    relatedTopics
      .sort((a, b) => {
        // 计算共同分类数量
        const commonCatsA = a.categories.filter(cat => currentTopic.categories.includes(cat)).length;
        const commonCatsB = b.categories.filter(cat => currentTopic.categories.includes(cat)).length;
        return commonCatsB - commonCatsA;
      })
      .slice(0, limit)
  );
} 
