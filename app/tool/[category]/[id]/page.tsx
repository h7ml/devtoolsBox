import { Metadata } from 'next';
import NavBarWithModals from '../../../components/NavBarWithModals';
import { Tool } from '../../../lib/tools-registry/types';

// 为每个工具页面生成唯一的元数据
export async function generateMetadata({ params }: { params: { category: string; id: string } }): Promise<Metadata> {
  const toolId = params.id;
  const category = params.category;

  // 确保工具已注册
  try {
    const { registerAllTools, getToolById } = await import('../../../lib/tools-registry/register-tools');
    await registerAllTools();

    const tool = getToolById(toolId);

    if (!tool) {
      return {
        title: '工具未找到 - DevTools Box',
        description: '您请求的工具不存在或已被移除。',
      };
    }

    const keywords = tool.meta.keywords?.join(',') || '';

    return {
      title: `${tool.name} - DevTools Box`,
      description: tool.description || '开发者工具集 - 提升开发效率的在线工具',
      keywords: `${tool.name},${keywords},开发工具,在线工具,devtools`,
      alternates: {
        canonical: `https://devtool.h7ml.cn/tools/${category}/${toolId}`,
      },
      openGraph: {
        title: `${tool.name} - 在线开发工具 | DevTools Box`,
        description: tool.description,
        url: `https://devtool.h7ml.cn/tools/${category}/${toolId}`,
        type: 'website',
        images: [
          {
            url: '/images/og-tool-image.jpg',
            width: 1200,
            height: 630,
            alt: tool.name,
          },
        ],
      },
    };
  } catch (error) {
    console.error('生成工具页面元数据时出错:', error);
    return {
      title: 'DevTools Box - 开发工具集',
      description: '为开发者提供的一站式在线工具集合',
    };
  }
}

// 添加结构化数据组件
function StructuredData({ tool }: { tool: Tool }) {
  const structuredData = {
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// 将此组件设置为客户端组件
export default async function ToolPage({ params }: { params: { category: string; id: string } }) {
  // 在服务器端获取工具数据
  const { registerAllTools, getToolById } = await import('../../../lib/tools-registry/register-tools');
  await registerAllTools();
  const tool = getToolById(params.id);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBarWithModals />
      {/* 添加结构化数据 */}
      {tool && <StructuredData tool={tool} />}

      {/* 工具内容 */}
      <main className="container mx-auto pt-24 px-4 pb-12">
        {tool ? (
          <>
            <h1 className="text-3xl font-bold">{tool.name}</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{tool.description}</p>
            {/* 工具UI组件将在这里渲染 */}
          </>
        ) : (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">工具未找到</h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">您请求的工具不存在或已被移除</p>
          </div>
        )}
      </main>
    </div>
  );
} 
