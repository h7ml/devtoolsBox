'use client';

import { useState, useEffect } from 'react';
import { FiClock, FiCopy, FiCheck, FiRefreshCw, FiMaximize, FiMinimize } from 'react-icons/fi';
import { VscDiffAdded, VscDiffRemoved, VscDiffModified } from 'react-icons/vsc';
import { Tool } from '../../../lib/tools-registry/types';
import { Card, CardHeader, Button, Input } from '../../../components/design-system';
import * as Diff from 'diff';

// 差异行类型
type LineType = 'added' | 'removed' | 'unchanged' | 'modified';

// 差异行结构
interface DiffLine {
  content: string;
  type: LineType;
  lineNumber: { left?: number; right?: number };
}

// 差异数据结构
interface DiffData {
  lines: DiffLine[];
  stats: {
    additions: number;
    deletions: number;
    modifications: number;
    unchanged: number;
  };
}

// 示例数据
const sampleTexts = [
  {
    left: `function calculateTax(income) {
  // 计算基本税额
  let tax = 0;
  
  if (income <= 10000) {
    tax = income * 0.1;
  } else if (income <= 50000) {
    tax = 1000 + (income - 10000) * 0.2;
  } else {
    tax = 9000 + (income - 50000) * 0.3;
  }
  
  // 四舍五入到最接近的整数
  return Math.round(tax);
}`,
    right: `function calculateTax(income, taxRate = 0.1) {
  // 计算应缴税额
  let tax = 0;
  
  if (income <= 10000) {
    tax = income * taxRate;
  } else if (income <= 50000) {
    tax = 1000 + (income - 10000) * 0.2;
  } else if (income <= 100000) {
    tax = 9000 + (income - 50000) * 0.3;
  } else {
    tax = 24000 + (income - 100000) * 0.4;
  }
  
  // 四舍五入到最接近的两位小数
  return Math.round(tax * 100) / 100;
}`
  },
  {
    left: `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <h2>计数器: {count}</h2>
      <button onClick={() => setCount(count + 1)}>
        增加
      </button>
      <button onClick={() => setCount(count - 1)}>
        减少
      </button>
    </div>
  );
}

export default Counter;`,
    right: `import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = \`当前计数: \${count}\`;
  }, [count]);
  
  return (
    <div className="counter">
      <h2>计数器: {count}</h2>
      <div className="buttons">
        <button onClick={() => setCount(count + 1)}>
          增加
        </button>
        <button onClick={() => setCount(count - 1)}>
          减少
        </button>
        <button onClick={() => setCount(0)}>
          重置
        </button>
      </div>
    </div>
  );
}

export default Counter;`
  }
];

