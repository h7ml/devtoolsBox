'use client';

import { useState, useEffect } from 'react';
import { FiCopy, FiRefreshCw } from 'react-icons/fi';
import { Tool } from '../../../lib/tools-registry/types';
import { FiClock } from 'react-icons/fi';

const TimestampConverter = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timestamp, setTimestamp] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [dateString, setDateString] = useState<string>(new Date().toISOString().substring(0, 19));
  const [sourceFormat, setSourceFormat] = useState<'seconds' | 'milliseconds'>('seconds');
  const [error, setError] = useState<string | null>(null);

  // 刷新当前时间
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // 从时间戳转换到日期字符串
  const convertTimestampToDate = (value: string, format: 'seconds' | 'milliseconds') => {
    try {
      setError(null);
      const numValue = parseInt(value.trim(), 10);

      if (isNaN(numValue)) {
        throw new Error('无效的时间戳');
      }

      // 转换时间戳为毫秒
      const timeInMs = format === 'seconds' ? numValue * 1000 : numValue;

      // 检查时间戳是否有效
      if (timeInMs < 0 || timeInMs > 8640000000000000) {
        throw new Error('时间戳超出有效范围');
      }

      const date = new Date(timeInMs);

      // 检查日期是否有效
      if (isNaN(date.getTime())) {
        throw new Error('无法转换为有效日期');
      }

      setDateString(date.toISOString().substring(0, 19).replace('T', ' '));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // 从日期字符串转换到时间戳
  const convertDateToTimestamp = (value: string) => {
    try {
      setError(null);
      const date = new Date(value.replace(' ', 'T'));

      if (isNaN(date.getTime())) {
        throw new Error('无效的日期格式');
      }

      const timeInMs = date.getTime();
      setTimestamp(sourceFormat === 'seconds' ? Math.floor(timeInMs / 1000).toString() : timeInMs.toString());
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // 处理时间戳输入变化
  const handleTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTimestamp(value);
    if (value) {
      convertTimestampToDate(value, sourceFormat);
    }
  };

  // 处理日期字符串输入变化
  const handleDateStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateString(value);
    if (value) {
      convertDateToTimestamp(value);
    }
  };

  // 切换时间戳格式
  const handleFormatChange = (format: 'seconds' | 'milliseconds') => {
    if (format === sourceFormat) return;

    setSourceFormat(format);
    if (timestamp) {
      try {
        const numValue = parseInt(timestamp.trim(), 10);
        if (!isNaN(numValue)) {
          if (format === 'seconds' && sourceFormat === 'milliseconds') {
            // 毫秒转秒
            setTimestamp(Math.floor(numValue / 1000).toString());
          } else if (format === 'milliseconds' && sourceFormat === 'seconds') {
            // 秒转毫秒
            setTimestamp((numValue * 1000).toString());
          }
        }
      } catch (err) {
        console.error('格式转换错误:', err);
      }
    }
  };

  // 使用当前时间
  const useCurrentTime = () => {
    const now = new Date();

    if (sourceFormat === 'seconds') {
      setTimestamp(Math.floor(now.getTime() / 1000).toString());
    } else {
      setTimestamp(now.getTime().toString());
    }

    setDateString(now.toISOString().substring(0, 19).replace('T', ' '));
    setError(null);
  };

  // 复制到剪贴板
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

  // 格式化当前时间显示
  const formatCurrentTime = () => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };

    return currentTime.toLocaleString(undefined, options);
  };

  const formatTimezoneOffset = () => {
    const offset = currentTime.getTimezoneOffset();
    const hours = Math.abs(Math.floor(offset / 60));
    const minutes = Math.abs(offset % 60);
    return `${offset <= 0 ? '+' : '-'}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">时间戳转换工具</h1>
        <p className="text-gray-600 dark:text-gray-300">
          在Unix时间戳和人类可读日期之间相互转换
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6">
          {/* 当前时间显示 */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <div className="flex items-center mb-4 md:mb-0">
              <FiClock className="h-6 w-6 text-blue-600 dark:text-blue-300 mr-2" />
              <div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  当前时间: {formatCurrentTime()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  时区: GMT{formatTimezoneOffset()}
                </div>
              </div>
            </div>

            <button
              onClick={useCurrentTime}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              <FiRefreshCw className="h-4 w-4 mr-2" />
              使用当前时间
            </button>
          </div>

          {/* 转换控制 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 时间戳部分 */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-lg font-medium text-gray-900 dark:text-white">
                  Unix 时间戳
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleFormatChange('seconds')}
                    className={`px-3 py-1 text-xs rounded-md ${sourceFormat === 'seconds'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}
                  >
                    秒
                  </button>
                  <button
                    onClick={() => handleFormatChange('milliseconds')}
                    className={`px-3 py-1 text-xs rounded-md ${sourceFormat === 'milliseconds'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}
                  >
                    毫秒
                  </button>
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={timestamp}
                  onChange={handleTimestampChange}
                  className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder={sourceFormat === 'seconds' ? '13位UNIX时间戳(秒)' : '10位UNIX时间戳(毫秒)'}
                />
                <button
                  onClick={() => copyToClipboard(timestamp)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title="复制"
                >
                  <FiCopy className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">时间戳示例：</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      const example = sourceFormat === 'seconds' ? '1609459200' : '1609459200000';
                      setTimestamp(example);
                      convertTimestampToDate(example, sourceFormat);
                    }}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline text-left"
                  >
                    2021-01-01 00:00:00
                  </button>
                  <button
                    onClick={() => {
                      const example = sourceFormat === 'seconds' ? '1640995200' : '1640995200000';
                      setTimestamp(example);
                      convertTimestampToDate(example, sourceFormat);
                    }}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline text-left"
                  >
                    2022-01-01 00:00:00
                  </button>
                </div>
              </div>
            </div>

            {/* 日期时间部分 */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-gray-900 dark:text-white">
                日期时间
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={dateString}
                  onChange={handleDateStringChange}
                  className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="YYYY-MM-DD HH:MM:SS"
                />
                <button
                  onClick={() => copyToClipboard(dateString)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title="复制"
                >
                  <FiCopy className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">支持的日期格式：</p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>YYYY-MM-DD HH:MM:SS</li>
                  <li>YYYY/MM/DD HH:MM:SS</li>
                  <li>MM/DD/YYYY HH:MM:SS</li>
                  <li>YYYY-MM-DDTHH:MM:SS (ISO 8601)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 错误信息 */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-md">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">什么是Unix时间戳？</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Unix时间戳是从UTC时间1970年1月1日00:00:00开始计算的总秒数。它是一种跨平台的时间表示方式，广泛用于计算机系统和编程中。
          </p>

          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">时间戳的应用场景</h4>
          <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 list-disc list-inside mb-4">
            <li>数据库记录创建和修改时间</li>
            <li>日志记录和事件追踪</li>
            <li>数据排序和比较</li>
            <li>API交互中的时间表示</li>
            <li>缓存控制和过期时间设置</li>
          </ul>

          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">使用提示</h4>
          <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
            <li>秒级时间戳通常是10位数字（截止2286年）</li>
            <li>毫秒级时间戳通常是13位数字</li>
            <li>在JavaScript中，<code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">Date.now()</code> 返回的是毫秒时间戳</li>
            <li>在大多数编程语言中，当前时间戳可以通过类似 <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">time()</code> 的函数获取</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const tool: Tool = {
  id: 'timestamp',
  name: '时间戳转换',
  description: '在Unix时间戳和人类可读日期之间相互转换',
  category: 'dev',
  icon: FiClock,
  component: TimestampConverter,
  meta: {
    keywords: ['时间戳', 'unix', '日期', '转换', 'timestamp'],
    examples: [
      '1609459200',
      '2021-01-01 00:00:00'
    ]
  }
};

export default tool; 
