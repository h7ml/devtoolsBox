'use client';

import React from 'react';
import Logo from '../components/logo/Logo';
import LogoDisplay from '../components/logo/LogoDisplay';
import AnimatedLogo from '../components/logo/AnimatedLogo';

export default function LogoDemo() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 border-b pb-4">DevToolsBox Logo 展示</h1>
      
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">基础 Logo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Logo width={40} height={40} />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">小尺寸 (40x40)</p>
          </div>
          
          <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Logo width={80} height={80} />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">中尺寸 (80x80)</p>
          </div>
          
          <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Logo width={120} height={120} />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">大尺寸 (120x120)</p>
          </div>
        </div>
      </section>
      
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">带文字的 Logo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <LogoDisplay size="small" />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">小尺寸</p>
          </div>
          
          <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <LogoDisplay size="medium" />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">中尺寸</p>
          </div>
          
          <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <LogoDisplay size="large" />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">大尺寸</p>
          </div>
        </div>
      </section>
      
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">动画 Logo</h2>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <AnimatedLogo />
          </div>
        </div>
      </section>
      
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">在不同背景下的 Logo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center justify-center p-8 bg-orange-500 rounded-lg">
            <Logo width={80} height={80} className="text-white" />
            <p className="mt-4 text-sm text-white">彩色背景上的 Logo</p>
          </div>
          
          <div className="flex flex-col items-center justify-center p-8 bg-gray-900 rounded-lg">
            <LogoDisplay size="medium" className="text-white" />
            <p className="mt-4 text-sm text-gray-300">深色背景上的带文字 Logo</p>
          </div>
        </div>
      </section>
    </div>
  );
} 