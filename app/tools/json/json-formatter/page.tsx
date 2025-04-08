/**
 * JSON格式化工具 - 使用工具模板系统实现
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
import { TextArea } from '@/app/components/design-system';
import { formatJSON } from './utils';
import { 
  jsonFormatterTool,
  formatOptions,
  examples,
  helpTips
} from './config';

export default function JSONFormatterPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ToolRunStatus>(ToolRunStatus.IDLE);
  const [options, setOptions] = useState({
    indentSize: '2',
    sortKeys: false,
    minify: false
  });

  // 处理表单提交
  const handleSubmit = (formData: Record<string, any>) => {
    const jsonInput = formData.jsonInput as string;
    setInput(jsonInput);
    setStatus(ToolRunStatus.PROCESSING);
    
    const { result: formattedJson, error: formatError } = formatJSON(
      jsonInput,
      options.indentSize,
      options.sortKeys,
      options.minify
    );
    
    setResult(formattedJson);
    setError(formatError);
    setStatus(formatError ? ToolRunStatus.ERROR : ToolRunStatus.SUCCESS);
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
      tool={jsonFormatterTool}
      status={status}
      formContent={
        <ToolForm onSubmit={handleSubmit}>
          <TextArea
            name="jsonInput"
            label="JSON数据"
            placeholder="请输入要格式化的JSON数据..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={10}
            className="font-mono text-sm"
          />
        </ToolForm>
      }
      resultContent={
        <ResultDisplay
          content={result}
          error={error}
          type="json"
          allowCopy={true}
          allowDownload={true}
          downloadFileName="formatted.json"
        />
      }
      optionsContent={
        <ToolOptions
          options={formatOptions}
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
