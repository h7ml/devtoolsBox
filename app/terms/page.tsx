'use client';

import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import NavBarWithModals from '../components/NavBarWithModals';

export default function Terms() {
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
            用户条款与服务协议
          </h1>
          
          <div className="prose prose-orange max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-400">
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              最后更新日期：{new Date().toLocaleDateString('zh-CN')}
            </p>

            <h2>1. 协议接受</h2>
            <p>
              欢迎使用"工具盒子"（以下简称"本平台"）。通过注册并使用本平台，您确认您已阅读、理解并同意接受本协议的所有条款和条件。
              本协议构成您与本平台之间关于您使用服务的法律协议。如您不同意本协议中的任何条款，请勿访问或使用本平台。
            </p>

            <h2>2. 服务概述</h2>
            <p>
              本平台提供一系列在线开发工具和实用程序，旨在帮助开发者提高工作效率。这些工具以SaaS（软件即服务）的方式提供，用户可以通过网络访问使用。
              所有工具尽可能在浏览器端本地运行，确保您的数据安全。
            </p>

            <h2>3. 注册与账户</h2>
            <p>
              3.1 为使用本平台的完整服务，您需要注册一个账户。在注册过程中，您需要提供准确、完整和最新的个人信息。<br />
              3.2 您须对账户的所有活动和内容负责，并对密码保密负责。<br />
              3.3 如发现未授权使用您账户的情况，您应立即通知我们。
            </p>

            <h2>4. 用户责任</h2>
            <p>
              4.1 您承诺不使用本平台进行任何违法或未经授权的活动。<br />
              4.2 您不得上传、处理或分享任何侵犯第三方权利的内容。<br />
              4.3 您不得试图干扰或破坏平台的正常运行。
            </p>

            <h2>5. 内容所有权</h2>
            <p>
              5.1 您通过本平台处理的内容所有权归您所有。<br />
              5.2 本平台不会保存或分享您处理的内容，除非特定工具明确说明需要临时存储。<br />
              5.3 本平台的界面设计、代码和算法等知识产权归本平台所有。
            </p>

            <h2>6. 免费使用与服务变更</h2>
            <p>
              6.1 本平台的大部分功能免费提供，我们可能在未来添加高级功能。<br />
              6.2 我们保留随时修改、暂停或终止服务的权利，且无需事先通知。
            </p>

            <h2>7. 免责声明</h2>
            <p>
              7.1 本平台按"现状"和"可用性"提供，不提供任何明示或暗示的保证。<br />
              7.2 我们不保证服务无错误或不中断。<br />
              7.3 您使用通过本平台处理的结果需自行承担风险。
            </p>

            <h2>8. 责任限制</h2>
            <p>
              在法律允许的最大范围内，本平台及其创建者、贡献者不对您使用本服务或无法使用本服务而导致的任何直接、间接、偶然、特殊、惩罚性或后果性损害承担责任。
            </p>

            <h2>9. 协议修改</h2>
            <p>
              我们可能会不时修改本协议。修改后的条款将在发布后立即生效。您继续使用本平台即表示您接受修改后的条款。
            </p>

            <h2>10. 适用法律</h2>
            <p>
              本协议受中华人民共和国法律管辖。任何与本协议相关的争议应首先通过友好协商解决。
            </p>
            
            <h2>11. 联系我们</h2>
            <p>
              如您对本协议有任何疑问，请通过以下方式联系我们：<br />
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