const DiffChecker = () => {
  const [leftText, setLeftText] = useState<string>('');
  const [rightText, setRightText] = useState<string>('');
  const [diffResult, setDiffResult] = useState<DiffData | null>(null);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [copyStatus, setCopyStatus] = useState<{ left: boolean, right: boolean }>({ left: false, right: false });
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(true);
  const [ignoreCase, setIgnoreCase] = useState<boolean>(false);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState<boolean>(false);

  // 计算文本差异
  useEffect(() => {
    if (!leftText.trim() && !rightText.trim()) {
      setDiffResult(null);
      return;
    }

    computeDiff();
  }, [leftText, rightText, ignoreCase, ignoreWhitespace]);

  // 计算差异
  const computeDiff = () => {
    let processedLeft = leftText;
    let processedRight = rightText;

    // 应用忽略大小写
    if (ignoreCase) {
      processedLeft = processedLeft.toLowerCase();
      processedRight = processedRight.toLowerCase();
    }

    // 应用忽略空白
    if (ignoreWhitespace) {
      processedLeft = processedLeft.replace(/\s+/g, ' ').trim();
      processedRight = processedRight.replace(/\s+/g, ' ').trim();
    }

    // 计算行级差异
    const diffLines = Diff.diffLines(processedLeft, processedRight);

    // 转换为我们的数据结构
    const lines: DiffLine[] = [];
    let leftLineNumber = 1;
    let rightLineNumber = 1;

    const stats = {
      additions: 0,
      deletions: 0,
      modifications: 0,
      unchanged: 0
    };

    diffLines.forEach((part) => {
      const partLines = part.value.split('\n');
      // 处理最后一个空行
      if (partLines[partLines.length - 1] === '') {
        partLines.pop();
      }

      if (part.added) {
        // 添加的行
        partLines.forEach((line) => {
          lines.push({
            content: line,
            type: 'added',
            lineNumber: { right: rightLineNumber++ }
          });
        });
        stats.additions += partLines.length;
      } else if (part.removed) {
        // 删除的行
        partLines.forEach((line) => {
          lines.push({
            content: line,
            type: 'removed',
            lineNumber: { left: leftLineNumber++ }
          });
        });
        stats.deletions += partLines.length;
      } else {
        // 未变更的行
        partLines.forEach((line) => {
          lines.push({
            content: line,
            type: 'unchanged',
            lineNumber: { left: leftLineNumber++, right: rightLineNumber++ }
          });
        });
        stats.unchanged += partLines.length;
      }
    });

    // 找到应该标记为修改的行
    markModifiedLines(lines);

    setDiffResult({ lines, stats });
  };

  // 标记修改过的行（相邻的添加和删除）
  const markModifiedLines = (lines: DiffLine[]) => {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].type === 'removed' && i + 1 < lines.length && lines[i + 1].type === 'added') {
        lines[i].type = 'modified';
        lines[i + 1].type = 'modified';

        // 保存行号对应关系
        lines[i].lineNumber.right = lines[i + 1].lineNumber.right;
        lines[i + 1].lineNumber.left = lines[i].lineNumber.left;

        i++; // 跳过下一行，因为我们已经处理了它
      }
    }
  };

  // 清空
  const clearAll = () => {
    setLeftText('');
    setRightText('');
    setDiffResult(null);
  };

  // 复制
  const copyText = (side: 'left' | 'right') => {
    const textToCopy = side === 'left' ? leftText : rightText;
    navigator.clipboard.writeText(textToCopy);

    // 显示复制成功状态
    setCopyStatus({
      ...copyStatus,
      [side]: true
    });

    // 2秒后重置状态
    setTimeout(() => {
      setCopyStatus({
        ...copyStatus,
        [side]: false
      });
    }, 2000);
  };

  // 加载示例
  const loadExample = (index: number) => {
    if (sampleTexts[index]) {
      setLeftText(sampleTexts[index].left);
      setRightText(sampleTexts[index].right);
    }
  };

  // 获取差异行的类型样式
  const getLineStyle = (type: LineType) => {
    switch (type) {
      case 'added':
        return 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500';
      case 'removed':
        return 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500';
      case 'modified':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500';
      default:
        return 'bg-white dark:bg-gray-900';
    }
  };

  // 获取差异行的图标
  const getDiffIcon = (type: LineType) => {
    switch (type) {
      case 'added':
        return <VscDiffAdded className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'removed':
        return <VscDiffRemoved className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case 'modified':
        return <VscDiffModified className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      default:
        return null;
    }
  };

  // 获取统计摘要
  const getStatsSummary = () => {
    if (!diffResult) return null;

    const { stats } = diffResult;
    return (
      <div className="flex gap-6 text-sm font-medium">
        <div className="flex items-center gap-1.5">
          <VscDiffAdded className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span>{stats.additions} 添加</span>
        </div>
        <div className="flex items-center gap-1.5">
          <VscDiffRemoved className="w-4 h-4 text-red-600 dark:text-red-400" />
          <span>{stats.deletions} 删除</span>
        </div>
        <div className="flex items-center gap-1.5">
          <VscDiffModified className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          <span>{stats.modifications / 2} 修改</span>
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full max-w-7xl mx-auto ${isFullScreen ? 'fixed inset-0 z-50 bg-gray-100 dark:bg-gray-950 p-4 overflow-auto' : ''}`}>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader
            icon={<FiClock className="h-6 w-6" />}
            title="文本差异比较"
            description="比较两段文本之间的差异"
            gradientColors="from-amber-500 to-orange-600"
          />

          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => loadExample(0)}
              >
                示例 1: 函数代码
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => loadExample(1)}
              >
                示例 2: React 组件
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={ignoreCase ? 'primary' : 'ghost'}
                onClick={() => setIgnoreCase(!ignoreCase)}
              >
                忽略大小写
              </Button>
              <Button
                size="sm"
                variant={ignoreWhitespace ? 'primary' : 'ghost'}
                onClick={() => setIgnoreWhitespace(!ignoreWhitespace)}
              >
                忽略空白
              </Button>
              <Button
                size="sm"
                variant={showLineNumbers ? 'primary' : 'ghost'}
                onClick={() => setShowLineNumbers(!showLineNumbers)}
              >
                行号
              </Button>
              <Button
                size="sm"
                variant="ghost"
                icon={<FiRefreshCw className="h-3.5 w-3.5" />}
                onClick={clearAll}
              >
                清空
              </Button>
              <Button
                size="sm"
                variant="ghost"
                icon={isFullScreen ? <FiMinimize className="h-3.5 w-3.5" /> : <FiMaximize className="h-3.5 w-3.5" />}
                onClick={() => setIsFullScreen(!isFullScreen)}
              >
                {isFullScreen ? '退出全屏' : '全屏'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* 左侧输入区域 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  原始文本
                </label>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={!leftText}
                  onClick={() => copyText('left')}
                  icon={copyStatus.left ? <FiCheck className="h-3 w-3" /> : <FiCopy className="h-3 w-3" />}
                >
                  {copyStatus.left ? '已复制' : '复制'}
                </Button>
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <textarea
                  className="w-full h-64 p-4 bg-white dark:bg-gray-900 font-mono text-sm focus:outline-none focus:ring-0"
                  value={leftText}
                  onChange={(e) => setLeftText(e.target.value)}
                  placeholder="请输入原始文本..."
                ></textarea>
              </div>
            </div>

            {/* 右侧输入区域 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  比较文本
                </label>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={!rightText}
                  onClick={() => copyText('right')}
                  icon={copyStatus.right ? <FiCheck className="h-3 w-3" /> : <FiCopy className="h-3 w-3" />}
                >
                  {copyStatus.right ? '已复制' : '复制'}
                </Button>
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <textarea
                  className="w-full h-64 p-4 bg-white dark:bg-gray-900 font-mono text-sm focus:outline-none focus:ring-0"
                  value={rightText}
                  onChange={(e) => setRightText(e.target.value)}
                  placeholder="请输入比较文本..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* 差异结果区域 */}
          {diffResult && (
            <div className="mt-6">
              <div className="flex flex-wrap items-center justify-between mb-3">
                <h3 className="text-base font-medium text-gray-800 dark:text-gray-200">差异结果</h3>
                {getStatsSummary()}
              </div>

              <div className={`rounded-xl border border-gray-200 dark:border-gray-700 ${isFullScreen ? 'h-[calc(100vh-280px)]' : 'max-h-[600px]'} overflow-auto`}>
                <div className="font-mono text-sm whitespace-pre overflow-x-auto">
                  <table className="w-full border-collapse">
                    <tbody>
                      {diffResult.lines.map((line, index) => (
                        <tr key={index} className={`${getLineStyle(line.type)}`}>
                          {showLineNumbers && (
                            <>
                              <td className="px-3 py-1 text-right select-none text-xs text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 min-w-12 w-12">
                                {line.lineNumber.left || ''}
                              </td>
                              <td className="px-3 py-1 text-right select-none text-xs text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 min-w-12 w-12">
                                {line.lineNumber.right || ''}
                              </td>
                            </>
                          )}
                          <td className="py-1 pl-2 pr-4 flex items-center gap-2">
                            <span className="w-4 inline-flex items-center">
                              {getDiffIcon(line.type)}
                            </span>
                            <span>{line.content}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p>• <span className="inline-flex items-center"><VscDiffAdded className="w-3 h-3 text-green-600 dark:text-green-400 mr-1" /> 绿色</span>: 添加的行</p>
            <p>• <span className="inline-flex items-center"><VscDiffRemoved className="w-3 h-3 text-red-600 dark:text-red-400 mr-1" /> 红色</span>: 删除的行</p>
            <p>• <span className="inline-flex items-center"><VscDiffModified className="w-3 h-3 text-yellow-600 dark:text-yellow-400 mr-1" /> 黄色</span>: 修改的行</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

const tool: Tool = {
  id: 'diff-checker',
  name: '文本差异比较',
  description: '比较两段文本之间的行级差异',
  category: 'formatter',
  icon: FiClock,
  component: DiffChecker,
  meta: {
    keywords: ['diff', 'compare', 'text', 'difference', 'checker', '差异', '比较', '文本', '对比'],
    examples: [
      '比较两个代码版本',
      '查看文本修改前后差异',
      '代码差异对比'
    ],
    version: '1.0.0'
  }
};

export default tool; 
