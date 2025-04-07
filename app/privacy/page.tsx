'use client';

import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import NavBarWithModals from '../components/NavBarWithModals';

export default function Privacy() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBarWithModals />

      <div className="max-w-4xl mx-auto pt-28 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center text-orange-500 hover:text-orange-600 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            返回首页
          </Link>
        </div>

        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-gray-100/50 dark:border-gray-700/50">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            隐私政策
          </h1>

          <div className="prose prose-orange max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-400">
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              最后更新日期：{new Date().toLocaleDateString('zh-CN')}
            </p>

            <p>
              感谢您使用工具盒子！我们非常重视您的隐私和个人信息保护。本隐私政策旨在向您说明我们如何收集、使用、存储和保护您的个人信息。
              请您在使用我们的服务前，仔细阅读并理解本隐私政策的全部内容。
            </p>

            <h2>1. 信息收集</h2>
            <p>
              <strong>1.1 您主动提供的信息</strong><br />
              当您注册账户时，我们会收集您提供的电子邮件地址、用户名和密码。<br />
              如果您选择通过第三方账户（如GitHub）登录，我们会收到该第三方提供的基本信息。
            </p>
            <p>
              <strong>1.2 自动收集的信息</strong><br />
              我们可能会自动收集某些技术信息，如IP地址、浏览器类型、访问时间、访问页面等，以优化用户体验和服务质量。
            </p>

            <h2>2. 信息使用</h2>
            <p>
              我们使用收集的信息主要用于：<br />
              • 提供、维护和改进我们的服务<br />
              • 验证您的身份并管理您的账户<br />
              • 响应您的请求、问题和意见<br />
              • 向您发送服务相关的通知<br />
              • 防止、检测和调查欺诈、安全漏洞或其他潜在的禁止或非法活动
            </p>

            <h2>3. 数据本地处理原则</h2>
            <p>
              <strong>3.1 浏览器端处理</strong><br />
              我们的大多数工具在您的浏览器本地运行，这意味着您上传或输入的数据（如代码、文本、图像等）通常不会发送到我们的服务器。
            </p>
            <p>
              <strong>3.2 例外情况</strong><br />
              部分需要服务器计算能力的工具可能会临时处理您的数据，但我们不会永久存储这些内容，并在处理完成后立即删除。
            </p>

            <h2>4. Cookie 和类似技术</h2>
            <p>
              我们使用Cookie和类似技术来增强您的体验、收集统计数据并提供个性化内容。您可以通过浏览器设置控制Cookie的使用。
            </p>

            <h2>5. 信息安全</h2>
            <p>
              我们采取适当的技术和组织措施来保护您的个人信息免遭丢失、盗用或未经授权的访问。然而，请理解互联网传输不能保证100%的安全性。
            </p>

            <h2>6. 信息共享</h2>
            <p>
              除非有下列情况，我们不会与第三方共享您的个人信息：<br />
              • 获得您的明确同意<br />
              • 履行法律义务<br />
              • 保护我们的合法权益<br />
              • 在必要的范围内与我们的服务提供商合作（如云服务提供商）
            </p>

            <h2>7. 用户权利</h2>
            <p>
              您对您的个人信息拥有以下权利：<br />
              • 访问和获取您的个人信息副本<br />
              • 更正不准确的个人信息<br />
              • 在某些情况下删除您的个人信息<br />
              • 限制或反对我们处理您的个人信息<br />
              • 数据可携带性
            </p>

            <h2>8. 儿童隐私</h2>
            <p>
              我们的服务不面向13岁以下的儿童。如果我们发现已经收集了13岁以下儿童的个人信息，我们会立即采取措施删除这些信息。
            </p>

            <h2>9. 隐私政策的变更</h2>
            <p>
              我们可能会不时更新本隐私政策。当我们进行重大更改时，我们会在网站上发布通知，并更新政策顶部的"最后更新日期"。
            </p>

            <h2>10. 联系我们</h2>
            <p>
              如果您对本隐私政策有任何疑问或需要行使您的用户权利，请通过以下方式联系我们：<br />
              GitHub: <a href="https://github.com/h7ml/devtoolsBox" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600">h7ml/devtoolsBox</a><br />
              提交问题: <a href="https://github.com/h7ml/devtoolsBox/issues" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600">Issues</a>
            </p>
          </div>
        </div>

        <div className="text-center mt-12 text-sm text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} 工具盒子 - 帮助开发者提高工作效率</p>
        </div>
      </div>
    </main>
  );
}
