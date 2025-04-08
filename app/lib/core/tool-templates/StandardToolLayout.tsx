/**
 * 标准工具布局组件
 * 提供统一的工具界面布局，支持表单、结果和选项区域
 */

'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../design-system';
import { cn } from '../design-system/utils';
import { ToolLayoutProps, ToolRunStatus } from './types';

const StandardToolLayout: React.FC<ToolLayoutProps> = ({
  tool,
  formContent,
  resultContent,
  optionsContent,
  helpContent,
  examplesContent,
  status = ToolRunStatus.IDLE,
  layoutType = 'standard',
  children
}) => {
  // 标签状态管理
  const [activeTab, setActiveTab] = useState<'options' | 'examples' | 'help'>('options');

  // 根据布局类型决定容器样式
  const getContainerStyles = () => {
    switch (layoutType) {
      case 'compact':
        return 'max-w-3xl mx-auto';
      case 'wide':
        return 'max-w-6xl mx-auto';
      case 'split':
        return 'grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto';
      case 'custom':
        return '';
      default:
        return 'mx-auto';
    }
  };

  // 根据工具状态生成状态指示器
  const getStatusIndicator = () => {
    switch (status) {
      case ToolRunStatus.LOADING:
        return (
          <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full text-sm font-medium">
            <div className="animate-spin w-4 h-4 border-2 border-blue-600/30 dark:border-blue-400/30 border-t-blue-600 dark:border-t-blue-400 rounded-full"></div>
            <span>加载中...</span>
          </div>
        );
      case ToolRunStatus.PROCESSING:
        return (
          <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-full text-sm font-medium">
            <div className="animate-spin w-4 h-4 border-2 border-indigo-600/30 dark:border-indigo-400/30 border-t-indigo-600 dark:border-t-indigo-400 rounded-full"></div>
            <span>处理中...</span>
          </div>
        );
      case ToolRunStatus.SUCCESS:
        return (
          <div className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>成功</span>
          </div>
        );
      case ToolRunStatus.ERROR:
        return (
          <div className="inline-flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>错误</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn('w-full', getContainerStyles())}>
      {/* 工具头部 */}
      <div className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{tool.title}</h1>
          {getStatusIndicator()}
        </div>
        <p className="text-gray-600 dark:text-gray-300">{tool.description}</p>
        
        {tool.tags && tool.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tool.tags.map((tag, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 主要内容区域 */}
      <div className={cn(
        'flex flex-col gap-6',
        layoutType === 'split' ? 'lg:flex-row' : ''
      )}>
        {/* 表单区域 */}
        {formContent && (
          <div className={layoutType === 'split' ? 'lg:w-1/2' : 'w-full'}>
            <Card>
              <CardHeader
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                }
                title="输入"
                description="提供需要处理的数据"
              />
              <CardContent>
                {formContent}
              </CardContent>
            </Card>
          </div>
        )}

        {/* 结果区域 */}
        {resultContent && (
          <div className={layoutType === 'split' ? 'lg:w-1/2' : 'w-full'}>
            <Card>
              <CardHeader
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                title="结果"
                description="处理后的输出"
              />
              <CardContent>
                {resultContent}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* 附加区域 */}
      {(optionsContent || helpContent || examplesContent) && (
        <div className="mt-6">
          <Card>
            {/* 标签切换 */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {optionsContent && (
                <button
                  onClick={() => setActiveTab('options')}
                  className={cn(
                    'py-3 px-4 text-sm font-medium',
                    activeTab === 'options'
                      ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  选项
                </button>
              )}
              {examplesContent && (
                <button
                  onClick={() => setActiveTab('examples')}
                  className={cn(
                    'py-3 px-4 text-sm font-medium',
                    activeTab === 'examples'
                      ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  示例
                </button>
              )}
              {helpContent && (
                <button
                  onClick={() => setActiveTab('help')}
                  className={cn(
                    'py-3 px-4 text-sm font-medium',
                    activeTab === 'help'
                      ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  帮助
                </button>
              )}
            </div>

            {/* 标签内容 */}
            <CardContent>
              {activeTab === 'options' && optionsContent}
              {activeTab === 'examples' && examplesContent}
              {activeTab === 'help' && helpContent}
            </CardContent>
          </Card>
        </div>
      )}

      {/* 自定义内容 */}
      {children && (
        <div className="mt-6">
          {children}
        </div>
      )}
    </div>
  );
};

export default StandardToolLayout; 
