/**
 * 工具示例组件
 * 展示工具使用的示例，方便用户快速上手
 */

'use client';

import React from 'react';
import { cn } from '@/app/lib/core/design-system/utils';
import { ToolExamplesProps, ToolExample } from './types';
/**
 * 工具示例组件
 */
export const ToolExamples: React.FC<ToolExamplesProps> = ({
  examples,
  onApplyExample,
  className,
}) => {
  // 如果没有示例，则不渲染
  if (!examples || examples.length === 0) {
    return null;
  }
  
  // 格式化示例数据为字符串
  const formatExampleData = (data: string | Record<string, any>): string => {
    if (typeof data === 'string') {
      return data;
    }
    
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return String(data);
    }
  };
  
  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-medium text-gray-800">示例</h3>
      
      <div className="space-y-4">
        {examples.map((example, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-md overflow-hidden hover:border-gray-300 transition-colors"
          >
            <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b border-gray-200">
              <div>
                <h4 className="font-medium text-gray-700">{example.title}</h4>
                {example.description && (
                  <p className="text-sm text-gray-500 mt-1">{example.description}</p>
                )}
              </div>
              
              <button
                onClick={() => onApplyExample(example)}
                className="px-3 py-1 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition-colors"
              >
                应用
              </button>
            </div>
            
            <div className="px-4 py-3 space-y-3">
              {/* 示例输入数据 */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">输入:</div>
                <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-40 font-mono">
                  {formatExampleData(example.input)}
                </pre>
              </div>
              
              {/* 期望输出（如果有） */}
              {example.expectedOutput && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">期望结果:</div>
                  <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-40 font-mono">
                    {formatExampleData(example.expectedOutput)}
                  </pre>
                </div>
              )}
              
              {/* 示例代码（如果有） */}
              {example.code && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">代码:</div>
                  <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-40 font-mono">
                    {example.code}
                  </pre>
                </div>
              )}
              
              {/* 预期效果图（如果有） */}
              {example.imageUrl && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">预期效果:</div>
                  <div className="bg-gray-50 p-2 rounded flex justify-center">
                    <img 
                      src={example.imageUrl} 
                      alt={`${example.title}效果图`} 
                      className="max-w-full max-h-40 object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 

export default ToolExamples
