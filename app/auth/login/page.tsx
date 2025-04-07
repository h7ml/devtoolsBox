'use client';

import { useState, useEffect } from 'react';
import { FiMail, FiLock, FiGithub, FiAlertCircle } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import NavBarWithModals from '../../components/NavBarWithModals';
import { useModalContext } from '../../contexts/ModalContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { openModal } = useModalContext();

  // 页面加载时，重定向到首页并打开登录模态框
  useEffect(() => {
    router.push('/');
    setTimeout(() => {
      openModal('login');
    }, 100);
  }, [router, openModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 表单验证
    if (!email || !password) {
      setError('请填写所有必填字段');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // 使用NextAuth的signIn方法进行认证
      const result = await signIn('credentials', {
        username: email, // 使用email作为用户名
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('登录失败，请检查您的用户名和密码');
        setLoading(false);
      } else {
        // 登录成功，跳转到首页或仪表盘
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      console.error('登录失败:', err);
      setError('登录过程中发生错误，请稍后重试');
      setLoading(false);
    }
  };

  const handleGithubLogin = () => {
    // 使用GitHub登录
    signIn('github', { callbackUrl: '/dashboard' });
  };

  // 渲染加载中的提示，因为页面会立即重定向
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  );
} 
