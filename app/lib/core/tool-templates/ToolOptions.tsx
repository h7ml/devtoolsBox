/**
 * 工具选项组件
 * 提供工具的可配置选项，支持主题、布局等配置
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/app/lib/core/design-system/utils';
import { toolOptions } from '@/app/tools/text/base64/config';
import { ToolOption, ToolOptionsProps } from './types';

/**
 * 工具选项组件
 */
export const ToolOptions: React.FC<ToolOptionsProps> = ({
  options,
  onChange,
  groups,
  className,
}) => {
  // 如果没有选项，则不渲染
  if (!options || options.length === 0) {
    return null;
  }

  // 初始化选项值
  const [optionValues, setOptionValues] = useState<Record<string, any>>(() => {
    const initialValues: Record<string, any> = {};
    options.forEach(option => {
      initialValues[option.id] = option.defaultValue;
    });
    return initialValues;
  });

  // 处理选项值变化
  const handleOptionChange = (optionId: string, newValue: any) => {
    // 更新状态
    setOptionValues(prev => {
      const newValues = { ...prev, [optionId]: newValue };

      // 调用外部回调
      onChange(optionId, newValue, newValues);

      return newValues;
    });
  };

  // 按组过滤选项
  const filteredOptions = groups
    ? options.filter(option => !option.group || groups.includes(option.group))
    : options;

  // 按组分类选项
  const groupedOptions = filteredOptions.reduce((acc, option) => {
    const group = option.group || '默认';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(option);
    return acc;
  }, {} as Record<string, ToolOption[]>);

  // 渲染单个选项控件
  const renderOptionControl = (option: ToolOption) => {
    const { id, type, label, options: optionItems, min, max, step } = option;
    const currentValue = optionValues[id];

    switch (type) {
      case 'select':
        return (
          <select
            id={id}
            value={String(currentValue)}
            onChange={(e) => handleOptionChange(id, e.target.value)}
            className="block w-full py-1 px-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {optionItems?.map((item, idx) => (
              <option key={idx} value={String(item.value)}>
                {item.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <input
            type="checkbox"
            id={id}
            checked={Boolean(currentValue)}
            onChange={(e) => handleOptionChange(id, e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        );

      case 'radio':
        return (
          <div className="flex flex-col space-y-1">
            {optionItems?.map((item, idx) => (
              <label key={idx} className="inline-flex items-center">
                <input
                  type="radio"
                  name={id}
                  value={String(item.value)}
                  checked={currentValue === item.value}
                  onChange={() => handleOptionChange(id, item.value)}
                  className="h-3 w-3 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-xs text-gray-700">{item.label}</span>
              </label>
            ))}
          </div>
        );

      case 'range':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="range"
              id={id}
              min={min}
              max={max}
              step={step}
              value={Number(currentValue)}
              onChange={(e) => handleOptionChange(id, Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs font-medium text-gray-700 min-w-[30px] text-right">
              {currentValue}
            </span>
          </div>
        );

      case 'switch':
        return (
          <button
            type="button"
            role="switch"
            aria-checked={Boolean(currentValue)}
            className={cn(
              "relative inline-flex h-5 w-10 items-center rounded-full",
              currentValue ? "bg-blue-600" : "bg-gray-200"
            )}
            onClick={() => handleOptionChange(id, !currentValue)}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition",
                currentValue ? "translate-x-5" : "translate-x-1"
              )}
            />
          </button>
        );

      case 'color':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="color"
              id={id}
              value={String(currentValue)}
              onChange={(e) => handleOptionChange(id, e.target.value)}
              className="w-6 h-6 border-0 p-0 rounded"
            />
            <span className="text-xs font-mono">{currentValue}</span>
          </div>
        );

      default:
        return null;
    }
  };

  // 渲染单个选项
  const renderOption = (option: ToolOption) => {
    return (
      <div key={option.id} className="flex flex-col space-y-1 mb-3">
        <div className="flex items-center justify-between">
          <label
            htmlFor={option.id}
            className="block text-sm font-medium text-gray-700"
          >
            {option.label}
          </label>
          {renderOptionControl(option)}
        </div>
        {option.description && (
          <p className="text-xs text-gray-500">{option.description}</p>
        )}
      </div>
    );
  };

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-medium text-gray-800">选项</h3>

      {Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
        <div key={groupName} className="border border-gray-200 rounded-md p-3">
          {groupName !== '默认' && (
            <h4 className="text-sm font-medium text-gray-700 mb-2">{groupName}</h4>
          )}
          <div className="space-y-2">
            {groupOptions.map(renderOption)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default toolOptions
