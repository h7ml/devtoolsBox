'use client';

import { useState, ChangeEvent } from 'react';
import { FiCopy, FiTrash2, FiDownload, FiUpload } from 'react-icons/fi';
import { Tool } from '../../../lib/tools-registry/types';
import { FiCode } from 'react-icons/fi';

const JsonFormatter = () => {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [indentSize, setIndentSize] = useState<number>(2);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);

    if (!value.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      // 解析 JSON 字符串
      const parsedJson = JSON.parse(value);
      // 格式化 JSON 对象
      const formatted = JSON.stringify(parsedJson, null, indentSize);
      setOutput(formatted);
      setError(null);
    } catch (err) {
      setError(`JSON 解析错误: ${(err as Error).message}`);
      setOutput('');
    }
  };

  const handleIndentSizeChange = (size: number) => {
    setIndentSize(size);
    if (input.trim()) {
      try {
        const parsedJson = JSON.parse(input);
        const formatted = JSON.stringify(parsedJson, null, size);
        setOutput(formatted);
        setError(null);
      } catch (err) {
        // 如果之前已经有错误，不需要重新设置错误
        if (!error) {
          setError(`JSON 解析错误: ${(err as Error).message}`);
          setOutput('');
        }
      }
    }
  };

  const handleMinify = () => {
    if (input.trim()) {
      try {
        const parsedJson = JSON.parse(input);
        const minified = JSON.stringify(parsedJson);
        setOutput(minified);
        setError(null);
      } catch (err) {
        setError(`JSON 解析错误: ${(err as Error).message}`);
        setOutput('');
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

  const downloadJson = () => {
    if (!output) return;

    try {
      const blob = new Blob([output], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'formatted.json';
      link.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('下载失败:', err);
      alert('下载失败');
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);

      try {
        const parsedJson = JSON.parse(content);
        const formatted = JSON.stringify(parsedJson, null, indentSize);
        setOutput(formatted);
        setError(null);
      } catch (err) {
        setError(`JSON 解析错误: ${(err as Error).message}`);
        setOutput('');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">JSON 格式化工具</h1>
        <p className="text-gray-600 dark:text-gray-300">
          美化、压缩或验证您的 JSON 数据
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 输入区域 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  输入 JSON
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={clearInput}
                    className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    title="清空"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                  <label className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer" title="上传文件">
                    <FiUpload className="w-4 h-4" />
                    <input
                      type="file"
                      className="hidden"
                      accept=".json,application/json"
                      onChange={handleFileUpload}
                    />
                  </label>
                  <button
                    onClick={() => copyToClipboard(input)}
                    className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    title="复制输入"
                  >
                    <FiCopy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <textarea
                className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                value={input}
                onChange={handleInputChange}
                placeholder='在这里粘贴您的 JSON 数据...\n例如: {"name":"DevToolsBox","version":"1.0.0"}'
              ></textarea>
            </div>

            {/* 输出区域 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  格式化结果
                </label>
                <div className="flex space-x-2">
                  {output && (
                    <button
                      onClick={downloadJson}
                      className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      title="下载 JSON"
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
                  placeholder="格式化后的 JSON 将显示在这里..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden">
              <span className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium">
                缩进大小
              </span>
              {[2, 4, 8].map((size) => (
                <button
                  key={size}
                  onClick={() => handleIndentSizeChange(size)}
                  className={`px-3 py-2 text-sm ${indentSize === size
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>

            <button
              onClick={handleMinify}
              className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              压缩
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">使用说明</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300 list-disc list-inside">
            <li>直接在输入框中粘贴 JSON 数据，或上传 JSON 文件</li>
            <li>可以调整缩进大小，使 JSON 格式更符合您的偏好</li>
            <li>使用"压缩"按钮可以移除所有空格，生成最小化的 JSON</li>
            <li>格式化后的 JSON 可以复制或下载</li>
            <li>工具会自动检查 JSON 格式是否有效，并提示错误信息</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const tool: Tool = {
  id: 'json-formatter',
  name: 'JSON 格式化',
  description: '美化、压缩或验证您的 JSON 数据',
  category: 'json',
  icon: FiCode,
  component: JsonFormatter,
  meta: {
    keywords: ['json', '格式化', '美化', '验证', '压缩'],
    examples: [
      '{"name":"DevToolsBox","version":"1.0.0"}',
      '{"users":[{"id":1,"name":"用户1"},{"id":2,"name":"用户2"}]}'
    ]
  }
};

export default tool; 
