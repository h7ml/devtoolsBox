'use client';

import { useState, useEffect } from 'react';
import { FiLink, FiCopy, FiCheck, FiRefreshCw, FiArrowRight } from 'react-icons/fi';
import { Tool } from '../../../lib/tools-registry/types';
import { Card, CardHeader, Button, Input } from '../../../components/design-system';

type ModeType = 'encode' | 'decode';

const UrlCodec = () => {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [mode, setMode] = useState<ModeType>('encode');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // 自动处理输入
  useEffect(() => {
    if (input) {
      processInput();
    } else {
      setOutput('');
      setError(null);
    }
  }, [input, mode]);

  const processInput = () => {
    try {
      setError(null);

      if (!input.trim()) {
        setOutput('');
        return;
      }

      if (mode === 'encode') {
        // URL编码
        setOutput(encodeURIComponent(input));
      } else {
        // URL解码
        setOutput(decodeURIComponent(input));
      }
    } catch (err: any) {
      setError(`${mode === 'decode' ? '解码' : '编码'}错误: ${err.message}`);
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const swapInputOutput = () => {
    setInput(output);
    // 模式将在useEffect中自动处理
  };

  // 执行示例
  const setExample = () => {
    if (mode === 'encode') {
      setInput('https://example.com/path?query=测试&param=value 123');
    } else {
      setInput('https%3A%2F%2Fexample.com%2Fpath%3Fquery%3D%E6%B5%8B%E8%AF%95%26param%3Dvalue%20123');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader
            icon={<FiLink className="h-6 w-6" />}
            title="URL编码解码"
            description="对URL进行编码和解码，支持特殊字符和中文"
            gradientColors="from-green-500 to-emerald-600"
          />

          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <div className="font-medium text-gray-700 dark:text-gray-300">操作模式</div>

              <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <Button
                  size="sm"
                  variant={mode === 'encode' ? 'primary' : 'outline'}
                  onClick={() => setMode('encode')}
                  className="rounded-none"
                >
                  编码
                </Button>
                <Button
                  size="sm"
                  variant={mode === 'decode' ? 'primary' : 'outline'}
                  onClick={() => setMode('decode')}
                  className="rounded-none"
                >
                  解码
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 输入区域 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {mode === 'encode' ? '输入原始URL' : '输入编码后URL'}
                </label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={setExample}
                  >
                    使用示例
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={clearAll}
                    icon={<FiRefreshCw className="h-3.5 w-3.5" />}
                  >
                    清空
                  </Button>
                </div>
              </div>
              <div className="mb-4">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-40 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder={mode === 'encode'
                    ? "输入需要编码的URL或文本..."
                    : "输入需要解码的URL或文本..."
                  }
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                  <p className="font-medium">{error}</p>
                </div>
              )}
            </div>

            {/* 输出区域 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {mode === 'encode' ? '编码结果' : '解码结果'}
                </label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyToClipboard}
                    disabled={!output}
                    icon={copied ? <FiCheck className="h-3.5 w-3.5" /> : <FiCopy className="h-3.5 w-3.5" />}
                  >
                    {copied ? '已复制' : '复制'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={swapInputOutput}
                    disabled={!output}
                    icon={<FiArrowRight className="h-3.5 w-3.5 rotate-180" />}
                  >
                    互换
                  </Button>
                </div>
              </div>
              <div className="relative">
                <textarea
                  value={output}
                  readOnly
                  className="w-full h-40 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm resize-none"
                  placeholder={mode === 'encode' ? "编码结果将显示在这里..." : "解码结果将显示在这里..."}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl">
            <h3 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">URL编码说明</h3>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
              <p>• URL编码将特殊字符转换为可在URL中安全传输的格式</p>
              <p>• 空格会被转换为 <code className="bg-white dark:bg-gray-800 px-1 py-0.5 rounded text-emerald-600 dark:text-emerald-400">%20</code></p>
              <p>• 中文和其他非ASCII字符会被转换为UTF-8格式的百分比编码</p>
              <p>• 编码常用于URL参数、表单提交和API调用中</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">空格:</span>
                <span className="ml-2 font-mono text-emerald-600 dark:text-emerald-400">%20</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">+:</span>
                <span className="ml-2 font-mono text-emerald-600 dark:text-emerald-400">%2B</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">/:</span>
                <span className="ml-2 font-mono text-emerald-600 dark:text-emerald-400">%2F</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">?:</span>
                <span className="ml-2 font-mono text-emerald-600 dark:text-emerald-400">%3F</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const tool: Tool = {
  id: 'url-codec',
  name: 'URL编码解码',
  description: '对URL进行编码和解码，支持特殊字符和中文',
  category: 'encoding',
  icon: FiLink,
  component: UrlCodec,
  meta: {
    keywords: ['url', 'encode', 'decode', 'urlencode', 'urldecode', 'URL编码', 'URL解码', '百分比编码'],
    examples: [
      'https://example.com/path?query=测试&param=value 123',
      'https%3A%2F%2Fexample.com%2Fpath%3Fquery%3D%E6%B5%8B%E8%AF%95%26param%3Dvalue%20123'
    ],
    version: '1.0.0'
  }
};

export default tool; 
