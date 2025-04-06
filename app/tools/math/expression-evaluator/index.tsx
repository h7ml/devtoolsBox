'use client';

import { useState, useEffect } from 'react';
import { FiHash, FiCopy, FiCheck, FiRefreshCw, FiArrowRight } from 'react-icons/fi';
import { TbMathFunction, TbMathSymbols } from 'react-icons/tb';
import { Tool } from '../../../lib/tools-registry/types';
import { Card, CardHeader, Button, Input } from '../../../components/design-system';
import * as math from 'mathjs';

// 表达式历史记录类型
interface History {
  expression: string;
  result: string;
  timestamp: number;
}

// 操作类型
enum OperationType {
  Basic = 'basic',
  Scientific = 'scientific',
  Constants = 'constants'
}

// 示例表达式
const examples = [
  { expression: '2 + 2 * 3', description: '基本算术' },
  { expression: 'sin(45 deg)', description: '三角函数' },
  { expression: 'log(100, 10)', description: '对数' },
  { expression: '3^2 + 4^2', description: '幂运算' },
  { expression: '(5+3) * (10-7)', description: '括号与优先级' },
  { expression: 'sqrt(16) + cbrt(27)', description: '开方函数' },
  { expression: 'derivative("x^2", "x")', description: '求导数' },
  { expression: 'pi * 3^2', description: '圆面积' }
];

// 操作按钮组
const operations = {
  [OperationType.Basic]: [
    { label: '(', value: '(' },
    { label: ')', value: ')' },
    { label: '^', value: '^' },
    { label: '÷', value: '/' },
    { label: '×', value: '*' },
    { label: '-', value: '-' },
    { label: '+', value: '+' },
    { label: '.', value: '.' },
    { label: '=', value: '=' }
  ],
  [OperationType.Scientific]: [
    { label: 'sin', value: 'sin(' },
    { label: 'cos', value: 'cos(' },
    { label: 'tan', value: 'tan(' },
    { label: 'ln', value: 'log(' },
    { label: 'log', value: 'log10(' },
    { label: 'sqrt', value: 'sqrt(' },
    { label: 'cbrt', value: 'cbrt(' },
    { label: 'abs', value: 'abs(' },
    { label: 'exp', value: 'exp(' }
  ],
  [OperationType.Constants]: [
    { label: 'π', value: 'pi' },
    { label: 'e', value: 'e' },
    { label: 'φ', value: '(1+sqrt(5))/2' },
    { label: 'deg', value: ' deg' },
    { label: 'rad', value: ' rad' },
    { label: '!', value: '!' },
    { label: '%', value: '%' },
    { label: 'i', value: 'i' },
    { label: '∞', value: 'Infinity' }
  ]
};

