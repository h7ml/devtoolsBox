'use client';

import React, { useState } from 'react';
import { FiBook, FiCopy, FiCheck, FiRefreshCw, FiUpload } from 'react-icons/fi';
import { Card, CardHeader, CardContent } from '../../../components/design-system/Card';
import Button from '../../../components/design-system/Button';
import { toast } from 'sonner';

// 字典格式化选项
type FormatOption = 'pretty' | 'compact' | 'python' | 'js' | 'php' | 'yaml';

// 支持的字典格式
const FORMAT_OPTIONS: { id: FormatOption; name: string }[] = [
  { id: 'pretty', name: '美化JSON' },
  { id: 'compact', name: '紧凑JSON' },
  { id: 'python', name: 'Python字典' },
  { id: 'js', name: 'JavaScript对象' },
  { id: 'php', name: 'PHP数组' },
  { id: 'yaml', name: 'YAML' },
];

// 示例字典数据
const EXAMPLE_DICT = {
  name: '开发工具箱',
  version: '1.0.0',
  features: ['格式化', '转换', '编码', '解码'],
  settings: {
    theme: 'dark',
    language: 'zh-CN',
    autoSave: true
  },
  stats: {
    users: 1000,
    tools: 20,
    rating: 4.8
  }
};

// 字典格式器组件
const DictFormatterComponent: React.FC = () => {
  const [input, setInput] = useState<string>(JSON.stringify(EXAMPLE_DICT, null, 2));
  const [output, setOutput] = useState<string>('');
  const [format, setFormat] = useState<FormatOption>('pretty');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [indentLevel, setIndentLevel] = useState<number>(2);

  // 解析输入的字典字符串为对象
  const parseInputDict = (): any => {
    try {
      // 尝试作为JSON解析
      return JSON.parse(input);
    } catch (jsonError) {
      try {
        // 尝试作为JavaScript对象解析
        // 注意：在生产环境中使用eval是有风险的，这里仅作为示例
        // eslint-disable-next-line no-eval
        const obj = eval(`(${input})`);
        return obj;
      } catch (jsError) {
        throw new Error('无法解析输入为有效的字典/对象');
      }
    }
  };

  // 格式化字典
  const formatDict = () => {
    setError(null);
    try {
      const dictObj = parseInputDict();

      switch (format) {
        case 'pretty':
          setOutput(JSON.stringify(dictObj, null, indentLevel));
          break;
        case 'compact':
          setOutput(JSON.stringify(dictObj));
          break;
        case 'python':
          setOutput(toPythonDict(dictObj));
          break;
        case 'js':
          setOutput(toJavaScriptObject(dictObj));
          break;
        case 'php':
          setOutput(toPhpArray(dictObj));
          break;
        case 'yaml':
          setOutput(toYaml(dictObj));
          break;
        default:
          setOutput(JSON.stringify(dictObj, null, indentLevel));
      }
    } catch (e) {
      setError(`格式化错误: ${e.message}`);
    }
  };

  // 转换为Python字典
  const toPythonDict = (obj: any, indent = 0): string => {
    const indentStr = ' '.repeat(indent);
    const indentNext = ' '.repeat(indent + indentLevel);

    if (obj === null) return 'None';
    if (typeof obj === 'boolean') return obj ? 'True' : 'False';
    if (typeof obj === 'number') return obj.toString();
    if (typeof obj === 'string') return `'${obj.replace(/'/g, "\\'")}'`;

    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';

      const items = obj.map(item => toPythonDict(item, indent + indentLevel)).join(', ');

      // 单行数组
      if (items.length < 60 && !items.includes('\n')) {
        return `[${items}]`;
      }

      // 多行数组
      return `[\n${indentNext}${obj.map(item => toPythonDict(item, indent + indentLevel)).join(`,\n${indentNext}`)}\n${indentStr}]`;
    }

    if (typeof obj === 'object') {
      const keys = Object.keys(obj);
      if (keys.length === 0) return '{}';

      const entries = keys.map(key => {
        const value = toPythonDict(obj[key], indent + indentLevel);
        const keyStr = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key) ? key : `'${key.replace(/'/g, "\\'")}'`;
        return `${keyStr}: ${value}`;
      });

      // 单行字典
      if (entries.join(', ').length < 60 && !entries.join(', ').includes('\n')) {
        return `{${entries.join(', ')}}`;
      }

      // 多行字典
      return `{\n${indentNext}${entries.join(`,\n${indentNext}`)}\n${indentStr}}`;
    }

    return String(obj);
  };

  // 转换为JavaScript对象
  const toJavaScriptObject = (obj: any, indent = 0): string => {
    const indentStr = ' '.repeat(indent);
    const indentNext = ' '.repeat(indent + indentLevel);

    if (obj === null) return 'null';
    if (typeof obj === 'boolean') return obj.toString();
    if (typeof obj === 'number') return obj.toString();
    if (typeof obj === 'string') return `"${obj.replace(/"/g, '\\"')}"`;

    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';

      const items = obj.map(item => toJavaScriptObject(item, indent + indentLevel)).join(', ');

      // 单行数组
      if (items.length < 60 && !items.includes('\n')) {
        return `[${items}]`;
      }

      // 多行数组
      return `[\n${indentNext}${obj.map(item => toJavaScriptObject(item, indent + indentLevel)).join(`,\n${indentNext}`)}\n${indentStr}]`;
    }

    if (typeof obj === 'object') {
      const keys = Object.keys(obj);
      if (keys.length === 0) return '{}';

      const entries = keys.map(key => {
        const value = toJavaScriptObject(obj[key], indent + indentLevel);
        const keyStr = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key.replace(/"/g, '\\"')}"`;
        return `${keyStr}: ${value}`;
      });

      // 单行对象
      if (entries.join(', ').length < 60 && !entries.join(', ').includes('\n')) {
        return `{${entries.join(', ')}}`;
      }

      // 多行对象
      return `{\n${indentNext}${entries.join(`,\n${indentNext}`)}\n${indentStr}}`;
    }

    return String(obj);
  };

  // 转换为PHP数组
  const toPhpArray = (obj: any, indent = 0): string => {
    const indentStr = ' '.repeat(indent);
    const indentNext = ' '.repeat(indent + indentLevel);

    if (obj === null) return 'null';
    if (typeof obj === 'boolean') return obj ? 'true' : 'false';
    if (typeof obj === 'number') return obj.toString();
    if (typeof obj === 'string') return `'${obj.replace(/'/g, "\\'")}'`;

    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';

      const items = obj.map(item => toPhpArray(item, indent + indentLevel)).join(', ');

      // 单行数组
      if (items.length < 60 && !items.includes('\n')) {
        return `[${items}]`;
      }

      // 多行数组
      return `[\n${indentNext}${obj.map(item => toPhpArray(item, indent + indentLevel)).join(`,\n${indentNext}`)}\n${indentStr}]`;
    }

    if (typeof obj === 'object') {
      const keys = Object.keys(obj);
      if (keys.length === 0) return '[]';

      const entries = keys.map(key => {
        const value = toPhpArray(obj[key], indent + indentLevel);
        return `'${key.replace(/'/g, "\\'")}' => ${value}`;
      });

      // 单行数组
      if (entries.join(', ').length < 60 && !entries.join(', ').includes('\n')) {
        return `[${entries.join(', ')}]`;
      }

      // 多行数组
      return `[\n${indentNext}${entries.join(`,\n${indentNext}`)}\n${indentStr}]`;
    }

    return String(obj);
  };

  // 转换为YAML
  const toYaml = (obj: any, indent = 0): string => {
    const indentStr = ' '.repeat(indent);

    if (obj === null) return 'null';
    if (typeof obj === 'boolean') return obj ? 'true' : 'false';
    if (typeof obj === 'number') return obj.toString();
    if (typeof obj === 'string') {
      // 如果包含特殊字符则用引号包围
      if (/[:#\[\]{},-]/.test(obj) || obj === '') {
        return `"${obj.replace(/"/g, '\\"')}"`;
      }
      return obj;
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';

      return obj.map(item => {
        if (typeof item === 'object' && item !== null) {
          return `${indentStr}- ${toYaml(item, indent + 2).trimStart()}`;
        }
        return `${indentStr}- ${toYaml(item, 0)}`;
      }).join('\n');
    }

    if (typeof obj === 'object') {
      const keys = Object.keys(obj);
      if (keys.length === 0) return '{}';

      return keys.map(key => {
        const value = obj[key];
        if (typeof value === 'object' && value !== null) {
          return `${indentStr}${key}:\n${toYaml(value, indent + 2)}`;
        }
        return `${indentStr}${key}: ${toYaml(value, 0)}`;
      }).join('\n');
    }

    return String(obj);
  };

  // 复制格式化后的内容
  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('已复制到剪贴板');
  };

  // 从文件加载
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInput(content);
    };
    reader.readAsText(file);
  };

  // 处理格式变更
  const handleFormatChange = (newFormat: FormatOption) => {
    setFormat(newFormat);
  };

  // 格式化输入
  const formatInput = () => {
    try {
      const parsed = parseInputDict();
      setInput(JSON.stringify(parsed, null, indentLevel));
    } catch (e) {
      setError(`输入格式化错误: ${e.message}`);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader
        icon={<FiBook className="h-6 w-6" />}
        title="字典/对象格式化工具"
        description="将字典/对象转换为不同格式，支持JSON、Python、JavaScript、PHP和YAML"
        gradientColors="from-violet-500 to-violet-600"
      />
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div className="md:col-span-3 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  字典/对象数据 (JSON, 字典, 对象)
                </label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<FiRefreshCw className="h-4 w-4" />}
                    onClick={formatInput}
                  >
                    格式化输入
                  </Button>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".json,.txt,.js,.py,.php,.yaml,.yml"
                      id="fileUpload"
                      className="sr-only"
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="fileUpload">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<FiUpload className="h-4 w-4" />}
                        as="span"
                      >
                        从文件加载
                      </Button>
                    </label>
                  </div>
                </div>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         font-mono text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                placeholder="输入字典/对象数据..."
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  格式化结果
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
                         bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100
                         font-mono text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                placeholder="格式化结果将显示在这里..."
              />
            </div>
          </div>

          <div className="md:col-span-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">格式化选项</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                  输出格式
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FORMAT_OPTIONS.map((option) => (
                    <label
                      key={option.id}
                      className={`
                        flex items-center p-2 rounded-md cursor-pointer
                        ${format === option.id
                          ? 'bg-violet-100 dark:bg-violet-900/30 border-violet-300 dark:border-violet-700'
                          : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'}
                        border
                      `}
                    >
                      <input
                        type="radio"
                        className="sr-only"
                        checked={format === option.id}
                        onChange={() => handleFormatChange(option.id)}
                      />
                      <span className="text-xs text-gray-600 dark:text-gray-400">{option.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                  缩进空格数
                </label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={indentLevel}
                  onChange={(e) => setIndentLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>{indentLevel}</span>
                  <span>8</span>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full"
                onClick={formatDict}
              >
                格式化
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="text-sm text-gray-600 dark:text-gray-400 mt-4">
          <h4 className="font-medium mb-1">使用说明：</h4>
          <p>输入字典/对象数据，选择输出格式，然后点击"格式化"按钮转换。支持多种输入格式（JSON、JavaScript对象等）。</p>
        </div>
      </CardContent>
    </Card>
  );
};

// 工具元数据
const dictFormatter = {
  id: 'dict-formatter',
  name: '字典/对象格式化工具',
  description: '将字典/对象转换为不同格式，支持JSON、Python、JavaScript、PHP和YAML',
  category: 'format',
  icon: FiBook,
  component: DictFormatterComponent,
  meta: {
    keywords: ['字典', '对象', '格式化', 'json', 'python', 'javascript', 'php', 'yaml'],
    author: 'DevTools Box',
    version: '1.0.0'
  }
};

export default dictFormatter;
