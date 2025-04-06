'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { FiCopy, FiTrash2, FiCheck, FiAlertTriangle } from 'react-icons/fi';
import { Tool } from '../../../lib/tools-registry/types';
import { FiCode } from 'react-icons/fi';

interface Match {
  text: string;
  index: number;
  length: number;
}

interface RegexState {
  pattern: string;
  flags: string;
  testText: string;
  isValid: boolean;
  error: string | null;
  matches: Match[];
  groupMatches: Record<number, string>[];
}

const RegexTester = () => {
  const [state, setState] = useState<RegexState>({
    pattern: '',
    flags: 'g',
    testText: '',
    isValid: true,
    error: null,
    matches: [],
    groupMatches: []
  });

  const [highlightedText, setHighlightedText] = useState<JSX.Element | null>(null);

  const handlePatternChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      pattern: e.target.value
    });
  };

  const handleFlagsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      flags: e.target.value
    });
  };

  const handleTestTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setState({
      ...state,
      testText: e.target.value
    });
  };

  const toggleFlag = (flag: string) => {
    const currentFlags = state.flags.split('');

    if (currentFlags.includes(flag)) {
      setState({
        ...state,
        flags: currentFlags.filter(f => f !== flag).join('')
      });
    } else {
      setState({
        ...state,
        flags: [...currentFlags, flag].join('')
      });
    }
  };

  const clearAll = () => {
    setState({
      pattern: '',
      flags: 'g',
      testText: '',
      isValid: true,
      error: null,
      matches: [],
      groupMatches: []
    });
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

  useEffect(() => {
    if (!state.pattern || !state.testText) {
      setState({
        ...state,
        isValid: true,
        error: null,
        matches: [],
        groupMatches: []
      });
      setHighlightedText(null);
      return;
    }

    try {
      const regex = new RegExp(state.pattern, state.flags);
      const matches: Match[] = [];
      const groupMatches: Record<number, string>[] = [];

      // 查找所有匹配
      let match;
      if (state.flags.includes('g')) {
        let execResult;
        while ((execResult = regex.exec(state.testText)) !== null) {
          matches.push({
            text: execResult[0],
            index: execResult.index,
            length: execResult[0].length
          });

          // 捕获分组
          const groups: Record<number, string> = {};
          for (let i = 1; i < execResult.length; i++) {
            if (execResult[i] !== undefined) {
              groups[i] = execResult[i];
            }
          }
          groupMatches.push(groups);

          // 如果匹配的是空字符串，手动前进避免无限循环
          if (execResult[0].length === 0) {
            regex.lastIndex++;
          }
        }
      } else {
        match = regex.exec(state.testText);
        if (match) {
          matches.push({
            text: match[0],
            index: match.index,
            length: match[0].length
          });

          // 捕获分组
          const groups: Record<number, string> = {};
          for (let i = 1; i < match.length; i++) {
            if (match[i] !== undefined) {
              groups[i] = match[i];
            }
          }
          groupMatches.push(groups);
        }
      }

      setState({
        ...state,
        isValid: true,
        error: null,
        matches,
        groupMatches
      });
    } catch (err) {
      setState({
        ...state,
        isValid: false,
        error: (err as Error).message,
        matches: [],
        groupMatches: []
      });
      setHighlightedText(null);
    }
  }, [state.pattern, state.flags, state.testText]);

  // 生成高亮文本
  useEffect(() => {
    if (state.matches.length === 0 || !state.testText) {
      setHighlightedText(null);
      return;
    }

    // 按照索引排序匹配结果
    const sortedMatches = [...state.matches].sort((a, b) => a.index - b.index);
    const parts: JSX.Element[] = [];
    let lastIndex = 0;

    sortedMatches.forEach((match, i) => {
      // 添加匹配前的文本
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${i}`} className="whitespace-pre-wrap">
            {state.testText.substring(lastIndex, match.index)}
          </span>
        );
      }

      // 添加匹配的文本
      parts.push(
        <mark key={`match-${i}`} className="bg-yellow-300 dark:bg-yellow-800 dark:text-white px-0.5 rounded">
          {state.testText.substr(match.index, match.length)}
        </mark>
      );

      lastIndex = match.index + match.length;
    });

    // 添加最后一部分文本
    if (lastIndex < state.testText.length) {
      parts.push(
        <span key="text-last" className="whitespace-pre-wrap">
          {state.testText.substring(lastIndex)}
        </span>
      );
    }

    setHighlightedText(<>{parts}</>);
  }, [state.matches, state.testText]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">正则表达式测试工具</h1>
        <p className="text-gray-600 dark:text-gray-300">
          测试和调试正则表达式，实时查看匹配结果
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 正则表达式输入 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  正则表达式
                </label>
                <div className="flex">
                  <div className="flex-1 relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">/</span>
                    <input
                      type="text"
                      value={state.pattern}
                      onChange={handlePatternChange}
                      className="w-full pl-6 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                      placeholder="输入正则表达式..."
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-1 text-gray-500 dark:text-gray-400">/</span>
                    <input
                      type="text"
                      value={state.flags}
                      onChange={handleFlagsChange}
                      className="w-20 pl-3 pr-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                      placeholder="flags"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 flex-wrap">
                <div className="text-sm text-gray-700 dark:text-gray-300 mr-2">修饰符：</div>
                {['g', 'i', 'm', 's', 'u', 'y'].map(flag => (
                  <button
                    key={flag}
                    onClick={() => toggleFlag(flag)}
                    className={`px-2 py-1 text-xs rounded-full ${state.flags.includes(flag)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}
                    title={
                      flag === 'g' ? '全局搜索' :
                        flag === 'i' ? '忽略大小写' :
                          flag === 'm' ? '多行模式' :
                            flag === 's' ? '点号匹配所有字符' :
                              flag === 'u' ? 'Unicode模式' :
                                '粘性匹配'
                    }
                  >
                    {flag}
                  </button>
                ))}
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    测试文本
                  </label>
                  <button
                    onClick={() => clearAll()}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    title="清空"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={state.testText}
                  onChange={handleTestTextChange}
                  className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="在这里输入要测试的文本..."
                ></textarea>
              </div>
            </div>

            {/* 匹配结果 */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    匹配结果
                  </label>
                  <div className="flex items-center">
                    {state.isValid ? (
                      <FiCheck className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <FiAlertTriangle className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${state.isValid ? 'text-green-500' : 'text-red-500'}`}>
                      {state.isValid ? '正则表达式有效' : '无效的正则表达式'}
                    </span>
                  </div>
                </div>

                <div className={`p-4 border rounded-md h-64 overflow-auto ${state.error
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-600'
                    : 'border-gray-300 dark:border-gray-600 dark:bg-gray-800'
                  }`}>
                  {state.error ? (
                    <div className="text-red-600 dark:text-red-400">
                      错误: {state.error}
                    </div>
                  ) : highlightedText ? (
                    <div className="text-gray-800 dark:text-gray-200">
                      {highlightedText}
                    </div>
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400 h-full flex items-center justify-center">
                      {state.pattern ? '没有找到匹配项' : '输入正则表达式和测试文本以查看结果'}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  匹配详情 ({state.matches.length} 个匹配)
                </label>

                <div className="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                  {state.matches.length > 0 ? (
                    <div className="overflow-auto max-h-40">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">序号</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">匹配文本</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">位置</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">操作</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {state.matches.map((match, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{index + 1}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 font-mono">{match.text}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{match.index}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">
                                <button
                                  onClick={() => copyToClipboard(match.text)}
                                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                  title="复制"
                                >
                                  <FiCopy className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                      没有匹配项
                    </div>
                  )}
                </div>
              </div>

              {/* 分组匹配结果 */}
              {state.groupMatches.length > 0 && Object.keys(state.groupMatches[0]).length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    分组匹配
                  </label>

                  <div className="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                    <div className="overflow-auto max-h-40">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">匹配序号</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">分组序号</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">分组内容</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {state.groupMatches.flatMap((groups, matchIndex) =>
                            Object.entries(groups).map(([groupIndex, value], i) => (
                              <tr key={`${matchIndex}-${groupIndex}`}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{matchIndex + 1}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{groupIndex}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-gray-200">{value}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">正则表达式参考</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">常用元字符</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">\d</code> - 匹配数字</li>
                <li><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">\w</code> - 匹配字母、数字、下划线</li>
                <li><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">\s</code> - 匹配空白字符</li>
                <li><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">.</code> - 匹配除换行符外的任意字符</li>
                <li><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">^</code> - 匹配开头</li>
                <li><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">$</code> - 匹配结尾</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">修饰符说明</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">g</code> - 全局匹配</li>
                <li><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">i</code> - 忽略大小写</li>
                <li><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">m</code> - 多行模式</li>
                <li><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">s</code> - 点号匹配所有字符（包括换行符）</li>
                <li><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">u</code> - 使用unicode码的模式</li>
                <li><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">y</code> - 粘性匹配</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const tool: Tool = {
  id: 'regex-tester',
  name: '正则表达式测试',
  description: '测试和调试正则表达式，实时查看匹配结果',
  category: 'dev',
  icon: FiCode,
  component: RegexTester,
  meta: {
    keywords: ['正则', '表达式', 'regex', '匹配', '测试'],
    examples: [
      '\\d+',
      '^https?:\\/\\/.*$',
      '\\b\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}\\b'
    ]
  }
};

export default tool; 
