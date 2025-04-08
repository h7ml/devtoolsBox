/**
 * 工具模板类型定义
 */

import { ReactNode } from 'react';
import { Tool } from '../../types';

/**
 * 工具布局类型
 */
export type ToolLayoutType = 'standard' | 'compact' | 'wide' | 'split' | 'custom';

/**
 * 工具运行状态
 */
export enum ToolRunStatus {
  /**
   * 空闲状态
   */
  IDLE = 'idle',
  
  /**
   * 加载中
   */
  LOADING = 'loading',
  
  /**
   * 处理中
   */
  PROCESSING = 'processing',
  
  /**
   * 成功
   */
  SUCCESS = 'success',
  
  /**
   * 错误
   */
  ERROR = 'error'
}

/**
 * 结果显示类型
 */
export enum ResultDisplayType {
  TEXT = 'text',
  JSON = 'json',
  XML = 'xml',
  HTML = 'html',
  CSS = 'css',
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  SQL = 'sql',
  MARKDOWN = 'markdown',
  IMAGE = 'image',
  CUSTOM = 'custom'
}

/**
 * 代码语言类型
 */
export type CodeLanguage = 'typescript' | 'javascript' | 'html' | 'css' | 'python' | 'xml' | 'json' | 'sql' | 'bash';

/**
 * 表单域类型
 */
export enum FormFieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  FILE = 'file',
  COLOR = 'color',
  DATE = 'date',
  DATETIME = 'datetime',
  TIME = 'time',
  RANGE = 'range',
  CUSTOM = 'custom'
}

/**
 * 表单验证规则
 */
export interface FormValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
  customValidator?: (value: any) => string | null;
}

/**
 * 表单字段配置
 */
export interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  helperText?: string;
  defaultValue?: any;
  options?: Array<{ value: string; label: string }>;
  validation?: FormValidation;
  disabled?: boolean;
  hidden?: boolean;
  render?: (props: { id: string; value: any; onChange: (value: any) => void; error?: string }) => React.ReactNode;
}

/**
 * 工具布局属性
 */
export interface ToolLayoutProps {
  /**
   * 工具定义
   */
  tool: Tool;
  
  /**
   * 工具运行状态
   */
  status: ToolRunStatus;
  
  /**
   * 布局类型
   */
  layoutType?: ToolLayoutType;
  
  /**
   * 工具表单内容
   */
  formContent: ReactNode;
  
  /**
   * 工具结果内容
   */
  resultContent: ReactNode;
  
  /**
   * 工具选项内容
   */
  optionsContent?: ReactNode;
  
  /**
   * 工具帮助内容
   */
  helpContent?: ReactNode;
  
  /**
   * 工具示例内容
   */
  examplesContent?: ReactNode;
  
  /**
   * 元数据内容
   */
  metadataContent?: ReactNode;
  
  /**
   * 示例点击处理函数
   */
  onExampleClick?: (example: any) => void;
  
  /**
   * 自定义类名
   */
  className?: string;
  
  /**
   * 子元素
   */
  children?: ReactNode;
}

/**
 * 工具结果属性
 */
export interface ToolResultProps {
  /**
   * 结果内容
   */
  content: any;
  
  /**
   * 是否有错误
   */
  error?: string | null;
  
  /**
   * 结果类型
   */
  type?: 'text' | 'json' | 'code' | 'html' | 'image' | 'custom';
  
  /**
   * 是否允许复制
   */
  allowCopy?: boolean;
  
  /**
   * 是否允许下载
   */
  allowDownload?: boolean;
  
  /**
   * 下载文件名
   */
  downloadFileName?: string;
  
  /**
   * 下载MIME类型
   */
  downloadMimeType?: string;
  
  /**
   * 语法高亮语言（用于代码类型）
   */
  language?: string;
  
  /**
   * 自定义渲染函数
   */
  renderCustom?: (content: any) => ReactNode;
  
  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * 工具表单属性
 */
export interface ToolFormProps {
  /**
   * 表单字段列表
   */
  fields: FormField[];
  
  /**
   * 提交处理函数
   */
  onSubmit: (data: Record<string, any>) => void;
  
  /**
   * 字段值变更处理函数
   */
  onChange?: (fieldId: string, value: any) => void;
  
  /**
   * 表单重置处理函数
   */
  onReset?: () => void;
  
  /**
   * 是否禁用提交
   */
  disableSubmit?: boolean;
  
  /**
   * 提交按钮文本
   */
  submitText?: string;
  
  /**
   * 重置按钮文本
   */
  resetText?: string;
  
  /**
   * 是否显示重置按钮
   */
  showReset?: boolean;
  
  /**
   * 自定义类名
   */
  className?: string;
  
  /**
   * 是否使用键盘快捷键提交
   */
  useKeyboardShortcut?: boolean;
  
  /**
   * 表单子元素
   */
  children?: ReactNode;

  /**
   * 是否正在加载
   */
  isLoading?: boolean;