const ExpressionEvaluator = () => {
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [history, setHistory] = useState<History[]>([]);
  const [activeOperation, setActiveOperation] = useState<OperationType>(OperationType.Basic);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 计算表达式
  const evaluateExpression = () => {
    if (!expression.trim()) {
      setError('请输入表达式');
      return;
    }

    try {
      setError(null);
      // 使用mathjs库计算表达式
      const evalResult = math.evaluate(expression);

      // 格式化结果
      let formattedResult: string;

      if (math.typeOf(evalResult) === 'Unit') {
        formattedResult = evalResult.toString();
      } else if (math.typeOf(evalResult) === 'Matrix') {
        formattedResult = math.format(evalResult, { precision: 10 });
      } else if (typeof evalResult === 'number') {
        // 处理小数精度问题
        formattedResult = math.format(evalResult, { precision: 10 });
        // 移除不必要的尾随0
        formattedResult = formattedResult.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
      } else {
        formattedResult = evalResult.toString();
      }

      setResult(formattedResult);

      // 添加到历史记录
      setHistory(prev => [
        {
          expression,
          result: formattedResult,
          timestamp: Date.now()
        },
        ...prev
      ].slice(0, 10)); // 只保留最近10条记录
    } catch (e: any) {
      setError(e.message || '计算错误');
    }
  };

  // 插入操作符或函数到表达式
  const insertOperation = (value: string) => {
    if (value === '=') {
      evaluateExpression();
      return;
    }

    setExpression(prev => prev + value);
  };

  // 插入数字到表达式
  const insertNumber = (num: number) => {
    setExpression(prev => prev + num.toString());
  };

  // 清除表达式
  const clearExpression = () => {
    setExpression('');
    setResult('');
    setError(null);
  };

  // 回退一个字符
  const backspace = () => {
    setExpression(prev => prev.slice(0, -1));
  };

  // 使用历史记录中的表达式
  const useHistory = (item: History) => {
    setExpression(item.expression);
    setResult(item.result);
  };

  // 加载示例表达式
  const loadExample = (expr: string) => {
    setExpression(expr);
  };

  // 复制结果到剪贴板
  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 键盘支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        evaluateExpression();
      } else if (e.key === 'Escape') {
        clearExpression();
      } else if (e.key === 'Backspace') {
        backspace();
      } else if (/^[0-9+\-*/.()^]$/.test(e.key)) {
        setExpression(prev => prev + e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression]);

  // 格式化时间戳
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader
            icon={<FiHash className="h-6 w-6" />}
            title="数学表达式计算器"
            description="计算各种数学表达式，支持高级函数和常量"
            gradientColors="from-blue-500 to-indigo-600"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：计算器 */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <Input
                  label="数学表达式"
                  value={expression}
                  onChange={(e) => setExpression(e.target.value)}
                  placeholder="输入数学表达式，如 2 + 2 * 3"
                  onKeyDown={(e) => e.key === 'Enter' && evaluateExpression()}
                  gradient
                />
                {error && (
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                    {error}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">计算结果</div>
                <Button
                  size="sm"
                  variant={copied ? 'primary' : 'ghost'}
                  disabled={!result}
                  onClick={copyResult}
                  icon={copied ? <FiCheck className="h-3.5 w-3.5" /> : <FiCopy className="h-3.5 w-3.5" />}
                >
                  {copied ? '已复制' : '复制'}
                </Button>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-6">
                <div className="font-mono text-lg font-medium overflow-x-auto whitespace-pre-wrap break-all">
                  {result || '结果将显示在这里'}
                </div>
              </div>

              {/* 操作类型切换按钮 */}
              <div className="flex items-center space-x-2 mb-3">
                <Button
                  size="sm"
                  variant={activeOperation === OperationType.Basic ? 'primary' : 'outline'}
                  onClick={() => setActiveOperation(OperationType.Basic)}
                  icon={<TbMathSymbols className="h-3.5 w-3.5" />}
                >
                  基础
                </Button>
                <Button
                  size="sm"
                  variant={activeOperation === OperationType.Scientific ? 'primary' : 'outline'}
                  onClick={() => setActiveOperation(OperationType.Scientific)}
                  icon={<TbMathFunction className="h-3.5 w-3.5" />}
                >
                  科学
                </Button>
                <Button
                  size="sm"
                  variant={activeOperation === OperationType.Constants ? 'primary' : 'outline'}
                  onClick={() => setActiveOperation(OperationType.Constants)}
                >
                  常量
                </Button>
              </div>

              {/* 操作按钮 */}
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 mb-6">
                {/* 数字 */}
                {activeOperation === OperationType.Basic && (
                  <>
                    {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0].map((num) => (
                      <Button
                        key={num}
                        size="sm"
                        variant="outline"
                        onClick={() => insertNumber(num)}
                        className="h-10"
                      >
                        {num}
                      </Button>
                    ))}
                  </>
                )}

                {/* 操作符和函数 */}
                {operations[activeOperation].map((op, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="outline"
                    onClick={() => insertOperation(op.value)}
                    className="h-10"
                  >
                    {op.label}
                  </Button>
                ))}

                {/* 控制按钮始终显示 */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={backspace}
                  className="h-10"
                >
                  ⌫
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearExpression}
                  className="h-10"
                >
                  C
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={evaluateExpression}
                  className="h-10"
                  icon={<FiArrowRight className="h-3.5 w-3.5" />}
                >
                  计算
                </Button>
              </div>

              {/* 示例表达式 */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">示例表达式</h3>
                <div className="flex flex-wrap gap-2">
                  {examples.map((example, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="ghost"
                      onClick={() => loadExample(example.expression)}
                      title={example.description}
                    >
                      {example.expression}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧：历史记录 */}
            <div>
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">计算历史</h3>
              </div>

              {history.length > 0 ? (
                <div className="space-y-2">
                  {history.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                      onClick={() => useHistory(item)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-mono text-sm text-gray-600 dark:text-gray-400 truncate max-w-[80%]">
                          {item.expression}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          {formatTime(item.timestamp)}
                        </div>
                      </div>
                      <div className="font-mono text-sm font-medium">
                        = {item.result}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
                  <div className="text-gray-500 dark:text-gray-400 text-sm">
                    计算历史将显示在这里
                  </div>
                </div>
              )}

              {history.length > 0 && (
                <div className="mt-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={<FiRefreshCw className="h-3.5 w-3.5" />}
                    onClick={() => setHistory([])}
                    className="w-full"
                  >
                    清除历史
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <h3 className="font-medium text-sm">支持的操作:</h3>
            <p>• <strong>基础运算</strong>: 加(+)、减(-)、乘(*)、除(/)、幂(^)、括号</p>
            <p>• <strong>三角函数</strong>: sin(), cos(), tan(), asin(), acos(), atan()</p>
            <p>• <strong>指数和对数</strong>: exp(), log(), log10(), ln()</p>
            <p>• <strong>常量</strong>: pi(π), e, i(虚数单位)</p>
            <p>• <strong>其他函数</strong>: abs(), sqrt(), cbrt(), derivative()</p>
            <p>• <strong>单位</strong>: 角度(deg)、弧度(rad)</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

const tool: Tool = {
  id: 'expression-evaluator',
  name: '数学表达式计算器',
  description: '计算各种数学表达式，支持高级函数和常量',
  category: 'math',
  icon: FiHash,
  component: ExpressionEvaluator,
  meta: {
    keywords: ['math', 'calculator', 'expression', 'evaluation', 'scientific', '数学', '计算器', '表达式', '计算', '科学'],
    examples: [
      '2 + 2 * 3',
      'sin(45 deg)',
      'log(100, 10)',
      '(5+3) * (10-7)'
    ],
    version: '1.0.0'
  }
};

export default tool; 
