'use client';

import React, { useState } from 'react';
import { FiRefreshCw, FiCopy, FiCheck, FiFileText } from 'react-icons/fi';
import { Card, CardHeader, CardContent } from '../../../components/design-system/Card';
import Button from '../../../components/design-system/Button';
import { AnimatePresence, motion } from 'framer-motion';

// HTTP头部字段示例
const HTTP_HEADER_EXAMPLES = {
  request: `GET /api/users HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36
Accept: application/json, text/plain, */*
Accept-Language: en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7
Accept-Encoding: gzip, deflate, br
Referer: https://example.com/users
Connection: keep-alive
Cache-Control: no-cache
Pragma: no-cache
Cookie: session_id=abc123; user_id=456; theme=dark`,
  response: `HTTP/1.1 200 OK
Date: Wed, 21 Oct 2023 07:28:00 GMT
Server: nginx/1.18.0
Content-Type: application/json; charset=utf-8
Content-Length: 1230
Connection: keep-alive
X-Powered-By: Express
ETag: W/"4ce-1d54fabd"
Access-Control-Allow-Origin: *
Cache-Control: max-age=3600, must-revalidate
Vary: Accept-Encoding
Content-Encoding: gzip
Set-Cookie: session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9; Path=/; HttpOnly; Secure; SameSite=Strict`,
  custom: ``
};

type HeaderType = 'request' | 'response' | 'custom';

const HeaderFormatterComponent = () => {
  const [input, setInput] = useState<string>(HTTP_HEADER_EXAMPLES.request);
  const [output, setOutput] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [headerType, setHeaderType] = useState<HeaderType>('request');
  const [formatType, setFormatType] = useState<'json' | 'table'>('json');

  // 处理示例类型变更
  const handleHeaderTypeChange = (type: HeaderType) => {
    setHeaderType(type);
    if (type !== 'custom') {
      setInput(HTTP_HEADER_EXAMPLES[type]);
    }
  };

  // 清除所有内容
  const handleClear = () => {
    setInput('');
    setOutput({});
    setError(null);
  };

  // 格式化HTTP头部
  const formatHeaders = () => {
    try {
      setError(null);

      const lines = input.trim().split('\n');
      const headers: { [key: string]: string } = {};

      // 跳过第一行，它通常是请求/响应行
      let startIndex = 0;

      // 检测是否包含请求行或响应行
      if (lines.length > 0 &&
        (lines[0].startsWith('HTTP/') ||
          /^[A-Z]+ \/\S* HTTP\/\d\.\d/.test(lines[0]))) {
        startIndex = 1;
      }

      // 解析每行头部
      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          const key = line.substring(0, colonIndex).trim();
          const value = line.substring(colonIndex + 1).trim();
          headers[key] = value;
        }
      }

      setOutput(headers);
    } catch (e) {
      setError(`解析错误: ${e.message}`);
    }
  };

  // 生成JSON字符串
  const getJsonOutput = () => {
    return JSON.stringify(output, null, 2);
  };

  // 复制输出内容
  const handleCopy = () => {
    let copyText = '';

    if (formatType === 'json') {
      copyText = getJsonOutput();
    } else {
      // 表格格式，使用键值对形式
      copyText = Object.entries(output)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
    }

    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader
        icon={<FiFileText className="h-6 w-6" />}
        title="HTTP头部格式化工具"
        description="将HTTP头部字符串解析为结构化数据"
        gradientColors="from-indigo-500 to-indigo-600"
      />
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                输入HTTP头部
              </label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<FiRefreshCw className="h-4 w-4" />}
                  onClick={formatHeaders}
                >
                  解析头部
                </Button>
              </div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                        bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                        font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="粘贴HTTP头部内容..."
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
                      className="mr-2 text-indigo-500 focus:ring-indigo-500"
                      checked={headerType === 'request'}
                      onChange={() => handleHeaderTypeChange('request')}
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">请求头部示例</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      className="mr-2 text-indigo-500 focus:ring-indigo-500"
                      checked={headerType === 'response'}
                      onChange={() => handleHeaderTypeChange('response')}
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">响应头部示例</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      className="mr-2 text-indigo-500 focus:ring-indigo-500"
                      checked={headerType === 'custom'}
                      onChange={() => handleHeaderTypeChange('custom')}
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
                      className="mr-2 text-indigo-500 focus:ring-indigo-500"
                      checked={formatType === 'json'}
                      onChange={() => setFormatType('json')}
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">JSON格式</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      className="mr-2 text-indigo-500 focus:ring-indigo-500"
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
            onClick={formatHeaders}
            icon={<FiRefreshCw className="h-4 w-4" />}
            className="w-full md:w-auto"
          >
            解析HTTP头部
          </Button>

          <div className="hidden md:flex items-center space-x-2">
            <AnimatePresence>
              {Object.keys(output).length > 0 && (
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
            {Object.keys(output).length > 0 && (
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
            {Object.keys(output).length > 0 ? getJsonOutput() : '// 解析后的结果将显示在这里'}
          </pre>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden max-h-80 overflow-y-auto">
            {Object.keys(output).length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      头部字段
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      值
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {Object.entries(output).map(([key, value], index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 font-semibold">
                        {key}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 font-mono break-all">
                        {value}
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
const headerFormatter = {
  id: 'header-formatter',
  name: 'HTTP头部格式化工具',
  description: '将HTTP头部字符串解析为结构化数据',
  category: 'web',
  icon: FiFileText,
  component: HeaderFormatterComponent,
  meta: {
    keywords: ['http', 'header', '头部', '格式化', '解析', 'request', 'response', '请求', '响应'],
    author: 'DevTools Box',
    version: '1.0.0'
  }
};

export default headerFormatter; 
