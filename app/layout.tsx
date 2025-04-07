import { Metadata } from 'next';
import { Providers } from './providers';
import { generateBaseMetadata } from './components/dynamicSEO';
import StructuredData from './components/StructuredData';
import { generateWebsiteStructuredData } from './components/dynamicSEO';

import './globals.css';

// 使用动态SEO工具生成基本元数据
export const metadata: Metadata = generateBaseMetadata();

export default function RootLayout({
  children
}) {
  // 生成网站结构化数据
  const websiteStructuredData = generateWebsiteStructuredData();

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        {/* 百度站点验证 - Next.js的Metadata类型不支持baidu字段，所以在这里手动添加 */}
        <meta name="baidu-site-verification" content="your-baidu-site-verification-code" />
      </head>
      <body className="font-sans" suppressHydrationWarning={true}>
        {/* 添加网站结构化数据 */}
        <StructuredData data={websiteStructuredData} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
} 
