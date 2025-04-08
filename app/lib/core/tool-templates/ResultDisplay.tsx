/**
 * 结果展示组件
 * 用于展示工具处理的结果，支持多种格式展示及操作
 */

'use client';

import React, { useRef, useState } from 'react';
import { Button } from '../design-system';
import { cn } from '../design-system/utils';
import { ResultDisplayProps } from './types';
import { copyToClipboard, downloadAsFile } from '@/app/tools/utils';

/**
 * 格式化JSON字符串
 */
const formatJSON = (jsonString: string, indentSize: number = 2): string => {
  try {
    const obj = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
    return JSON.stringify(obj, null, indentSize);
  } catch (e) {
    return typeof jsonString === 'string' ? jsonString : JSON.stringify(jsonString);
  }
};

/**
 * 将Base64图片数据转换为Blob
 */
const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: mimeType });
};

/**
 * 工具结果展示组件
 */
export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  content,
  type = 'text',
  language = 'json',
  error = null,
  allowCopy = true,
  allowDownload = true,
  downloadFileName = 'result.txt',
  downloadMimeType,
  tableColumns,
  tableData,
  className,
}) => {
  // 状态管理
  const [copySuccess, setCopySuccess] = React.useState(false);
  const [downloadSuccess, setDownloadSuccess] = React.useState(false);
  
  // 计算实际下载的MIME类型
  const actualMimeType = React.useMemo(() => {
    if (downloadMimeType) return downloadMimeType;
    
    switch (type) {
      case 'json': return 'application/json';
      case 'html': return 'text/html';
      case 'code': 
        if (language === 'javascript') return 'application/javascript';
        if (language === 'css') return 'text/css';
        if (language === 'html') return 'text/html';
        if (language === 'xml') return 'application/xml';
        return 'text/plain';
      default: return 'text/plain';
    }
  }, [type, language, downloadMimeType]);
  
  // 格式化内容用于显示
  const formattedContent = React.useMemo(() => {
    if (content === null) return '';
    
    if (typeof content === 'object') {
      try {
        return JSON.stringify(content, null, 2);
      } catch (e) {
        return String(content);
      }
    }
    
    return String(content);
  }, [content]);
  
  // 格式化内容用于下载
  const downloadContent = React.useMemo(() => {
    if (content === null) return '';
    
    if (typeof content === 'object' && type === 'json') {
      try {
        return JSON.stringify(content, null, 2);
      } catch (e) {
        return String(content);
      }
    }
    
    return String(content);
  }, [content, type]);
  
  // 处理复制按钮点击
  const handleCopy = async () => {
    const success = await copyToClipboard(downloadContent);
    
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };
  
  // 处理下载按钮点击
  const handleDownload = () => {
    downloadAsFile(downloadContent, downloadFileName, actualMimeType);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };
  
  // 根据类型渲染不同的内容展示
  const renderContent = () => {
    if (error) {
      return (
        <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
          <p className="font-semibold mb-1">错误</p>
          <p className="text-sm">{error}</p>
        </div>
      );
    }
    
    if (content === null || formattedContent === '') {
      return (
        <div className="p-4 text-gray-500 text-center">
          <p>暂无结果</p>
        </div>
      );
    }
    
    switch (type) {
      case 'json':
        return (
          <pre className="p-4 bg-gray-50 rounded-md overflow-auto text-sm font-mono">{formattedContent}</pre>
        );
        
      case 'html':
        return (
          <div className="p-4 bg-white rounded-md border border-gray-200">
            <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
          </div>
        );
        
      case 'code':
        return (
          <pre className="p-4 bg-gray-50 rounded-md overflow-auto text-sm font-mono">{formattedContent}</pre>
        );
        
      case 'image':
        // 对于图片类型，我们假设content是图片的URL或base64
        return (
          <div className="p-4 flex justify-center bg-gray-50 rounded-md">
            <img 
              src={formattedContent} 
              alt="Result" 
              className="max-w-full max-h-96 object-contain"
            />
          </div>
        );
        
      case 'table':
        // 对于表格类型，我们需要tableColumns和tableData
        if (!tableColumns || !tableData) {
          return (
            <div className="p-4 text-gray-500 text-center">
              <p>表格数据不完整</p>
            </div>
          );
        }
        
        return (
          <div className="overflow-auto max-h-96">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  {tableColumns.map((column, index) => (
                    <th 
                      key={index}
                      className="py-2 px-4 text-left text-sm font-medium text-gray-600 border border-gray-200"
                    >
                      {column.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {tableColumns.map((column, colIndex) => (
                      <td 
                        key={colIndex}
                        className="py-2 px-4 text-sm text-gray-800 border border-gray-200"
                      >
                        {column.render 
                          ? column.render(row[column.key], row, colIndex)
                          : row[column.key] !== undefined 
                            ? String(row[column.key])
                            : ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        
      case 'text':
      default:
        return (
          <div className="p-4 bg-white rounded-md whitespace-pre-wrap font-mono text-sm">
            {formattedContent}
          </div>
        );
    }
  };
  
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="mb-2 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800">结果</h3>
        
        <div className="flex space-x-2">
          {allowCopy && (
            <button
              onClick={handleCopy}
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
              title="复制到剪贴板"
            >
              {copySuccess ? '已复制' : '复制'}
            </button>
          )}
          
          {allowDownload && (
            <button
              onClick={handleDownload}
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
              title={`下载为 ${downloadFileName}`}
            >
              {downloadSuccess ? '已下载' : '下载'}
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-1 rounded-md border border-gray-200 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
};

export default ResultDisplay; 
