'use client';

import React, { useState, useEffect } from 'react';
import { FiRefreshCw, FiCopy, FiCheck, FiType } from 'react-icons/fi';
import { Card, CardHeader, CardContent } from '../../../components/design-system/Card';
import Button from '../../../components/design-system/Button';
import { AnimatePresence, motion } from 'framer-motion';

// 编码/解码方法
type EncodingMethod = 'url' | 'base64' | 'html' | 'unicode' | 'morse';

// 支持的默认编码方法列表
const ENCODING_METHODS: Array<{ id: EncodingMethod; name: string; description: string }> = [
  { id: 'url', name: 'URL编码', description: '转换URL中的特殊字符，如空格转为%20' },
  { id: 'base64', name: 'Base64', description: '将二进制数据编码为ASCII字符串' },
  { id: 'html', name: 'HTML实体', description: '将HTML特殊字符替换为实体，如&lt;代替<' },
  { id: 'unicode', name: 'Unicode转义', description: '将字符转换为Unicode转义序列，如\u4F60\u597D' },
  { id: 'morse', name: '摩尔斯电码', description: '将文本转换为点和短划线' },
];

// 示例文本
const EXAMPLE_TEXT: Record<EncodingMethod, { encoded: string; decoded: string }> = {
  url: {
    encoded: 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3D%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C',
    decoded: 'https://example.com/search?q=你好世界'
  },
  base64: {
    encoded: '5L2g5aW95LiW55WM',
    decoded: '你好世界'
  },
  html: {
    encoded: '&lt;div&gt;Hello &amp; Welcome&lt;/div&gt;',
    decoded: '<div>Hello & Welcome</div>'
  },
  unicode: {
    encoded: '\\u4F60\\u597D\\u4E16\\u754C',
    decoded: '你好世界'
  },
  morse: {
    encoded: '.... . .-.. .-.. --- / .-- --- .-. .-.. -..',
    decoded: 'hello world'
  }
};

// 摩尔斯电码映射表
const MORSE_CODE_MAP: Record<string, string> = {
  'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.',
  'g': '--.', 'h': '....', 'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..',
  'm': '--', 'n': '-.', 'o': '---', 'p': '.--.', 'q': '--.-', 'r': '.-.',
  's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
  'y': '-.--', 'z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
  '"': '.-..-.', '$': '...-..-', '@': '.--.-.', ' ': '/'
};

// 反向摩尔斯电码映射表
const REVERSE_MORSE_CODE_MAP: Record<string, string> = Object.entries(MORSE_CODE_MAP)
  .reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {} as Record<string, string>);

