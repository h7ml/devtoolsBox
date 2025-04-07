'use client';

import { useState, useEffect } from 'react';
import {
  FiUser, FiMail, FiLock, FiEdit, FiAlertCircle,
  FiCheck, FiSave, FiStar, FiBarChart2, FiClock, FiSettings
} from 'react-icons/fi';
import NavBarWithModals from '../../components/NavBarWithModals';
import Link from 'next/link';

interface UserProfile {
  username: string;
  email: string;
  createdAt: string;
  avatar: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  // 模拟加载用户资料
  useEffect(() => {
    // 检查登录状态
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
      // 如果未登录，重定向到登录页
      window.location.href = '/auth/login';
      return;
    }

    // 模拟从API获取用户数据
    setTimeout(() => {
      const savedUser = localStorage.getItem('user');

      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);

          // 补充模拟数据
          setUser({
            username: 'demo_user',
            email: parsedUser.email || 'demo@example.com',
            createdAt: new Date().toISOString(),
            avatar: `https://ui-avatars.com/api/?name=Demo+User&background=random`,
          });
        } catch (err) {
          console.error('解析用户数据失败', err);
        }
      } else {
        // 如果没有用户数据，创建模拟数据
        setUser({
          username: 'demo_user',
          email: 'demo@example.com',
          createdAt: new Date().toISOString(),
          avatar: `https://ui-avatars.com/api/?name=Demo+User&background=random`,
        });
      }

      setLoading(false);
    }, 1000);
  }, []);

  // 进入编辑模式
  const handleEdit = () => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
      });
      setEditMode(true);
      setError('');
      setSuccess('');
    }
  };

  // 处理表单字段改变
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 保存用户资料
  const handleSave = () => {
    // 表单验证
    if (!formData.username || !formData.email) {
      setError('请填写所有必填字段');
      return;
    }

    // 模拟API保存
    setTimeout(() => {
      if (user) {
        const updatedUser = { ...user, ...formData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify({ email: updatedUser.email }));

        setSuccess('个人资料已更新');
        setEditMode(false);

        // 3秒后清除成功消息
        setTimeout(() => setSuccess(''), 3000);
      }
    }, 800);
  };

  // 取消编辑
  const handleCancel = () => {
    setEditMode(false);
    setError('');
  };

  // 处理登出
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavBarWithModals />
        <div className="pt-24 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBarWithModals />

      <div className="max-w-6xl mx-auto pt-24 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 侧边栏 */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 dark:border-gray-700/50 overflow-hidden">
              <div className="p-6 pb-4 text-center border-b border-gray-100 dark:border-gray-700">
                <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white dark:border-gray-700 shadow-sm">
                  <img src={user?.avatar} alt={user?.username} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{user?.username}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user?.email}</p>
              </div>

              <nav className="p-4">
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium ${activeTab === 'profile'
                        ? 'bg-orange-50 dark:bg-gray-700/60 text-orange-500 dark:text-orange-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                        }`}
                    >
                      <FiUser className="mr-3 h-5 w-5" />
                      个人资料
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('favorites')}
                      className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium ${activeTab === 'favorites'
                        ? 'bg-orange-50 dark:bg-gray-700/60 text-orange-500 dark:text-orange-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                        }`}
                    >
                      <FiStar className="mr-3 h-5 w-5" />
                      我的收藏
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('history')}
                      className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium ${activeTab === 'history'
                        ? 'bg-orange-50 dark:bg-gray-700/60 text-orange-500 dark:text-orange-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                        }`}
                    >
                      <FiClock className="mr-3 h-5 w-5" />
                      使用历史
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium ${activeTab === 'settings'
                        ? 'bg-orange-50 dark:bg-gray-700/60 text-orange-500 dark:text-orange-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                        }`}
                    >
                      <FiSettings className="mr-3 h-5 w-5" />
                      账户设置
                    </button>
                  </li>
                </ul>

                <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={handleLogout}
                    className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  >
                    退出登录
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* 主内容区 */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-gray-100/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">个人资料</h2>
                  {!editMode && (
                    <button
                      onClick={handleEdit}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <FiEdit className="mr-2 -ml-1 h-4 w-4" />
                      编辑资料
                    </button>
                  )}
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 flex items-center">
                    <FiAlertCircle className="mr-2 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 flex items-center">
                    <FiCheck className="mr-2 flex-shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      用户名
                    </label>
                    {editMode ? (
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="username"
                          name="username"
                          type="text"
                          value={formData.username || ''}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl
                                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                   focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-200 flex items-center">
                        <FiUser className="h-5 w-5 text-gray-400 mr-3" />
                        {user?.username}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      邮箱
                    </label>
                    {editMode ? (
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email || ''}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl
                                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                   focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-200 flex items-center">
                        <FiMail className="h-5 w-5 text-gray-400 mr-3" />
                        {user?.email}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      注册时间
                    </label>
                    <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-200 flex items-center">
                      <FiClock className="h-5 w-5 text-gray-400 mr-3" />
                      {user?.createdAt ? new Date(user.createdAt).toLocaleString() : '未知'}
                    </div>
                  </div>

                  {editMode && (
                    <div className="pt-6 flex items-center justify-end space-x-3">
                      <button
                        onClick={handleCancel}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        取消
                      </button>
                      <button
                        onClick={handleSave}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                      >
                        <FiSave className="mr-2 -ml-1 h-4 w-4" />
                        保存修改
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-gray-100/50 dark:border-gray-700/50">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">我的收藏</h2>
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50/80 dark:bg-gray-700/30 rounded-xl">
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 rounded-lg bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/30"
                  >
                    查看我的收藏工具
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-gray-100/50 dark:border-gray-700/50">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">使用历史</h2>
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50/80 dark:bg-gray-700/30 rounded-xl">
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 rounded-lg bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/30"
                  >
                    查看最近使用的工具
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-gray-100/50 dark:border-gray-700/50">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">账户设置</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">密码修改</h3>
                    <Link
                      href="/auth/change-password"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <FiLock className="mr-2 -ml-1 h-4 w-4" />
                      修改密码
                    </Link>
                  </div>

                  <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">账户注销</h3>
                    <button
                      className="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-700 rounded-xl shadow-sm text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/10"
                    >
                      注销账户
                    </button>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      注意：账户注销后，您的所有数据将被永久删除，且无法恢复。
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 
