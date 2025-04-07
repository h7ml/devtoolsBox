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
type FormatOption = 'basic' | 'with_comments' | 'with_parser';

const FORMAT_OPTIONS: { id: FormatOption; name: string; description: string }[] = [
  { id: 'basic', name: '基本代码', description: '生成基础的feapder请求代码' },
  { id: 'with_comments', name: '带注释', description: '包含详细注释的feapder代码' },
  { id: 'with_parser', name: '完整爬虫', description: '生成带解析器的完整爬虫代码' },
];

const CurlToFeapderComponent: React.FC = () => {
  const [input, setInput] = useState<string>(EXAMPLE_CURL);
  const [output, setOutput] = useState<string>('');
  const [formatOption, setFormatOption] = useState<FormatOption>('basic');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [spiderName, setSpiderName] = useState<string>('ExampleSpider');

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
    const headerMatches = [...processedCommand.matchAll(/-H\s+['"]([^'"]+)['"]|--header\s+['"]([^'"]+)['"]/g)];
    for (const match of headerMatches) {
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

        // 提取cookies
        if (key.toLowerCase() === 'cookie') {
          const cookiePairs = value.split(';');
          for (const pair of cookiePairs) {
            const [cookieKey, cookieValue] = pair.split('=').map(p => p.trim());
            if (cookieKey && cookieValue) {
              result.cookies[cookieKey] = cookieValue;
            }
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
      for (const [key, value] of urlObj.searchParams.entries()) {
        result.params[key] = value;
      }
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

  // 生成feapder代码
  const generateFeapderCode = (parsedCurl: ReturnType<typeof parseCurl>): string => {
    let code = '';
    const isBasic = formatOption === 'basic';
    const hasComments = formatOption === 'with_comments' || formatOption === 'with_parser';
    const isFullSpider = formatOption === 'with_parser';

    // 导入语句
    if (hasComments) {
      code += '# -*- coding: utf-8 -*-\n';
      code += '"""\n';
      code += '由cURL命令自动生成的feapder爬虫代码\n\n';
      code += '原始cURL命令:\n';
      code += input.split('\n').map(line => '# ' + line).join('\n');
      code += '\n"""\n\n';
    }

    // 导入feapder和其他必要库
    code += 'import feapder\n';
    if (parsedCurl.hasJson) {
      code += 'import json\n';
    }

    if (isFullSpider) {
      code += 'from feapder.utils.tools import log\n';
      code += 'from feapder.utils.webdriver import WebDriver\n';
      code += 'from items import *\n';
    }

    code += '\n\n';

    if (isFullSpider) {
      // 生成完整爬虫类
      code += `class ${spiderName}(feapder.AirSpider):\n`;

      if (hasComments) {
        code += '    """根据cURL生成的feapder爬虫\n';
        code += '    \n';
        code += '    Attributes:\n';
        code += '        start_urls: 初始请求地址\n';
        code += '    """\n\n';
      }

      // 设置起始URL
      code += '    # 起始地址\n';
      code += `    start_urls = ["${parsedCurl.url}"]\n\n`;

      // 默认请求头
      if (Object.keys(parsedCurl.headers).length > 0) {
        code += '    # 请求头\n';
        code += '    headers = {\n';
        for (const [key, value] of Object.entries(parsedCurl.headers)) {
          code += `        "${key}": "${value.replace(/"/g, '\\"')}",\n`;
        }
        code += '    }\n\n';
      }

      // 初始化方法
      code += '    def __init__(self, *args, **kwargs):\n';
      code += '        super().__init__(*args, **kwargs)\n';

      // 爬虫入口方法
      code += '\n    def start_requests(self):\n';
      code += '        """\n';
      code += '        爬虫入口\n';
      code += '        """\n';
      code += '        for url in self.start_urls:\n';

      // 根据请求方法生成代码
      if (parsedCurl.method === 'GET') {
        if (Object.keys(parsedCurl.params).length > 0) {
          code += '            params = {\n';
          for (const [key, value] of Object.entries(parsedCurl.params)) {
            code += `                "${key}": "${value.replace(/"/g, '\\"')}",\n`;
          }
          code += '            }\n';
          code += '            yield feapder.Request(url, params=params, headers=self.headers, callback=self.parse)\n';
        } else {
          code += '            yield feapder.Request(url, headers=self.headers, callback=self.parse)\n';
        }
      } else {
        // POST或其他方法
        if (parsedCurl.hasJson) {
          try {
            // 尝试格式化JSON
            const jsonData = JSON.parse(parsedCurl.data);
            code += '            data = {\n';
            for (const [key, value] of Object.entries(jsonData)) {
              if (typeof value === 'string') {
                code += `                "${key}": "${value.toString().replace(/"/g, '\\"')}",\n`;
              } else {
                code += `                "${key}": ${JSON.stringify(value)},\n`;
              }
            }
            code += '            }\n';
            code += `            yield feapder.Request(url, method="${parsedCurl.method}", headers=self.headers, json=data, callback=self.parse)\n`;
          } catch (e) {
            // JSON解析失败，使用原始字符串
            code += `            data = '${parsedCurl.data}'\n`;
            code += `            yield feapder.Request(url, method="${parsedCurl.method}", headers=self.headers, data=data, callback=self.parse)\n`;
          }
        } else {
          code += `            data = '${parsedCurl.data}'\n`;
          code += `            yield feapder.Request(url, method="${parsedCurl.method}", headers=self.headers, data=data, callback=self.parse)\n`;
        }
      }

      // 解析方法
      code += '\n    def parse(self, request, response):\n';
      code += '        """\n';
      code += '        解析响应\n';
      code += '        """\n';
      code += '        try:\n';

      if (parsedCurl.hasJson) {
        code += '            # 解析json数据\n';
        code += '            data = response.json\n';
        code += '            log.info(f"Response data: {data}")\n';
        code += '            \n';
        code += '            # TODO: 解析逻辑，例如：\n';
        code += '            # for item in data.get("items", []):\n';
        code += '            #     yield ExampleItem(\n';
        code += '            #         id=item.get("id"),\n';
        code += '            #         name=item.get("name"),\n';
        code += '            #         description=item.get("description")\n';
        code += '            #     )\n';
      } else {
        code += '            # 解析html数据\n';
        code += '            # 使用response.xpath或response.css选择器提取数据\n';
        code += '            title = response.xpath("//title/text()").extract_first()  # 示例：提取标题\n';
        code += '            log.info(f"页面标题: {title}")\n';
        code += '            \n';
        code += '            # TODO: 解析逻辑，例如：\n';
        code += '            # items = response.xpath("//div[@class=\'item\']")\n';
        code += '            # for item in items:\n';
        code += '            #     yield ExampleItem(\n';
        code += '            #         name=item.xpath(".//h2/text()").extract_first(),\n';
        code += '            #         price=item.xpath(".//span[@class=\'price\']/text()").extract_first()\n';
        code += '            #     )\n';
      }

      code += '        except Exception as e:\n';
      code += '            log.error(f"解析出错: {e}")\n';

      // 主函数
      code += '\n\nif __name__ == "__main__":\n';
      code += `    ${spiderName}().start()\n`;

    } else {
      // 基本请求代码
      if (hasComments) {
        code += '# feapder请求示例\n';
      }

      // URL
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

      // 创建AirSpider实例
      if (hasComments) {
        code += '# 创建爬虫\n';
      }
      code += 'spider = feapder.AirSpider()\n';

      // 发送请求
      if (hasComments) {
        code += '\n# 发送请求\n';
      }

      let requestArgs = [];
      requestArgs.push(`url`);

      if (parsedCurl.method !== 'GET') {
        requestArgs.push(`method="${parsedCurl.method}"`);
      }

      if (Object.keys(parsedCurl.headers).length > 0) {
        requestArgs.push(`headers=headers`);
      }

      if (Object.keys(parsedCurl.params).length > 0) {
        requestArgs.push(`params=params`);
      }

      if (parsedCurl.data) {
        if (parsedCurl.hasJson) {
          requestArgs.push(`json=data`);
        } else {
          requestArgs.push(`data=data`);
        }
      }

      code += `response = spider.download(${requestArgs.join(', ')})\n\n`;

      // 处理响应
      if (hasComments) {
        code += '# 处理响应\n';
      }
      code += 'print(f"Status code: {response.status_code}")\n';

      if (parsedCurl.hasJson) {
        if (hasComments) {
          code += '# 解析JSON响应\n';
          code += 'try:\n';
          code += '    data = response.json\n';
          code += '    print(json.dumps(data, indent=4, ensure_ascii=False))\n';
          code += 'except Exception as e:\n';
          code += '    print(f"解析JSON出错: {e}")\n';
          code += '    print(response.text)\n';
        } else {
          code += 'data = response.json\n';
          code += 'print(json.dumps(data, indent=4, ensure_ascii=False))\n';
        }
      } else {
        code += 'print(response.text)\n';
      }
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

      const feapderCode = generateFeapderCode(parsedCurl);
      setOutput(feapderCode);
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
        title="cURL 转 feapder"
        description="将cURL命令转换为feapder爬虫代码"
        gradientColors="from-green-500 to-teal-600"
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
                         font-mono text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="输入cURL命令..."
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  feapder 爬虫代码
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
                         font-mono text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="转换后的feapder爬虫代码将显示在这里..."
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">转换选项</h3>

            <div className="space-y-4">
              {formatOption === 'with_parser' && (
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                    爬虫类名
                  </label>
                  <input
                    type="text"
                    value={spiderName}
                    onChange={(e) => setSpiderName(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                              text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="输入爬虫类名"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                  代码格式
                </label>
                <div className="space-y-3">
                  {FORMAT_OPTIONS.map((option) => (
                    <label
                      key={option.id}
                      className={`
                        flex items-center p-2 rounded-md cursor-pointer
                        ${formatOption === option.id
                          ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700'
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
                <li>feapder是一个Python爬虫框架，支持分布式爬虫和数据处理</li>
                <li>完整爬虫模式会生成可直接运行的爬虫类</li>
                <li>代码可能需要根据实际情况调整解析逻辑</li>
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
const curlToFeapder = {
  id: 'curl-to-feapder',
  name: 'cURL 转 feapder',
  description: '将cURL命令转换为feapder爬虫代码',
  category: 'web',
  icon: FiCode,
  component: CurlToFeapderComponent,
  meta: {
    keywords: ['curl', 'python', 'feapder', '爬虫', '转换', 'spider'],
    author: 'DevTools Box',
    version: '1.0.0'
  }
};

export default curlToFeapder;
