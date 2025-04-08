 'use client';

import React, { useState, useEffect } from 'react';
import { Base64Result } from '../types';
import { downloadFromResult, generateFileName, getExtensionFromMimeType } from '../utils/fileHandlers';

interface ResultViewerProps {
  result: Base64Result | null;
  inputType?: string;
  outputType?: string;
  showMetadata?: boolean;
}

export const ResultViewer: React.FC<ResultViewerProps> = ({
  result,
  inputType = 'text',
  outputType = 'text',
  showMetadata = true
}) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [previewType, setPreviewType] = useState<'text' | 'image' | 'binary' | 'none'>('none');
  
  // 重置复制状态
  useEffect(() => {
    setCopied(false);
  }, [result]);
  
  // 确定预览类型
  useEffect(() => {
    if (!result || !result.success || !result.data) {
      setPreviewType('none');
      return;
    }
    
    if (typeof result.data === 'string') {
      // 尝试检测是否为图片DataURL
      if (result.data.startsWith('data:image/')) {
        setPreviewType('image');
      } else {
        setPreviewType('text');
      }
    } else if (result.data instanceof ArrayBuffer || result.data instanceof Blob) {
      // 如果是二进制数据，检查MIME类型
      const mimeType = result.meta?.detectedType || '';
      if (mimeType.startsWith('image/')) {
        setPreviewType('image');
      } else {
        setPreviewType('binary');
      }
    } else {
      setPreviewType('none');
    }
  }, [result]);
  
  // 复制到剪贴板
  const handleCopy = async () => {
    if (!result || !result.success || !result.data) return;
    
    try {
      if (typeof result.data === 'string') {
        await navigator.clipboard.writeText(result.data);
      } else if (result.data instanceof Blob) {
        await navigator.clipboard.write([
          new ClipboardItem({
            [result.data.type]: result.data
          })
        ]);
      } else if (result.data instanceof ArrayBuffer) {
        const blob = new Blob([result.data], { 
          type: result.meta?.detectedType || 'application/octet-stream' 
        });
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]);
      }
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
      alert('复制失败，请手动复制');
    }
  };
  
  // 下载结果
  const handleDownload = () => {
    if (!result || !result.success || !result.data) return;
    
    const mimeType = result.meta?.detectedType;
    const extension = getExtensionFromMimeType(mimeType);
    const filename = generateFileName(extension);
    
    try {
      downloadFromResult(result, filename);
    } catch (error) {
      console.error('下载失败:', error);
      alert('下载失败，请稍后重试');
    }
  };
  
  // 扩展/收起长文本
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  
  // 格式化大小
  const formatSize = (bytes?: number): string => {
    if (bytes === undefined) return 'N/A';
    
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };
  
  // 计算压缩/扩展率
  const calculateRatio = (): string => {
    if (!result?.meta?.originalSize || !result?.meta?.resultSize) {
      return 'N/A';
    }
    
    const originalSize = result.meta.originalSize;
    const resultSize = result.meta.resultSize;
    const ratio = ((resultSize - originalSize) / originalSize * 100).toFixed(2);
    
    if (parseFloat(ratio) > 0) {
      return `+${ratio}%`;
    } else {
      return `${ratio}%`;
    }
  };
  
  // 如果没有结果
  if (!result) {
    return (
      <div className="bg-gray-50 rounded-md p-6 text-center text-gray-400">
        输入数据并点击编码/解码按钮开始操作
      </div>
    );
  }
  
  // 如果操作失败
  if (!result.success) {
    return (
      <div className="bg-red-50 rounded-md p-6 border border-red-200">
        <h3 className="text-red-600 font-medium">操作失败</h3>
        <p className="text-red-500 mt-1">{result.error}</p>
      </div>
    );
  }
  
  // 如果没有数据
  if (!result.data) {
    return (
      <div className="bg-gray-50 rounded-md p-6 text-center text-gray-400">
        没有可显示的数据
      </div>
    );
  }
  
  // 如果是图片预览
  if (previewType === 'image') {
    let imageUrl = '';
    if (typeof result.data === 'string') {
      imageUrl = result.data.startsWith('data:') ? result.data : `data:image/png;base64,${result.data}`;
    } else if (result.data instanceof Blob) {
      imageUrl = URL.createObjectURL(result.data);
    } else if (result.data instanceof ArrayBuffer) {
      const blob = new Blob([result.data], { type: result.meta?.detectedType || 'image/png' });
      imageUrl = URL.createObjectURL(blob);
    }
    
    return (
      <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-medium">图片预览</h3>
          <div className="flex space-x-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
              title="复制到剪贴板"
            >
              {copied ? '已复制!' : '复制'}
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded"
              title="下载文件"
            >
              下载
            </button>
          </div>
        </div>
        
        <div className="p-4 flex justify-center">
          <img src={imageUrl} alt="Preview" className="max-w-full max-h-96 object-contain" />
        </div>
        
        {showMetadata && result.meta && (
          <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 grid grid-cols-2 gap-2">
            <div>原始大小: {formatSize(result.meta.originalSize)}</div>
            <div>结果大小: {formatSize(result.meta.resultSize)}</div>
            <div>变化率: {calculateRatio()}</div>
            <div>处理时间: {result.meta.processingTime?.toFixed(2)} ms</div>
            {result.meta.detectedType && <div className="col-span-2">类型: {result.meta.detectedType}</div>}
          </div>
        )}
      </div>
    );
  }
  
  // 如果是二进制预览
  if (previewType === 'binary') {
    return (
      <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-medium">二进制数据</h3>
          <div className="flex space-x-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
              title="复制到剪贴板"
            >
              {copied ? '已复制!' : '复制'}
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded"
              title="下载文件"
            >
              下载
            </button>
          </div>
        </div>
        
        <div className="p-4 bg-gray-100 font-mono text-sm">
          <div className="text-center">
            <div className="inline-block bg-gray-200 rounded px-3 py-1">
              二进制数据 ({formatSize(result.meta?.resultSize)})
            </div>
          </div>
        </div>
        
        {showMetadata && result.meta && (
          <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 grid grid-cols-2 gap-2">
            <div>原始大小: {formatSize(result.meta.originalSize)}</div>
            <div>结果大小: {formatSize(result.meta.resultSize)}</div>
            <div>变化率: {calculateRatio()}</div>
            <div>处理时间: {result.meta.processingTime?.toFixed(2)} ms</div>
            {result.meta.detectedType && <div className="col-span-2">类型: {result.meta.detectedType}</div>}
          </div>
        )}
      </div>
    );
  }
  
  // 文本预览（默认）
  const textContent = typeof result.data === 'string' ? result.data : '[无法显示二进制数据]';
  const isLongText = textContent.length > 500;
  
  return (
    <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-medium">结果</h3>
        <div className="flex space-x-2">
          {isLongText && (
            <button
              onClick={toggleExpand}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
              title={expanded ? '收起' : '展开全部'}
            >
              {expanded ? '收起' : '展开'}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            title="复制到剪贴板"
          >
            {copied ? '已复制!' : '复制'}
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded"
            title="下载文件"
          >
            下载
          </button>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 overflow-auto max-h-96">
        <pre className="whitespace-pre-wrap font-mono text-sm">
          {isLongText && !expanded
            ? textContent.substring(0, 500) + '...'
            : textContent}
        </pre>
      </div>
      
      {result.meta?.warnings?.length && (
        <div className="p-4 bg-yellow-50 border-t border-yellow-200">
          <h4 className="text-yellow-700 font-medium text-sm mb-1">警告</h4>
          <ul className="list-disc pl-5 text-xs text-yellow-600">
            {result.meta.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
      
      {showMetadata && result.meta && (
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 grid grid-cols-2 gap-2">
          <div>原始大小: {formatSize(result.meta.originalSize)}</div>
          <div>结果大小: {formatSize(result.meta.resultSize)}</div>
          <div>变化率: {calculateRatio()}</div>
          <div>处理时间: {result.meta.processingTime?.toFixed(2)} ms</div>
          {result.meta.detectedType && <div className="col-span-2">类型: {result.meta.detectedType}</div>}
        </div>
      )}
    </div>
  );
};
