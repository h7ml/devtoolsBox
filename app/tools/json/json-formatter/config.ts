/**
 * JSON格式化工具 - 配置
 */

import { Tool } from '@/app/lib/types';
import { ToolOption } from '@/app/lib/core/tool-templates';

/**
 * 工具定义
 */
export const jsonFormatterTool: Tool = {
  id: 'json-formatter',
  title: 'JSON格式化工具',
  description: '格式化和验证JSON数据，使其更易读和分析',
  category: 'json',
  tags: ['格式化', '验证', 'JSON'],
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
};

/**
 * 选项定义
 */
export const formatOptions: ToolOption[] = [
  {
    id: 'indentSize',
    label: '缩进大小',
    type: 'select',
    defaultValue: '2',
    options: [
      { value: '2', label: '2个空格' },
      { value: '4', label: '4个空格' },
      { value: '8', label: '8个空格' },
      { value: 'tab', label: '制表符' }
    ],
    description: '选择JSON格式化的缩进大小'
  },
  {
    id: 'sortKeys',
    label: '按键排序',
    type: 'checkbox',
    defaultValue: false,
    description: '是否按字母顺序排序JSON的键'
  },
  {
    id: 'minify',
    label: '最小化',
    type: 'checkbox',
    defaultValue: false,
    description: '移除所有空格，生成最小化的JSON'
  }
];

/**
 * 示例定义
 */
export const examples = [
  {
    id: 'simple-json',
    title: '简单JSON对象',
    description: '包含基本数据类型的JSON对象示例',
    input: '{"name":"John Doe","age":30,"email":"john@example.com","isActive":true}',
    output: '{\n  "name": "John Doe",\n  "age": 30,\n  "email": "john@example.com",\n  "isActive": true\n}',
    tags: ['基础']
  },
  {
    id: 'nested-json',
    title: '嵌套JSON对象',
    description: '包含嵌套结构的复杂JSON示例',
    input: '{"user":{"name":"Jane","profile":{"address":{"city":"Shanghai","country":"China"},"contacts":[{"type":"email","value":"jane@example.com"},{"type":"phone","value":"123-456-7890"}]}},"settings":{"theme":"dark","notifications":true}}',
    output: '',
    tags: ['嵌套', '复杂']
  },
  {
    id: 'json-array',
    title: 'JSON数组',
    description: '包含数组的JSON示例',
    input: '[{"id":1,"name":"Product A","price":19.99},{"id":2,"name":"Product B","price":29.99},{"id":3,"name":"Product C","price":39.99}]',
    output: '',
    tags: ['数组']
  }
];

/**
 * 帮助提示
 */
export const helpTips = [
  {
    title: '如何使用JSON格式化工具？',
    content: '将您的JSON数据粘贴到输入框中，点击"执行"按钮即可获得格式化后的JSON。您可以在选项中调整缩进大小和是否对键进行排序。'
  },
  {
    title: '为什么我的JSON无法格式化？',
    content: '可能是因为您的JSON数据格式不正确。确保您的JSON数据符合标准格式，如：双引号包裹键名、值之间用逗号分隔等。本工具会在遇到无效JSON时显示错误信息。'
  },
  {
    title: '格式化后的JSON可以保存吗？',
    content: '是的，格式化后的JSON可以复制到剪贴板或下载为文件。点击结果区域下方的"复制"或"下载"按钮即可。'
  },
  {
    title: '什么是按键排序？',
    content: '按键排序功能会将JSON对象中的键按字母顺序排序，使结构更加清晰和一致，特别适合比较两个JSON对象的差异。'
  }
]; 
