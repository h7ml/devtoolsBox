 'use client';

import React, { useState, useRef } from 'react';
import { readFileAsDataURL, readFileAsText } from '../utils/fileHandlers';

interface FileUploaderProps {
  onFileLoad: (data: string, file: File) => void;
  accept?: string;
  maxSize?: number; // 最大文件大小(字节)
  multiple?: boolean;
  className?: string;
  isDataURL?: boolean; // 是否以DataURL形式读取
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileLoad,
  accept = '*/*',
  maxSize = 50 * 1024 * 1024, // 默认50MB
  multiple = false,
  className = '',
  isDataURL = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 处理文件
  const handleFile = async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      
      // 检查文件大小
      if (file.size > maxSize) {
        throw new Error(`文件过大，最大允许 ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
      }
      
      // 读取文件内容
      const content = isDataURL 
        ? await readFileAsDataURL(file)
        : await readFileAsText(file);
      
      // 调用回调
      onFileLoad(content, file);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  
  // 处理文件输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    handleFile(files[0]);
    
    // 重置input，以便同一文件可以再次上传
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // 处理拖放
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    handleFile(files[0]);
  };
  
  // 点击上传区域
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="mb-4">
      <div 
        className={`border-2 border-dashed p-8 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        } ${className}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleInputChange}
          accept={accept}
          multiple={multiple}
          className="hidden"
        />
        
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">拖拽文件到此处或点击上传</p>
          <p className="text-xs text-gray-500 mt-1">支持的格式: {accept === '*/*' ? '所有文件' : accept}</p>
          <p className="text-xs text-gray-500">最大文件大小: {(maxSize / 1024 / 1024).toFixed(1)}MB</p>
        </div>
        
        {loading && (
          <div className="mt-3">
            <svg className="animate-spin h-5 w-5 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-xs text-center text-gray-500 mt-1">处理中...</p>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-red-500">{error}</div>
      )}
    </div>
  );
};
