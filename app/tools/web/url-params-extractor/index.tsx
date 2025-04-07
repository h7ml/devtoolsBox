'use client';

import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiRefreshCw, FiCopy, FiCheck, FiLink } from 'react-icons/fi';
import { Card, CardHeader, CardContent } from '../../../components/design-system/Card';
import Button from '../../../components/design-system/Button';
import { AnimatePresence, motion } from 'framer-motion';

type Param = {
  key: string;
  value: string;
  id: string;
};

const UrlParamsExtractorComponent = () => {
  const [url, setUrl] = useState<string>('https://example.com/path?param1=value1&param2=value2&param3=value3');
  const [params, setParams] = useState<Param[]>([]);
  const [jsonOutput, setJsonOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [rebuiltUrl, setRebuiltUrl] = useState<string>('');

  useEffect(() => {
    if (url) {
      extractParams();
    }
  }, [url]);

  const extractParams = () => {
    try {
      setError(null);
      let urlObj: URL;

      try {
        urlObj = new URL(url);
      } catch (e) {
        // 尝试添加协议前缀，如果缺少
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          urlObj = new URL('https://' + url);
        } else {
          throw e;
        }
      }

      const searchParams = urlObj.searchParams;
      const extractedParams: Param[] = [];

      searchParams.forEach((value, key) => {
        extractedParams.push({
          key,
          value,
          id: generateId()
        });
      });

      setParams(extractedParams);
      updateJsonOutput(extractedParams);
      updateRebuiltUrl(urlObj, extractedParams);
    } catch (e) {
      setError(`URL解析错误: ${e.message}`);
      setParams([]);
      setJsonOutput('');
      setRebuiltUrl('');
    }
  };

  const updateJsonOutput = (paramsList: Param[]) => {
    const paramsObj: Record<string, string> = {};
    paramsList.forEach(param => {
      paramsObj[param.key] = param.value;
    });

    setJsonOutput(JSON.stringify(paramsObj, null, 2));
  };

  const updateRebuiltUrl = (urlObj: URL, paramsList: Param[]) => {
    const newUrl = new URL(urlObj.origin + urlObj.pathname);

    paramsList.forEach(param => {
      newUrl.searchParams.append(param.key, param.value);
    });

    // 添加哈希部分
    if (urlObj.hash) {
      newUrl.hash = urlObj.hash;
    }

    setRebuiltUrl(newUrl.toString());
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearUrl = () => {
    setUrl('');
    setParams([]);
    setJsonOutput('');
    setRebuiltUrl('');
    setError(null);
  };

  const addParam = () => {
    const newParam: Param = {
      key: '',
      value: '',
      id: generateId()
    };

    const newParams = [...params, newParam];
    setParams(newParams);

    // 不立即更新JSON输出，等待用户输入键和值
  };

  const removeParam = (id: string) => {
    const newParams = params.filter(param => param.id !== id);
    setParams(newParams);

    try {
      const urlObj = new URL(url);
      updateJsonOutput(newParams);
      updateRebuiltUrl(urlObj, newParams);
    } catch (e) {
      // 如果URL无效，仅更新JSON输出
      updateJsonOutput(newParams);
    }
  };

  const updateParam = (id: string, field: 'key' | 'value', value: string) => {
    const newParams = params.map(param =>
      param.id === id
        ? { ...param, [field]: value }
        : param
    );

    setParams(newParams);

    try {
      const urlObj = new URL(url);
      updateJsonOutput(newParams);
      updateRebuiltUrl(urlObj, newParams);
    } catch (e) {
      // 如果URL无效，仅更新JSON输出
      updateJsonOutput(newParams);
    }
  };

  const rebuildUrl = () => {
    try {
      let urlObj: URL;

      try {
        urlObj = new URL(url);
      } catch (e) {
        // 如果URL无效，使用默认URL
        urlObj = new URL('https://example.com');
      }

      updateRebuiltUrl(urlObj, params);
      setUrl(rebuiltUrl);
    } catch (e) {
      setError(`URL重建错误: ${e.message}`);
    }
  };

  const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  return (
    <Card className="w-full">
      <CardHeader
        icon={<FiLink className="h-6 w-6" />}
        title="URL参数提取器"
        description="提取和编辑URL中的查询参数"
        gradientColors="from-purple-500 to-purple-600"
      />
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              URL
            </label>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                icon={<FiRefreshCw className="h-4 w-4" />}
                onClick={extractParams}
              >
                提取参数
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={<FiTrash2 className="h-4 w-4" />}
                onClick={handleClearUrl}
              >
                清空
              </Button>
            </div>
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                    font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="输入URL..."
          />
        </div>

        {error && (
          <div className="mb-4 p-3 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              参数列表
            </label>
            <Button
              variant="ghost"
              size="sm"
              icon={<FiPlus className="h-4 w-4" />}
              onClick={addParam}
            >
              添加参数
            </Button>
          </div>

          <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden divide-y divide-gray-300 dark:divide-gray-600">
            {params.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                没有参数
              </div>
            ) : (
              params.map((param) => (
                <div key={param.id} className="p-3 bg-white dark:bg-gray-800 flex flex-wrap md:flex-nowrap items-center gap-2">
                  <div className="w-full md:w-5/12">
                    <input
                      type="text"
                      value={param.key}
                      onChange={(e) => updateParam(param.id, 'key', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded 
                              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                              font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="键"
                    />
                  </div>
                  <div className="w-full md:w-5/12">
                    <input
                      type="text"
                      value={param.value}
                      onChange={(e) => updateParam(param.id, 'value', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded 
                              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                              font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="值"
                    />
                  </div>
                  <div className="w-full md:w-2/12 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<FiTrash2 className="h-4 w-4" />}
                      onClick={() => removeParam(param.id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      删除
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <Button
            onClick={rebuildUrl}
            icon={<FiRefreshCw className="h-4 w-4" />}
            className="w-full md:w-auto"
          >
            重建 URL
          </Button>

          <div className="hidden md:flex items-center space-x-2">
            <AnimatePresence>
              {rebuiltUrl && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    icon={copied ? <FiCheck className="h-4 w-4" /> : <FiCopy className="h-4 w-4" />}
                    onClick={() => handleCopy(rebuiltUrl)}
                  >
                    {copied ? '已复制' : '复制 URL'}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {rebuiltUrl && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-mono text-sm overflow-x-auto">
            {rebuiltUrl}
          </div>
        )}

        <div className="mb-2 flex justify-between items-center">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            JSON输出
          </div>
          {jsonOutput && (
            <Button
              variant="ghost"
              size="sm"
              icon={copied ? <FiCheck className="h-4 w-4" /> : <FiCopy className="h-4 w-4" />}
              onClick={() => handleCopy(jsonOutput)}
            >
              {copied ? '已复制' : '复制'}
            </Button>
          )}
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 font-mono text-sm overflow-auto max-h-64">
          {jsonOutput || '{}'}
        </div>
      </CardContent>
    </Card>
  );
};

// 工具元数据
const urlParamsExtractor = {
  id: 'url-params-extractor',
  name: 'URL参数提取器',
  description: '提取和编辑URL中的查询参数',
  category: 'web',
  icon: FiLink,
  component: UrlParamsExtractorComponent,
  meta: {
    keywords: ['url', '参数', '查询', 'query', 'params', '提取器', '编辑'],
    author: 'DevTools Box',
    version: '1.0.0'
  }
};

export default urlParamsExtractor; 
