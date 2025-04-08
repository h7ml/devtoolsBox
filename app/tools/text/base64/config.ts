/**
 * Base64编解码工具 - 配置
 */

import { Tool } from '@/app/lib/types';
import { ToolOption } from '@/app/lib/core/tool-templates';
import { Base64Options, InputType, OutputType } from './types';

/**
 * 工具定义
 */
export const toolDefinition: Tool = {
  id: 'base64',
  title: 'Base64 高级编解码工具',
  description: '全功能的 Base64 编解码工具，支持文本、文件和二进制数据处理',
  category: 'text',
  tags: ['编码', '解码', 'Base64', '文件处理', '二进制'],
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: '2.0.0'
  }
};

/**
 * 默认选项
 */
export const defaultOptions: Base64Options = {
  mode: 'encode',
  urlSafe: false,
  inputType: 'text',
  outputType: 'text',
  paddingEnabled: true,
  chunkSize: 1024 * 1024, // 1MB
  useWorker: true,
  compress: false,
  validateInput: true,
  detectSensitive: true
};

/**
 * 选项分组
 */
const optionGroups = {
  basic: '基本选项',
  advanced: '高级选项',
  security: '安全选项'
};

/**
 * 选项定义
 */
export const toolOptions: ToolOption[] = [
  // 基本选项
  {
    id: 'mode',
    label: '操作模式',
    type: 'radio',
    defaultValue: defaultOptions.mode,
    options: [
      { value: 'encode', label: '编码' },
      { value: 'decode', label: '解码' }
    ],
    description: '选择编码或解码操作',
    group: optionGroups.basic
  },
  {
    id: 'urlSafe',
    label: 'URL安全模式',
    type: 'checkbox',
    defaultValue: defaultOptions.urlSafe,
    description: '使用URL安全的Base64变体，将+替换为-，/替换为_',
    group: optionGroups.basic
  },
  
  // 输入输出选项
  {
    id: 'inputType',
    label: '输入类型',
    type: 'select',
    defaultValue: defaultOptions.inputType,
    options: [
      { value: 'text', label: '文本' },
      { value: 'file', label: '文件' },
      { value: 'binary', label: '二进制' }
    ],
    description: '选择输入数据的类型',
    group: optionGroups.basic
  },
  {
    id: 'outputType',
    label: '输出类型',
    type: 'select',
    defaultValue: defaultOptions.outputType,
    options: [
      { value: 'text', label: '文本' },
      { value: 'file', label: '文件' },
      { value: 'binary', label: '二进制' },
      { value: 'dataUrl', label: '数据URL' }
    ],
    description: '选择输出数据的类型',
    group: optionGroups.basic
  },
  
  // 高级选项
  {
    id: 'paddingEnabled',
    label: '保留填充字符',
    type: 'checkbox',
    defaultValue: defaultOptions.paddingEnabled,
    description: '保留Base64编码末尾的等号填充字符',
    group: optionGroups.advanced
  },
  {
    id: 'useWorker',
    label: '使用Web Worker',
    type: 'checkbox',
    defaultValue: defaultOptions.useWorker,
    description: '在后台线程处理大文件以避免界面卡顿',
    group: optionGroups.advanced
  },
  {
    id: 'compress',
    label: 'Gzip压缩',
    type: 'checkbox',
    defaultValue: defaultOptions.compress,
    description: '在编码前压缩数据以减小结果大小',
    group: optionGroups.advanced
  },
  
  // 安全选项
  {
    id: 'validateInput',
    label: '验证输入',
    type: 'checkbox',
    defaultValue: defaultOptions.validateInput,
    description: '验证输入数据是否符合选定格式',
    group: optionGroups.security
  },
  {
    id: 'detectSensitive',
    label: '检测敏感信息',
    type: 'checkbox',
    defaultValue: defaultOptions.detectSensitive,
    description: '检测并提示可能的敏感信息（如密钥、令牌）',
    group: optionGroups.security
  }
];

/**
 * 示例定义
 */
export const examples = [
  {
    id: 'text-encode-example',
    title: '文本编码示例',
    description: '将普通文本转换为Base64编码',
    input: 'Hello, World!',
    output: 'SGVsbG8sIFdvcmxkIQ==',
    options: { mode: 'encode', inputType: 'text', outputType: 'text' },
    tags: ['编码', '文本']
  },
  {
    id: 'text-decode-example',
    title: 'Base64解码示例',
    description: '将Base64编码转换为普通文本',
    input: 'SGVsbG8sIFdvcmxkIQ==',
    output: 'Hello, World!',
    options: { mode: 'decode', inputType: 'text', outputType: 'text' },
    tags: ['解码', '文本']
  },
  {
    id: 'url-safe-example',
    title: 'URL安全Base64示例',
    description: 'URL安全的Base64编码',
    input: 'Hello?World+123/456',
    output: 'SGVsbG8_V29ybGQrMTIzLzQ1Ng',
    options: { mode: 'encode', urlSafe: true, paddingEnabled: false },
    tags: ['URL安全', '编码']
  },
  {
    id: 'binary-example',
    title: '二进制数据编码',
    description: '编码二进制数据并获取DataURL',
    input: '[二进制数据]',
    output: 'data:application/octet-stream;base64,...',
    options: { mode: 'encode', inputType: 'binary', outputType: 'dataUrl' },
    tags: ['二进制', 'DataURL']
  },
  {
    id: 'image-encode-example',
    title: '图片编码示例',
    description: '将图片转换为Base64编码（用于嵌入HTML）',
    input: '[图片文件]',
    output: 'data:image/jpeg;base64,...',
    options: { mode: 'encode', inputType: 'file', outputType: 'dataUrl' },
    tags: ['图片', '编码']
  }
];

/**
 * 帮助提示
 */
export const helpTips = [
  {
    title: '什么是Base64编码？',
    content: 'Base64是一种基于64个可打印字符来表示二进制数据的表示方法。常用于在处理文本的场合，表示、传输、存储一些二进制数据，包括MIME的电子邮件及XML的一些复杂数据。'
  },
  {
    title: '何时使用URL安全模式？',
    content: '当您需要在URL中使用Base64编码时，应选择URL安全模式。这会将标准Base64中的"+"替换为"-"，"/"替换为"_"，从而避免URL编码问题。'
  },
  {
    title: '如何处理大文件？',
    content: '处理大文件（>10MB）时，建议启用Web Worker选项，这将在后台线程进行处理，避免主界面卡顿。同时，文件会自动进行分块处理，以避免内存溢出问题。'
  },
  {
    title: '如何嵌入图片到HTML？',
    content: '要将图片嵌入HTML，选择"文件"输入类型和"数据URL"输出类型，然后上传图片。生成的Base64数据URL可以直接用于HTML的img标签的src属性。'
  },
  {
    title: '检测敏感信息是什么？',
    content: '启用此选项后，工具会分析您的数据，检测可能包含的敏感信息，如密钥、令牌、凭证等，并给出警告提示，帮助您避免意外泄露。'
  },
  {
    title: 'Base64和文件大小的关系',
    content: 'Base64编码会使数据大小增加约33%，因为它将3字节的二进制数据转换为4字节的文本。如果担心大小问题，可以启用Gzip压缩选项。'
  },
  {
    title: '常见错误：解码失败',
    content: '如果解码失败，请检查：1. 输入的Base64字符串是否完整 2. 是否包含非Base64字符 3. 如果使用了URL安全模式编码，解码时也应选择URL安全模式 4. 对于二进制数据，确保选择了正确的输出类型'
  }
];
