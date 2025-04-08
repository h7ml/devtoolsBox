import { Metadata } from 'next';
import { generateCategoryMetadata } from '../../components/dynamicSEO';
import { categoryNameMap } from '../../lib/tools-registry/categories';

// 为每个分类页面生成唯一的元数据
export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const category = params.category;
  const categoryName = categoryNameMap[category] || category;
  const description = `浏览我们精选的${categoryName}工具集合，帮助开发者提高开发效率和解决常见问题`;
  
  return generateCategoryMetadata(category, description);
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return children;
} 