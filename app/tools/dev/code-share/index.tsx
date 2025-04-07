'use client';

import React, { useState, useEffect } from 'react';
import { FiCode, FiShare2, FiCopy, FiClipboard, FiTrash, FiCheck, FiLink, FiEye, FiEdit, FiDownload } from 'react-icons/fi';
import { Card, CardHeader, CardContent } from '../../../components/design-system/Card';
import Button from '../../../components/design-system/Button';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';

// 支持的语言列表
const SUPPORTED_LANGUAGES = [
  { id: 'text', name: '纯文本' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'jsx', name: 'JSX' },
  { id: 'tsx', name: 'TSX' },
  { id: 'html', name: 'HTML' },
  { id: 'css', name: 'CSS' },
  { id: 'json', name: 'JSON' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'rust', name: 'Rust' },
  { id: 'go', name: 'Go' },
  { id: 'c', name: 'C' },
  { id: 'cpp', name: 'C++' },
  { id: 'csharp', name: 'C#' },
  { id: 'php', name: 'PHP' },
  { id: 'ruby', name: 'Ruby' },
  { id: 'sql', name: 'SQL' },
  { id: 'markdown', name: 'Markdown' },
  { id: 'yaml', name: 'YAML' },
  { id: 'bash', name: 'Bash' },
  { id: 'powershell', name: 'PowerShell' },
];

// 代码片段类型
interface CodeSnippet {
  id: string;
  title: string;
  code: string;
  language: string;
  createdAt: string;
  expiresAt?: string;
  isPrivate: boolean;
}

// 存储服务模拟
const snippetStorageService = {
  // 在实际应用中，这里会连接到后端API或云存储
  // 目前使用localStorage作为演示存储
  saveSnippet: (snippet: CodeSnippet): Promise<CodeSnippet> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 在实际应用中，这里会将数据发送到服务器
        // 模拟保存到localStorage
        const snippets = JSON.parse(localStorage.getItem('codeSnippets') || '[]');
        snippets.push(snippet);
        localStorage.setItem('codeSnippets', JSON.stringify(snippets));
        resolve(snippet);
      }, 500); // 模拟网络延迟
    });
  },

  getSnippet: (id: string): Promise<CodeSnippet | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const snippets = JSON.parse(localStorage.getItem('codeSnippets') || '[]');
        const snippet = snippets.find((s: CodeSnippet) => s.id === id);
        resolve(snippet || null);
      }, 300);
    });
  },

  getAllSnippets: (): Promise<CodeSnippet[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const snippets = JSON.parse(localStorage.getItem('codeSnippets') || '[]');
        resolve(snippets);
      }, 300);
    });
  },

  deleteSnippet: (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const snippets = JSON.parse(localStorage.getItem('codeSnippets') || '[]');
        const filtered = snippets.filter((s: CodeSnippet) => s.id !== id);
        localStorage.setItem('codeSnippets', JSON.stringify(filtered));
        resolve(true);
      }, 300);
    });
  }
};

// 代码高亮渲染组件（简化版）
const CodeHighlight: React.FC<{ code: string, language: string }> = ({ code, language }) => {
  // 实际应用中，这里会使用像Prism.js或highlight.js这样的库
  return (
    <pre className={`language-${language} overflow-auto max-h-80 p-4 rounded-md bg-gray-50 dark:bg-gray-900 text-sm font-mono`}>
      <code>{code}</code>
    </pre>
  );
};

