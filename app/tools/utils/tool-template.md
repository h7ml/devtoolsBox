# 工具重构指南

## 文件结构

每个工具应遵循以下文件结构：

```
app/tools/[category]/[tool-name]/
  ├── page.tsx        # 主页面组件（使用模板系统）
  ├── config.ts       # 工具配置（工具定义、选项、示例、帮助提示）
  ├── utils.ts        # 工具特定的工具函数
  └── components/     # 可选，工具特定的组件
```

## 代码抽离原则

1. **配置分离**：
   - 将工具定义、选项配置、示例和帮助信息抽离到 `config.ts`
   - 保持页面组件干净简洁

2. **逻辑抽离**：
   - 将工具特定的处理逻辑抽离到 `utils.ts`
   - 通用逻辑抽离到 `app/tools/utils/` 下的共享文件中

3. **组件抽离**：
   - 复杂UI组件抽离到 `components/` 目录
   - 通用组件考虑移至设计系统

## 组件结构

```tsx
/**
 * 工具名称 - 简短描述
 */

'use client';

import { useState } from 'react';
import { 
  StandardToolLayout, 
  ResultDisplay, 
  ToolForm,
  ToolOptions,
  ToolExamples,
  ToolHelpTips,
  ToolRunStatus
} from '@/app/lib/core/tool-templates';
import { /* 设计系统组件 */ } from '@/app/components/design-system';
import { /* 工具函数 */ } from './utils';
import { 
  toolDefinition,
  toolOptions,
  examples,
  helpTips
} from './config';

export default function ToolPage() {
  // 状态定义
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ToolRunStatus>(ToolRunStatus.IDLE);
  const [options, setOptions] = useState({
    // 默认选项值
  });

  // 处理表单提交
  const handleSubmit = (formData: Record<string, any>) => {
    // 1. 更新状态
    // 2. 调用工具函数处理数据
    // 3. 更新结果状态
  };

  // 处理选项变更
  const handleOptionChange = (optionId: string, value: any) => {
    setOptions(prev => ({
      ...prev,
      [optionId]: value
    }));
  };

  // 处理示例应用
  const handleApplyExample = (example: any) => {
    // 应用示例到表单
  };

  return (
    <StandardToolLayout
      tool={toolDefinition}
      status={status}
      formContent={
        <ToolForm onSubmit={handleSubmit}>
          {/* 表单内容 */}
        </ToolForm>
      }
      resultContent={
        <ResultDisplay
          content={result}
          error={error}
          type="text" // 或其他类型
          allowCopy={true}
          allowDownload={true}
          downloadFileName="result.txt" // 适当的文件名
        />
      }
      optionsContent={
        <ToolOptions
          options={toolOptions}
          values={options}
          onChange={handleOptionChange}
        />
      }
      examplesContent={
        <ToolExamples
          examples={examples}
          onApply={handleApplyExample}
        />
      }
      helpContent={
        <ToolHelpTips tips={helpTips} />
      }
    />
  );
}
```

## 配置文件结构

```tsx
/**
 * 工具名称 - 配置
 */

import { Tool } from '@/app/lib/types';
import { ToolOption } from '@/app/lib/core/tool-templates';

/**
 * 工具定义
 */
export const toolDefinition: Tool = {
  id: 'tool-id',
  title: '工具名称',
  description: '工具描述',
  category: 'category',
  tags: ['标签1', '标签2'],
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
};

/**
 * 选项定义
 */
export const toolOptions: ToolOption[] = [
  // 选项配置
];

/**
 * 示例定义
 */
export const examples = [
  // 示例数据
];

/**
 * 帮助提示
 */
export const helpTips = [
  // 帮助提示
];
```

## 工具函数文件结构

```tsx
/**
 * 工具名称 - 工具函数
 */

/**
 * 主要工具函数
 * @param input 输入数据
 * @param options 选项
 * @returns 处理结果
 */
export function processInput(
  input: string,
  options: Record<string, any>
): { result: string; error: string | null } {
  try {
    // 处理逻辑
    return {
      result: 'processed result',
      error: null
    };
  } catch (err) {
    return {
      result: '',
      error: `处理错误: ${(err as Error).message}`
    };
  }
}

// 其他辅助函数
```

## 通用工具函数

建议将以下类型的通用函数抽离到 `app/tools/utils/` 目录：

1. 文件处理函数（读取、保存等）
2. 格式转换函数（日期、颜色等）
3. 数据验证函数
4. 文本处理函数
5. 通用计算函数

例如：
- `app/tools/utils/file-helpers.ts`
- `app/tools/utils/date-helpers.ts`
- `app/tools/utils/color-helpers.ts`
- `app/tools/utils/validation.ts`
- `app/tools/utils/text-helpers.ts`

## 重构步骤

1. 创建配置文件
   - 提取工具定义、选项、示例、帮助提示

2. 创建工具函数文件
   - 提取核心处理逻辑
   - 分解为功能单一的函数

3. 优化页面组件
   - 保留状态管理和事件处理
   - 确保组件简洁明了
   - 使用工具模板系统组件

4. 识别通用工具函数
   - 将通用功能移至共享工具函数
   - 确保工具函数具有良好的文档 
