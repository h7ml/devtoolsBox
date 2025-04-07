'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { FiUser, FiLogOut } from 'react-icons/fi';

interface MobileAuthMenuProps {
  onClose: () => void;
}

export default function MobileAuthMenu({ onClose }: MobileAuthMenuProps) {
  const { data: session, status } = useSession();

  // 处理登出
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
    onClose();
  };

  if (status === 'loading') {
    return (
      <div className="py-2 px-3">
        <div className="animate-pulse h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
      </div>
    );
  }

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

  return (
    <Link
      href="/auth/login"
      onClick={onClose}
      className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-800 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-colors"
    >
      <FiUser className="h-5 w-5 mr-2" />
      登录/注册
    </Link>
  );
} 
