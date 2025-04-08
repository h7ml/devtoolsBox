import { Metadata } from 'next';
import { generateToolMetadata } from '../../../components/dynamicSEO';

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

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return children;
}
