'use client';

import { useState } from 'react';
import { FiCopy, FiTrash2, FiUpload } from 'react-icons/fi';
import { Tool } from '../../../lib/tools-registry/types';
import { FiCode } from 'react-icons/fi';

const JsonFormatter = () => {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [indentSize, setIndentSize] = useState<number>(2);

  const formatJson = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError(null);
        return;
      }

      const parsedJson = JSON.parse(input);
      const formattedJson = JSON.stringify(parsedJson, null, indentSize);
      setOutput(formattedJson);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      setOutput('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const clearInput = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const copyToClipboard = async () => {
    if (output) {
      try {
        await navigator.clipboard.writeText(output);
        alert('已复制到剪贴板');
      } catch (err) {
        console.error('复制失败:', err);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setInput(event.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">JSON 格式化工具</h1>
        <p className="text-gray-600 dark:text-gray-300">格式化和验证JSON数据，使其更易于阅读和调试</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="json-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              JSON 输入
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
                <input type="file" accept=".json,.txt" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </div>
          <textarea
            id="json-input"
            className="w-full h-80 p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white font-mono text-sm"
            value={input}
            onChange={handleInputChange}
            placeholder='在这里粘贴您的JSON，例如: {"name":"DevToolsBox","version":"1.0.0"}'
          ></textarea>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="json-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              格式化结果
            </label>
            {output && (
              <button
                onClick={copyToClipboard}
                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="复制"
              >
                <FiCopy className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="relative h-80">
            <textarea
              id="json-output"
              readOnly
              className={`w-full h-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-mono text-sm ${error
                  ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                  : 'border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                }`}
              value={error ? `错误: ${error}` : output}
              placeholder="格式化的JSON将在这里显示"
            ></textarea>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center">
          <label htmlFor="indent-size" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
            缩进大小:
          </label>
          <select
            id="indent-size"
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            className="mt-1 block w-20 pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value={2}>2</option>
            <option value={4}>4</option>
            <option value={8}>8</option>
          </select>
        </div>

        <button
          onClick={formatJson}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 text-white rounded-md focus:outline-none"
        >
          格式化 JSON
        </button>
      </div>

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">使用提示</h3>
        <ul className="text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
          <li>粘贴原始JSON数据到输入框，然后点击"格式化JSON"按钮</li>
          <li>您可以上传JSON文件进行格式化</li>
          <li>调整缩进大小来适应您的需求</li>
          <li>工具会自动验证JSON格式的正确性，并显示任何格式错误</li>
          <li>格式化后的结果可以一键复制到剪贴板</li>
        </ul>
      </div>
    </div>
  );
};

const tool: Tool = {
  id: 'json-formatter',
  name: 'JSON 格式化',
  description: '格式化和验证JSON数据，使其更易于阅读和调试',
  category: 'text',
  icon: FiCode,
  component: JsonFormatter,
  meta: {
    keywords: ['json', '格式化', '美化', '验证', '缩进'],
    examples: [
      '{"name":"DevToolsBox","version":"1.0.0"}',
      '{"users":[{"id":1,"name":"张三"},{"id":2,"name":"李四"}]}'
    ]
  }
};

export default tool; 
