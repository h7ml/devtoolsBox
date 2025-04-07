'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { useModalContext } from '../contexts/ModalContext';
import { useState, useEffect } from 'react';

interface MobileAuthMenuProps {
  onClose: () => void;
}

export default function MobileAuthMenu({ onClose }: MobileAuthMenuProps) {
  const { data: session, status } = useSession();
  const { openModal } = useModalContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 处理登出
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
    onClose();
  };

  // 打开登录模态框
  const handleOpenLoginModal = () => {
    openModal('login');
    onClose();
  };

  // 在挂载前或加载中时显示加载占位符
  if (!mounted || status === 'loading') {
    return (
      <div className="py-2 px-3">
        <div className="animate-pulse h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
      </div>
    );
  }

  // 已认证状态
  if (status === 'authenticated') {
    return (
      <>
        <Link
          href="/auth/profile"
          onClick={onClose}
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-800 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-colors"
        >
          <img
            src={session?.user?.image || 'https://via.placeholder.com/40'}
            alt="用户头像"
            className="h-5 w-5 rounded-full mr-2"
          />
          {session?.user?.name || '个人资料'}
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full text-left flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-800 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-colors"
        >
          <FiLogOut className="h-5 w-5 mr-2" />
          退出登录
        </button>
      </>
    );
  }

  // 未认证状态
  return (
    <button
      onClick={handleOpenLoginModal}
      className="w-full text-left flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-800 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-colors"
    >
      <FiUser className="h-5 w-5 mr-2" />
      登录/注册
    </button>
  );
} 
