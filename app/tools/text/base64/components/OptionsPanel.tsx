 'use client';

import React, { useState } from 'react';
import { Base64Options } from '../types';
import { defaultOptions } from '../config';

interface OptionsPanelProps {
  options: Partial<Base64Options>;
  onChange: (options: Partial<Base64Options>) => void;
}

export const OptionsPanel: React.FC<OptionsPanelProps> = ({ 
  options, 
  onChange 
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // 处理选项变更
  const handleOptionChange = (key: keyof Base64Options, value: any) => {
    onChange({ ...options, [key]: value });
  };
  
  // 切换基本/高级视图
  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };
  
  // 重置为默认选项
  const resetOptions = () => {
    onChange({
      ...defaultOptions,
      mode: options.mode, // 保留当前的模式
      inputType: options.inputType, // 保留当前的输入类型
      outputType: options.outputType // 保留当前的输出类型
    });
  };
  
  return (
    <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-medium">选项</h3>
        <div className="flex space-x-2">
          <button
            onClick={toggleAdvanced}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
          >
            {showAdvanced ? '基本选项' : '高级选项'}
          </button>
          <button
            onClick={resetOptions}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
            title="重置为默认选项"
          >
            重置
          </button>
        </div>
      </div>
      
      <div className="p-4">
        {/* 基本选项 */}
        <div className="space-y-4">
          {/* 操作模式 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">操作模式</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="encode"
                  checked={options.mode === 'encode'}
                  onChange={() => handleOptionChange('mode', 'encode')}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">编码</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="decode"
                  checked={options.mode === 'decode'}
                  onChange={() => handleOptionChange('mode', 'decode')}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">解码</span>
              </label>
            </div>
          </div>
          
          {/* URL安全模式 */}
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={options.urlSafe}
                onChange={(e) => handleOptionChange('urlSafe', e.target.checked)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700">URL安全模式</span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-6">将标准Base64中的"+"替换为"-"，"/"替换为"_"</p>
          </div>
          
          {/* 输入类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">输入类型</label>
            <select
              value={options.inputType}
              onChange={(e) => handleOptionChange('inputType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="text">文本</option>
              <option value="file">文件</option>
              <option value="binary">二进制</option>
            </select>
          </div>
          
          {/* 输出类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">输出类型</label>
            <select
              value={options.outputType}
              onChange={(e) => handleOptionChange('outputType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="text">文本</option>
              <option value="file">文件</option>
              <option value="binary">二进制</option>
              <option value="dataUrl">数据URL</option>
            </select>
          </div>
        </div>
        
        {/* 高级选项 */}
        {showAdvanced && (
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
            <h4 className="font-medium text-sm text-gray-700 mb-2">高级选项</h4>
            
            {/* 填充字符 */}
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={options.paddingEnabled}
                  onChange={(e) => handleOptionChange('paddingEnabled', e.target.checked)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">保留填充字符</span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">保留Base64编码末尾的等号填充字符</p>
            </div>
            
            {/* Web Worker */}
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={options.useWorker}
                  onChange={(e) => handleOptionChange('useWorker', e.target.checked)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">使用Web Worker</span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">在后台线程处理大文件以避免界面卡顿</p>
            </div>
            
            {/* Gzip压缩 */}
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={options.compress}
                  onChange={(e) => handleOptionChange('compress', e.target.checked)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">Gzip压缩</span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">在编码前压缩数据以减小结果大小（需现代浏览器支持）</p>
            </div>
            
            {/* 安全选项 */}
            <h4 className="font-medium text-sm text-gray-700 mb-2 mt-6">安全选项</h4>
            
            {/* 验证输入 */}
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={options.validateInput}
                  onChange={(e) => handleOptionChange('validateInput', e.target.checked)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">验证输入</span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">验证输入数据是否符合选定格式</p>
            </div>
            
            {/* 检测敏感信息 */}
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={options.detectSensitive}
                  onChange={(e) => handleOptionChange('detectSensitive', e.target.checked)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">检测敏感信息</span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">检测并提示可能的敏感信息（如密钥、令牌）</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
