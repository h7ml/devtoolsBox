import { Metadata } from 'next';
import { generateBaseMetadata } from '../components/dynamicSEO';

// 生成工具列表页元数据
export const metadata: Metadata = {
  ...generateBaseMetadata(),
  title: '全部工具 - DevTools Box',
  description: '浏览我们丰富的开发工具集合，包括编码解码、格式化、加密解密、时间处理、图像处理等多种实用工具',
  alternates: {
    canonical: '/tools',
  },
  openGraph: {
    ...generateBaseMetadata().openGraph,
    title: '全部工具 - DevTools Box',
    description: '浏览我们丰富的开发工具集合，包括编码解码、格式化、加密解密、时间处理、图像处理等多种实用工具',
    url: 'https://devtool.h7ml.cn/tools',
  }
};

export default function ToolsLayout({ children }) {
  return children;
} 
