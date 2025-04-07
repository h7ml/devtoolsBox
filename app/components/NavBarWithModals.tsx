'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiMoon, FiSun, FiGithub, FiSearch } from 'react-icons/fi';
import { useTheme } from 'next-themes';
import { useColorMode } from '@chakra-ui/react';
import { useSession, SessionProvider } from 'next-auth/react';
import LogoDisplay from './logo/LogoDisplay';
import AuthStatus from './auth/AuthStatus';
import { useModalContext } from '../contexts/ModalContext';

// 创建一个内部组件，包含NavBar的实际内容
const NavBarContent = () => {
  const { theme, setTheme } = useTheme();
  const { colorMode, toggleColorMode } = useColorMode();
  const { data: session, status } = useSession();
  const { openModal } = useModalContext();

  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // 客户端挂载后才能访问主题和会话
  useEffect(() => {
    setMounted(true);

    // 监听滚动事件，用于控制导航栏样式
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 同时处理Tailwind和Chakra UI的主题切换
  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    toggleColorMode(); // 同时切换Chakra UI的主题
  };

  // 确定当前主题状态
  const isDarkMode = mounted && (theme === 'dark' || colorMode === 'dark');

  // 打开登录弹窗
  const handleOpenLoginModal = () => {
    openModal('login');
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  // 打开注册弹窗
  const handleOpenRegisterModal = () => {
    openModal('register');
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  // 打开搜索弹窗
  const handleOpenSearchModal = () => {
    openModal('search');
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  if (!mounted) return null;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
      ? 'bg-white/85 dark:bg-gray-900/85 backdrop-blur-md shadow-md'
      : 'bg-white dark:bg-gray-900'
      }`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <LogoDisplay size="small" />
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link
                  href="/"
                  className={`text-gray-800 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium relative transition-colors group ${pathname === '/' ? 'text-orange-500 dark:text-orange-500' : ''
                    }`}
                >
                  首页
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-orange-500 transition-all duration-300 ${pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></span>
                </Link>
                <Link
                  href="/tools"
                  className={`text-gray-800 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium relative transition-colors group ${pathname === '/tools' ? 'text-orange-500 dark:text-orange-500' : ''
                    }`}
                >
                  全部工具
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-orange-500 transition-all duration-300 ${pathname === '/tools' ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></span>
                </Link>
                <Link
                  href="/dashboard"
                  className={`text-gray-800 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium relative transition-colors group ${pathname === '/dashboard' ? 'text-orange-500 dark:text-orange-500' : ''
                    }`}
                >
                  我的工具箱
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-orange-500 transition-all duration-300 ${pathname === '/dashboard' ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></span>
                </Link>
                <Link
                  href="/about"
                  className={`text-gray-800 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium relative transition-colors group ${pathname === '/about' ? 'text-orange-500 dark:text-orange-500' : ''
                    }`}
                >
                  关于
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-orange-500 transition-all duration-300 ${pathname === '/about' ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></span>
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-3">
              {/* 搜索按钮 */}
              <button
                onClick={handleOpenSearchModal}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 backdrop-blur-sm focus:outline-none transition-colors"
                aria-label="搜索"
              >
                <FiSearch className="h-5 w-5" />
              </button>

              <button
                onClick={handleToggleTheme}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 backdrop-blur-sm focus:outline-none transition-colors"
                aria-label="切换主题"
              >
                {isDarkMode ? (
                  <FiSun className="h-5 w-5" />
                ) : (
                  <FiMoon className="h-5 w-5" />
                )}
              </button>

              {/* 根据登录状态显示登录按钮或用户信息 */}
              {!mounted || status === 'loading' ? (
                <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              ) : session ? (
                <AuthStatus />
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleOpenLoginModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-500 transition-colors"
                  >
                    登录
                  </button>
                  <button
                    onClick={handleOpenRegisterModal}
                    className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md shadow-sm transition-colors"
                  >
                    注册
                  </button>
                </div>
              )}

              <a
                href="https://github.com/h7ml/devtoolsBox"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white/90 dark:bg-gray-700/90 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none transition-colors"
              >
                <FiGithub className="mr-2 -ml-1 h-4 w-4" />
                GitHub
              </a>
            </div>
          </div>
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-500 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 backdrop-blur-sm focus:outline-none transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">打开菜单</span>
              {isMenuOpen ? (
                <FiX className="block h-6 w-6" />
              ) : (
                <FiMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-t border-gray-100 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              onClick={toggleMenu}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${pathname === '/'
                ? 'text-orange-500 dark:text-orange-500 bg-orange-50/80 dark:bg-orange-900/10'
                : 'text-gray-800 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500 hover:bg-gray-100/80 dark:hover:bg-gray-800/80'
                } transition-colors`}
            >
              首页
            </Link>
            <Link
              href="/tools"
              onClick={toggleMenu}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${pathname === '/tools'
                ? 'text-orange-500 dark:text-orange-500 bg-orange-50/80 dark:bg-orange-900/10'
                : 'text-gray-800 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500 hover:bg-gray-100/80 dark:hover:bg-gray-800/80'
                } transition-colors`}
            >
              全部工具
            </Link>
            <Link
              href="/dashboard"
              onClick={toggleMenu}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${pathname === '/dashboard'
                ? 'text-orange-500 dark:text-orange-500 bg-orange-50/80 dark:bg-orange-900/10'
                : 'text-gray-800 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500 hover:bg-gray-100/80 dark:hover:bg-gray-800/80'
                } transition-colors`}
            >
              我的工具箱
            </Link>
            <Link
              href="/about"
              onClick={toggleMenu}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${pathname === '/about'
                ? 'text-orange-500 dark:text-orange-500 bg-orange-50/80 dark:bg-orange-900/10'
                : 'text-gray-800 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500 hover:bg-gray-100/80 dark:hover:bg-gray-800/80'
                } transition-colors`}
            >
              关于
            </Link>

            {/* 搜索按钮 */}
            <button
              onClick={handleOpenSearchModal}
              className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-gray-800 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-colors"
            >
              <FiSearch className="mr-2 h-5 w-5" />
              搜索工具
            </button>

            {/* 移动端登录/注册 */}
            {!mounted || status === 'loading' ? (
              <div className="px-3 py-2">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              </div>
            ) : session ? (
              <>
                <div className="px-3 py-3 flex items-center">
                  <img
                    src={session.user?.image || '/images/avatar-placeholder.png'}
                    alt={session.user?.name || '用户头像'}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-800 dark:text-white">
                      {session.user?.name || '用户'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {session.user?.email || ''}
                    </div>
                  </div>
                </div>
                <Link
                  href="/profile"
                  onClick={toggleMenu}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-gray-800 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-colors"
                >
                  个人设置
                </Link>
                <Link
                  href="/api/auth/signout"
                  onClick={toggleMenu}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                  退出登录
                </Link>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 px-3 py-3">
                <button
                  onClick={handleOpenLoginModal}
                  className="py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  登录
                </button>
                <button
                  onClick={handleOpenRegisterModal}
                  className="py-2 text-center text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md transition-colors"
                >
                  注册
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={handleToggleTheme}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-800 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-colors"
                aria-label="切换主题"
              >
                {isDarkMode ? (
                  <FiSun className="h-5 w-5 mr-2" />
                ) : (
                  <FiMoon className="h-5 w-5 mr-2" />
                )}
                {isDarkMode ? '浅色模式' : '深色模式'}
              </button>

              <a
                href="https://github.com/h7ml/devtoolsBox"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-800 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-colors"
              >
                <FiGithub className="h-5 w-5 mr-2" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

// 主组件包装了一个额外的SessionProvider
const NavBarWithModals = () => {
  return (
    <SessionProvider>
      <NavBarContent />
    </SessionProvider>
  );
};

export default NavBarWithModals;
