'use client';

import { useState, useEffect } from 'react';
import { FiCode, FiCopy, FiTrash2, FiSearch, FiInfo } from 'react-icons/fi';
import { Tool } from '../../../lib/tools-registry/types';

interface MatchedElement {
  selector: string;
  html: string;
  text: string;
  attributes: Record<string, string>;
}

const CssSelectorTester: React.FC = () => {
  const [html, setHtml] = useState<string>('');
  const [selector, setSelector] = useState<string>('');
  const [matchedElements, setMatchedElements] = useState<MatchedElement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedExample, setSelectedExample] = useState<string>('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // 示例选项
  const examples = [
    { name: '简单示例', html: '<div class="container"><h1 id="title">Hello World</h1><p class="text">这是一个段落</p><p class="text highlight">这是高亮段落</p></div>', selector: '.text' },
    { name: '表格示例', html: '<table><thead><tr><th>姓名</th><th>年龄</th></tr></thead><tbody><tr><td>张三</td><td>25</td></tr><tr><td>李四</td><td>30</td></tr></tbody></table>', selector: 'tbody tr' },
    { name: '列表示例', html: '<ul class="menu"><li class="item active">首页</li><li class="item">关于</li><li class="item">联系</li></ul>', selector: 'li.active' },
  ];

  // 当选择示例改变时加载示例
  useEffect(() => {
    if (selectedExample) {
      const example = examples.find(ex => ex.name === selectedExample);
      if (example) {
        setHtml(example.html);
        setSelector(example.selector);
      }
    }
  }, [selectedExample]);

  // 测试选择器
  const testSelector = () => {
    try {
      setError(null);

      if (!html.trim()) {
        setError('HTML不能为空');
        return;
      }

      if (!selector.trim()) {
        setError('选择器不能为空');
        return;
      }

      // 创建一个临时DOM解析HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // 使用选择器查找元素
      const elements = doc.querySelectorAll(selector);

      if (elements.length === 0) {
        setError('没有找到匹配的元素');
        setMatchedElements([]);
        return;
      }

      // 将结果转换为我们的数据结构
      const results: MatchedElement[] = Array.from(elements).map(el => {
        const attributes: Record<string, string> = {};
        Array.from(el.attributes).forEach(attr => {
          attributes[attr.name] = attr.value;
        });

        return {
          selector,
          html: el.outerHTML,
          text: el.textContent || '',
          attributes
        };
      });

      setMatchedElements(results);
    } catch (err) {
      setError(`选择器语法错误: ${err.message}`);
      setMatchedElements([]);
    }
  };

  // 复制到剪贴板
  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);

    // 3秒后重置复制状态
    setTimeout(() => {
      setCopiedIndex(null);
    }, 3000);
  };

  // 清除所有内容
  const clearAll = () => {
    setHtml('');
    setSelector('');
    setMatchedElements([]);
    setError(null);
    setSelectedExample('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">CSS选择器测试器</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          输入HTML内容和CSS选择器，查找匹配的元素并提取信息
        </p>
      </div>

      {/* 控制区域 */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[250px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            选择示例
          </label>
          <select
            value={selectedExample}
            onChange={(e) => setSelectedExample(e.target.value)}
            className="w-full py-2 px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- 选择示例 --</option>
            {examples.map((ex) => (
              <option key={ex.name} value={ex.name}>
                {ex.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={testSelector}
            className="py-2 px-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            <FiSearch /> 测试选择器
          </button>
          <button
            onClick={clearAll}
            className="py-2 px-4 flex items-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors"
          >
            <FiTrash2 /> 清空
          </button>
        </div>
      </div>

      {/* 输入区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            HTML内容
          </label>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="w-full h-60 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            placeholder="<div class=&quot;example&quot;>输入HTML内容...</div>"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            CSS选择器
          </label>
          <input
            type="text"
            value={selector}
            onChange={(e) => setSelector(e.target.value)}
            className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm mb-4"
            placeholder=".example > p"
          />

          {error && (
            <div className="mt-2 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-300 text-sm">
              <div className="flex items-start">
                <FiInfo className="mt-0.5 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 结果区域 */}
      <div className="flex-1 overflow-auto">
        <div className="border border-gray-300 dark:border-gray-700 rounded-md">
          <div className="bg-gray-100 dark:bg-gray-800 p-3 border-b border-gray-300 dark:border-gray-700">
            <h3 className="font-medium text-gray-700 dark:text-gray-300">
              匹配结果 ({matchedElements.length})
            </h3>
          </div>

          {matchedElements.length > 0 ? (
            <div className="divide-y divide-gray-300 dark:divide-gray-700">
              {matchedElements.map((element, index) => (
                <div key={index} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      元素 #{index + 1}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(element.html, index)}
                        className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        title="复制HTML"
                      >
                        {copiedIndex === index ? (
                          <span className="text-green-500 text-xs">已复制!</span>
                        ) : (
                          <FiCopy size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      HTML
                    </div>
                    <pre className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md overflow-x-auto text-xs text-gray-800 dark:text-gray-200 font-mono">
                      {element.html}
                    </pre>
                  </div>

                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      文本内容
                    </div>
                    <pre className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md overflow-x-auto text-xs text-gray-800 dark:text-gray-200">
                      {element.text || <em className="text-gray-400">空文本</em>}
                    </pre>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      属性
                    </div>
                    {Object.keys(element.attributes).length > 0 ? (
                      <div className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-800">
                              <th className="text-left py-1 px-2 font-medium text-gray-700 dark:text-gray-300">名称</th>
                              <th className="text-left py-1 px-2 font-medium text-gray-700 dark:text-gray-300">值</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(element.attributes).map(([key, value]) => (
                              <tr key={key} className="border-b border-gray-200 dark:border-gray-800">
                                <td className="py-1 px-2 font-mono text-gray-800 dark:text-gray-200">{key}</td>
                                <td className="py-1 px-2 text-gray-700 dark:text-gray-300">{value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md text-xs text-gray-500">
                        无属性
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              {error ? '无匹配结果' : '输入HTML和选择器，然后点击"测试选择器"按钮'}
            </div>
          )}
        </div>
      </div>

      {/* 参考指南 */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <details className="group">
          <summary className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
            <span className="mr-2">CSS选择器参考</span>
            <svg className="w-5 h-5 transition-transform group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="mt-3 text-sm space-y-3 text-gray-600 dark:text-gray-400">
            <p>以下是一些常用的CSS选择器：</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="py-1 px-2 text-left font-medium text-gray-700 dark:text-gray-300">选择器</th>
                      <th className="py-1 px-2 text-left font-medium text-gray-700 dark:text-gray-300">描述</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <td className="py-1 px-2 font-mono">element</td>
                      <td className="py-1 px-2">选择所有指定元素</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <td className="py-1 px-2 font-mono">.class</td>
                      <td className="py-1 px-2">选择具有指定类的元素</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <td className="py-1 px-2 font-mono">#id</td>
                      <td className="py-1 px-2">选择具有指定ID的元素</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <td className="py-1 px-2 font-mono">[attribute]</td>
                      <td className="py-1 px-2">选择具有指定属性的元素</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="py-1 px-2 text-left font-medium text-gray-700 dark:text-gray-300">组合器</th>
                      <th className="py-1 px-2 text-left font-medium text-gray-700 dark:text-gray-300">描述</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <td className="py-1 px-2 font-mono">E F</td>
                      <td className="py-1 px-2">E元素的所有F后代元素</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <td className="py-1 px-2 font-mono">E > F</td>
                      <td className="py-1 px-2">E元素的直接子元素F</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <td className="py-1 px-2 font-mono">E + F</td>
                      <td className="py-1 px-2">E元素之后的相邻F元素</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <td className="py-1 px-2 font-mono">E ~ F</td>
                      <td className="py-1 px-2">E元素之后的所有同级F元素</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

// 工具配置
const tool: Tool = {
  id: 'css-selector',
  name: 'CSS选择器测试',
  category: 'web',
  description: '测试CSS选择器并提取匹配元素的信息',
  component: CssSelectorTester,
  icon: FiCode,
  meta: {
    keywords: ['css', 'selector', 'html', 'dom', '选择器', '爬虫', '提取']
  }
};

export default tool;
