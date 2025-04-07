'use client';

import React, { useRef } from 'react';
import Logo from '../components/logo/Logo';
import LogoDisplay from '../components/logo/LogoDisplay';
import AnimatedLogo from '../components/logo/AnimatedLogo';
import Link from 'next/link';
import { FiArrowLeft, FiDownload } from 'react-icons/fi';

export default function BrandPage() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // 下载SVG文件
  const downloadSVG = () => {
    console.log("downloadSVG")
    if (!svgRef.current) return;

    // 获取SVG内容
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    // 创建下载链接
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = 'devtoolsbox-logo.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // 释放URL对象
    URL.revokeObjectURL(svgUrl);
  };

  // 下载PNG文件
  const downloadPNG = () => {
    console.log("downloadPNG")
    if (!svgRef.current) return;

    // 创建Canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgRect = svgRef.current.getBoundingClientRect();

    // 设置Canvas尺寸
    canvas.width = svgRect.width * 2; // 2倍尺寸以获得更高分辨率
    canvas.height = svgRect.height * 2;

    if (ctx) {
      ctx.scale(2, 2);

      // 将SVG绘制到Canvas
      const img = new Image();
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const svgUrl = URL.createObjectURL(new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' }));

      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(svgUrl);

        // 转换为PNG并下载
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = 'devtoolsbox-logo.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };

      img.src = svgUrl;
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-orange-500 hover:text-orange-600 transition-colors">
          <FiArrowLeft className="mr-2" />
          返回首页
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-6">DevToolsBox 品牌</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-12 max-w-3xl">
        DevToolsBox 是一个为开发者设计的工具集合平台，旨在提高开发效率。
        我们的品牌标识体现了工具箱和开发的核心理念，简洁而专业。
      </p>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">品牌标识</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-white dark:bg-gray-800 p-12 rounded-lg shadow-sm flex items-center justify-center">
              <AnimatedLogo ref={svgRef} />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-medium mb-4">标志含义</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              DevToolsBox 的标志由工具箱和代码符号组成，代表了开发者的工具集合。
              橙色渐变代表活力和创新，而工具箱形状则象征实用性和功能性。
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={downloadSVG}
                className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
              >
                <FiDownload className="mr-2" />
                下载 SVG
              </button>
              <button
                onClick={downloadPNG}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <FiDownload className="mr-2" />
                下载 PNG
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">颜色系统</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="rounded-lg overflow-hidden shadow-sm">
            <div className="h-32 bg-orange-500"></div>
            <div className="p-4 bg-white dark:bg-gray-800">
              <p className="font-medium">主要颜色</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">橙色 #FF5733</p>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-sm">
            <div className="h-32 bg-amber-500"></div>
            <div className="p-4 bg-white dark:bg-gray-800">
              <p className="font-medium">辅助颜色</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">琥珀色 #FF8C33</p>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-sm">
            <div className="h-32 bg-gray-900 dark:bg-gray-100"></div>
            <div className="p-4 bg-white dark:bg-gray-800">
              <p className="font-medium">文本颜色</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">深灰 #1A202C</p>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-sm">
            <div className="h-32 bg-white dark:bg-gray-900"></div>
            <div className="p-4 bg-white dark:bg-gray-800">
              <p className="font-medium">背景颜色</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">白色 #FFFFFF</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Logo变体</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm flex flex-col items-center">
            <Logo width={80} height={80} />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">仅Logo</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm flex flex-col items-center">
            <LogoDisplay size="medium" />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">Logo + 文字</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm flex flex-col items-center">
            <LogoDisplay size="small" showText={false} />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">小尺寸Logo</p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">品牌字体</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-medium mb-4">标题字体</h3>
            <p className="text-4xl font-bold">DevToolsBox</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              使用系统无衬线字体，粗体，保持简洁和专业
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-medium mb-4">正文字体</h3>
            <p className="text-lg">工具盒子是开发者的好帮手</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              使用系统无衬线字体，常规字重，保持良好的可读性
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">使用指南</h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-medium mb-4">Logo 使用规则</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
            <li>保持Logo的比例，不要扭曲或变形</li>
            <li>确保Logo周围有足够的空白区域</li>
            <li>优先使用提供的官方颜色</li>
            <li>深色背景使用浅色版本，浅色背景使用深色版本</li>
            <li>不要在复杂或干扰性强的背景上使用Logo</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
