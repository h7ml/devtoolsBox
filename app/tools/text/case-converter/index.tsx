'use client';

import { useState, useEffect } from 'react';
import { FiType, FiCopy, FiCheck, FiRefreshCw, FiClipboard } from 'react-icons/fi';
import { Tool } from '../../../lib/tools-registry/types';
import { Card, CardHeader, Button } from '../../../components/design-system';

type CaseType =
  | 'lowercase'        // 小写
  | 'uppercase'        // 大写
  | 'capitalize'       // 首字母大写 
  | 'titleCase'        // 标题格式
  | 'camelCase'        // 驼峰命名
  | 'pascalCase'       // 帕斯卡命名
  | 'snakeCase'        // 下划线命名
  | 'kebabCase'        // 短横线命名
  | 'alternatingCase'  // 交替大小写
  | 'inverseCase';     // 反转大小写

// 文本转换函数集合
const transforms: Record<CaseType, (text: string) => string> = {
  lowercase: (text) => text.toLowerCase(),

  uppercase: (text) => text.toUpperCase(),

  capitalize: (text) =>
    text.toLowerCase().replace(/(?:^|\s)\S/g, (a) => a.toUpperCase()),

  titleCase: (text) =>
    text.toLowerCase().replace(/(?:^|\s)\S/g, (a) => a.toUpperCase())
      .replace(/\s+([a-z]{1,3})\s+/gi, (_, word) =>
        [' ', 'a', 'an', 'the', 'in', 'on', 'at', 'by', 'for', 'and', 'or', 'but', 'of'].includes(word.toLowerCase())
          ? ` ${word.toLowerCase()} `
          : ` ${word} `
      ),

  camelCase: (text) =>
    text.replace(/[^\w\s]/g, '')
      .replace(/\s+(.)/g, (_, c) => c.toUpperCase())
      .replace(/^[A-Z]/, (c) => c.toLowerCase()),

  pascalCase: (text) =>
    text.replace(/[^\w\s]/g, '')
      .replace(/\s+(.)/g, (_, c) => c.toUpperCase())
      .replace(/^[a-z]/, (c) => c.toUpperCase()),

  snakeCase: (text) =>
    text.replace(/\s+/g, '_')
      .replace(/[^\w_]/g, '')
      .toLowerCase(),

  kebabCase: (text) =>
    text.replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .toLowerCase(),

  alternatingCase: (text) =>
    text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join(''),

  inverseCase: (text) =>
    text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('')
};

// 转换描述和示例
const transformInfo: Record<CaseType, { name: string; example: string }> = {
  lowercase: {
    name: '小写',
    example: 'hello world'
  },
  uppercase: {
    name: '大写',
    example: 'HELLO WORLD'
  },
  capitalize: {
    name: '首字母大写',
    example: 'Hello World'
  },
  titleCase: {
    name: '标题格式',
    example: 'Hello World of the Day'
  },
  camelCase: {
    name: '驼峰命名',
    example: 'helloWorldExample'
  },
  pascalCase: {
    name: '帕斯卡命名',
    example: 'HelloWorldExample'
  },
  snakeCase: {
    name: '下划线命名',
    example: 'hello_world_example'
  },
  kebabCase: {
    name: '短横线命名',
    example: 'hello-world-example'
  },
  alternatingCase: {
    name: '交替大小写',
    example: 'hElLo WoRlD'
  },
  inverseCase: {
    name: '反转大小写',
    example: 'HeLLO world'
  }
};

