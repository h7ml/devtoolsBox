/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用App Router功能
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
    // 启用SRI（子资源完整性）
    sri: {
      algorithm: 'sha512', // 使用SHA-512算法
    },
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

    // 如果使用自定义CDN，可以在这里添加SRI
    if (process.env.NODE_ENV === 'production') {
      config.output.crossOriginLoading = 'anonymous';
    }

    return config;
  },
  // 禁用SWC
  swcMinify: process.env.NODE_ENV === 'development' ? false : true,
  // 开发环境禁用SWC，生产环境使用默认配置
  // 指定需要编译的包
  transpilePackages: ['next/font/google'],
  // 解决JSX命名空间报错问题
  compiler: {
    styledComponents: true,
    // 如果使用styled-components，则启用此选项
    reactRemoveProperties: process.env.NODE_ENV === 'production',
    emotion: true,
    // 如果使用emotion，则启用此选项
  },
  // 配置资源压缩选项，生产环境中开启
  compress: process.env.NODE_ENV === 'production',
  // 配置内容安全策略
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://devtool.h7ml.cn; frame-ancestors 'none';"
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
