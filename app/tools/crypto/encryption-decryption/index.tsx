'use client';

import { useState, useEffect } from 'react';
import { FiLock, FiUnlock, FiCopy, FiRefreshCw, FiCheck } from 'react-icons/fi';
import { Tool } from '../../../lib/tools-registry/types';
import { Card, CardHeader, Button, Input } from '../../../components/design-system';
import * as CryptoJS from 'crypto-js';

type AlgorithmType = 'aes' | 'des' | 'tripledes' | 'md5' | 'sha1' | 'sha256' | 'sha512' | 'base64';
type ModeType = 'encrypt' | 'decrypt';

const EncryptionDecryption = () => {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [key, setKey] = useState<string>('secret key 123');
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('aes');
  const [mode, setMode] = useState<ModeType>('encrypt');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // 根据算法和模式处理更新输出
  useEffect(() => {
    if (input.trim()) {
      processData();
    }
  }, [algorithm, mode, input, key]);

  const processData = () => {
    try {
      setError(null);
      if (!input.trim()) {
        setOutput('');
        return;
      }

      // 加密操作
      if (mode === 'encrypt') {
        switch (algorithm) {
          case 'aes':
            setOutput(CryptoJS.AES.encrypt(input, key).toString());
            break;
          case 'des':
            setOutput(CryptoJS.DES.encrypt(input, key).toString());
            break;
          case 'tripledes':
            setOutput(CryptoJS.TripleDES.encrypt(input, key).toString());
            break;
          case 'md5':
            setOutput(CryptoJS.MD5(input).toString());
            break;
          case 'sha1':
            setOutput(CryptoJS.SHA1(input).toString());
            break;
          case 'sha256':
            setOutput(CryptoJS.SHA256(input).toString());
            break;
          case 'sha512':
            setOutput(CryptoJS.SHA512(input).toString());
            break;
          case 'base64':
            setOutput(CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(input)));
            break;
          default:
            throw new Error('不支持的算法');
        }
      }
      // 解密操作
      else {
        try {
          switch (algorithm) {
            case 'aes':
              const aesBytes = CryptoJS.AES.decrypt(input, key);
              setOutput(aesBytes.toString(CryptoJS.enc.Utf8));
              break;
            case 'des':
              const desBytes = CryptoJS.DES.decrypt(input, key);
              setOutput(desBytes.toString(CryptoJS.enc.Utf8));
              break;
            case 'tripledes':
              const tripleDesBytes = CryptoJS.TripleDES.decrypt(input, key);
              setOutput(tripleDesBytes.toString(CryptoJS.enc.Utf8));
              break;
            case 'base64':
              setOutput(CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(input)));
              break;
            default:
              throw new Error('该算法不支持解密');
          }
        } catch (error) {
          throw new Error('解密失败，请检查密钥和密文是否正确');
        }
      }
    } catch (err: any) {
      setError(err.message || '处理失败');
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

  // 是否为单向算法（只能加密，不能解密）
  const isOneWayAlgorithm = ['md5', 'sha1', 'sha256', 'sha512'].includes(algorithm);

  // 确定是否显示密钥输入框
  const showKeyInput = ['aes', 'des', 'tripledes'].includes(algorithm);

  // 设置示例输入
  const setExample = () => {
    setInput('Hello, 这是一个加密解密示例');
    if (showKeyInput) {
      setKey('secret key 123');
    }
  };

  // 生成随机密钥
  const generateRandomKey = () => {
    const randomKey = CryptoJS.lib.WordArray.random(16).toString();
    setKey(randomKey);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader
            icon={mode === 'encrypt' ? <FiLock className="h-6 w-6" /> : <FiUnlock className="h-6 w-6" />}
            title="加密解密工具"
            description="支持多种加密算法，进行文本加密和解密操作"
            gradientColors="from-purple-500 to-blue-600"
          />

          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <div className="font-medium text-gray-700 dark:text-gray-300">操作模式</div>

              <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <Button
                  size="sm"
                  variant={mode === 'encrypt' ? 'primary' : 'outline'}
                  onClick={() => setMode('encrypt')}
                  icon={<FiLock className="h-3.5 w-3.5" />}
                  className="rounded-none"
                >
                  加密
                </Button>
                <Button
                  size="sm"
                  variant={mode === 'decrypt' ? 'primary' : 'outline'}
                  onClick={() => setMode('decrypt')}
                  icon={<FiUnlock className="h-3.5 w-3.5" />}
                  className="rounded-none"
                  disabled={isOneWayAlgorithm}
                >
                  解密
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              {(
                [
                  { id: 'aes', name: 'AES' },
                  { id: 'des', name: 'DES' },
                  { id: 'tripledes', name: '3DES' },
                  { id: 'md5', name: 'MD5' },
                  { id: 'sha1', name: 'SHA-1' },
                  { id: 'sha256', name: 'SHA-256' },
                  { id: 'sha512', name: 'SHA-512' },
                  { id: 'base64', name: 'Base64' },
                ] as { id: AlgorithmType; name: string }[]
              ).map(alg => (
                <Button
                  key={alg.id}
                  size="sm"
                  variant={algorithm === alg.id ? 'primary' : 'outline'}
                  onClick={() => {
                    setAlgorithm(alg.id);
                    // 如果选择了单向算法且当前是解密模式，自动切换到加密模式
                    if (['md5', 'sha1', 'sha256', 'sha512'].includes(alg.id) && mode === 'decrypt') {
                      setMode('encrypt');
                    }
                  }}
                >
                  {alg.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  输入{mode === 'encrypt' ? '明文' : '密文'}
                </label>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={setExample}
                >
                  使用示例
                </Button>
              </div>
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-40 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder={mode === 'encrypt' ? "输入需要加密的内容..." : "输入需要解密的内容..."}
                />
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={clearAll}
                    className="h-8 w-8 p-0"
                  >
                    <FiRefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {showKeyInput && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      密钥
                    </label>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={generateRandomKey}
                    >
                      生成随机密钥
                    </Button>
                  </div>
                  <Input
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="输入加密密钥"
                    gradient
                  />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  输出{mode === 'encrypt' ? '密文' : '明文'}
                </label>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyToClipboard}
                  disabled={!output}
                  icon={copied ? <FiCheck className="h-3.5 w-3.5" /> : <FiCopy className="h-3.5 w-3.5" />}
                >
                  {copied ? '已复制' : '复制'}
                </Button>
              </div>
              <div className="relative">
                <textarea
                  value={output}
                  readOnly
                  className="w-full h-40 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none font-mono text-sm"
                  placeholder={mode === 'encrypt' ? "加密结果将显示在这里..." : "解密结果将显示在这里..."}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              <p className="font-medium">错误:</p>
              <p>{error}</p>
            </div>
          )}

          <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 rounded-xl">
            <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-2">算法说明</h3>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li><span className="font-medium">AES/DES/3DES:</span> 对称加密算法，加密和解密使用相同的密钥</li>
              <li><span className="font-medium">MD5/SHA:</span> 单向散列算法，无法解密，常用于密码存储和校验</li>
              <li><span className="font-medium">Base64:</span> 编码方案，用于将二进制数据转换为ASCII字符串，非加密算法</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

// 工具注册对象
const tool: Tool = {
  id: 'encryption-decryption',
  name: '加密解密',
  description: '支持AES、DES、3DES、MD5、SHA、Base64等多种加密算法',
  category: 'crypto',
  icon: FiLock,
  component: EncryptionDecryption,
  meta: {
    keywords: ['encryption', 'decryption', 'AES', 'DES', '3DES', 'MD5', 'SHA', 'Base64', '加密', '解密', '密码学'],
    examples: [
      'AES加密敏感数据',
      'Base64编码图片内容',
      'MD5生成密码哈希'
    ],
    version: '1.0.0'
  }
};

export default tool; 
