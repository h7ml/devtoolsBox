import { Metadata } from 'next';
import { Providers } from './providers';

import './globals.css';

export const metadata = {
  title: 'DevTools Box - 程序员在线工具箱',
  description: '为开发者提供的一站式在线工具集合，包括JSON格式化、正则测试、编码解码等',
};

export default function RootLayout({
  children
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning={true}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
} 
