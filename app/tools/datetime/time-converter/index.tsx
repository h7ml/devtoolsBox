'use client';

import { useState, useEffect } from 'react';
import { FiClock, FiCopy, FiRefreshCw, FiCheck, FiArrowRight } from 'react-icons/fi';
import { Tool } from '../../../lib/tools-registry/types';
import { Card, CardHeader, Button, Input } from '../../../components/design-system';

type TimeFormat = 'timestamp' | 'iso' | 'locale' | 'custom';

interface TimeResult {
  timestamp: number;
  iso: string;
  locale: string;
  utc: string;
  custom: string;
}

const TimeConverter = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [inputFormat, setInputFormat] = useState<TimeFormat>('timestamp');
  const [customFormat, setCustomFormat] = useState<string>('YYYY-MM-DD HH:mm:ss');
  const [result, setResult] = useState<TimeResult | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  // 每秒更新当前时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 设置当前时间
  const useCurrentTime = () => {
    const now = new Date();

    if (inputFormat === 'timestamp') {
      setInputValue(now.getTime().toString());
    } else if (inputFormat === 'iso') {
      setInputValue(now.toISOString());
    } else if (inputFormat === 'locale') {
      setInputValue(now.toLocaleString());
    }

    convertTime();
  };

  // 时间转换功能
  const convertTime = () => {
    try {
      setError(null);

      if (!inputValue.trim()) {
        setResult(null);
        return;
      }

      let date: Date;

      // 根据输入格式解析时间
      if (inputFormat === 'timestamp') {
        const timestamp = parseInt(inputValue, 10);
        if (isNaN(timestamp)) {
          throw new Error('无效的时间戳');
        }
        date = new Date(timestamp);
      } else if (inputFormat === 'iso') {
        date = new Date(inputValue);
      } else if (inputFormat === 'locale') {
        date = new Date(inputValue);
      } else {
        date = new Date(inputValue);
      }

      // 检查日期是否有效
      if (isNaN(date.getTime())) {
        throw new Error('无效的日期格式');
      }

      // 格式化自定义日期 (简化版，实际应该使用如dayjs等库)
      const customFormatted = formatCustomDate(date, customFormat);

      setResult({
        timestamp: date.getTime(),
        iso: date.toISOString(),
        locale: date.toLocaleString('zh-CN'),
        utc: date.toUTCString(),
        custom: customFormatted,
      });
    } catch (err: any) {
      setError(err.message || '时间转换错误');
      setResult(null);
    }
  };

  // 简单的自定义日期格式化函数(仅支持基本格式)
  const formatCustomDate = (date: Date, format: string): string => {
    const pad = (n: number): string => n < 10 ? `0${n}` : `${n}`;

    return format
      .replace('YYYY', date.getFullYear().toString())
      .replace('MM', pad(date.getMonth() + 1))
      .replace('DD', pad(date.getDate()))
      .replace('HH', pad(date.getHours()))
      .replace('mm', pad(date.getMinutes()))
      .replace('ss', pad(date.getSeconds()))
      .replace('SSS', pad(date.getMilliseconds()));
  };

  const copyToClipboard = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  // 渲染结果行
  const renderResultRow = (label: string, value: string, fieldName: string) => (
    <div className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-800">
      <div className="text-sm">
        <span className="text-gray-600 dark:text-gray-400 font-medium">{label}:</span>
        <span className="ml-2 font-mono text-gray-900 dark:text-gray-100">{value}</span>
      </div>
      <Button
        size="sm"
        variant="ghost"
        icon={copied === fieldName ? <FiCheck className="h-3.5 w-3.5" /> : <FiCopy className="h-3.5 w-3.5" />}
        onClick={() => copyToClipboard(value, fieldName)}
      >
        {copied === fieldName ? '已复制' : '复制'}
      </Button>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader
            icon={<FiClock className="h-6 w-6" />}
            title="时间转换工具"
            description="在不同时间格式之间转换，支持时间戳、ISO格式等"
            gradientColors="from-amber-500 to-yellow-600"
          />

          <div className="flex flex-col lg:flex-row gap-6">
            {/* 左侧输入区域 */}
            <div className="flex-1">
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10 p-4 rounded-xl mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">当前时间</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={useCurrentTime}
                    icon={<FiRefreshCw className="h-3.5 w-3.5" />}
                  >
                    使用当前时间
                  </Button>
                </div>
                <div className="font-mono text-lg text-amber-700 dark:text-amber-400">{new Date(currentTime).toLocaleString('zh-CN')}</div>
                <div className="mt-1 font-mono text-xs text-amber-600/80 dark:text-amber-500/80">{currentTime.toString()}</div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    输入格式
                  </label>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    size="sm"
                    variant={inputFormat === 'timestamp' ? 'primary' : 'outline'}
                    onClick={() => setInputFormat('timestamp')}
                  >
                    时间戳
                  </Button>
                  <Button
                    size="sm"
                    variant={inputFormat === 'iso' ? 'primary' : 'outline'}
                    onClick={() => setInputFormat('iso')}
                  >
                    ISO 8601
                  </Button>
                  <Button
                    size="sm"
                    variant={inputFormat === 'locale' ? 'primary' : 'outline'}
                    onClick={() => setInputFormat('locale')}
                  >
                    本地时间
                  </Button>
                </div>

                <Input
                  label="输入时间"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={inputFormat === 'timestamp'
                    ? '输入时间戳，如: 1609459200000'
                    : inputFormat === 'iso'
                      ? '输入ISO格式时间，如: 2021-01-01T08:00:00.000Z'
                      : '输入本地时间，如: 2021/01/01 08:00:00'
                  }
                  className="mb-4"
                  gradient
                />

                <Button
                  onClick={convertTime}
                  gradient
                  fullWidth
                  icon={<FiArrowRight className="h-4 w-4" />}
                >
                  转换时间
                </Button>
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                  <p className="font-medium">错误:</p>
                  <p>{error}</p>
                </div>
              )}
            </div>

            {/* 右侧结果区域 */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  转换结果
                </label>
                <Input
                  value={customFormat}
                  onChange={(e) => setCustomFormat(e.target.value)}
                  placeholder="自定义格式: YYYY-MM-DD HH:mm:ss"
                  className="w-64"
                  inputClassName="text-xs"
                />
              </div>

              {result ? (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                  {renderResultRow('时间戳 (毫秒)', result.timestamp.toString(), 'timestamp')}
                  {renderResultRow('ISO 8601', result.iso, 'iso')}
                  {renderResultRow('本地时间', result.locale, 'locale')}
                  {renderResultRow('UTC 时间', result.utc, 'utc')}
                  {renderResultRow('自定义格式', result.custom, 'custom')}
                </div>
              ) : (
                <div className="p-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-600">
                  <span>转换结果将显示在这里</span>
                </div>
              )}

              <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <p>• <strong>时间戳</strong>: 自1970年1月1日UTC零点以来的毫秒数</p>
                <p>• <strong>ISO 8601</strong>: 国际标准格式，例如 2021-01-01T00:00:00.000Z</p>
                <p>• <strong>自定义格式</strong>: 支持YYYY(年)、MM(月)、DD(日)、HH(时)、mm(分)、ss(秒)</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const tool: Tool = {
  id: 'time-converter',
  name: '时间转换',
  description: '在各种时间格式间转换，支持时间戳、ISO 8601等格式',
  category: 'datetime',
  icon: FiClock,
  component: TimeConverter,
  meta: {
    keywords: ['time', 'date', 'timestamp', 'converter', 'ISO 8601', 'UTC', 'GMT', '时间戳', '时间转换', 'Unix时间戳'],
    examples: [
      '1609459200000',
      '2021-01-01T08:00:00.000Z',
      '2021/01/01 16:00:00'
    ],
    version: '1.0.0'
  }
};

export default tool; 
