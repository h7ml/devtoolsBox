'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiRefreshCw, FiCopy, FiCheck, FiCode, FiEye } from 'react-icons/fi';
import { Card, CardHeader, CardContent } from '../../../components/design-system/Card';
import Button from '../../../components/design-system/Button';
import { AnimatePresence, motion } from 'framer-motion';

const HtmlRendererComponent = () => {
  const [htmlInput, setHtmlInput] = useState<string>('<div class="example">\n  <h1 style="color: blue;">Hello World</h1>\n  <p>This is a <strong>sample</strong> HTML to demonstrate the renderer.</p>\n  <button class="btn" onclick="alert(\'Button clicked!\')">Click Me</button>\n</div>');
  const [cssInput, setCssInput] = useState<string>('.example {\n  padding: 20px;\n  border: 1px solid #ccc;\n  border-radius: 8px;\n  max-width: 500px;\n  margin: 0 auto;\n}\n\n.btn {\n  background-color: #4CAF50;\n  color: white;\n  padding: 8px 16px;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n}\n\n.btn:hover {\n  background-color: #45a049;\n}');
  const [jsInput, setJsInput] = useState<string>('// JavaScript code will run in the preview iframe\nconsole.log("Preview loaded");\n\n// Example: Change the heading color after 2 seconds\nsetTimeout(() => {\n  const heading = document.querySelector("h1");\n  if (heading) {\n    heading.style.color = "red";\n    console.log("Changed heading color");\n  }\n}, 2000);');
  
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [renderMode, setRenderMode] = useState<'auto' | 'manual'>('manual');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // 自动渲染定时器
  const autoRenderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // 在组件卸载时清除定时器
  useEffect(() => {
    return () => {
      if (autoRenderTimeoutRef.current) {
        clearTimeout(autoRenderTimeoutRef.current);
      }
    };
  }, []);
  
  // 当输入内容变化且为自动渲染模式时，设置延迟渲染
  useEffect(() => {
    if (renderMode === 'auto') {
      if (autoRenderTimeoutRef.current) {
        clearTimeout(autoRenderTimeoutRef.current);
      }
      
      autoRenderTimeoutRef.current = setTimeout(() => {
        renderPreview();
      }, 1000);
    }
  }, [htmlInput, cssInput, jsInput, renderMode]);
  
  // 生成预览HTML
  const generatePreviewHTML = (): string => {
    return `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>HTML预览</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.5;
            color: #333;
            margin: 0;
            padding: 10px;
          }
          
          ${cssInput}
        </style>
      </head>
      <body>
        ${htmlInput}
        
        <script>
          // 禁止危险操作
          window.parent = null;
          window.top = null;
          
          // 用户JS
          try {
            ${jsInput}
          } catch (error) {
            console.error("预览JS错误:", error);
          }
        </script>
      </body>
      </html>
    `;
  };
  
  // 渲染预览
  const renderPreview = () => {
    try {
      setError(null);
      
      if (!iframeRef.current) return;
      
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (!iframeDoc) {
        setError("无法访问iframe文档");
        return;
      }
      
      // 写入HTML
      iframeDoc.open();
      iframeDoc.write(generatePreviewHTML());
      iframeDoc.close();
      
      // 拦截console输出
      if (iframe.contentWindow) {
        const originalConsoleLog = iframe.contentWindow.console.log;
        const originalConsoleError = iframe.contentWindow.console.error;
        
        iframe.contentWindow.console.log = function(...args) {
          originalConsoleLog.apply(this, args);
          // 这里可以将console输出显示在UI上
        };
        
        iframe.contentWindow.console.error = function(...args) {
          originalConsoleError.apply(this, args);
          // 这里可以将错误显示在UI上
        };
      }
    } catch (e) {
      setError(`渲染错误: ${e.message}`);
    }
  };
  
  // 复制完整HTML
  const handleCopy = () => {
    const fullHtml = generatePreviewHTML();
    navigator.clipboard.writeText(fullHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // 根据标签页显示对应输入区
  const renderInputArea = () => {
    switch (activeTab) {
      case 'html':
        return (
          <textarea
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                      font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="输入HTML代码..."
          />
        );
      case 'css':
        return (
          <textarea
            value={cssInput}
            onChange={(e) => setCssInput(e.target.value)}
            className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                      font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="输入CSS样式..."
          />
        );
      case 'js':
        return (
          <textarea
            value={jsInput}
            onChange={(e) => setJsInput(e.target.value)}
            className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                      font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="输入JavaScript代码..."
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader
        icon={<FiEye className="h-6 w-6" />}
        title="HTML渲染工具"
        description="实时渲染HTML、CSS和JavaScript"
        gradientColors="from-purple-500 to-purple-600"
      />
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：代码输入区 */}
          <div>
            <div className="mb-4">
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'html'
                      ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-500'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('html')}
                >
                  HTML
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'css'
                      ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-500'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('css')}
                >
                  CSS
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'js'
                      ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-500'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('js')}
                >
                  JavaScript
                </button>
              </div>
            </div>
            
            {renderInputArea()}
            
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center">
                <label className="flex items-center mr-4">
                  <input
                    type="radio"
                    className="mr-2 text-purple-500 focus:ring-purple-500"
                    checked={renderMode === 'manual'}
                    onChange={() => setRenderMode('manual')}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">手动渲染</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="mr-2 text-purple-500 focus:ring-purple-500"
                    checked={renderMode === 'auto'}
                    onChange={() => setRenderMode('auto')}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">自动渲染</span>
                </label>
              </div>
              
              {renderMode === 'manual' && (
                <Button
                  onClick={renderPreview}
                  icon={<FiRefreshCw className="h-4 w-4" />}
                >
                  渲染预览
                </Button>
              )}
            </div>
            
            {error && (
              <div className="mt-4 p-3 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">
                {error}
              </div>
            )}
          </div>
          
          {/* 右侧：预览区 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">预览结果</h3>
              <Button
                variant="outline"
                size="sm"
                icon={copied ? <FiCheck className="h-4 w-4" /> : <FiCopy className="h-4 w-4" />}
                onClick={handleCopy}
              >
                {copied ? '已复制' : '复制完整HTML'}
              </Button>
            </div>
            
            <div className="h-[450px] border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
              <div className="w-full h-8 bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 flex items-center px-3 py-1">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-center text-xs text-gray-600 dark:text-gray-400 flex-1">
                  HTML预览
                </div>
              </div>
              
              <iframe
                ref={iframeRef}
                title="HTML预览"
                className="w-full h-[calc(100%-2rem)] bg-white"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
            
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              <p>注意：预览环境为安全沙盒，某些功能可能受限。</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// 工具元数据
const htmlRenderer = {
  id: 'html-renderer',
  name: 'HTML渲染工具',
  description: '实时渲染HTML、CSS和JavaScript',
  category: 'web',
  icon: FiEye,
  component: HtmlRendererComponent,
  meta: {
    keywords: ['html', 'css', 'js', 'javascript', '渲染', '预览', '编辑器'],
    author: 'DevTools Box',
    version: '1.0.0'
  }
};

export default htmlRenderer;