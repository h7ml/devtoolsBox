 'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Base64Options, Base64Result } from '../types';
import { FileUploader } from './FileUploader';
import { encode } from '../utils/encoder';
import { decode } from '../utils/decoder';

interface Base64FormProps {
  options: Partial<Base64Options>;
  onProcess: (result: Base64Result) => void;
  onProcessing: (isProcessing: boolean) => void;
}

export const Base64Form: React.FC<Base64FormProps> = ({
  options,
  onProcess,
  onProcessing
}) => {
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // 根据选项调整表单状态
  useEffect(() => {
    // 如果切换了输入类型，重置状态
    if (options.inputType === 'file' && input) {
      setInput('');
    } else if (options.inputType === 'text' && file) {
      setFile(null);
    }
  }, [options.inputType]);
  
  // 自动调整文本框高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);
  
  // 处理文本输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setError(null);
  };
  
  // 处理文件上传
  const handleFileUpload = (data: string, uploadedFile: File) => {
    setFile(uploadedFile);
    
    // 如果是文本模式，将文件内容设置为输入
    if (options.inputType === 'text') {
      setInput(data);
    } else {
      // 如果是文件/二进制模式，直接显示文件信息
      const fileSizeStr = uploadedFile.size < 1024 * 1024
        ? `${Math.round(uploadedFile.size / 1024)} KB`
        : `${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB`;
      
      setInput(`已上传: ${uploadedFile.name} (${fileSizeStr})`);
    }
    
    setError(null);
  };
  
  // 验证输入
  const validateInput = (): boolean => {
    if (options.inputType === 'text' && !input.trim()) {
      setError('请输入要处理的文本');
      return false;
    }
    
    if (options.inputType === 'file' && !file) {
      setError('请上传要处理的文件');
      return false;
    }
    
    return true;
  };
  
  // 处理提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInput()) {
      return;
    }
    
    try {
      setError(null);
      onProcessing(true);
      
      let result: Base64Result;
      
      if (options.mode === 'encode') {
        // 编码
        if (options.inputType === 'file' && file) {
          result = await encode(file, options);
        } else {
          result = await encode(input, options);
        }
      } else {
        // 解码
        result = await decode(input, options);
      }
      
      onProcess(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      onProcessing(false);
    }
  };
  
  // 清空输入
  const clearInput = () => {
    setInput('');
    setFile(null);
    setError(null);
  };
  
  // 根据选项决定占位符文本
  const getPlaceholder = (): string => {
    if (options.mode === 'encode') {
      return '输入要编码的文本...';
    } else {
      return '输入要解码的Base64字符串...';
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 文件上传 */}
      {options.inputType === 'file' && (
        <FileUploader
          onFileLoad={handleFileUpload}
          accept="*/*"
          isDataURL={options.outputType === 'dataUrl'}
          maxSize={50 * 1024 * 1024} // 50MB
        />
      )}
      
      {/* 文本输入 */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          placeholder={getPlaceholder()}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 min-h-[150px] ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
          disabled={options.inputType === 'file' && !!file}
          rows={6}
        />
        
        {input && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            title="清空"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      {/* 错误消息 */}
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      
      {/* 提交按钮 */}
      <div className="flex space-x-3">
        <button
          type="submit"
          className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {options.mode === 'encode' ? '编码' : '解码'}
        </button>
        
        <button
          type="button"
          onClick={clearInput}
          className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-md shadow-sm focus:outline-none"
        >
          清空
        </button>
      </div>
    </form>
  );
};