  /**
   * 提交按钮位置
   */
  submitPosition?: 'top' | 'bottom' | 'both';

  /**
   * 表单布局
   */
  layout?: 'vertical' | 'horizontal' | 'inline';
}

/**
 * 工具选项属性
 */
export interface ToolOptionsProps {
  /**
   * 选项列表
   */
  options: ToolOption[];
  
  /**
   * 选项值变更处理函数
   */
  onChange: (optionId: string, value: any, values?: Record<string, any>) => void;
  
  /**
   * 过滤特定组的选项
   */
  groups?: string[];
  
  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * 工具选项定义
 */
export interface ToolOption {
  /**
   * 选项ID
   */
  id: string;
  
  /**
   * 选项标签
   */
  label: string;
  
  /**
   * 选项类型
   */
  type: 'checkbox' | 'select' | 'radio' | 'input' | 'number' | 'range' | 'switch' | 'color';
  
  /**
   * 选项默认值
   */
  defaultValue?: any;
  
  /**
   * 选项可选值（用于select、radio类型）
   */
  options?: {
    value: string | number | boolean;
    label: string;
  }[];
  
  /**
   * 选项描述
   */
  description?: string;
  
  /**
   * 是否禁用
   */
  disabled?: boolean;
  
  /**
   * 最小值（用于number、range类型）
   */
  min?: number;
  
  /**
   * 最大值（用于number、range类型）
   */
  max?: number;
  
  /**
   * 步长（用于number、range类型）
   */
  step?: number;
  
  /**
   * 选项分组
   */
  group?: string;
}

/**
 * 工具示例属性
 */
export interface ToolExamplesProps {
  /**
   * 示例列表
   */
  examples: ToolExample[];
  
  /**
   * 应用示例处理函数
   */
  onApplyExample: (example: ToolExample) => void;
  
  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * 工具示例定义
 */
export interface ToolExample {
  /**
   * 示例ID
   */
  id: string;
  
  /**
   * 示例标题
   */
  title: string;
  
  /**
   * 示例描述
   */
  description?: string;
  
  /**
   * 示例输入
   */
  input: any;
  
  /**
   * 示例输出
   */
  output?: any;
  
  /**
   * 预期输出
   */
  expectedOutput?: any;
  
  /**
   * 示例代码
   */
  code?: string;
  
  /**
   * 效果图URL
   */
  imageUrl?: string;
  
  /**
   * 示例标签
   */
  tags?: string[];
}

/**
 * 工具帮助提示
 */
export interface ToolHelpTip {
  /**
   * 提示标题
   */
  title: string;
  
  /**
   * 提示内容
   */
  content: string;

  /**
   * 提示类型
   */
  type?: 'info' | 'warning' | 'error' | 'success' | 'general';
  
  /**
   * 提示标签
   */
  tags?: string[];
  
  /**
   * 相关链接
   */
  links?: Array<{ text: string; url: string }>;
}

/**
 * 工具帮助提示属性
 */
export interface ToolHelpTipsProps {
  /**
   * 提示列表
   */
  helpTips: ToolHelpTip[];
  
  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * 下载选项
 */
export interface DownloadOptions {
  fileName: string;
  formats: string[];
}

/**
 * 表格列定义
 */
export interface TableColumn {
  title: string;
  dataIndex: string;
  key?: string;
  render?: (text: any, record: any, index: number) => React.ReactNode;
}

/**
 * 工具结果显示属性
 */
export interface ResultDisplayProps {
  /**
   * 结果内容
   */
  content: string | null;
  
  /**
   * 错误信息
   */
  error: string | null;
  
  /**
   * 展示类型
   */
  type?: 'text' | 'json' | 'html' | 'code' | 'image' | 'table';
  
  /**
   * 代码语言（用于code类型）
   */
  language?: string;
  
  /**
   * 表格列定义（用于table类型）
   */
  tableColumns?: TableColumn[];
  
  /**
   * 表格数据（用于table类型）
   */
  tableData?: Record<string, any>[];
  
  /**
   * 高度
   */
  height?: number | 'auto';
  
  /**
   * 是否允许复制
   */
  allowCopy?: boolean;
  
  /**
   * 是否允许下载
   */
  allowDownload?: boolean;
  
  /**
   * 下载文件名
   */
  downloadFileName?: string;
  
  /**
   * 下载MIME类型
   */
  downloadMimeType?: string;
  
  /**
   * 下载选项
   */
  downloadOptions?: DownloadOptions;
  
  /**
   * 是否显示打开按钮
   */
  showOpenButton?: boolean;
  
  /**
   * 打开按钮文本
   */
  openButtonText?: string;
  
  /**
   * 打开链接URL
   */
  openButtonUrl?: string;
  
  /**
   * 打开按钮点击事件
   */
  onOpenClick?: () => void;
  
  /**
   * 自定义结果组件
   */
  resultComponent?: React.ReactNode;
  
  /**
   * 自定义类名
   */
  className?: string;
}
