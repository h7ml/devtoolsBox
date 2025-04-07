'use client';

import React, { useState, useEffect } from 'react';
import { FiRefreshCw, FiCopy, FiCheck, FiCode } from 'react-icons/fi';
import { Card, CardHeader, CardContent } from '../../../components/design-system/Card';
import Button from '../../../components/design-system/Button';
import { AnimatePresence, motion } from 'framer-motion';

// 格式化选项类型
type FormatOptions = {
  indent: number;
  singleQuote: boolean;
  semi: boolean;
  bracketSpacing: boolean;
  jsxBracketSameLine: boolean;
  arrowParens: 'avoid' | 'always';
};

const JsFormatterComponent = () => {
  const [input, setInput] = useState<string>('const example = {foo: "bar",baz:42,deeply:{nested:{object:true,array:[1,2,3,]}}};function myFunc(a,b){return a+b}const arrowFunc = (a) => a * 2;');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [formatting, setFormatting] = useState<boolean>(false);
  const [prettierLoaded, setPrettierLoaded] = useState<boolean>(false);
  const [prettier, setPrettier] = useState<any>(null);
  const [parserBabel, setParserBabel] = useState<any>(null);

  // 加载 prettier 库
  useEffect(() => {
    const loadPrettier = async () => {
      try {
        const [prettierModule, babelParser] = await Promise.all([
          import('prettier/standalone'),
          import('prettier/plugins/babel')
        ]);
        setPrettier(prettierModule);
        setParserBabel(babelParser);
        setPrettierLoaded(true);
      } catch (err) {
        setError(`加载格式化库失败: ${err.message}`);
      }
    };

    loadPrettier();
  }, []);

  // 格式化选项
  const [options, setOptions] = useState<FormatOptions>({
    indent: 2,
    singleQuote: true,
    semi: true,
    bracketSpacing: true,
    jsxBracketSameLine: false,
    arrowParens: 'avoid',
  });

  // 处理选项变更
  const handleOptionChange = (key: keyof FormatOptions, value: any) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 格式化JS代码
  const formatCode = async () => {
    if (!prettierLoaded || !prettier) {
      setError('格式化工具尚未加载完成，请稍候');
      return;
    }

    try {
      setError(null);
      setFormatting(true);

      // 使用prettier格式化代码
      const formatted = await prettier.format(input, {
        parser: 'babel',
        plugins: [parserBabel],
        printWidth: 80,
        tabWidth: options.indent,
        useTabs: false,
        singleQuote: options.singleQuote,
        semi: options.semi,
        bracketSpacing: options.bracketSpacing,
        jsxBracketSameLine: options.jsxBracketSameLine,
        arrowParens: options.arrowParens,
        trailingComma: 'es5',
      });

      setOutput(formatted);
    } catch (e) {
      setError(`格式化错误: ${e.message}`);
    } finally {
      setFormatting(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;

    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrettierError = (e: any) => {
    // 处理Prettier可能的错误
    if (typeof e.loc === 'object' && e.loc) {
      const { line, column } = e.loc;
      return `第${line}行，第${column}列: ${e.message}`;
    }
    return e.message;
  };

  return (
    <Card className="w-full">
      <CardHeader
        icon={<FiCode className="h-6 w-6" />}
        title="JS格式化工具"
        description="美化和格式化JavaScript代码"
        gradientColors="from-amber-500 to-amber-600"
      />
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                输入JavaScript代码
              </label>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                        bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                        font-mono text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="在此粘贴需要格式化的JavaScript代码..."
            />
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">格式化选项</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  缩进空格数
                </label>
                <select
                  value={options.indent}
                  onChange={(e) => handleOptionChange('indent', parseInt(e.target.value))}
                  className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
                >
                  <option value={2}>2 空格</option>
                  <option value={4}>4 空格</option>
                  <option value={8}>8 空格</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="singleQuote"
                  checked={options.singleQuote}
                  onChange={(e) => handleOptionChange('singleQuote', e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="singleQuote" className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                  使用单引号
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="semi"
                  checked={options.semi}
                  onChange={(e) => handleOptionChange('semi', e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="semi" className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                  使用分号
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="bracketSpacing"
                  checked={options.bracketSpacing}
                  onChange={(e) => handleOptionChange('bracketSpacing', e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="bracketSpacing" className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                  括号内空格
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="jsxBracketSameLine"
                  checked={options.jsxBracketSameLine}
                  onChange={(e) => handleOptionChange('jsxBracketSameLine', e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="jsxBracketSameLine" className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                  JSX标签结束符同行
                </label>
              </div>

              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  箭头函数参数括号
                </label>
                <select
                  value={options.arrowParens}
                  onChange={(e) => handleOptionChange('arrowParens', e.target.value as 'avoid' | 'always')}
                  className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
                >
                  <option value="avoid">单参数时省略</option>
                  <option value="always">总是使用</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <Button
            onClick={formatCode}
            icon={<FiRefreshCw className={`h-4 w-4 ${formatting ? 'animate-spin' : ''}`} />}
            className="w-full md:w-auto"
            disabled={formatting}
          >
            {formatting ? '格式化中...' : '格式化代码'}
          </Button>

          <div className="hidden md:flex items-center space-x-2">
            <AnimatePresence>
              {output && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    icon={copied ? <FiCheck className="h-4 w-4" /> : <FiCopy className="h-4 w-4" />}
                    onClick={handleCopy}
                    disabled={!output}
                  >
                    {copied ? '已复制' : '复制代码'}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="mb-2 flex justify-between items-center">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            格式化结果
          </div>
          <div className="md:hidden">
            {output && (
              <Button
                variant="ghost"
                size="sm"
                icon={copied ? <FiCheck className="h-4 w-4" /> : <FiCopy className="h-4 w-4" />}
                onClick={handleCopy}
              >
                {copied ? '已复制' : '复制'}
              </Button>
            )}
          </div>
        </div>

        <pre className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 overflow-auto max-h-96 font-mono text-sm text-gray-800 dark:text-gray-200">
          {output || '// 格式化后的代码将显示在这里'}
        </pre>
      </CardContent>
    </Card>
  );
};

// 工具元数据
const jsFormatter = {
  id: 'js-formatter',
  name: 'JS格式化工具',
  description: '美化和格式化JavaScript代码',
  category: 'web',
  icon: FiCode,
  component: JsFormatterComponent,
  meta: {
    keywords: ['javascript', 'js', 'prettier', '格式化', '美化', '代码'],
    author: 'DevTools Box',
    version: '1.0.0'
  }
};

export default jsFormatter; 
