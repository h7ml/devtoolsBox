'use client';

import React, { useState, useEffect } from 'react';
import { 
  StandardToolLayout,
  ToolRunStatus,
} from '@/app/lib/core/tool-templates';
import { toolDefinition, examples, helpTips, defaultOptions } from './config';
import { StateService } from '@/app/lib/core/services';
import { FiFileText } from 'react-icons/fi';
import { Tool } from '../../../lib/tools-registry/types';
import { Base64Options, Base64Result } from './types';
import { Base64Form } from './components/Base64Form';
import { OptionsPanel } from './components/OptionsPanel';
import { ResultViewer } from './components/ResultViewer';

/**
 * Base64编解码工具主组件
 */
export const Base64Tool = () => {
  // 获取状态服务实例
  const stateService = StateService.getInstance();
  
  // 状态管理
  const [result, setResult] = useState<Base64Result | null>(null);
  const [status, setStatus] = useState<ToolRunStatus>(ToolRunStatus.IDLE);
  const [processing, setProcessing] = useState(false);
  
  // 选项状态，使用defaultOptions作为基础
  const [options, setOptions] = useState<Partial<Base64Options>>(defaultOptions);
  
  // 历史记录
  const [history, setHistory] = useState<any[]>([]);
  
  // 保存选项状态到全局状态
  useEffect(() => {
    stateService.setToolState(toolDefinition.id, options);
  }, [options]);
  
  // 从全局状态恢复选项
  useEffect(() => {
    const savedState = stateService.getToolState(toolDefinition.id);
    if (savedState) {
      setOptions(prev => ({ ...prev, ...savedState }));
    }
  }, []);
  
  // 处理选项变更
  const handleOptionsChange = (newOptions: Partial<Base64Options>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  };
  
  // 处理示例点击
  const handleExampleClick = (example: any) => {
    // 设置示例选项
    if (example.options) {
      setOptions(prev => ({ ...prev, ...example.options }));
    }
    
    // 创建模拟提交结果
    const mockResult: Base64Result = {
      success: true,
      data: example.output,
      meta: {
        originalSize: example.input.length,
        resultSize: example.output.length,
        processingTime: 0
      }
    };
    
    setResult(mockResult);
    setStatus(ToolRunStatus.SUCCESS);
  };
  
  // 处理处理结果
  const handleProcessResult = (result: Base64Result) => {
    setResult(result);
    setStatus(result.success ? ToolRunStatus.SUCCESS : ToolRunStatus.ERROR);
    
    // 添加到历史记录（仅存储成功结果）
    if (result.success && result.data) {
      // 限制历史记录长度
      const newHistory = [...history];
      if (newHistory.length >= 10) {
        newHistory.pop(); // 移除最旧的
      }
      
      // 添加到历史记录
      const historyItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        mode: options.mode,
        inputPreview: typeof result.data === 'string' 
          ? result.data.substring(0, 30) + (result.data.length > 30 ? '...' : '')
          : '[二进制数据]',
        options: { ...options }
      };
      
      setHistory([historyItem, ...newHistory]);
    }
  };
  
  // 处理处理状态
  const handleProcessing = (isProcessing: boolean) => {
    setProcessing(isProcessing);
    setStatus(isProcessing ? ToolRunStatus.PROCESSING : status);
  };
  
  return (
    <StandardToolLayout
      tool={toolDefinition}
      status={status}
      formContent={
        <div className="space-y-6">
          <OptionsPanel 
            options={options} 
            onChange={handleOptionsChange} 
          />
          
          <Base64Form 
            options={options}
            onProcess={handleProcessResult}
            onProcessing={handleProcessing}
          />
        </div>
      }
      resultContent={
        <ResultViewer 
          result={result}
          inputType={options.inputType}
          outputType={options.outputType}
          showMetadata={true}
        />
      }
      examplesContent={
        <div className="space-y-3">
          {examples.map(example => (
            <div 
              key={example.id} 
              className="p-3 border rounded cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handleExampleClick(example)}
            >
              <h3 className="font-medium">{example.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{example.description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {example.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      }
      helpContent={
        <div className="space-y-4">
          {helpTips.map((tip, index) => (
            <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
              <h3 className="font-medium mb-2">{tip.title}</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{tip.content}</p>
            </div>
          ))}
        </div>
      }
      extraContent={
        history.length > 0 ? (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">历史记录</h3>
            <div className="space-y-2">
              {history.map(item => (
                <div 
                  key={item.id} 
                  className="p-3 border rounded hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setOptions(item.options);
                    // 这里可以添加更多操作，如重新加载历史项等
                  }}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {item.mode === 'encode' ? '编码' : '解码'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1 truncate">
                    {item.inputPreview}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null
      }
    />
  );
};

const tool: Tool = {
  id: 'base64',
  name: 'Base64编解码工具',
  description: '全功能的Base64编解码工具，支持文本、文件和二进制数据处理',
  category: 'text',
  icon: FiFileText,
  component: Base64Tool,
  meta: {
    keywords: ['base64', 'encode', 'decode', 'text', 'binary', 'file', '编码', '解码', '文件'],
    examples: [
      'Hello, World!',
      'SGVsbG8sIFdvcmxkIQ==',
      '图片转Base64',
      'Base64转文本'
    ],
    version: '2.0.0'
  }
};

export default tool;