const CaseConverter = () => {
  const [input, setInput] = useState<string>('');
  const [outputs, setOutputs] = useState<Record<CaseType, string>>({} as Record<CaseType, string>);
  const [copiedType, setCopiedType] = useState<CaseType | null>(null);
  const [statsVisible, setStatsVisible] = useState<boolean>(true);
  const [characterCount, setCharacterCount] = useState<number>(0);
  const [wordCount, setWordCount] = useState<number>(0);
  const [lineCount, setLineCount] = useState<number>(0);

  // 例子文本
  const exampleText = '大小写转换工具示例: Hello World! 这是一个示例文本123';

  // 处理所有转换
  useEffect(() => {
    const transformed: Record<CaseType, string> = {} as Record<CaseType, string>;

    Object.entries(transforms).forEach(([type, transformFn]) => {
      transformed[type as CaseType] = transformFn(input);
    });

    setOutputs(transformed);

    // 统计字数等
    if (input) {
      setCharacterCount(input.length);
      setWordCount(input.trim().split(/\s+/).filter(Boolean).length);
      setLineCount(input.split(/\r\n|\r|\n/).filter(Boolean).length);
    } else {
      setCharacterCount(0);
      setWordCount(0);
      setLineCount(0);
    }
  }, [input]);

  // 复制到剪贴板
  const copyToClipboard = (text: string, type: CaseType) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // 清空输入
  const clearInput = () => {
    setInput('');
  };

  // 设置示例文本
  const setExample = () => {
    setInput(exampleText);
  };

  // 从剪贴板粘贴
  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch (error) {
      console.error('访问剪贴板失败:', error);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader
            icon={<FiType className="h-6 w-6" />}
            title="文本大小写转换"
            description="将文本转换为各种格式：小写、大写、驼峰命名等"
            gradientColors="from-blue-500 to-indigo-600"
          />

          <div className="flex items-center justify-between mb-4">
            <div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setStatsVisible(!statsVisible)}
              >
                {statsVisible ? '隐藏统计' : '显示统计'}
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={setExample}
              >
                使用示例文本
              </Button>
              <Button
                size="sm"
                variant="ghost"
                icon={<FiClipboard className="h-3.5 w-3.5" />}
                onClick={pasteFromClipboard}
              >
                从剪贴板粘贴
              </Button>
              <Button
                size="sm"
                variant="ghost"
                icon={<FiRefreshCw className="h-3.5 w-3.5" />}
                onClick={clearInput}
              >
                清空
              </Button>
            </div>
          </div>

          {/* 文本统计信息 */}
          {statsVisible && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-3 rounded-xl mb-4 flex flex-wrap gap-4 justify-around">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">字符数</div>
                <div className="text-xl font-mono text-indigo-600 dark:text-indigo-400">{characterCount}</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">单词数</div>
                <div className="text-xl font-mono text-indigo-600 dark:text-indigo-400">{wordCount}</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">行数</div>
                <div className="text-xl font-mono text-indigo-600 dark:text-indigo-400">{lineCount}</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 输入区域 */}
            <div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  输入文本
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-64 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                  placeholder="在此输入需要转换的文本..."
                />
              </div>
            </div>

            {/* 输出区域 */}
            <div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  转换结果
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(transformInfo).map(([type, info]) => (
                    <div
                      key={type}
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 relative group overflow-hidden"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300">{info.name}</h3>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(outputs[type as CaseType] || '', type as CaseType)}
                          disabled={!input}
                          icon={
                            copiedType === type
                              ? <FiCheck className="h-3 w-3" />
                              : <FiCopy className="h-3 w-3" />
                          }
                        >
                          复制
                        </Button>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-2 text-xs font-mono text-gray-800 dark:text-gray-200 h-14 overflow-auto">
                        {outputs[type as CaseType] || (
                          <span className="text-gray-400 dark:text-gray-500 italic">
                            {input ? '' : info.example}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <h3 className="font-medium text-sm mb-1">格式说明:</h3>
            <p>• <strong>驼峰命名(camelCase)</strong>: 第一个单词首字母小写，后续单词首字母大写，如 'helloWorld'</p>
            <p>• <strong>帕斯卡命名(PascalCase)</strong>: 所有单词首字母大写，如 'HelloWorld'</p>
            <p>• <strong>下划线命名(snake_case)</strong>: 所有单词小写，用下划线连接，如 'hello_world'</p>
            <p>• <strong>短横线命名(kebab-case)</strong>: 所有单词小写，用短横线连接，如 'hello-world'</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

const tool: Tool = {
  id: 'case-converter',
  name: '文本格式转换',
  description: '将文本转换为小写、大写、驼峰命名等各种格式',
  category: 'text',
  icon: FiType,
  component: CaseConverter,
  meta: {
    keywords: ['text', 'case', 'convert', 'lowercase', 'uppercase', 'camelCase', 'snake_case', '大小写', '驼峰命名', '文本转换'],
    examples: [
      'Hello World',
      'camelCase to snake_case',
      '转换编程变量命名'
    ],
    version: '1.0.0'
  }
};

export default tool; 
