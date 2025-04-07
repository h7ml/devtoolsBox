'use client';

import React, { useState } from 'react';
import { FiRefreshCw, FiCopy, FiCheck, FiCoffee } from 'react-icons/fi';
import { Card, CardHeader, CardContent } from '../../../components/design-system/Card';
import Button from '../../../components/design-system/Button';
import { AnimatePresence, motion } from 'framer-motion';

// Cookie解析函数
const parseCookies = (cookieString: string): Array<{ name: string; value: string; attributes?: { [key: string]: string } }> => {
  const cookies: Array<{ name: string; value: string; attributes?: { [key: string]: string } }> = [];

  // 分割多个cookie
  const cookieParts = cookieString.split(/;\s*/);

  let currentCookie: { name: string; value: string; attributes?: { [key: string]: string } } | null = null;

  for (const part of cookieParts) {
    // 检查是否是新的name=value对
    if (part.includes('=')) {
      const [name, ...valueParts] = part.split('=');
      const value = valueParts.join('='); // 处理值中可能包含的等号

      // 如果是第一个Cookie或者不是属性，则创建新的Cookie对象
      if (!currentCookie || !name.trim().toLowerCase().match(/^(expires|max-age|domain|path|secure|httponly|samesite)$/)) {
        // 如果已有Cookie对象，先保存
        if (currentCookie) {
          cookies.push(currentCookie);
        }

        // 创建新的Cookie对象
        currentCookie = {
          name: name.trim(),
          value: value,
          attributes: {}
        };
      } else if (currentCookie) {
        // 这是一个Cookie属性
        const attrName = name.trim().toLowerCase();
        if (!currentCookie.attributes) {
          currentCookie.attributes = {};
        }
        currentCookie.attributes[attrName] = value;
      }
    } else if (currentCookie) {
      // 无值属性，如Secure、HttpOnly
      const attrName = part.trim().toLowerCase();
      if (!currentCookie.attributes) {
        currentCookie.attributes = {};
      }
      currentCookie.attributes[attrName] = 'true';
    }
  }

  // 添加最后一个Cookie
  if (currentCookie) {
    cookies.push(currentCookie);
  }

  return cookies;
};

// 示例Cookie字符串
const COOKIE_EXAMPLES = {
  simple: 'userId=abc123; sessionId=xyz789; theme=dark',
  complex: '_ga=GA1.2.1234567890.1612345678; _gid=GA1.2.9876543210.1612345678; JSESSIONID=ABC123XYZ; session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.kzaVCY3tGTSM; cf_clearance=abc123xyz456; auth=true; preferences={"lang":"en","notifications":true}; SameSite=Lax; Secure; HttpOnly; Path=/api; Expires=Wed, 21 Oct 2025 07:28:00 GMT; Max-Age=2592000; Domain=.example.com',
  setcookie: 'Set-Cookie: session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600\nSet-Cookie: theme=dark; Path=/; SameSite=Lax; Max-Age=2592000\nSet-Cookie: userId=123456; Path=/account; Domain=example.com'
};

type CookieType = 'simple' | 'complex' | 'setcookie' | 'custom';

