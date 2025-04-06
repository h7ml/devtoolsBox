'use client';

import { useState, ChangeEvent } from 'react';
import { FiCopy, FiTrash2, FiRotateCcw } from 'react-icons/fi';
import { Tool } from '../../../lib/tools-registry/types';
import { FiLink } from 'react-icons/fi';

const UrlEncoder = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [encodingType, setEncodingType] = useState<'standard' | 'component' | 'all'>('standard');

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (mode === 'encode') {
      encodeUrl(e.target.value);
    } else {
      decodeUrl(e.target.value);
    }
  };

  const encodeUrl = (text: string) => {
    try {
      setError(null);
      if (!text.trim()) {
        setOutput('');
        return;
      }

      let encoded = '';
      switch (encodingType) {
        case 'standard':
          encoded = encodeURIComponent(text);
          break;
        case 'component':
          encoded = encodeURI(text);
          break;
        case 'all':
          // 自定义编码，包括所有字符
          encoded = [...text]
            .map(char => {
              if (/[a-zA-Z0-9\-_.!~*'()]/.test(char)) {
                return char;
              }
              return [...new TextEncoder().encode(char)]
                .map(byte => '%' + byte.toString(16).toUpperCase().padStart(2, '0'))
                .join('');
            })
            .join('');
          break;
      }
      setOutput(encoded);
    } catch (err) {
      setError(`编码错误: ${(err as Error).message}`);
      setOutput('');
    }
  };

  const decodeUrl = (encoded: string) => {
    try {
      setError(null);
      if (!encoded.trim()) {
        setOutput('');
        return;
      }

      let decoded = '';
      switch (encodingType) {
        case 'standard':
          decoded = decodeURIComponent(encoded);
          break;
        case 'component':
          decoded = decodeURI(encoded);
          break;
        case 'all':
          // 尝试通用解码
          try {
            decoded = decodeURIComponent(encoded);
          } catch (e) {
            // 容错处理: 如果URI解码失败，尝试手动解码
            decoded = encoded.replace(/%([0-9A-Fa-f]{2})/g, (_, p1) =>
              String.fromCharCode(parseInt(p1, 16))
            );
          }
          break;
      }
      setOutput(decoded);
    } catch (err) {
      setError(`解码错误: ${(err as Error).message}`);
      setOutput('');
    }
  };

  const handleModeChange = (newMode: 'encode' | 'decode') => {
    setMode(newMode);
    setError(null);

    // 切换模式时交换输入和输出
    const temp = input;
    setInput(output);
    setOutput(temp);
  };

  const handleEncodingTypeChange = (type: 'standard' | 'component' | 'all') => {
    setEncodingType(type);
    // 使用新的编码类型重新处理当前输入
    if (input) {
      if (mode === 'encode') {
        encodeUrl(input);
      } else {
        decodeUrl(input);
      }
    }
  };

  const clearInput = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const copyToClipboard = async (text: string) => {
    if (text) {
      try {
        await navigator.clipboard.writeText(text);
        alert('已复制到剪贴板');
      } catch (err) {
        console.error('复制失败:', err);
        alert('复制失败');
      }
    }
  };

  const swapInputOutput = () => {
    const temp = input;
    setInput(output);
    setOutput(temp);
    // 重新处理
    if (mode === 'encode') {
      encodeUrl(output);
    } else {
      decodeUrl(output);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">URL 编解码工具</h1>
        <p className="text-gray-600 dark:text-gray-300">
          对URL进行编码和解码，支持多种编码方法
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`flex-1 px-4 py-3 text-center text-sm font-medium ${mode === 'encode'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-b-2 border-blue-500'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            onClick={() => handleModeChange('encode')}
          >
            编码
          </button>
          <button
            className={`flex-1 px-4 py-3 text-center text-sm font-medium ${mode === 'decode'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-b-2 border-blue-500'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            onClick={() => handleModeChange('decode')}
          >
            解码
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              编码类型
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1.5 text-sm rounded-md ${encodingType === 'standard'
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                onClick={() => handleEncodingTypeChange('standard')}
                title="编码所有特殊字符，适用于URL参数值"
              >
                标准 (encodeURIComponent)
              </button>
              <button
                className={`px-3 py-1.5 text-sm rounded-md ${encodingType === 'component'
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                onClick={() => handleEncodingTypeChange('component')}
                title="保留URL有效字符，适用于完整URL"
              >
                URL组件 (encodeURI)
              </button>
              <button
                className={`px-3 py-1.5 text-sm rounded-md ${encodingType === 'all'
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                onClick={() => handleEncodingTypeChange('all')}
                title="编码所有非ASCII字符"
              >
                全部字符
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 输入区域 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {mode === 'encode' ? '待编码内容' : '已编码URL'}
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={clearInput}
                    className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    title="清空"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <textarea
                value={input}
                onChange={handleInputChange}
                className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder={mode === 'encode' ? '输入需要URL编码的文本' : '输入需要解码的URL编码文本'}
              />
            </div>

            {/* 输出区域 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {mode === 'encode' ? '已编码URL' : '解码结果'}
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => copyToClipboard(output)}
                    className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    title="复制到剪贴板"
                    disabled={!output}
                  >
                    <FiCopy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={swapInputOutput}
                    className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    title="交换输入输出"
                    disabled={!output}
                  >
                    <FiRotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <textarea
                value={output}
                readOnly
                className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 dark:text-white"
                placeholder={mode === 'encode' ? 'URL编码结果将显示在这里' : 'URL解码结果将显示在这里'}
              />
              {error && (
                <div className="text-red-500 text-sm mt-2">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">URL编码说明</h2>
        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
          <p>URL编码(Percent-encoding)将特殊字符转换为%后跟两位十六进制数，使URL可以安全传输。</p>
          <p><strong>编码类型说明：</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>标准 (encodeURIComponent)</strong>：编码除了字母、数字、(、)、.、!、~、*、'、-和_之外的所有字符，适用于URL参数值
            </li>
            <li>
              <strong>URL组件 (encodeURI)</strong>：保留URL特殊字符(:、/、&等)，适用于编码完整URL
            </li>
            <li>
              <strong>全部字符</strong>：对所有非ASCII字符进行编码，包括中文等Unicode字符
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const tool: Tool = {
  id: 'url-encoder',
  name: 'URL 编解码',
  description: '对URL进行编码和解码，支持多种编码方法',
  category: 'text',
  icon: FiLink,
  component: UrlEncoder,
  meta: {
    keywords: ['url', '编码', '解码', 'encode', 'decode', '转换', 'percent-encoding'],
    examples: [
      'https://example.com?param=测试',
      'https://example.com?name=John Doe&age=25'
    ]
  }
};

export default tool;