// Tab组件
const Tabs: React.FC<{
  tabs: { id: string, label: string }[],
  activeTabId: string,
  onChange: (id: string) => void
}> = ({ tabs, activeTabId, onChange }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
      <nav className="flex space-x-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`py-2 px-1 font-medium text-sm border-b-2 -mb-px ${tab.id === activeTabId
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

const CodeShareComponent: React.FC = () => {
  // 新建片段的表单状态
  const [title, setTitle] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('javascript');
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [expiration, setExpiration] = useState<string>('never');

  // 应用状态
  const [activeTab, setActiveTab] = useState<string>('create');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [createdSnippetId, setCreatedSnippetId] = useState<string | null>(null);
  const [mySnippets, setMySnippets] = useState<CodeSnippet[]>([]);
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet | null>(null);

  // 获取用户的所有片段
  useEffect(() => {
    if (activeTab === 'my-snippets') {
      loadMySnippets();
    }
  }, [activeTab]);

  const loadMySnippets = async () => {
    setIsLoading(true);
    try {
      const snippets = await snippetStorageService.getAllSnippets();
      setMySnippets(snippets);
    } catch (error) {
      toast.error('加载代码片段失败');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 创建新的代码片段
  const createSnippet = async () => {
    if (!title || !code) {
      toast.error('标题和代码不能为空');
      return;
    }

    setIsLoading(true);

    try {
      // 准备过期时间
      let expiresAt: string | undefined;
      if (expiration !== 'never') {
        const now = new Date();
        switch (expiration) {
          case '10min':
            now.setMinutes(now.getMinutes() + 10);
            break;
          case '1hour':
            now.setHours(now.getHours() + 1);
            break;
          case '1day':
            now.setDate(now.getDate() + 1);
            break;
          case '1week':
            now.setDate(now.getDate() + 7);
            break;
          case '1month':
            now.setMonth(now.getMonth() + 1);
            break;
        }
        expiresAt = now.toISOString();
      }

      // 创建新的片段对象
      const snippet: CodeSnippet = {
        id: nanoid(10),
        title,
        code,
        language,
        createdAt: new Date().toISOString(),
        expiresAt,
        isPrivate,
      };

      // 保存片段
      const savedSnippet = await snippetStorageService.saveSnippet(snippet);
      setCreatedSnippetId(savedSnippet.id);

      toast.success('代码片段已创建');

      // 清空表单
      if (expiration === 'once') {
        resetForm();
      }
    } catch (error) {
      toast.error('创建代码片段失败');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 删除代码片段
  const deleteSnippet = async (id: string) => {
    if (!confirm('确定要删除这个代码片段吗？此操作无法撤销。')) {
      return;
    }

    setIsLoading(true);
    try {
      await snippetStorageService.deleteSnippet(id);
      setMySnippets(mySnippets.filter(s => s.id !== id));
      if (selectedSnippet?.id === id) {
        setSelectedSnippet(null);
      }
      toast.success('代码片段已删除');
    } catch (error) {
      toast.error('删除代码片段失败');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 复制分享链接
  const copyShareLink = (id: string) => {
    // 在实际应用中，这将是指向此片段的真实URL
    const shareLink = `${window.location.origin}/code-share/${id}`;
    navigator.clipboard.writeText(shareLink);
    toast.success('分享链接已复制到剪贴板');
  };

  // 复制代码
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('代码已复制到剪贴板');
  };

  // 下载代码文件
  const downloadCode = (snippet: CodeSnippet) => {
    // 确定文件扩展名
    let extension = 'txt';
    switch (snippet.language) {
      case 'javascript': extension = 'js'; break;
      case 'typescript': extension = 'ts'; break;
      case 'jsx': extension = 'jsx'; break;
      case 'tsx': extension = 'tsx'; break;
      case 'html': extension = 'html'; break;
      case 'css': extension = 'css'; break;
      case 'python': extension = 'py'; break;
      case 'java': extension = 'java'; break;
      case 'c': extension = 'c'; break;
      case 'cpp': extension = 'cpp'; break;
      case 'csharp': extension = 'cs'; break;
      case 'go': extension = 'go'; break;
      case 'rust': extension = 'rs'; break;
      case 'php': extension = 'php'; break;
      case 'ruby': extension = 'rb'; break;
      case 'sql': extension = 'sql'; break;
      case 'markdown': extension = 'md'; break;
      case 'yaml': extension = 'yml'; break;
      case 'bash': extension = 'sh'; break;
      case 'powershell': extension = 'ps1'; break;
      default: extension = 'txt';
    }

    // 创建下载链接
    const blob = new Blob([snippet.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${snippet.title.replace(/\s+/g, '_')}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`代码已下载为 ${a.download}`);
  };

  // 重置表单
  const resetForm = () => {
    setTitle('');
    setCode('');
    setLanguage('javascript');
    setIsPrivate(false);
    setExpiration('never');
    setCreatedSnippetId(null);
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card className="w-full">
      <CardHeader
        icon={<FiShare2 className="h-6 w-6" />}
        title="代码分享"
        description="创建、管理和分享代码片段"
        gradientColors="from-indigo-500 to-blue-600"
      />
      <CardContent>
        <Tabs
          tabs={[
            { id: 'create', label: '创建片段' },
            { id: 'my-snippets', label: '我的片段' },
          ]}
          activeTabId={activeTab}
          onChange={setActiveTab}
        />

        {activeTab === 'create' && (
          <div className="space-y-6">
            {/* 创建代码片段表单 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  标题
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                           focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="输入代码片段标题..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    语言
                  </label>
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {SUPPORTED_LANGUAGES.map(lang => (
                      <option key={lang.id} value={lang.id}>{lang.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="expiration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    过期时间
                  </label>
                  <select
                    id="expiration"
                    value={expiration}
                    onChange={(e) => setExpiration(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="never">永不过期</option>
                    <option value="10min">10分钟</option>
                    <option value="1hour">1小时</option>
                    <option value="1day">1天</option>
                    <option value="1week">1周</option>
                    <option value="1month">1个月</option>
                    <option value="once">查看一次后删除</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  代码
                </label>
                <div className="flex items-center">
                  <label className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <input
                      type="checkbox"
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      className="mr-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    私有（仅创建者可访问）
                  </label>
                </div>
              </div>
              <textarea
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-80 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="粘贴或输入您的代码..."
              />
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                icon={<FiTrash className="h-4 w-4" />}
                onClick={resetForm}
                disabled={isLoading || (!title && !code)}
              >
                清空
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<FiShare2 className="h-4 w-4" />}
                onClick={createSnippet}
                disabled={isLoading || !title || !code}
                isLoading={isLoading}
              >
                创建分享
              </Button>
            </div>

            {/* 分享链接（创建成功后显示） */}
            {createdSnippetId && (
              <div className="mt-6 p-4 border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 rounded-lg">
                <div className="flex items-center text-green-700 dark:text-green-400 mb-2">
                  <FiCheck className="h-5 w-5 mr-2" />
                  <span className="font-medium">代码片段已创建成功！</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-grow">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/code-share/${createdSnippetId}`}
                      className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<FiLink className="h-4 w-4" />}
                    onClick={() => copyShareLink(createdSnippetId)}
                  >
                    复制链接
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'my-snippets' && (
          <div>
            {isLoading ? (
              <div className="py-12 text-center text-gray-500 dark:text-gray-400">加载中...</div>
            ) : mySnippets.length === 0 ? (
              <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                <FiClipboard className="h-12 w-12 mx-auto mb-4 opacity-40" />
                <p>您还没有创建任何代码片段</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => setActiveTab('create')}
                >
                  创建第一个代码片段
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* 左侧：代码片段列表 */}
                <div className="lg:col-span-1 border-r border-gray-200 dark:border-gray-700 pr-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">我的代码片段</h3>
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                    {mySnippets.map(snippet => (
                      <button
                        key={snippet.id}
                        onClick={() => setSelectedSnippet(snippet)}
                        className={`w-full text-left p-3 rounded-lg transition-colors
                                  ${selectedSnippet?.id === snippet.id
                            ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-100 dark:border-indigo-800'
                            : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                          } border border-gray-200 dark:border-gray-700`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                            {snippet.title}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${snippet.isPrivate
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            }`}>
                            {snippet.isPrivate ? '私有' : '公开'}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <span className="mr-2">{SUPPORTED_LANGUAGES.find(l => l.id === snippet.language)?.name || snippet.language}</span>
                          <span>创建于 {new Date(snippet.createdAt).toLocaleDateString()}</span>
                        </div>
                        {snippet.expiresAt && (
                          <div className="mt-1 text-xs text-red-500 dark:text-red-400">
                            过期时间：{new Date(snippet.expiresAt).toLocaleString()}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 右侧：选中的代码片段详情 */}
                <div className="lg:col-span-2">
                  {selectedSnippet ? (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{selectedSnippet.title}</h3>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<FiLink className="h-4 w-4" />}
                            onClick={() => copyShareLink(selectedSnippet.id)}
                          >
                            复制链接
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<FiCopy className="h-4 w-4" />}
                            onClick={() => copyCode(selectedSnippet.code)}
                          >
                            复制代码
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<FiDownload className="h-4 w-4" />}
                            onClick={() => downloadCode(selectedSnippet)}
                          >
                            下载
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<FiTrash className="h-4 w-4" />}
                            onClick={() => deleteSnippet(selectedSnippet.id)}
                          >
                            删除
                          </Button>
                        </div>
                      </div>

                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex flex-wrap gap-x-4 gap-y-1">
                        <div>语言：{SUPPORTED_LANGUAGES.find(l => l.id === selectedSnippet.language)?.name || selectedSnippet.language}</div>
                        <div>创建时间：{formatDate(selectedSnippet.createdAt)}</div>
                        {selectedSnippet.expiresAt && (
                          <div>过期时间：{formatDate(selectedSnippet.expiresAt)}</div>
                        )}
                        <div>访问权限：{selectedSnippet.isPrivate ? '私有' : '公开'}</div>
                      </div>

                      <CodeHighlight
                        code={selectedSnippet.code}
                        language={selectedSnippet.language}
                      />
                    </div>
                  ) : (
                    <div className="py-20 text-center text-gray-500 dark:text-gray-400">
                      <FiEye className="h-12 w-12 mx-auto mb-4 opacity-40" />
                      <p>选择一个代码片段查看详情</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// 工具元数据
const codeShare = {
  id: 'code-share',
  name: '代码分享',
  description: '创建、管理和分享代码片段',
  category: 'dev',
  icon: FiShare2,
  component: CodeShareComponent,
  meta: {
    keywords: ['代码', '分享', '片段', '代码片段', '代码分享', 'gist', 'pastebin'],
    author: 'DevTools Box',
    version: '1.0.0'
  }
};

export default codeShare; 
