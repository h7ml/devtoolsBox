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
  // 禁用SWC
  swcMinify: process.env.NODE_ENV === 'development' ? false : true, // 开发环境禁用SWC，生产环境使用默认配置
  // 指定需要编译的包
  transpilePackages: ['next/font/google'],
  // 解决JSX命名空间报错问题
  compiler: {
    styledComponents: true, // 如果使用styled-components，则启用此选项
    reactRemoveProperties: process.env.NODE_ENV === 'production',
    emotion: true, // 如果使用emotion，则启用此选项
  },
  // SWC编译器配置
  swcOptions: {
    jsc: {
      transform: {
        react: {
          throwIfNamespace: false, // 设置为false，解决JSX命名空间报错
          runtime: 'automatic',
        },
      },
    },
  },
};

module.exports = nextConfig;
