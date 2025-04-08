# 工具迁移指南

本文档提供了将现有工具迁移到新架构的详细步骤和最佳实践。

## 迁移目标

1. 提高代码复用性和一致性
2. 优化用户体验
3. 降低维护成本
4. 提升开发效率

## 迁移步骤

### 1. 配置文件分离

将工具定义、配置、示例和帮助信息抽离到单独的 `config.ts` 文件：

```typescript
// app/tools/[category]/[tool-name]/config.ts

import { Tool } from '@/app/lib/types';
import { ToolOption } from '@/app/lib/core/tool-templates';

/**
 * 工具定义
 */
export const toolDefinition: Tool = {
  id: 'tool-id',
  title: '工具名称',
  description: '工具描述',
  category: 'tool-category',
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
  {
    id: 'option1',
    label: '选项1',
    type: 'select',
    defaultValue: 'value1',
    options: [
      { value: 'value1', label: '选项1' },
      { value: 'value2', label: '选项2' }
    ],
    description: '选项描述'
  },
  // 更多选项...
];

/**
 * 示例定义
 */
export const examples = [
  {
    id: 'example1',
    title: '示例1',
    description: '示例描述',
    input: '示例输入',
    output: '示例输出',
    tags: ['示例标签']
  },
  // 更多示例...
];

/**
 * 帮助提示
 */
export const helpTips = [
  {
    title: '提示1',
    content: '提示内容',
    type: 'info'
  },
  // 更多提示...
];
```

### 2. 工具函数分离

将核心业务逻辑抽离到 `utils.ts` 文件：

```typescript
// app/tools/[category]/[tool-name]/utils.ts

/**
 * 工具核心业务逻辑
 */
export function processData(input: string, options: Record<string, any>): { result: any; error: string | null } {
  try {
    // 处理逻辑...
    return { result: '处理结果', error: null };
  } catch (error) {
    return { result: null, error: (error as Error).message };
  }
}
```

### 3. 页面组件重构

使用模板系统组件重构页面：

```tsx
// app/tools/[category]/[tool-name]/page.tsx

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
import { TextArea } from '@/app/components/design-system';
import { processData } from './utils';
import { 
  toolDefinition,
  toolOptions,
  examples,
  helpTips
} from './config';

export default function ToolPage() {
  // 状态管理
  const [input, setInput] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ToolRunStatus>(ToolRunStatus.IDLE);
  const [options, setOptions] = useState<Record<string, any>>({
    // 基于toolOptions的默认选项值
    ...Object.fromEntries(
      toolOptions.map(option => [option.id, option.defaultValue])
    )
  });

  // 处理表单提交
  const handleSubmit = (formData: Record<string, any>) => {
    // 1. 更新状态
    setStatus(ToolRunStatus.PROCESSING);
    
    // 2. 调用工具函数处理数据
    const { result: processedResult, error: processError } = processData(
      formData.input,
      options
    );
    
    // 3. 更新结果状态
    setResult(processedResult);
    setError(processError);
    setStatus(processError ? ToolRunStatus.ERROR : ToolRunStatus.SUCCESS);
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
    setInput(example.input);
  };

  return (
    <StandardToolLayout
      tool={toolDefinition}
      status={status}
      formContent={
        <ToolForm 
          fields={[
            {
              id: 'input',
              label: '输入',
              type: 'textarea',
              placeholder: '请输入...',
              defaultValue: input,
              validation: { required: true }
            }
          ]}
          onSubmit={handleSubmit}
          onChange={(fieldId, value) => {
            if (fieldId === 'input') setInput(value);
          }}
        />
      }
      resultContent={
        <ResultDisplay
          data={result}
          type="json" // 或其他适合的类型
          error={error}
          loading={status === ToolRunStatus.PROCESSING}
          actions={[
            {
              label: '复制',
              onClick: () => {
                // 复制逻辑
                navigator.clipboard.writeText(
                  typeof result === 'string' ? result : JSON.stringify(result, null, 2)
                );
              }
            }
          ]}
        />
      }
      optionsContent={
        <ToolOptions
          options={toolOptions}
          onChange={handleOptionChange}
          groups={['基本', '高级']} // 可选，用于分组显示选项
        />
      }
      examplesContent={
        <ToolExamples
          examples={examples}
          onApplyExample={handleApplyExample}
        />
      }
      helpContent={
        <ToolHelpTips
          helpTips={helpTips}
        />
      }
    />
  );
}
```

## 迁移检查清单

每个工具迁移后，请确保：

- [ ] 工具配置已抽离到 `config.ts`
- [ ] 工具逻辑已抽离到 `utils.ts`
- [ ] 页面组件使用了模板系统
- [ ] 所有原有功能都已正确迁移
- [ ] 工具在各种状态下都能正常工作（空闲、处理中、成功、错误）
- [ ] 选项、示例和帮助提示正常显示和工作
- [ ] 工具页面在移动设备上具有良好的响应式体验

## 典型迁移案例

### JSON 格式化工具

JSON 格式化工具已经完成迁移，可以作为参考案例：
- 路径：`app/tools/json/json-formatter/`
- 文件：`config.ts`, `utils.ts`, `page.tsx`

查看这些文件以了解迁移的最佳实践。

## 迁移顺序建议

按照以下顺序迁移工具可获得最佳效果：

1. 文本处理工具 - 通常较简单，适合作为起点
2. 格式化工具 - 如JSON、XML、HTML格式化器
3. 转换工具 - 如编码、解码工具
4. 计算工具 - 如哈希计算、数学工具
5. 复杂工具 - 需要特殊处理或外部API的工具

## 常见问题

### Q: 如何处理异步操作？

A: 在处理异步操作时，确保更新工具状态，并处理可能的错误：

```typescript
const handleSubmit = async (formData: Record<string, any>) => {
  setStatus(ToolRunStatus.PROCESSING);
  
  try {
    const result = await someAsyncOperation(formData.input);
    setResult(result);
    setError(null);
    setStatus(ToolRunStatus.SUCCESS);
  } catch (error) {
    setError((error as Error).message);
    setStatus(ToolRunStatus.ERROR);
  }
};
```

### Q: 如何处理文件上传和下载？

A: 使用 `ToolForm` 中的文件类型字段和 `ResultDisplay` 的下载功能：

```tsx
// 文件上传
<ToolForm
  fields={[
    {
      id: 'file',
      label: '上传文件',
      type: 'file',
      validation: { required: true }
    }
  ]}
  onSubmit={handleSubmit}
/>

// 文件处理
const handleSubmit = async (formData: Record<string, any>) => {
  const file = formData.file as File;
  // 处理文件...
};

// 文件下载
<ResultDisplay
  content={result}
  type="text"
  allowDownload={true}
  downloadFileName="result.txt"
  downloadMimeType="text/plain"
/>
```

### Q: 如何优化性能？

A: 对于计算密集型工具，考虑以下优化：

1. 使用 `React.memo` 避免不必要的重新渲染
2. 使用 `useMemo` 和 `useCallback` 优化计算和回调函数
3. 考虑使用 Web Workers 进行耗时计算
4. 对大型数据集使用分页或虚拟滚动

## 模板系统组件参考

参见 `app/lib/core/tool-templates/` 目录下的组件和 `types.ts` 文件了解完整的组件属性和类型定义。 