const CookieFormatterComponent = () => {
  const [input, setInput] = useState<string>(COOKIE_EXAMPLES.simple);
  const [parsedCookies, setParsedCookies] = useState<Array<{ name: string; value: string; attributes?: { [key: string]: string } }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [cookieType, setCookieType] = useState<CookieType>('simple');
  const [formatType, setFormatType] = useState<'json' | 'table'>('table');

  // 处理示例类型变更
  const handleCookieTypeChange = (type: CookieType) => {
    setCookieType(type);
    if (type !== 'custom') {
      setInput(COOKIE_EXAMPLES[type]);
    }
  };

  // 解析Cookie
  const parseCookieString = () => {
    try {
      setError(null);

      let cookieStr = input;

      // 处理Set-Cookie头格式
      if (cookieStr.includes('Set-Cookie:')) {
        const setCookieLines = cookieStr.split('\n')
          .filter(line => line.trim().startsWith('Set-Cookie:'))
          .map(line => line.replace(/^Set-Cookie:\s*/, ''));

        cookieStr = setCookieLines.join('; ');
      }

      const cookies = parseCookies(cookieStr);
      setParsedCookies(cookies);
    } catch (e) {
      setError(`解析错误: ${e.message}`);
    }
  };

  // 清除输入和结果
  const handleClear = () => {
    setInput('');
    setParsedCookies([]);
    setError(null);
  };

  // 获取JSON格式输出
  const getJsonOutput = () => {
    return JSON.stringify(parsedCookies, null, 2);
  };

  // 复制结果
  const handleCopy = () => {
    if (parsedCookies.length === 0) return;

    let copyText = '';

    if (formatType === 'json') {
      copyText = getJsonOutput();
    } else {
      // 表格格式，使用键值对形式
      copyText = parsedCookies.map(cookie => {
        let result = `${cookie.name}=${cookie.value}`;
        if (cookie.attributes) {
          const attrs = Object.entries(cookie.attributes)
            .map(([key, value]) => `${key}=${value}`)
            .join('; ');
          if (attrs) {
            result += `; ${attrs}`;
          }
        }
        return result;
      }).join('\n');
    }

    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader
        icon={<FiCoffee className="h-6 w-6" />}
        title="Cookie格式化工具"
        description="解析和格式化Cookie字符串"
        gradientColors="from-orange-500 to-orange-600"
      />
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                输入Cookie字符串
              </label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<FiRefreshCw className="h-4 w-4" />}
                  onClick={parseCookieString}
                >
                  解析Cookie
                </Button>
              </div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                        bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                        font-mono text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="粘贴Cookie字符串..."
            />
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">选项</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                  示例类型
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      className="mr-2 text-orange-500 focus:ring-orange-500"
                      checked={cookieType === 'simple'}
                      onChange={() => handleCookieTypeChange('simple')}
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">简单Cookie</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      className="mr-2 text-orange-500 focus:ring-orange-500"
                      checked={cookieType === 'complex'}
                      onChange={() => handleCookieTypeChange('complex')}
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">复杂Cookie（含属性）</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      className="mr-2 text-orange-500 focus:ring-orange-500"
                      checked={cookieType === 'setcookie'}
                      onChange={() => handleCookieTypeChange('setcookie')}
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Set-Cookie格式</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      className="mr-2 text-orange-500 focus:ring-orange-500"
                      checked={cookieType === 'custom'}
                      onChange={() => handleCookieTypeChange('custom')}
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">自定义</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                  输出格式
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      className="mr-2 text-orange-500 focus:ring-orange-500"
                      checked={formatType === 'json'}
                      onChange={() => setFormatType('json')}
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">JSON格式</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      className="mr-2 text-orange-500 focus:ring-orange-500"
                      checked={formatType === 'table'}
                      onChange={() => setFormatType('table')}
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">表格格式</span>
                  </label>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="w-full border border-gray-300 dark:border-gray-600"
                onClick={handleClear}
              >
                清除输入
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <Button
            onClick={parseCookieString}
            icon={<FiRefreshCw className="h-4 w-4" />}
            className="w-full md:w-auto"
          >
            解析Cookie
          </Button>

          <div className="hidden md:flex items-center space-x-2">
            <AnimatePresence>
              {parsedCookies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    icon={copied ? <FiCheck className="h-4 w-4" /> : <FiCopy className="h-4 w-4" />}
                    onClick={handleCopy}
                  >
                    {copied ? '已复制' : '复制结果'}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="mb-2 flex justify-between items-center">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            解析结果
          </div>
          <div className="md:hidden">
            {parsedCookies.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                icon={copied ? <FiCheck className="h-4 w-4" /> : <FiCopy className="h-4 w-4" />}
                onClick={handleCopy}
              >
                {copied ? '已复制' : '复制'}
              </Button>
            )}
          </div>
        </div>

        {formatType === 'json' ? (
          <pre className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 overflow-auto max-h-80 font-mono text-sm text-gray-800 dark:text-gray-200">
            {parsedCookies.length > 0 ? getJsonOutput() : '// 解析后的结果将显示在这里'}
          </pre>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden max-h-80 overflow-y-auto">
            {parsedCookies.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      名称
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      值
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      属性
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {parsedCookies.map((cookie, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 font-semibold">
                        {cookie.name}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 font-mono break-all">
                        {cookie.value}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                        {cookie.attributes && Object.keys(cookie.attributes).length > 0 ? (
                          <ul className="list-disc list-inside space-y-1">
                            {Object.entries(cookie.attributes).map(([key, value], i) => (
                              <li key={i} className="text-xs">
                                <span className="font-medium">{key}</span>: {value}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400 text-xs italic">无</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-4 text-center text-gray-600 dark:text-gray-400">
                解析后的结果将显示在这里
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// 工具元数据
const cookieFormatter = {
  id: 'cookie-formatter',
  name: 'Cookie格式化工具',
  description: '解析和格式化Cookie字符串',
  category: 'web',
  icon: FiCoffee,
  component: CookieFormatterComponent,
  meta: {
    keywords: ['cookie', '格式化', '解析', 'http', '会话', 'session', '浏览器'],
    author: 'DevTools Box',
    version: '1.0.0'
  }
};

export default cookieFormatter; 
