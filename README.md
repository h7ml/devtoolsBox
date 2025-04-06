# DevToolsBox - 程序员在线工具箱

DevToolsBox是一个为开发者打造的一站式在线工具集合，提供各种常用的开发工具，包括JSON格式化、正则测试、编码解码、代码片段生成等。

## 特性

- 🛠️ **多样化工具**: 提供文本处理、开发辅助、代码执行和爬虫相关等多种类别的工具
- 🎨 **现代UI界面**: 基于Tailwind CSS和Chakra UI的现代化界面设计
- 🌓 **暗色模式**: 支持亮色/暗色主题切换
- 📱 **响应式设计**: 完美适配桌面和移动设备
- 🔒 **用户系统**: 支持OAuth登录，保存您的偏好设置和工具使用历史
- 🧩 **可扩展架构**: 插件式工具注册系统，便于添加新工具

## 技术栈

- **前端框架**: Next.js 14+ (App Router)
- **UI库**: TailwindCSS + Chakra UI
- **状态管理**: Zustand
- **数据库/认证**: Supabase
- **部署**: Vercel

## 工具类别

1. **文本工具**
   - JSON格式化/校验
   - 文本对比(Diff)
   - Base64编解码
   - URL编解码

2. **开发辅助**
   - 正则表达式测试
   - 代码片段生成器
   - UUID生成器
   - 时间戳转换

3. **代码执行**
   - JavaScript沙箱
   - Python沙箱

4. **爬虫工具**
   - Cookie解析
   - cURL转代码
   - HTTP头构造器

## 本地开发

1. 克隆项目
```bash
git clone https://github.com/yourusername/devtoolsbox.git
cd devtoolsbox
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
# 创建 .env.local 文件，并添加Supabase配置
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. 启动开发服务器
```bash
npm run dev
```

5. 打开浏览器，访问 http://localhost:3000

## 贡献指南

欢迎贡献新的工具或改进现有功能！请参阅[贡献指南](CONTRIBUTING.md)了解更多信息。

## 许可证

[MIT](LICENSE) 
