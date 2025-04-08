/**
 * 工具表单组件
 * 用于收集工具所需的输入参数，支持多种表单布局和字段类型
 */

'use client';

import React, { useState, useRef, FormEvent } from 'react';
import { cn } from '@/app/lib/core/design-system/utils';
import { ToolFormProps, FormField } from './types';

/**
 * 工具表单组件
 */
export const ToolForm: React.FC<ToolFormProps> = ({
  fields,
  submitText = '提交',
  resetText = '重置',
  onSubmit,
  onChange,
  onReset,
  disableSubmit = false,
  showReset = false,
  isLoading = false,
  submitPosition = 'bottom',
  layout = 'vertical',
  className,
  useKeyboardShortcut = false,
  children,
}) => {
  // 表单值状态
  const [formValues, setFormValues] = useState<Record<string, any>>(() => {
    const initialValues: Record<string, any> = {};
    fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        initialValues[field.id] = field.defaultValue;
      }
    });
    return initialValues;
  });

  // 表单错误状态
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 表单引用
  const formRef = useRef<HTMLFormElement>(null);

  // 验证单个字段
  const validateField = (field: FormField, value: any): string => {
    const { validation } = field;
    if (!validation) return '';

    if (validation.required && (value === undefined || value === null || value === '')) {
      return validation.message || `${field.label}是必填项`;
    }

    if (validation.min !== undefined && Number(value) < validation.min) {
      return validation.message || `${field.label}不能小于${validation.min}`;
    }

    if (validation.max !== undefined && Number(value) > validation.max) {
      return validation.message || `${field.label}不能大于${validation.max}`;
    }

    if (validation.pattern && typeof value === 'string') {
      const regex = new RegExp(validation.pattern);
      if (!regex.test(value)) {
        return validation.message || `${field.label}格式不正确`;
      }
    }

    return '';
  };

  // 验证整个表单
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach(field => {
      const value = formValues[field.id];
      const error = validateField(field, value);
      if (error) {
        newErrors[field.id] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理字段值变化
  const handleFieldChange = (fieldId: string, value: any) => {
    const newValues = { ...formValues, [fieldId]: value };
    setFormValues(newValues);

    // 清除该字段的错误
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }

    // 调用外部onChange回调
    if (onChange) {
      onChange(fieldId, value);
    }
  };

  // 处理表单提交
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formValues);
    }
  };

  // 渲染字段
  const renderField = (field: FormField) => {
    const { id, label, type, placeholder, helperText } = field;
    const value = formValues[id] !== undefined ? formValues[id] : '';
    const error = errors[id];

    // 自定义渲染函数
    if (field.render) {
      return (
        <div className="mb-4">
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {field.render({
            id,
            value,
            onChange: (val) => handleFieldChange(id, val),
            error
          })}
          {helperText && !error && (
            <p className="mt-1 text-xs text-gray-500">{helperText}</p>
          )}
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      );
    }

    // 根据类型渲染不同的表单控件
    switch (type) {
      case 'textarea':
        return (
          <div className="mb-4">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
              {label}
              {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              id={id}
              value={value as string}
              onChange={(e) => handleFieldChange(id, e.target.value)}
              placeholder={placeholder}
              className={cn(
                "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                error ? "border-red-300" : "border-gray-300"
              )}
              rows={5}
            />
            {helperText && !error && (
              <p className="mt-1 text-xs text-gray-500">{helperText}</p>
            )}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>
        );

      case 'number':
        return (
          <div className="mb-4">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
              {label}
              {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="number"
              id={id}
              value={value as number}
              onChange={(e) => handleFieldChange(id, e.target.valueAsNumber)}
              placeholder={placeholder}
              className={cn(
                "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                error ? "border-red-300" : "border-gray-300"
              )}
              min={field.validation?.min}
              max={field.validation?.max}
            />
            {helperText && !error && (
              <p className="mt-1 text-xs text-gray-500">{helperText}</p>
            )}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>
        );

      case 'select':
        return (
          <div className="mb-4">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
              {label}
              {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              id={id}
              value={value as string}
              onChange={(e) => handleFieldChange(id, e.target.value)}
              className={cn(
                "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                error ? "border-red-300" : "border-gray-300"
              )}
            >
              <option value="">{placeholder || '请选择'}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {helperText && !error && (
              <p className="mt-1 text-xs text-gray-500">{helperText}</p>
            )}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div className="mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id={id}
                checked={Boolean(value)}
                onChange={(e) => handleFieldChange(id, e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor={id} className="ml-2 block text-sm text-gray-700">
                {label}
                {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            </div>
            {helperText && !error && (
              <p className="mt-1 text-xs text-gray-500 ml-6">{helperText}</p>
            )}
            {error && <p className="mt-1 text-xs text-red-500 ml-6">{error}</p>}
          </div>
        );

      case 'radio':
        return (
          <div className="mb-4">
            <div className="block text-sm font-medium text-gray-700 mb-1">
              {label}
              {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
            </div>
            <div className="space-y-2">
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    id={`${id}-${option.value}`}
                    name={id}
                    value={option.value}
                    checked={value === option.value}
                    onChange={() => handleFieldChange(id, option.value)}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor={`${id}-${option.value}`} className="ml-2 block text-sm text-gray-700">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            {helperText && !error && (
              <p className="mt-1 text-xs text-gray-500">{helperText}</p>
            )}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>
        );

      case 'file':
        return (
          <div className="mb-4">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
              {label}
              {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="file"
              id={id}
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  handleFieldChange(id, files[0]);
                }
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {helperText && !error && (
              <p className="mt-1 text-xs text-gray-500">{helperText}</p>
            )}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>
        );

      case 'text':
      default:
        return (
          <div className="mb-4">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
              {label}
              {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              id={id}
              value={value as string}
              onChange={(e) => handleFieldChange(id, e.target.value)}
              placeholder={placeholder}
              className={cn(
                "block w-full rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                error ? "border-red-300" : "border-gray-300"
              )}
            />
            {helperText && !error && (
              <p className="mt-1 text-xs text-gray-500">{helperText}</p>
            )}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>
        );
    }
  };

  // 渲染提交按钮
  const renderSubmitButton = () => (
    <div className="mt-4">
      <button
        type="submit"
        disabled={disableSubmit || isLoading}
        className={cn(
          "inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
          (disableSubmit || isLoading) && "opacity-50 cursor-not-allowed"
        )}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            处理中...
          </>
        ) : (
          submitText
        )}
      </button>
    </div>
  );

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={cn('space-y-4', className)}>
      {(submitPosition === 'top' || submitPosition === 'both') && renderSubmitButton()}

      <div className={cn(
        'space-y-4',
        layout === 'horizontal' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''
      )}>
        {fields.map((field) => (
          <div key={field.id} className={layout === 'horizontal' ? 'col-span-1' : ''}>
            {renderField(field)}
          </div>
        ))}
      </div>

      {(submitPosition === 'bottom' || submitPosition === 'both') && renderSubmitButton()}
    </form>
  );
};

export default ToolForm; 
