'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { FiCopy, FiTrash2, FiUpload, FiDownload, FiRotateCcw, FiFile } from 'react-icons/fi';
import { Tool } from '../../../lib/tools-registry/types';
import { FiType } from 'react-icons/fi';

const Base64Tool = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isFile, setIsFile] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setIsFile(false);
    setFileName('');
    setFileType('');
    setFileSize(0);
    if (mode === 'encode') {
      encodeToBase64(e.target.value, false);
    } else {
      decodeFromBase64(e.target.value);
    }
  };

  const encodeToBase64 = (text: string, isFileData = false) => {
    try {
      setError(null);
      if (!text.trim() && !isFileData) {
        setOutput('');
        return;
      }

      const base64String = isFileData
        ? text // 如果是文件数据，传入的text已经是Base64格式
        : btoa(unescape(encodeURIComponent(text)));

      setOutput(base64String);
    } catch (err) {
      setError(`编码错误: ${(err as Error).message}`);
      setOutput('');
    }
  };

  const decodeFromBase64 = (base64String: string) => {
    try {
      setError(null);
      if (!base64String.trim()) {
        setOutput('');
        return;
      }

      // 检查是否是有效的Base64字符串
      if (!/^[A-Za-z0-9+/=]+$/.test(base64String.trim())) {
        throw new Error('无效的Base64字符串');
      }

      const decoded = decodeURIComponent(escape(atob(base64String.trim())));
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

    if (isFile && newMode === 'decode') {
      // 如果是文件并且切换到解码模式，清除文件信息
      setIsFile(false);
      setFileName('');
      setFileType('');
      setFileSize(0);
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileType(file.type || '未知类型');
    setFileSize(file.size);
    setIsFile(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        // 文件读取为Base64
        const base64String = (event.target.result as string).split(',')[1];
        setInput(file.name); // 显示文件名称而不是Base64内容
        encodeToBase64(base64String, true);
      }
    };
    reader.readAsDataURL(file);
  };

  const clearInput = () => {
    setInput('');
    setOutput('');
    setError(null);
    setIsFile(false);
    setFileName('');
    setFileType('');
    setFileSize(0);

    // 清除文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

  const downloadBase64 = () => {
    if (!output || mode !== 'encode') return;

    try {
      // 创建一个下载链接
      const link = document.createElement('a');
      link.href = `data:application/octet-stream;base64,${output}`;
      link.download = fileName || 'download.txt';
      link.click();
    } catch (err) {
      console.error('下载失败:', err);
      alert('下载失败');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Base64 编解码工具</h1>
        <p className="text-gray-600 dark:text-gray-300">
          将文本或文件编码为Base64格式，或将Base64字符串解码为文本
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 输入区域 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {mode === 'encode' ? '待编码内容' : 'Base64字符串'}
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={clearInput}
                    className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    title="清空"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                  {mode === 'encode' && (
                    <label className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer" title="上传文件">
                      <FiUpload className="w-4 h-4" />
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                  )}
                  <button
                    onClick={() => copyToClipboard(input)}
                    className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    title="复制输入"
                  >
                    <FiCopy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isFile && mode === 'encode' ? (
                <div className="border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-gray-50 dark:bg-gray-700/50 h-64 flex flex-col items-center justify-center">
                  <FiFile className="w-12 h-12 text-blue-500 mb-3" />
                  <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">{fileName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{fileType}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {fileSize < 1024
                      ? `${fileSize} B`
                      : fileSize < 1048576
                        ? `${(fileSize / 1024).toFixed(2)} KB`
                        : `${(fileSize / 1048576).toFixed(2)} MB`}
                  </p>
                </div>
              ) : (
                <textarea
                  className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  value={input}
                  onChange={handleInputChange}
                  placeholder={mode === 'encode'
                    ? '在这里输入要编码的文本...'
                    : '在这里粘贴Base64字符串进行解码...'}
                ></textarea>
              )}
            </div>

            {/* 输出区域 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {mode === 'encode' ? 'Base64结果' : '解码结果'}
                </label>
                <div className="flex space-x-2">
                  {mode === 'encode' && output && (
                    <button
                      onClick={downloadBase64}
                      className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      title="下载"
                    >
                      <FiDownload className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => copyToClipboard(output)}
                    className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    title="复制结果"
                  >
                    <FiCopy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="relative h-64">
                <textarea
                  readOnly
                  className={`w-full h-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white ${error
                    ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : 'border-gray-300 dark:border-gray-600'
                    }`}
                  value={error ? error : output}
                  placeholder={mode === 'encode'
                    ? 'Base64编码结果将显示在这里...'
                    : '解码结果将显示在这里...'}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">使用说明</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300 list-disc list-inside">
            <li>在编码模式下，可以上传文件或直接输入文本进行Base64编码</li>
            <li>在解码模式下，粘贴Base64字符串可解码为原始文本</li>
            <li>编码后的内容可以复制或下载为文件</li>
            <li>点击"编码"和"解码"标签可以在两种模式之间切换</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const tool: Tool = {
  id: 'base64',
  name: 'Base64 编解码',
  description: '将文本或文件编码为Base64格式，或将Base64字符串解码为原始文本',
  category: 'text',
  icon: FiType,
  component: Base64Tool,
  meta: {
    keywords: ['base64', '编码', '解码', '文件编码', '文本转换'],
    examples: [
      '{"name":"DevToolsBox"}',
      'https://example.com?param=value'
    ]
  }
};

export default tool; 
