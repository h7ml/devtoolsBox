import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  rounded?: 'default' | 'full';
  gradient?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

/**
 * 按钮组件
 * 采用小米+Apple设计风格
 */
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  rounded = 'default',
  gradient = false,
  isLoading = false,
  fullWidth = false,
  className = '',
  ...props
}) => {
  // 尺寸样式
  const sizeClasses = {
    sm: 'py-1.5 px-3 text-xs',
    md: 'py-2.5 px-4 text-sm',
    lg: 'py-3 px-5 text-base',
  };

  // 圆角样式
  const roundedClasses = {
    default: 'rounded-xl',
    full: 'rounded-full',
  };

  // 变体样式
  const variantClasses = {
    primary: gradient
      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg'
      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg',
    secondary: gradient
      ? 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300 shadow-md hover:shadow-lg'
      : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 shadow-md hover:shadow-lg',
    outline: 'border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
    ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/80 backdrop-blur-sm',
  };

  return (
    <button
      className={`
        ${sizeClasses[size]}
        ${roundedClasses[rounded]}
        ${variantClasses[variant]}
        inline-flex items-center justify-center gap-2
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isLoading ? 'opacity-70 cursor-progress' : ''}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full"></div>
      )}
      {icon && iconPosition === 'left' && !isLoading && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && !isLoading && (
        <span className="flex-shrink-0">{icon}</span>
      )}
    </button>
  );
};

export default Button; 
