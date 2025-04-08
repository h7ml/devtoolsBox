import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import NavBarWithModals from '../../components/NavBarWithModals';
import StructuredData from '../../components/StructuredData';
import { getTopicBySlug } from '../../lib/topics/topics-registry';
import { registerAllTools, getToolById } from '../../lib/tools-registry/register-tools';
import ToolCard from '../../components/ToolCard';
import { FiArrowLeft, FiBook, FiTag, FiCalendar, FiUser } from 'react-icons/fi';

// 生成元数据
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const topic = await getTopicBySlug(params.slug);
  
  if (!topic) {
    return {
      title: '专题未找到 - DevTools Box',
      description: '您访问的专题内容不存在',
    };
  }
  
  return {
    title: `${topic.title} - DevTools Box专题`,
    description: topic.description,
    keywords: topic.keywords.join(','),
    openGraph: {
      title: `${topic.title} - DevTools Box专题`,
      description: topic.description,
      type: 'article',
      url: `https://devtool.h7ml.cn/topics/${topic.slug}`,
      images: [
        {
          url: topic.image || 'https://devtool.h7ml.cn/images/default-topic.jpg',
          width: 1200,
          height: 630,
          alt: topic.title,
        }
      ],
    }
  };
}

export default async function TopicPage({ params }: { params: { slug: string } }) {
  const topic = await getTopicBySlug(params.slug);
  
  if (!topic) {
    notFound();
  }
  
  // 注册所有工具
  await registerAllTools();
  
  // 获取相关工具
  const relatedTools = topic.toolIds
    .map(id => getToolById(id))
    .filter(tool => tool !== undefined);
  
  // 结构化数据
  const topicStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: topic.title,
    description: topic.description,
    author: {
      '@type': 'Organization',
      name: topic.metadata?.author || 'DevTools Box',
    },
    publisher: {
      '@type': 'Organization',
      name: 'DevTools Box',
      logo: {
        '@type': 'ImageObject',
        url: 'https://devtool.h7ml.cn/logo.png'
      }
    },
    datePublished: topic.createdAt,
    dateModified: topic.updatedAt || topic.createdAt,
    image: topic.image || 'https://devtool.h7ml.cn/images/default-topic.jpg',
    keywords: topic.keywords.join(','),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://devtool.h7ml.cn/topics/${topic.slug}`
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBarWithModals />
      <StructuredData data={topicStructuredData} />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link 
              href="/topics" 
              className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
            >
              <FiArrowLeft className="mr-2" /> 返回专题列表
            </Link>
            
            <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
              {topic.title}
            </h1>
            
            <div className="mt-3 flex flex-wrap gap-2">
              {topic.keywords.map(keyword => (
                <span 
                  key={keyword} 
                  className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm rounded-full flex items-center"
                >
                  <FiTag className="mr-1" size={14} /> {keyword}
                </span>
              ))}
            </div>
            
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <FiCalendar className="mr-1" /> 
                发布于 {new Date(topic.createdAt || '').toLocaleDateString('zh-CN')}
              </span>
              
              {topic.updatedAt && (
                <span className="flex items-center">
                  <FiCalendar className="mr-1" /> 
                  更新于 {new Date(topic.updatedAt).toLocaleDateString('zh-CN')}
                </span>
              )}
              
              {topic.metadata?.author && (
                <span className="flex items-center">
                  <FiUser className="mr-1" /> 
                  {topic.metadata.author}
                </span>
              )}
            </div>
            
            <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg border-l-4 border-orange-500 pl-4 py-2 bg-orange-50 dark:bg-orange-900/10 rounded-r">
              {topic.description}
            </p>
          </div>
          
          {/* 专题内容 */}
          <div className="prose dark:prose-invert prose-orange max-w-none">
            <div dangerouslySetInnerHTML={{ __html: topic.content || topic.longDescription || topic.description }} />
          </div>
          
          {/* 相关工具 */}
          {relatedTools.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center border-b pb-2 border-gray-200 dark:border-gray-700">
                <FiBook className="mr-2 text-orange-500" /> 相关工具
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedTools.map(tool => tool && (
                  <ToolCard 
                    key={tool.id} 
                    tool={tool}
                    isFavorite={false}
                    onToggleFavorite={() => {}}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
