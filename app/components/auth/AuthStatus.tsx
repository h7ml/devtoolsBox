'use client';

import { useSession, signOut } from 'next-auth/react';
import { FiLogIn, FiLogOut, FiUser } from 'react-icons/fi';
import Button from '../design-system/Button';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function AuthStatus() {
  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);

  if (status === 'loading') {
    return <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>;
  }

  if (status === 'unauthenticated') {
    return (
      <Link href="/auth/signin">
        <Button variant="outline" size="sm" icon={<FiLogIn className="h-4 w-4" />}>
          登录
        </Button>
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        className="flex items-center space-x-2"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {session?.user?.image ? (
          <div className="relative h-9 w-9 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
            <Image
              src={session.user.image}
              alt={session.user.name || 'User'}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
            <FiUser className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
          </div>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="font-medium text-gray-900 dark:text-white">{session?.user?.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{session?.user?.email}</div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <FiLogOut className="h-4 w-4 mr-2" />
            退出登录
          </button>
        </div>
      )}
    </div>
  );
} 
