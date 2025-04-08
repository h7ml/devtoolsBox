/**
 * 工具帮助提示组件
 * 展示工具的使用帮助信息，常见问题及解决方案
 */

'use client';

import React from 'react';
import { cn } from '@/app/lib/core/design-system/utils';
import { ToolHelpTipsProps } from './types';

/**
 * 工具帮助提示组件
 */
export const ToolHelpTips: React.FC<ToolHelpTipsProps> = ({
  helpTips,
  className,
}) => {
  // 如果没有帮助提示，则不渲染
  if (!helpTips || helpTips.length === 0) {
    return null;
  }
  
  // 定义不同类型提示的样式
  const tipStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    general: 'bg-gray-50 border-gray-200 text-gray-800',
  };
  
  // 定义不同类型提示的图标
  const tipIcons = {
    info: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    success: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    general: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    ),
  };
  
  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-medium text-gray-800">帮助与提示</h3>
      
      <div className="space-y-4">
        {helpTips.map((tip, index) => {
          const tipType = tip.type || 'general';
          
          return (
            <div
              key={index}
              className={cn(
                'rounded-md border p-4',
                tipStyles[tipType]
              )}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {tipIcons[tipType]}
                </div>
                
                <div className="ml-3">
                  <h4 className="text-sm font-medium">{tip.title}</h4>
                  <div className="mt-2 text-sm whitespace-pre-line">
                    {tip.content}
                  </div>
                  
                  {/* 显示标签（如果有） */}
                  {tip.tags && tip.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {tip.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* 显示相关链接（如果有） */}
                  {tip.links && tip.links.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs font-medium mb-1">相关链接:</div>
                      <ul className="space-y-1 list-inside list-disc text-xs text-blue-600">
                        {tip.links.map((link, linkIndex) => (
                          <li key={linkIndex}>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {link.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ToolHelpTips
