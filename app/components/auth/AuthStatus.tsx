'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { useState } from 'react';

export default function AuthStatus() {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (status === 'loading') {
    return (
      <div className="animate-pulse rounded-full h-8 w-20 bg-gray-200 dark:bg-gray-700"></div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <Link
        href="/auth/login"
        className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none transition-colors"
      >
        <FiUser className="mr-2 -ml-1 h-4 w-4" />
        登录/注册
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none transition-colors"
      >
        <span className="mr-2">{session?.user?.name || '用户'}</span>
        <img
          src={session?.user?.image || 'https://via.placeholder.com/40'}
          alt="用户头像"
          className="h-6 w-6 rounded-full"
        />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
          <Link
            href="/dashboard"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsDropdownOpen(false)}
          >
            我的工具箱
          </Link>
          <Link
            href="/auth/profile"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsDropdownOpen(false)}
          >
            个人资料
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="flex items-center">
              <FiLogOut className="mr-2 h-4 w-4" />
              退出登录
            </div>
          </button>
        </div>
      )}
    </div>
  );
} 
