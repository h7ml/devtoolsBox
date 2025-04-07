'use client';

import { useState } from 'react';
import { FiMail, FiAlertCircle, FiCheck, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import NavBarWithModals from '../../components/NavBarWithModals';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 表单验证
    if (!email) {
      setError('请输入您的邮箱');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // 实际项目中，这里会调用重置密码API
      // 目前仅做模拟
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
      }, 1500);

    } catch (err) {
      console.error('发送重置密码邮件失败:', err);
      setError('操作失败，请稍后重试');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBarWithModals />

      <div className="max-w-md mx-auto pt-28 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            找回<span className="text-orange-500">密码</span>
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            我们将向您的邮箱发送重置密码的链接
          </p>
        </div>

        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-gray-100/50 dark:border-gray-700/50">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 flex items-center">
              <FiAlertCircle className="mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="text-center">
              <div className="mb-6 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-500">
                <FiCheck className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                邮件已发送
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                我们已向 {email} 发送了一封包含重置密码链接的邮件。
                请检查您的收件箱并点击邮件中的链接重置密码。
              </p>
              <div className="flex flex-col space-y-4">
                <Link
                  href="/auth/login"
                  className="inline-flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  返回登录
                </Link>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                  className="inline-flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  重新发送
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  邮箱
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    发送中...
                  </>
                ) : (
                  '发送重置密码邮件'
                )}
              </button>

              <div className="mt-6 text-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-500"
                >
                  <FiArrowLeft className="mr-2 h-4 w-4" />
                  返回登录
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
} 
