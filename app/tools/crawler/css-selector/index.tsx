'use client';

import { useState, useEffect } from 'react';
import { FiCode, FiCopy, FiTrash2, FiSearch, FiInfo, FiCheckSquare, FiDatabase, FiLayout, FiCheck, FiFile } from 'react-icons/fi';
import { Tool } from '../../../lib/tools-registry/types';

interface MatchedElement {
  selector: string;
  html: string;
  text: string;
  attributes: Record<string, string>;
}

const CssSelectorTester = () => {
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
    } catch (err: any) {
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
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col gap-8">
        {/* 控制面板 */}
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
          <div className="backdrop-blur-sm backdrop-filter bg-white/70 dark:bg-gray-800/70 p-6">
            {/* 标题区 */}
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-white shadow-md">
                <FiCode className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">CSS选择器测试</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  测试CSS选择器并提取匹配元素的信息
                </p>
              </div>
            </div>

            {/* 示例选择 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                选择示例
              </label>
              <div className="relative">
                <select
                  value={selectedExample}
                  onChange={(e) => setSelectedExample(e.target.value)}
                  className="w-full py-3 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white text-sm transition-colors"
                >
                  <option value="">-- 选择示例 --</option>
                  {examples.map((ex) => (
                    <option key={ex.name} value={ex.name}>
                      {ex.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 输入区域 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    HTML内容
                  </label>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <FiFile className="h-3 w-3" />
                    <span>输入HTML代码</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 opacity-20 rounded-xl pointer-events-none"></div>
                  <textarea
                    value={html}
                    onChange={(e) => setHtml(e.target.value)}
                    className="w-full h-60 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white font-mono text-sm resize-none transition-all"
                    placeholder="<div class=&quot;example&quot;>输入HTML内容...</div>"
                    spellCheck="false"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    CSS选择器
                  </label>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <FiCode className="h-3 w-3" />
                    <span>输入选择器</span>
                  </div>
                </div>
                <div className="relative mb-4">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 opacity-20 rounded-xl pointer-events-none"></div>
                  <input
                    type="text"
                    value={selector}
                    onChange={(e) => setSelector(e.target.value)}
                    className="w-full py-3 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white font-mono text-sm"
                    placeholder=".example > p"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm mb-4">
                    <div className="flex items-start">
                      <FiInfo className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                {/* 选择器提示 */}
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl mb-4">
                  <h4 className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2">常用选择器示例</h4>
                  <ul className="text-xs text-indigo-600 dark:text-indigo-400 space-y-1.5">
                    <li><code className="bg-indigo-100 dark:bg-indigo-800/30 px-1.5 py-0.5 rounded">.class</code> - 选择所有class属性的元素</li>
                    <li><code className="bg-indigo-100 dark:bg-indigo-800/30 px-1.5 py-0.5 rounded">#id</code> - 选择特定id的元素</li>
                    <li><code className="bg-indigo-100 dark:bg-indigo-800/30 px-1.5 py-0.5 rounded">div &gt; p</code> - 选择div的直接子p元素</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={testSelector}
                    className="flex-1 py-3 px-4 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    <FiSearch className="h-4 w-4" /> 测试选择器
                  </button>
                  <button
                    onClick={clearAll}
                    className="py-3 px-4 flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    <FiTrash2 className="h-4 w-4" /> 清空
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 结果区域 */}
        {matchedElements.length > 0 && (
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300">
            <div className="backdrop-blur-sm backdrop-filter bg-white/70 dark:bg-gray-800/70 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl text-white shadow-md">
                  <FiCheckSquare className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">匹配结果</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    找到 {matchedElements.length} 个匹配元素
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {matchedElements.map((element, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-medium py-1 px-2.5 rounded-full">
                          元素 #{index + 1}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(element.html, index)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full transition-all duration-200"
                        title="复制HTML"
                      >
                        {copiedIndex === index ? (
                          <>
                            <FiCheck className="h-3 w-3" /> 已复制
                          </>
                        ) : (
                          <>
                            <FiCopy className="h-3 w-3" /> 复制HTML
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-4 space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <FiFile className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">HTML</h4>
                        </div>
                        <div className="relative overflow-hidden rounded-xl">
                          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-900/10 dark:to-green-900/10 opacity-10 pointer-events-none"></div>
                          <pre className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-x-auto text-xs text-gray-800 dark:text-gray-200 font-mono shadow-inner max-h-40">
                            {element.html}
                          </pre>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <FiDatabase className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">文本内容</h4>
                          </div>
                          <div className="relative overflow-hidden rounded-xl">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 opacity-20 pointer-events-none"></div>
                            <pre className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-x-auto text-xs text-gray-800 dark:text-gray-200 shadow-inner max-h-32">
                              {element.text || <em className="text-gray-400">空文本</em>}
                            </pre>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <FiInfo className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">属性</h4>
                          </div>
                          {Object.keys(element.attributes).length > 0 ? (
                            <div className="relative overflow-hidden rounded-xl">
                              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 opacity-20 pointer-events-none"></div>
                              <div className="p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-x-auto shadow-inner max-h-32">
                                <table className="w-full text-xs">
                                  <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-800">
                                      <th className="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300">名称</th>
                                      <th className="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300">值</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {Object.entries(element.attributes).map(([key, value]) => (
                                      <tr key={key}>
                                        <td className="py-2 px-3 text-gray-800 dark:text-gray-200 font-mono">{key}</td>
                                        <td className="py-2 px-3 text-gray-600 dark:text-gray-400 font-mono">{value}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-center text-gray-500 dark:text-gray-400 text-sm">
                              无属性
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const tool: Tool = {
  id: 'css-selector',
  name: 'CSS选择器测试',
  description: '测试CSS选择器并提取匹配元素的信息',
  category: 'web',
  icon: FiCode,
  component: CssSelectorTester,
  meta: {
    keywords: ['css', 'selector', 'test', 'query', 'html', 'dom', 'extract'],
    examples: [
      '.class > p',
      '#id',
      'div[attribute=value]',
    ],
    version: '1.0.0'
  }
};

export default tool;
