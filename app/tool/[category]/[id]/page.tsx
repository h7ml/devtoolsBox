import { Metadata } from 'next';
import NavBarWithModals from '../../../components/NavBarWithModals';
import { Tool } from '../../../lib/tools-registry/types';
import StructuredData from '../../../components/StructuredData';
import { generateToolMetadata, generateToolStructuredData, generateBreadcrumbStructuredData } from '../../../components/dynamicSEO';

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

    // 使用动态SEO工具生成元数据
    return generateToolMetadata(tool, category);
  } catch (error) {
    console.error('生成工具页面元数据时出错:', error);
    return {
      title: 'DevTools Box - 开发工具集',
      description: '为开发者提供的一站式在线工具集合',
    };
  }
}

// 将此组件设置为客户端组件
export default async function ToolPage({ params }: { params: { category: string; id: string } }) {
  // 在服务器端获取工具数据
  const { registerAllTools, getToolById } = await import('../../../lib/tools-registry/register-tools');
  await registerAllTools();
  const tool = getToolById(params.id);

  // 生成结构化数据
  const toolStructuredData = tool ? generateToolStructuredData(tool) : null;

  // 生成面包屑导航结构化数据
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: '首页', item: '/' },
    { name: '工具', item: '/tools' },
    { name: params.category, item: `/tools?category=${params.category}` },
    { name: tool ? tool.name : '工具详情', item: `/tools/${params.category}/${params.id}` }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBarWithModals />

      {/* 添加结构化数据 */}
      {tool && <StructuredData data={toolStructuredData} />}
      <StructuredData data={breadcrumbStructuredData} />

      {/* 工具内容 */}
      <main className="container mx-auto pt-24 px-4 pb-12">
        {/* 面包屑导航 */}
        <nav className="mb-6 text-sm">
          <ol className="flex flex-wrap items-center space-x-2">
            <li>
              <a href="/" className="text-gray-500 hover:text-orange-500 transition-colors">首页</a>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <a href="/tools" className="text-gray-500 hover:text-orange-500 transition-colors">工具</a>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <a href={`/tools?category=${params.category}`} className="text-gray-500 hover:text-orange-500 transition-colors">
                {params.category}
              </a>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-orange-500">{tool ? tool.name : params.id}</li>
          </ol>
        </nav>

        {tool ? (
          <>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{tool.name}</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{tool.description}</p>

            {/* 标签 */}
            {tool.meta.keywords && tool.meta.keywords.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {tool.meta.keywords.map(keyword => (
                  <span
                    key={keyword}
                    className="px-3 py-1 text-xs rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}

            {/* 工具UI组件将在这里渲染 */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              {/* 在这里根据工具类型和ID动态加载相应的组件 */}
              <div className="text-center text-gray-500 dark:text-gray-400">
                工具 "{tool.name}" 的UI组件将在这里渲染
              </div>
            </div>
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