const TextDecoderComponent = () => {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [mode, setMode] = useState<'encode' | 'decode'>('decode');
  const [method, setMethod] = useState<EncodingMethod>('url');

  // 当编码方法或模式改变时，设置示例文本
  useEffect(() => {
    const exampleText = EXAMPLE_TEXT[method];
    if (exampleText) {
      if (mode === 'decode') {
        setInput(exampleText.encoded);
        setOutput(exampleText.decoded);
      } else {
        setInput(exampleText.decoded);
        setOutput(exampleText.encoded);
      }
    }
  }, [method, mode]);

  // 处理方法变更
  const handleMethodChange = (newMethod: EncodingMethod) => {
    setMethod(newMethod);
    setError(null);
  };

  // 处理模式变更
  const handleModeChange = (newMode: 'encode' | 'decode') => {
    setMode(newMode);
    // 交换输入和输出
    setInput(output);
    setOutput(input);
    setError(null);
  };

  // URL编码/解码
  const handleUrlEncodeDecode = () => {
    try {
      if (mode === 'encode') {
        // URL编码（保留中文显示）
        setOutput(encodeURI(input));
      } else {
        // URL解码
        setOutput(decodeURI(input));
      }
    } catch (e) {
      setError(`URL ${mode === 'encode' ? '编码' : '解码'}错误: ${e.message}`);
    }
  };

  // Base64编码/解码
  const handleBase64EncodeDecode = () => {
    try {
      if (mode === 'encode') {
        // Base64编码
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        // Base64解码
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch (e) {
      setError(`Base64 ${mode === 'encode' ? '编码' : '解码'}错误: ${e.message}`);
    }
  };

  // HTML实体编码/解码
  const handleHtmlEncodeDecode = () => {
    try {
      if (mode === 'encode') {
        // HTML实体编码
        const el = document.createElement('div');
        el.textContent = input;
        setOutput(el.innerHTML);
      } else {
        // HTML实体解码
        const el = document.createElement('div');
        el.innerHTML = input;
        setOutput(el.textContent || '');
      }
    } catch (e) {
      setError(`HTML实体 ${mode === 'encode' ? '编码' : '解码'}错误: ${e.message}`);
    }
  };

  // Unicode转义编码/解码
  const handleUnicodeEncodeDecode = () => {
    try {
      if (mode === 'encode') {
        // Unicode转义编码
        const result = Array.from(input)
          .map(char => {
            const code = char.charCodeAt(0);
            return code > 127 ? `\\u${code.toString(16).padStart(4, '0').toUpperCase()}` : char;
          })
          .join('');
        setOutput(result);
      } else {
        // Unicode转义解码
        const result = input.replace(/\\u([0-9a-f]{4})/gi, (_, code) => {
          return String.fromCharCode(parseInt(code, 16));
        });
        setOutput(result);
      }
    } catch (e) {
      setError(`Unicode ${mode === 'encode' ? '编码' : '解码'}错误: ${e.message}`);
    }
  };

  // 摩尔斯电码编码/解码
  const handleMorseEncodeDecode = () => {
    try {
      if (mode === 'encode') {
        // 摩尔斯电码编码
        const result = input.toLowerCase().split('').map(char => {
          return MORSE_CODE_MAP[char] || char;
        }).join(' ');
        setOutput(result);
      } else {
        // 摩尔斯电码解码
        const words = input.trim().split(' / ');
        const result = words.map(word => {
          return word.split(' ').map(char => {
            return REVERSE_MORSE_CODE_MAP[char] || char;
          }).join('');
        }).join(' ');
        setOutput(result);
      }
    } catch (e) {
      setError(`摩尔斯电码 ${mode === 'encode' ? '编码' : '解码'}错误: ${e.message}`);
    }
  };

  // 处理编码/解码
  const handleProcess = () => {
    setError(null);

    switch (method) {
      case 'url':
        handleUrlEncodeDecode();
        break;
      case 'base64':
        handleBase64EncodeDecode();
        break;
      case 'html':
        handleHtmlEncodeDecode();
        break;
      case 'unicode':
        handleUnicodeEncodeDecode();
        break;
      case 'morse':
        handleMorseEncodeDecode();
        break;
      default:
        setError('不支持的编码方法');
    }
  };

  // 复制结果到剪贴板
  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 清空输入和输出
  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  // 交换输入和输出
  const handleSwap = () => {
    const temp = input;
    setInput(output);
    setOutput(temp);
  };

  return (
    <Card className="w-full">
      <CardHeader
        icon={<FiType className="h-6 w-6" />}
        title="文本编码解码工具"
        description="支持多种编码方式的文本转换"
        gradientColors="from-cyan-500 to-cyan-600"
      />
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
          <div className="lg:col-span-4 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {mode === 'decode' ? '编码文本' : '原始文本'}
                </label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<FiRefreshCw className="h-4 w-4" />}
                    onClick={handleProcess}
                  >
                    {mode === 'decode' ? '解码' : '编码'}
                  </Button>
                </div>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                          font-mono text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder={mode === 'decode' ? '输入需要解码的文本...' : '输入需要编码的文本...'}
              />
            </div>

            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSwap}
                className="rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v8a1 1 0 11-2 0V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                交换
              </Button>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {mode === 'decode' ? '解码结果' : '编码结果'}
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={copied ? <FiCheck className="h-4 w-4" /> : <FiCopy className="h-4 w-4" />}
                  onClick={handleCopy}
                  disabled={!output}
                >
                  {copied ? '已复制' : '复制'}
                </Button>
              </div>
              <textarea
                value={output}
                readOnly
                className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                          bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100
                          font-mono text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder={mode === 'decode' ? '解码结果将显示在这里...' : '编码结果将显示在这里...'}
              />
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">选项</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                  模式
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      className="mr-2 text-cyan-500 focus:ring-cyan-500"
                      checked={mode === 'decode'}
                      onChange={() => handleModeChange('decode')}
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">解码</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      className="mr-2 text-cyan-500 focus:ring-cyan-500"
                      checked={mode === 'encode'}
                      onChange={() => handleModeChange('encode')}
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">编码</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                  编码方式
                </label>
                <div className="space-y-2">
                  {ENCODING_METHODS.map((encodingMethod) => (
                    <label key={encodingMethod.id} className="flex items-center">
                      <input
                        type="radio"
                        className="mr-2 text-cyan-500 focus:ring-cyan-500"
                        checked={method === encodingMethod.id}
                        onChange={() => handleMethodChange(encodingMethod.id)}
                      />
                      <span className="text-xs text-gray-600 dark:text-gray-400">{encodingMethod.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="w-full border border-gray-300 dark:border-gray-600"
                onClick={handleClear}
              >
                清空输入
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="text-sm text-gray-600 dark:text-gray-400 mt-4">
          <h4 className="font-medium mb-1">当前编码方式说明：</h4>
          <p>{ENCODING_METHODS.find(m => m.id === method)?.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// 工具元数据
const textDecoder = {
  id: 'text-decoder',
  name: '文本编码解码工具',
  description: '支持多种编码方式的文本转换',
  category: 'text',
  icon: FiType,
  component: TextDecoderComponent,
  meta: {
    keywords: ['编码', '解码', 'encode', 'decode', 'base64', 'url', 'unicode', 'html', 'morse', '摩尔斯电码'],
    author: 'DevTools Box',
    version: '1.0.0'
  }
};

export default textDecoder; 
