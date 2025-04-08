/**
 * 设计系统类型定义
 */

import { ReactNode } from 'react';

/**
 * 颜色模式
 */
export type ColorMode = 'light' | 'dark';

/**
 * 尺寸定义
 */
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';

/**
 * 组件变体
 */
export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning' | 'error';

/**
 * 图标位置
 */
export type IconPosition = 'left' | 'right';

/**
 * 对齐方式
 */
export type Alignment = 'left' | 'center' | 'right';

/**
 * 标准组件属性
 */
export interface BaseComponentProps {
  /**
   * 子元素
   */
  children?: ReactNode;
  
  /**
   * 类名
   */
  className?: string;
  
  /**
   * 自定义样式
   */
  style?: React.CSSProperties;
  
  /**
   * 数据测试ID
   */
  'data-testid'?: string;
}

/**
 * 按钮组件属性
 */
export interface ButtonProps extends BaseComponentProps, React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 按钮变体
   */
  variant?: Variant;
  
  /**
   * 按钮尺寸
   */
  size?: Size;
  
  /**
   * 按钮图标
   */
  icon?: ReactNode;
  
  /**
   * 图标位置
   */
  iconPosition?: IconPosition;
  
  /**
   * 圆角类型
   */
  rounded?: 'default' | 'full';
  
  /**
   * 是否显示渐变
   */
  gradient?: boolean;
  
  /**
   * 是否处于加载状态
   */
  isLoading?: boolean;
  
  /**
   * 是否占满宽度
   */
  fullWidth?: boolean;
}

/**
 * 输入框组件属性
 */
export interface InputProps extends BaseComponentProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * 标签文本
   */
  label?: string;
  
  /**
   * 输入框图标
   */
  icon?: ReactNode;
  
  /**
   * 错误信息
   */
  error?: string;
  
  /**
   * 帮助提示
   */
  hint?: string;
  
  /**
   * 输入框尺寸
   */
  size?: Size;
  
  /**
   * 是否占满宽度
   */
  fullWidth?: boolean;
  
  /**
   * 是否显示渐变
   */
  gradient?: boolean;
  
  /**
   * 输入框容器类名
   */
  containerClassName?: string;
  
  /**
   * 标签类名
   */
  labelClassName?: string;
  
  /**
   * 输入框类名
   */
  inputClassName?: string;
}

/**
 * 文本域组件属性
 */
export interface TextAreaProps extends BaseComponentProps, Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /**
   * 标签文本
   */
  label?: string;
  
  /**
   * 错误信息
   */
  error?: string;
  
  /**
   * 帮助提示
   */
  hint?: string;
  
  /**
   * 文本域尺寸
   */
  size?: Size;
  
  /**
   * 是否占满宽度
   */
  fullWidth?: boolean;
  
  /**
   * 是否显示渐变
   */
  gradient?: boolean;
  
  /**
   * 文本域容器类名
   */
  containerClassName?: string;
  
  /**
   * 标签类名
   */
  labelClassName?: string;
  
  /**
   * 文本域类名
   */
  textareaClassName?: string;
}

/**
 * 卡片组件属性
 */
export interface CardProps extends BaseComponentProps {
  /**
   * 是否启用悬停效果
   */
  hoverEffect?: boolean;
  
  /**
   * 是否取消内边距
   */
  noPadding?: boolean;
  
  /**
   * 卡片变体
   */
  variant?: 'default' | 'outlined' | 'elevated';
}

/**
 * 卡片标题区域属性
 */
export interface CardHeaderProps extends BaseComponentProps {
  /**
   * 图标
   */
  icon?: ReactNode;
  
  /**
   * 标题
   */
  title: string;
  
  /**
   * 描述
   */
  description?: string;
  
  /**
   * 图标类名
   */
  iconClassName?: string;
  
  /**
   * 渐变颜色
   */
  gradientColors?: string;
}

/**
 * 卡片内容区域属性
 */
export interface CardContentProps extends BaseComponentProps {}

/**
 * 卡片底部区域属性
 */
export interface CardFooterProps extends BaseComponentProps {} 
 