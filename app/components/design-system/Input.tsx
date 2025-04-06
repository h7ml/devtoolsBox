import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
  className?: string;
  inputClassName?: string;
  containerClassName?: string;
  labelClassName?: string;
  gradient?: boolean;
}

/**
 * 输入框组件
 * 采用小米+Apple设计风格
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      icon,
      error,
      hint,
      fullWidth = true,
      className = '',
      inputClassName = '',
      containerClassName = '',
      labelClassName = '',
      gradient = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
        {label && (
          <div className="flex items-center justify-between mb-2">
            <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${labelClassName}`}>
              {label}
            </label>
            {hint && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {hint}
              </span>
            )}
          </div>
        )}
        <div className={`relative ${className}`}>
          {gradient && (
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 opacity-20 rounded-xl pointer-events-none"></div>
          )}

          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400">{icon}</span>
            </div>
          )}

          <input
            ref={ref}
            className={`
              w-full py-3 px-4 ${icon ? 'pl-10' : ''}
              bg-white dark:bg-gray-800 
              border border-gray-200 dark:border-gray-700 
              rounded-xl shadow-sm 
              focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
              dark:text-white text-sm transition-all
              disabled:opacity-60 disabled:cursor-not-allowed
              ${error ? 'border-red-300 dark:border-red-700 focus:ring-red-500' : ''}
              ${gradient ? 'shadow-inner' : ''}
              ${inputClassName}
            `}
            {...props}
          />
        </div>

        {error && (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

/**
 * 文本域组件
 * 采用与Input相同的设计风格
 */
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
  className?: string;
  textareaClassName?: string;
  containerClassName?: string;
  labelClassName?: string;
  gradient?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      hint,
      fullWidth = true,
      className = '',
      textareaClassName = '',
      containerClassName = '',
      labelClassName = '',
      gradient = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
        {label && (
          <div className="flex items-center justify-between mb-2">
            <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${labelClassName}`}>
              {label}
            </label>
            {hint && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {hint}
              </span>
            )}
          </div>
        )}
        <div className={`relative ${className}`}>
          {gradient && (
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 opacity-20 rounded-xl pointer-events-none"></div>
          )}

          <textarea
            ref={ref}
            className={`
              w-full p-4
              bg-white dark:bg-gray-800 
              border border-gray-200 dark:border-gray-700 
              rounded-xl ${gradient ? 'shadow-inner' : 'shadow-sm'} 
              focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
              dark:text-white text-sm transition-all
              disabled:opacity-60 disabled:cursor-not-allowed
              ${error ? 'border-red-300 dark:border-red-700 focus:ring-red-500' : ''}
              resize-none
              ${textareaClassName}
            `}
            {...props}
          />
        </div>

        {error && (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea'; 
