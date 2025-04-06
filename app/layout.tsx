import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DevTools Box - 程序员在线工具箱',
  description: '为开发者提供的一站式在线工具集合，包括JSON格式化、正则测试、编码解码等',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning={true}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
} 
