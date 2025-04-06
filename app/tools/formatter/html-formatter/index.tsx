'use client';

import { useState, useEffect } from 'react';
import { FiCode, FiCopy, FiCheck, FiRefreshCw, FiDownload } from 'react-icons/fi';
import { Tool } from '../../../lib/tools-registry/types';
import { Card, CardHeader, Button, Input } from '../../../components/design-system';

type PrettierConfig = {
  printWidth: number;
  tabWidth: number;
  useTabs: boolean;
  semi: boolean;
  singleQuote: boolean;
  bracketSameLine: boolean;
};

const defaultConfig: PrettierConfig = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  bracketSameLine: false,
};

const HtmlFormatter = () => {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [config, setConfig] = useState<PrettierConfig>(defaultConfig);
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [isFormatting, setIsFormatting] = useState<boolean>(false);

  // 自动格式化
  useEffect(() => {
    if (input.trim()) {
      const debounceTimer = setTimeout(() => {
        formatHtml();
      }, 500);

      return () => clearTimeout(debounceTimer);
    }
  }, [input, config]);

  // 格式化HTML
  const formatHtml = async () => {
    try {
      setError(null);
      setIsFormatting(true);

      if (!input.trim()) {
        setOutput('');
        setIsFormatting(false);
        return;
      }

      // 动态导入prettier相关模块
      const [prettier, parserHtml, parserBabel, parserCss] = await Promise.all([
        import('prettier/standalone'),
        import('prettier/parser-html'),
        import('prettier/parser-babel'),
        import('prettier/parser-postcss')
      ]);

      const formatted = await prettier.default.format(input, {
        parser: 'html',
        plugins: [parserHtml.default, parserBabel.default, parserCss.default],
        ...config,
      });

      setOutput(formatted);
    } catch (err: any) {
      console.error('格式化错误:', err);
      setError(err.message || '格式化失败');
      // 如果格式化失败，至少保留输入
      setOutput(input);
    } finally {
      setIsFormatting(false);
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

  const downloadFormatted = () => {
    const blob = new Blob([output], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 样例代码
  const loadExample = () => {
    setInput(`<!DOCTYPE html>
<html>
<head>
<title>Example</title>
<style>
  body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
  .container { max-width: 800px; margin: 0 auto; }
  .header { background-color: #f5f5f5; padding: 15px; border-radius: 5px; }
</style>
</head>
<body>
  <div class="container">
    <header class="header">
      <h1>HTML Example</h1>
      <p>This is an example HTML document with some nested elements.</p>
    </header>
    <main>
      <section>
        <h2>Section Title</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at justo in turpis faucibus volutpat.</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </section>
    </main>
  </div>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Document ready!');
  });
</script>
</body>
</html>`);
  };

  // 配置更新器
  const updateConfig = (key: keyof PrettierConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader
            icon={<FiCode className="h-6 w-6" />}
            title="HTML格式化工具"
            description="格式化和美化HTML代码，使其更易于阅读和维护"
            gradientColors="from-blue-500 to-cyan-600"
          />

          <div className="flex justify-between items-center mb-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowConfig(!showConfig)}
            >
              {showConfig ? '隐藏格式化选项' : '显示格式化选项'}
            </Button>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={loadExample}
              >
                加载示例
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={clearAll}
                icon={<FiRefreshCw className="h-3.5 w-3.5" />}
              >
                清空
              </Button>
            </div>
          </div>

          {/* 格式化配置选项 */}
          {showConfig && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-3">格式化选项</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Input
                    label="每行最大字符数"
                    type="number"
                    min="40"
                    max="200"
                    size="sm"
                    value={config.printWidth.toString()}
                    onChange={(e) => updateConfig('printWidth', Number(e.target.value) || 80)}
                  />
                </div>
                <div>
                  <Input
                    label="缩进空格数"
                    type="number"
                    min="1"
                    max="8"
                    size="sm"
                    value={config.tabWidth.toString()}
                    onChange={(e) => updateConfig('tabWidth', Number(e.target.value) || 2)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="useTabs"
                    checked={config.useTabs}
                    onChange={(e) => updateConfig('useTabs', e.target.checked)}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor="useTabs" className="text-sm text-gray-700 dark:text-gray-300">
                    使用Tab缩进
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="semi"
                    checked={config.semi}
                    onChange={(e) => updateConfig('semi', e.target.checked)}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor="semi" className="text-sm text-gray-700 dark:text-gray-300">
                    添加分号
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="singleQuote"
                    checked={config.singleQuote}
                    onChange={(e) => updateConfig('singleQuote', e.target.checked)}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor="singleQuote" className="text-sm text-gray-700 dark:text-gray-300">
                    使用单引号
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="bracketSameLine"
                    checked={config.bracketSameLine}
                    onChange={(e) => updateConfig('bracketSameLine', e.target.checked)}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor="bracketSameLine" className="text-sm text-gray-700 dark:text-gray-300">
                    尖括号与标签在同行
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 输入区域 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  输入HTML代码
                </label>
              </div>
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-[500px] p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm leading-relaxed focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="在此输入需要格式化的HTML代码..."
                  spellCheck={false}
                />
              </div>
            </div>

            {/* 输出区域 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  格式化结果
                </label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyToClipboard}
                    disabled={!output}
                    icon={copied ? <FiCheck className="h-3.5 w-3.5" /> : <FiCopy className="h-3.5 w-3.5" />}
                  >
                    {copied ? '已复制' : '复制'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={downloadFormatted}
                    disabled={!output}
                    icon={<FiDownload className="h-3.5 w-3.5" />}
                  >
                    下载
                  </Button>
                </div>
              </div>
              <div className="relative">
                <textarea
                  value={output}
                  readOnly
                  className="w-full h-[500px] p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm leading-relaxed resize-none"
                  placeholder="格式化后的HTML代码将显示在这里..."
                  spellCheck={false}
                />
              </div>
            </div>
          </div>

          {/* 错误信息 */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              <p className="font-medium">格式化错误:</p>
              <p className="font-mono text-xs mt-1 whitespace-pre-wrap">{error}</p>
            </div>
          )}

          <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p>• 此工具使用Prettier进行HTML格式化</p>
            <p>• 支持HTML, CSS和JavaScript代码的格式化</p>
            <p>• 可自定义格式化选项，如缩进、引号样式等</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

// 工具注册对象
const tool: Tool = {
  id: 'html-formatter',
  name: 'HTML格式化',
  description: '格式化和美化HTML代码，使其更加易读易维护',
  category: 'formatter',
  icon: FiCode,
  component: HtmlFormatter,
  meta: {
    keywords: ['html', 'formatter', 'beautify', 'prettify', 'indentation', 'format', '格式化', '美化', 'HTML格式化'],
    examples: [
      '<div><p>未格式化的HTML</p></div>',
      '<!DOCTYPE html><html><head><title>Example</title></head><body><div><h1>Hello</h1></div></body></html>'
    ],
    version: '1.0.0'
  }
};

export default tool; 
