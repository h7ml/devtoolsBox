'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useModalContext } from '../../contexts/ModalContext';

export default function Register() {
  const router = useRouter();
  const { openModal } = useModalContext();

  // 页面加载时，重定向到首页并打开注册模态框
  useEffect(() => {
    router.push('/');
    setTimeout(() => {
      openModal('register');
    }, 100);
  }, [router, openModal]);

  // 渲染加载中的提示，因为页面会立即重定向
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  );
} 
