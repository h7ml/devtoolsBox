'use client';

import React, { useState } from 'react';
import { FiCode, FiCopy, FiCheck, FiRefreshCw } from 'react-icons/fi';
import { Card, CardHeader, CardContent } from '../../../components/design-system/Card';
import Button from '../../../components/design-system/Button';
import { toast } from 'sonner';

// 示例cURL命令
const EXAMPLE_CURL = `curl 'https://api.example.com/data' \\
  -H 'Accept: application/json' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer token123' \\
  -X POST \\
  -d '{"name":"test","age":25}'`;

// 格式化选项
type FormatOption = 'requests' | 'requests_session' | 'requests_with_comments';

const FORMAT_OPTIONS: { id: FormatOption; name: string; description: string }[] = [
  { id: 'requests', name: '基本请求', description: '基础的requests代码' },
  { id: 'requests_session', name: '会话请求', description: '使用Session的请求代码' },
  { id: 'requests_with_comments', name: '带注释', description: '包含详细注释的请求代码' },
];

const CurlToRequestsComponent: React.FC = () => {
  const [input, setInput] = useState<string>(EXAMPLE_CURL);
  const [output, setOutput] = useState<string>('');
  const [formatOption, setFormatOption] = useState<FormatOption>('requests');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // 解析cURL命令
  const parseCurl = (curlCommand: string) => {
    // 初始化参数
    const result = {
      url: '',
      method: 'GET',
      headers: {} as Record<string, string>,
      data: '',
      params: {} as Record<string, string>,
      cookies: {} as Record<string, string>,
      auth: null as { username: string; password: string } | null,
      hasJson: false,
      hasMultipart: false,
      hasUrlencoded: false,
    };

    // 预处理: 删除续行符 \，合并多行
    let processedCommand = curlCommand.replace(/\\\n\s*/g, ' ').trim();

    // 如果命令不以curl开头，检查并添加
    if (!processedCommand.toLowerCase().startsWith('curl')) {
      processedCommand = `curl ${processedCommand}`;
    }

    // 提取URL (简单处理，复杂情况可能需要更强大的解析)
    const urlMatch = processedCommand.match(/'([^']+)'|"([^"]+)"|(\S+)/);
    if (urlMatch && urlMatch.index !== undefined && urlMatch.index > processedCommand.toLowerCase().indexOf('curl')) {
      result.url = urlMatch[1] || urlMatch[2] || urlMatch[3];
    }

    // 检查请求方法
    if (processedCommand.includes(' -X ') || processedCommand.includes(' --request ')) {
      const methodMatch = processedCommand.match(/-X\s+(\w+)|--request\s+(\w+)/);
      if (methodMatch) {
        result.method = (methodMatch[1] || methodMatch[2]).toUpperCase();
      }
    } else if (processedCommand.includes(' -d ') ||
      processedCommand.includes(' --data ') ||
      processedCommand.includes(' --data-binary ')) {
      // 如果没有指定方法但有数据，默认为POST
      result.method = 'POST';
    }

    // 提取headers
    const headerRegex = /-H\s+['"]([^'"]+)['"]|--header\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = headerRegex.exec(processedCommand)) !== null) {
      const headerStr = match[1] || match[2];
      const separatorIndex = headerStr.indexOf(':');
      if (separatorIndex > 0) {
        const key = headerStr.substring(0, separatorIndex).trim();
        const value = headerStr.substring(separatorIndex + 1).trim();
        result.headers[key] = value;

        // 检查内容类型
        if (key.toLowerCase() === 'content-type') {
          if (value.includes('application/json')) {
            result.hasJson = true;
          } else if (value.includes('multipart/form-data')) {
            result.hasMultipart = true;
          } else if (value.includes('application/x-www-form-urlencoded')) {
            result.hasUrlencoded = true;
          }
        }
      }
    }

    // 提取数据
    const dataMatch = processedCommand.match(/-d\s+['"]([^'"]+)['"]|--data\s+['"]([^'"]+)['"]|--data-binary\s+['"]([^'"]+)['"]/);
    if (dataMatch) {
      result.data = dataMatch[1] || dataMatch[2] || dataMatch[3];

      // 如果没有明确的Content-Type但数据看起来像JSON
      if (!result.hasJson && !result.hasMultipart && !result.hasUrlencoded) {
        if (result.data.trim().startsWith('{') && result.data.trim().endsWith('}')) {
          result.hasJson = true;
        }
      }
    }

    // 提取URL参数
    try {
      const urlObj = new URL(result.url);
      urlObj.searchParams.forEach((value, key) => {
        result.params[key] = value;
      });
      // 更新URL，移除参数
      result.url = `${urlObj.origin}${urlObj.pathname}`;
    } catch (e) {
      // URL解析失败，使用原始URL
    }

    // 检查basic auth
    const userPassMatch = processedCommand.match(/-u\s+['"]([^'"]+)['"]|--user\s+['"]([^'"]+)['"]/);
    if (userPassMatch) {
      const userPass = userPassMatch[1] || userPassMatch[2];
      const [username, password] = userPass.split(':');
      if (username) {
        result.auth = { username, password: password || '' };
      }
    }

    return result;
  };

  // 生成requests代码
  const generateRequestsCode = (parsedCurl: ReturnType<typeof parseCurl>): string => {
    let code = '';
    const isSimple = formatOption === 'requests';
    const isSession = formatOption === 'requests_session';
    const hasComments = formatOption === 'requests_with_comments';

    // 导入语句
    if (hasComments) {
      code += '# -*- coding: utf-8 -*-\n';
      code += '"""由cURL命令自动生成的Python requests代码。\n\n原始cURL命令:\n';
      code += input.split('\n').map(line => '# ' + line).join('\n');
      code += '\n"""\n\n';
    }

    code += 'import requests\n';
    if (parsedCurl.hasJson) {
      code += 'import json\n';
    }
    code += '\n';

    // URL
    if (hasComments) {
      code += '# 请求URL\n';
    }
    code += `url = "${parsedCurl.url}"\n\n`;

    // 请求头
    if (Object.keys(parsedCurl.headers).length > 0) {
      if (hasComments) {
        code += '# 请求头\n';
      }
      code += 'headers = {\n';
      for (const [key, value] of Object.entries(parsedCurl.headers)) {
        code += `    "${key}": "${value.replace(/"/g, '\\"')}",\n`;
      }
      code += '}\n\n';
    }

    // URL参数
    if (Object.keys(parsedCurl.params).length > 0) {
      if (hasComments) {
        code += '# URL参数\n';
      }
      code += 'params = {\n';
      for (const [key, value] of Object.entries(parsedCurl.params)) {
        code += `    "${key}": "${value.replace(/"/g, '\\"')}",\n`;
      }
      code += '}\n\n';
    }

    // 请求数据
    if (parsedCurl.data) {
      if (hasComments) {
        code += '# 请求数据\n';
      }

      if (parsedCurl.hasJson) {
        try {
          // 尝试格式化JSON
          const jsonData = JSON.parse(parsedCurl.data);
          code += 'data = {\n';
          for (const [key, value] of Object.entries(jsonData)) {
            if (typeof value === 'string') {
              code += `    "${key}": "${value.toString().replace(/"/g, '\\"')}",\n`;
            } else {
              code += `    "${key}": ${JSON.stringify(value)},\n`;
            }
          }
          code += '}\n\n';
        } catch (e) {
          // JSON解析失败，使用原始字符串
          code += `data = '${parsedCurl.data}'\n\n`;
        }
      } else {
        code += `data = '${parsedCurl.data}'\n\n`;
      }
    }

    // Session或直接请求
    if (isSession) {
      if (hasComments) {
        code += '# 创建会话对象\n';
      }
      code += 'session = requests.Session()\n';

      // 设置基本认证
      if (parsedCurl.auth) {
        if (hasComments) {
          code += '# 设置基本认证\n';
        }
        code += `session.auth = ("${parsedCurl.auth.username}", "${parsedCurl.auth.password}")\n`;
      }

      // 发送请求
      if (hasComments) {
        code += '\n# 发送请求\n';
      }

      code += 'response = session.';
    } else {
      if (hasComments) {
        code += '# 发送请求\n';
      }
      code += 'response = requests.';
    }

    // 请求方法和参数
    code += parsedCurl.method.toLowerCase() + '(\n';
    code += `    url,\n`;

    if (Object.keys(parsedCurl.headers).length > 0) {
      code += '    headers=headers,\n';
    }

    if (Object.keys(parsedCurl.params).length > 0) {
      code += '    params=params,\n';
    }

    if (parsedCurl.data) {
      if (parsedCurl.hasJson) {
        code += '    json=data,\n';
      } else {
        code += '    data=data,\n';
      }
    }

    if (parsedCurl.auth && isSimple) {
      code += `    auth=("${parsedCurl.auth.username}", "${parsedCurl.auth.password}"),\n`;
    }

    code += ')\n\n';

    // 响应处理
    if (hasComments) {
      code += '# 处理响应\n';
    }
    code += 'print(f"Status code: {response.status_code}")\n';

    if (parsedCurl.hasJson || parsedCurl.headers['Accept']?.includes('application/json')) {
      if (hasComments) {
        code += '# 尝试解析JSON响应\n';
        code += 'try:\n';
        code += '    response_data = response.json()\n';
        code += '    print(json.dumps(response_data, indent=4, ensure_ascii=False))\n';
        code += 'except ValueError:\n';
        code += '    print(response.text)\n';
      } else {
        code += 'response_data = response.json()\n';
        code += 'print(json.dumps(response_data, indent=4, ensure_ascii=False))\n';
      }
    } else {
      code += 'print(response.text)\n';
    }

    return code;
  };

  // 转换cURL命令
  const convertCurl = () => {
    setError(null);

    try {
      const parsedCurl = parseCurl(input);

      if (!parsedCurl.url) {
        throw new Error('无法解析URL，请检查cURL命令格式');
      }

      const requestsCode = generateRequestsCode(parsedCurl);
      setOutput(requestsCode);
    } catch (e) {
      setError(`转换错误: ${e.message}`);
    }
  };

  // 复制结果
  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('已复制到剪贴板');
  };

  // 格式化cURL命令
  const formatCurl = () => {
    try {
      // 简单格式化: 删除多余空格，整理续行符
      const lines = input.split('\n').map(line => line.trim());
      let formatted = '';

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // 如果不是最后一行，并且没有续行符，添加续行符
        if (i < lines.length - 1 && !line.endsWith('\\')) {
          line += ' \\';
        }

        // 如果是最后一行，并且有续行符，移除续行符
        if (i === lines.length - 1 && line.endsWith('\\')) {
          line = line.slice(0, -1).trim();
        }

        formatted += line + '\n';
      }

      setInput(formatted.trim());
    } catch (e) {
      setError(`格式化错误: ${e.message}`);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader
        icon={<FiCode className="h-6 w-6" />}
        title="cURL 转 Python requests"
        description="将cURL命令转换为Python requests代码"
        gradientColors="from-blue-500 to-indigo-600"
      />
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
          <div className="lg:col-span-3 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  cURL 命令
                </label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<FiRefreshCw className="h-4 w-4" />}
                    onClick={formatCurl}
                  >
                    格式化
                  </Button>
                </div>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="输入cURL命令..."
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Python requests 代码
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={copied ? <FiCheck className="h-4 w-4" /> : <FiCopy className="h-4 w-4" />}
                  onClick={handleCopy}
                  disabled={!output}
                >
                  {copied ? '已复制' : '复制'}
                </Button>
              </div>
              <textarea
                value={output}
                readOnly
                className="w-full h-52 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100
                         font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="转换后的Python requests代码将显示在这里..."
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">转换选项</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                  输出格式
                </label>
                <div className="space-y-3">
                  {FORMAT_OPTIONS.map((option) => (
                    <label
                      key={option.id}
                      className={`
                        flex items-center p-2 rounded-md cursor-pointer
                        ${formatOption === option.id
                          ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'
                          : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'}
                        border
                      `}
                    >
                      <input
                        type="radio"
                        name="formatOption"
                        className="sr-only"
                        checked={formatOption === option.id}
                        onChange={() => setFormatOption(option.id)}
                      />
                      <div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">{option.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full"
                onClick={convertCurl}
              >
                转换
              </Button>
            </div>

            <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
              <h4 className="font-medium mb-1">提示：</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>工具支持带引号和不带引号的cURL命令</li>
                <li>复杂的cURL参数可能需要手动调整生成的代码</li>
                <li>添加详细注释可以增强代码可读性</li>
              </ul>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// 工具元数据
const curlToRequests = {
  id: 'curl-to-requests',
  name: 'cURL 转 Python requests',
  description: '将cURL命令转换为Python requests代码',
  category: 'web',
  icon: FiCode,
  component: CurlToRequestsComponent,
  meta: {
    keywords: ['curl', 'python', 'requests', '转换', 'api', 'http'],
    author: 'DevTools Box',
    version: '1.0.0'
  }
};

export default curlToRequests;
