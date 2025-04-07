export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/auth/']
      },
    ],
    sitemap: 'https://devtool.h7ml.cn/sitemap.xml',
    host: 'https://devtool.h7ml.cn',
  };
} 
