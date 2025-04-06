'use client';

import { useState } from 'react';
import { FiCode, FiCopy, FiTrash2, FiCheck, FiSliders } from 'react-icons/fi';
import { Tool } from '../../../lib/tools-registry/types';
import { Card, CardHeader, Button, TextArea } from '../../../components/design-system';

interface FormatOptions {
  indentSize: number;
  sortKeys: boolean;
}

const JsonFormatter = () => {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState<FormatOptions>({
    indentSize: 2,
    sortKeys: false,
  });

  const formatJson = () => {
    try {
      setError(null);

      if (!input.trim()) {
        setOutput('');
        return;
      }

      // 解析JSON
      const parsedJson = JSON.parse(input);

      // 如果需要按键排序
      const processedJson = options.sortKeys ? sortObjectKeys(parsedJson) : parsedJson;

      // 格式化输出
      const formatted = JSON.stringify(processedJson, null, options.indentSize);
      setOutput(formatted);
    } catch (err: any) {
      setError(err.message || '无效的JSON格式');
      setOutput('');
    }
  };

  // 递归排序对象键
  const sortObjectKeys = (obj: any): any => {
    if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
      return obj;
    }

    const sortedObj: Record<string, any> = {};
    Object.keys(obj).sort().forEach(key => {
      sortedObj[key] = sortObjectKeys(obj[key]);
    });

    return sortedObj;
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader
            icon={<FiCode className="h-6 w-6" />}
            title="JSON格式化"
            description="格式化JSON字符串，提高可读性"
          />

          <div className="flex flex-col lg:flex-row gap-6">
            {/* 输入区域 */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  JSON输入
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={<FiSliders className="h-4 w-4" />}
                    onClick={() => setOptions({
                      ...options,
                      sortKeys: !options.sortKeys
                    })}
                  >
                    {options.sortKeys ? '取消排序' : '按键排序'}
                  </Button>
                  <select
                    value={options.indentSize}
                    onChange={(e) => setOptions({
                      ...options,
                      indentSize: Number(e.target.value)
                    })}
                    className="text-xs py-1 px-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    <option value="2">缩进: 2空格</option>
                    <option value="4">缩进: 4空格</option>
                    <option value="8">缩进: 8空格</option>
                  </select>
                </div>
              </div>
              <TextArea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='{"example": "粘贴需要格式化的JSON"}'
                className="mb-4"
                gradient
                textareaClassName="h-80 font-mono"
              />
              <div className="flex gap-3">
                <Button
                  onClick={formatJson}
                  gradient
                  icon={<FiCode className="h-4 w-4" />}
                >
                  格式化JSON
                </Button>
                <Button
                  onClick={clearAll}
                  variant="secondary"
                  icon={<FiTrash2 className="h-4 w-4" />}
                >
                  清空
                </Button>
              </div>
            </div>

            {/* 输出区域 */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  格式化结果
                </label>
                {output && (
                  <Button
                    size="sm"
                    variant="outline"
                    icon={copied ? <FiCheck className="h-4 w-4" /> : <FiCopy className="h-4 w-4" />}
                    onClick={copyToClipboard}
                  >
                    {copied ? '已复制' : '复制结果'}
                  </Button>
                )}
              </div>

              {error ? (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm mb-4">
                  <p className="font-medium">错误:</p>
                  <p>{error}</p>
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-xl">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/5 dark:to-teal-900/5 opacity-20 pointer-events-none"></div>
                  <pre className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-x-auto text-sm text-gray-800 dark:text-gray-200 font-mono shadow-inner h-80">
                    {output || <span className="text-gray-400">格式化后的JSON将显示在此处</span>}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const tool: Tool = {
  id: 'json-formatter',
  name: 'JSON格式化',
  description: '格式化JSON字符串，提高可读性和结构清晰度',
  category: 'formatter',
  icon: FiCode,
  component: JsonFormatter,
  meta: {
    keywords: ['json', 'format', 'formatter', 'pretty', 'beautify', '格式化', '美化'],
    examples: [
      '{"name":"John","age":30,"city":"New York"}',
      '[{"id":1,"name":"Product1"},{"id":2,"name":"Product2"}]'
    ],
    version: '1.0.0'
  }
};

export default tool; 
