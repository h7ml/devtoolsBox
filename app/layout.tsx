import { Metadata } from 'next';
import { Providers } from './providers';

import './globals.css';

export const metadata: Metadata = {
  title: 'DevTools Box - 程序员在线工具箱',
  description: '为开发者提供的一站式在线工具集合，包括JSON格式化、正则测试、编码解码、加密解密、图片处理等常用开发工具',
  keywords: '开发者工具,JSON格式化,正则表达式,编码解码,加密解密,前端工具,程序员工具箱,开发工具集,在线工具',
  authors: [{ name: 'DevTools Team', url: 'https://github.com/h7ml/devtoolsBox' }],
  creator: 'DevTools Team',
  publisher: 'DevTools Box',
  alternates: {
    canonical: 'https://devtool.h7ml.cn',
  },
  applicationName: 'DevTools Box',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://devtool.h7ml.cn',
    title: 'DevTools Box - 程序员必备在线工具箱',
    description: '为开发者提供的一站式在线工具集合，提升开发效率，简化工作流程',
    siteName: 'DevTools Box',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DevTools Box - 程序员必备在线工具箱',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevTools Box - 程序员必备在线工具箱',
    description: '为开发者提供的一站式在线工具集合，提升开发效率，简化工作流程',
    images: ['/images/twitter-image.jpg'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
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
  verification: {
    google: 'your-google-site-verification-code',
  },
};

export default function RootLayout({
  children
}) {
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
} 
