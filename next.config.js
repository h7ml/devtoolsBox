/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用App Router功能
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  // 配置图像优化
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  // 将Tailwind CSS和Chakra UI整合时的配置
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(js|jsx)$/,
      use: ['babel-loader'],
      include: /node_modules[/\\](framer-motion|react-icons|react-select)/,
    });
    return config;
  },
};

module.exports = nextConfig; 
