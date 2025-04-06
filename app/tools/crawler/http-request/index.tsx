'use client';

import { useState } from 'react';
import { FiSend, FiCopy, FiTrash2, FiPlus, FiMinus, FiCode, FiGlobe, FiCheck, FiX, FiSave, FiRefreshCw, FiClock, FiHash, FiAlertCircle } from 'react-icons/fi';
import { Tool } from '../../../lib/tools-registry/types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
type ContentType = 'application/json' | 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain' | 'custom';

interface Header {
  key: string;
  value: string;
  enabled: boolean;
}

interface RequestConfig {
  url: string;
  method: HttpMethod;
  headers: Header[];
  body: string;
  contentType: ContentType;
  customContentType: string;
}

interface Response {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  time: number;
  size: number;
}

const HttpRequestTester = () => {
  // 默认请求配置
  const defaultRequest: RequestConfig = {
    url: 'https://httpbin.org/get',
    method: 'GET',
    headers: [
      { key: 'Accept', value: 'application/json', enabled: true }
    ],
    body: '',
    contentType: 'application/json',
    customContentType: ''
  };

  // 状态
  const [request, setRequest] = useState<RequestConfig>(defaultRequest);
  const [response, setResponse] = useState<Response | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'body' | 'headers'>('body');
  const [responseTab, setResponseTab] = useState<'body' | 'headers'>('body');
  const [bodyFormat, setBodyFormat] = useState<'raw' | 'json' | 'form'>('raw');
  const [savedRequests, setSavedRequests] = useState<RequestConfig[]>([]);
  const [requestName, setRequestName] = useState<string>('');

  // 处理URL变更
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRequest(prev => ({ ...prev, url: e.target.value }));
  };

  // 处理请求方法变更
  const handleMethodChange = (method: HttpMethod) => {
    setRequest(prev => ({ ...prev, method }));
  };

  // 处理请求体变更
  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRequest(prev => ({ ...prev, body: e.target.value }));
  };

  // 处理请求头添加
  const addHeader = () => {
    setRequest(prev => ({
      ...prev,
      headers: [...prev.headers, { key: '', value: '', enabled: true }]
    }));
  };

  // 处理请求头移除
  const removeHeader = (index: number) => {
    setRequest(prev => ({
      ...prev,
      headers: prev.headers.filter((_, i) => i !== index)
    }));
  };

  // 处理请求头变更
  const handleHeaderChange = (index: number, field: 'key' | 'value', value: string) => {
    setRequest(prev => ({
      ...prev,
      headers: prev.headers.map((header, i) =>
        i === index ? { ...header, [field]: value } : header
      )
    }));
  };

  // 切换请求头启用状态
  const toggleHeader = (index: number) => {
    setRequest(prev => ({
      ...prev,
      headers: prev.headers.map((header, i) =>
        i === index ? { ...header, enabled: !header.enabled } : header
      )
    }));
  };

  // 处理Content-Type变更
  const handleContentTypeChange = (contentType: ContentType) => {
    setRequest(prev => ({ ...prev, contentType }));
  };

  // 处理自定义Content-Type变更
  const handleCustomContentTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRequest(prev => ({ ...prev, customContentType: e.target.value }));
  };

  // 格式化JSON
  const formatJson = () => {
    try {
      const parsed = JSON.parse(request.body);
      setRequest(prev => ({
        ...prev,
        body: JSON.stringify(parsed, null, 2)
      }));
    } catch (err) {
      setError('无效的JSON格式');
    }
  };

  // 发送请求
  const sendRequest = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      // 验证URL
      if (!request.url.trim()) {
        throw new Error('请求URL不能为空');
      }

      // 准备请求头
      const headers: Record<string, string> = {};
      request.headers
        .filter(header => header.enabled && header.key.trim())
        .forEach(header => {
          headers[header.key] = header.value;
        });

      // 设置Content-Type
      if (request.method !== 'GET' && request.method !== 'HEAD' && request.body) {
        if (request.contentType === 'custom' && request.customContentType) {
          headers['Content-Type'] = request.customContentType;
        } else if (request.contentType !== 'custom') {
          headers['Content-Type'] = request.contentType;
        }
      }

      // 记录请求开始时间
      const startTime = Date.now();

      // 发送请求
      const res = await fetch(request.url, {
        method: request.method,
        headers,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      });

      // 计算请求时间
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // 获取响应头
      const responseHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      // 获取响应体
      const responseText = await res.text();
      const responseSize = new Blob([responseText]).size;

      // 设置响应
      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        body: responseText,
        time: responseTime,
        size: responseSize
      });
    } catch (err) {
      console.error('请求错误:', err);
      setError((err as Error).message || '请求失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 保存请求
  const saveRequest = () => {
    if (!requestName.trim()) {
      setError('请输入请求名称');
      return;
    }

    const savedRequest = {
      ...request,
      name: requestName
    };

    setSavedRequests(prev => [...prev, savedRequest]);
    setRequestName('');
  };

  // 加载保存的请求
  const loadRequest = (index: number) => {
    setRequest(savedRequests[index]);
  };

  // 删除保存的请求
  const deleteRequest = (index: number) => {
    setSavedRequests(prev => prev.filter((_, i) => i !== index));
  };

  // 复制响应到剪贴板
  const copyResponse = async () => {
    if (!response) return;

    try {
      await navigator.clipboard.writeText(
        responseTab === 'body'
          ? response.body
          : JSON.stringify(response.headers, null, 2)
      );
      alert('已复制到剪贴板');
    } catch (err) {
      console.error('复制失败:', err);
      alert('复制失败');
    }
  };

  // 格式化响应体为JSON
  const formatResponseJson = () => {
    if (!response?.body) return response?.body;

    try {
      const parsed = JSON.parse(response.body);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return response.body;
    }
  };

  // 重置请求
  const resetRequest = () => {
    setRequest(defaultRequest);
    setResponse(null);
    setError(null);
  };

  // 获取响应状态码颜色
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600 dark:text-green-400';
    if (status >= 300 && status < 400) return 'text-blue-600 dark:text-blue-400';
    if (status >= 400 && status < 500) return 'text-orange-600 dark:text-orange-400';
    if (status >= 500) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">HTTP请求测试工具</h1>
        <p className="text-gray-600 dark:text-gray-300">
          发送HTTP请求并分析响应结果
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 请求部分 */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-4">
              {/* URL和方法 */}
              <div className="mb-4">
                <div className="flex mb-2">
                  <div className="w-1/4">
                    <select
                      value={request.method}
                      onChange={(e) => handleMethodChange(e.target.value as HttpMethod)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                      <option value="PATCH">PATCH</option>
                      <option value="HEAD">HEAD</option>
                      <option value="OPTIONS">OPTIONS</option>
                    </select>
                  </div>
                  <div className="w-3/4">
                    <input
                      type="text"
                      value={request.url}
                      onChange={handleUrlChange}
                      placeholder="输入请求URL"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-r-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={sendRequest}
                    disabled={isLoading}
                    className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <FiRefreshCw className="animate-spin h-4 w-4 mr-2" />
                        发送中...
                      </>
                    ) : (
                      <>
                        <FiSend className="h-4 w-4 mr-2" />
                        发送请求
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetRequest}
                    className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    <FiRefreshCw className="h-4 w-4 mr-2" />
                    重置
                  </button>
                </div>
              </div>

              {/* 选项卡 */}
              <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                <div className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('body')}
                    className={`mr-2 py-2 px-4 ${activeTab === 'body'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                      }`}
                  >
                    请求体
                  </button>
                  <button
                    onClick={() => setActiveTab('headers')}
                    className={`py-2 px-4 ${activeTab === 'headers'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                      }`}
                  >
                    请求头
                  </button>
                </div>
              </div>

              {/* 请求体 */}
              {activeTab === 'body' && (
                <div>
                  {/* 请求体格式 */}
                  {request.method !== 'GET' && request.method !== 'HEAD' && (
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Content-Type
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleContentTypeChange('application/json')}
                          className={`text-xs px-2 py-1 rounded-md ${request.contentType === 'application/json'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                        >
                          application/json
                        </button>
                        <button
                          onClick={() => handleContentTypeChange('application/x-www-form-urlencoded')}
                          className={`text-xs px-2 py-1 rounded-md ${request.contentType === 'application/x-www-form-urlencoded'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                        >
                          x-www-form-urlencoded
                        </button>
                        <button
                          onClick={() => handleContentTypeChange('text/plain')}
                          className={`text-xs px-2 py-1 rounded-md ${request.contentType === 'text/plain'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                        >
                          text/plain
                        </button>
                        <button
                          onClick={() => handleContentTypeChange('multipart/form-data')}
                          className={`text-xs px-2 py-1 rounded-md ${request.contentType === 'multipart/form-data'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                        >
                          multipart/form-data
                        </button>
                        <button
                          onClick={() => handleContentTypeChange('custom')}
                          className={`text-xs px-2 py-1 rounded-md ${request.contentType === 'custom'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                        >
                          自定义
                        </button>
                      </div>
                      {request.contentType === 'custom' && (
                        <input
                          type="text"
                          value={request.customContentType}
                          onChange={handleCustomContentTypeChange}
                          placeholder="输入自定义Content-Type"
                          className="mt-2 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                        />
                      )}
                    </div>
                  )}

                  {/* 请求体内容 */}
                  {request.method !== 'GET' && request.method !== 'HEAD' && (
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          请求体
                        </label>
                        {request.contentType === 'application/json' && (
                          <button
                            onClick={formatJson}
                            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md"
                          >
                            格式化JSON
                          </button>
                        )}
                      </div>
                      <textarea
                        value={request.body}
                        onChange={handleBodyChange}
                        rows={8}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-mono text-sm dark:bg-gray-700 dark:text-white"
                        placeholder="输入请求体内容"
                      ></textarea>
                    </div>
                  )}
                </div>
              )}

              {/* 请求头 */}
              {activeTab === 'headers' && (
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      请求头
                    </label>
                    <button
                      onClick={addHeader}
                      className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md"
                    >
                      <FiPlus className="inline-block mr-1" />
                      添加请求头
                    </button>
                  </div>
                  <div className="space-y-2">
                    {request.headers.map((header, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={header.enabled}
                          onChange={() => toggleHeader(index)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                        />
                        <input
                          type="text"
                          value={header.key}
                          onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                          placeholder="键"
                          className="w-2/5 p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:text-white"
                        />
                        <input
                          type="text"
                          value={header.value}
                          onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                          placeholder="值"
                          className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:text-white"
                        />
                        <button
                          onClick={() => removeHeader(index)}
                          className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {request.headers.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        没有设置请求头
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 保存请求 */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={requestName}
                    onChange={(e) => setRequestName(e.target.value)}
                    placeholder="请求名称"
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    onClick={saveRequest}
                    disabled={!requestName.trim()}
                    className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50"
                  >
                    <FiSave className="h-4 w-4 mr-2" />
                    保存请求
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 保存的请求 */}
          {savedRequests.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  保存的请求
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {savedRequests.map((req, index) => (
                    <div
                      key={index}
                      className="p-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 flex justify-between items-center"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {(req as any).name || `请求 ${index + 1}`}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300 mr-2">
                            {req.method}
                          </span>
                          {req.url}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => loadRequest(index)}
                          className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          title="加载请求"
                        >
                          <FiCheck className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteRequest(index)}
                          className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          title="删除请求"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 响应部分 */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden h-full">
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                响应结果
              </h3>

              {isLoading && (
                <div className="flex flex-col items-center justify-center h-64">
                  <FiRefreshCw className="animate-spin h-8 w-8 text-blue-500 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">请求处理中...</p>
                </div>
              )}

              {!isLoading && error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-md p-4 mb-4">
                  <div className="flex">
                    <FiAlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" />
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {!isLoading && !error && !response && (
                <div className="flex flex-col items-center justify-center h-64">
                  <FiGlobe className="h-8 w-8 text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">等待发送请求</p>
                </div>
              )}

              {!isLoading && response && (
                <div>
                  {/* 响应状态和信息 */}
                  <div className="mb-4 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">状态</div>
                        <div className={`text-lg font-medium ${getStatusColor(response.status)}`}>
                          {response.status} {response.statusText}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <FiClock className="inline-block mr-1" />
                          响应时间
                        </div>
                        <div className="text-gray-800 dark:text-gray-200">
                          {response.time} ms
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <FiHash className="inline-block mr-1" />
                          大小
                        </div>
                        <div className="text-gray-800 dark:text-gray-200">
                          {(response.size / 1024).toFixed(2)} KB
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 响应内容选项卡 */}
                  <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                    <div className="flex -mb-px">
                      <button
                        onClick={() => setResponseTab('body')}
                        className={`mr-2 py-2 px-4 ${responseTab === 'body'
                          ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                          }`}
                      >
                        响应体
                      </button>
                      <button
                        onClick={() => setResponseTab('headers')}
                        className={`py-2 px-4 ${responseTab === 'headers'
                          ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                          }`}
                      >
                        响应头
                      </button>
                    </div>
                  </div>

                  {/* 响应内容 */}
                  <div className="relative">
                    <button
                      onClick={copyResponse}
                      className="absolute top-2 right-2 p-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
                    >
                      <FiCopy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>

                    {responseTab === 'body' ? (
                      <pre className="w-full h-96 p-4 bg-gray-50 dark:bg-gray-900 overflow-auto rounded-md border border-gray-200 dark:border-gray-700 font-mono text-sm whitespace-pre-wrap">
                        {formatResponseJson()}
                      </pre>
                    ) : (
                      <div className="w-full h-96 overflow-auto">
                        <table className="min-w-full">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600 sticky top-0 bg-gray-50 dark:bg-gray-700">
                                键
                              </th>
                              <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600 sticky top-0 bg-gray-50 dark:bg-gray-700">
                                值
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {Object.entries(response.headers).map(([key, value], index) => (
                              <tr key={index}>
                                <td className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">
                                  {key}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 break-all">
                                  {value}
                                </td>
                              </tr>
                            ))}
                            {Object.keys(response.headers).length === 0 && (
                              <tr>
                                <td colSpan={2} className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                                  无响应头
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const tool: Tool = {
  id: 'http-request',
  name: 'HTTP请求测试',
  description: '发送HTTP请求并分析响应结果',
  category: 'web',
  icon: FiGlobe,
  component: HttpRequestTester,
  meta: {
    keywords: ['HTTP', 'API', '请求', '测试', 'REST'],
    examples: [
      'GET https://api.example.com',
      'POST application/json'
    ]
  }
};

export default tool; 
