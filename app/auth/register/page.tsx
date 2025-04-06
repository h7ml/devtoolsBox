'use client';

import { useState } from 'react';
import { FiMail, FiLock, FiUser, FiAlertCircle, FiGithub, FiCheck } from 'react-icons/fi';
import Link from 'next/link';
import NavBar from '../../components/NavBar';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 密码强度检查
  const getPasswordStrength = (pass: string): { score: number; text: string; color: string } => {
    if (!pass) return { score: 0, text: '输入密码', color: 'text-gray-400' };
    
    let score = 0;
    
    if (pass.length >= 8) score += 1;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    
    const strengthMap = [
      { text: '弱', color: 'text-red-500' },
      { text: '一般', color: 'text-orange-500' },
      { text: '中等', color: 'text-yellow-500' },
      { text: '强', color: 'text-green-500' },
      { text: '非常强', color: 'text-green-500' }
    ];
    
    return {
      score,
      text: strengthMap[score].text, 
      color: strengthMap[score].color
    };
  };

  const passwordStrength = getPasswordStrength(password);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!username || !email || !password || !confirmPassword) {
      setError('请填写所有必填字段');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('两次密码输入不匹配');
      return;
    }
    
    if (passwordStrength.score < 2) {
      setError('请设置更强的密码');
      return;
    }
    
    if (!agreeTerms) {
      setError('请同意服务条款和隐私政策');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // 实际项目中，这里会调用注册API
      // 目前仅做模拟
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        
        // 模拟延迟后跳转到登录页
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 2000);
      }, 1500);
      
    } catch (err) {
      console.error('注册失败:', err);
      setError('注册失败，请稍后重试');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      
      <div className="max-w-md mx-auto pt-28 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            注册<span className="text-orange-500">工具盒子</span>
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            创建您的账户以体验全部功能
          </p>
        </div>
        
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-gray-100/50 dark:border-gray-700/50">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 flex items-center">
              <FiAlertCircle className="mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 flex items-center">
              <FiCheck className="mr-2 flex-shrink-0" />
              <span>注册成功！正在跳转到登录页面...</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                用户名
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="用户名"
                />
              </div>
            </div>
            
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
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                密码
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="••••••••"
                />
              </div>
              
              {password && (
                <div className="mt-2 flex items-center">
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                    <div 
                      className={`h-2 rounded-full ${
                        passwordStrength.score === 0 ? 'bg-gray-400' :
                        passwordStrength.score === 1 ? 'bg-red-500' :
                        passwordStrength.score === 2 ? 'bg-orange-500' :
                        passwordStrength.score === 3 ? 'bg-yellow-500' : 'bg-green-500'
                      }`} 
                      style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                    ></div>
                  </div>
                  <span className={`text-xs ${passwordStrength.color}`}>
                    {passwordStrength.text}
                  </span>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                确认密码
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                           ${
                             confirmPassword
                               ? password === confirmPassword
                                 ? 'border-green-500 dark:border-green-500'
                                 : 'border-red-500 dark:border-red-500'
                               : 'border-gray-300 dark:border-gray-600'
                           }`}
                  placeholder="••••••••"
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-2 text-xs text-red-500">密码不匹配</p>
              )}
            </div>
            
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  id="agree-terms"
                  name="agree-terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  我同意 
                  <Link href="/terms" className="text-orange-500 hover:text-orange-600 mx-1">
                    服务条款
                  </Link>
                  和
                  <Link href="/privacy" className="text-orange-500 hover:text-orange-600 ml-1">
                    隐私政策
                  </Link>
                </label>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading || success}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
                (loading || success) ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  注册中...
                </>
              ) : success ? (
                <>
                  <FiCheck className="mr-2 h-4 w-4" />
                  注册成功
                </>
              ) : (
                '注册'
              )}
            </button>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    或使用其他方式
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <FiGithub className="h-5 w-5 mr-2" />
                  <span>使用 GitHub 注册</span>
                </button>
              </div>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              已有账号?{' '}
              <Link
                href="/auth/login"
                className="font-medium text-orange-500 hover:text-orange-600"
              >
                登录
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 