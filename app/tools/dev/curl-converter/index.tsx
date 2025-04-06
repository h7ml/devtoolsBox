'use client';

import { useState, useEffect } from 'react';
import { FiCopy, FiTrash2, FiCode, FiCheck, FiAlertTriangle, FiPlay, FiTerminal, FiSend, FiDownload, FiClipboard } from 'react-icons/fi';
import { Tool } from '../../../lib/tools-registry/types';

// 支持的编程语言
type Language = 'javascript' | 'python' | 'go' | 'php' | 'java' | 'rust' | 'csharp' | 'ruby' | 'powershell' | 'nodejs';

// 语言选项定义
interface LanguageOption {
  id: Language;
  name: string;
  mode: string; // 代码编辑器的模式
  icon?: string; // 语言图标
}

// 定义支持的语言列表
const languages: LanguageOption[] = [
  { id: 'javascript', name: 'JavaScript (Fetch)', mode: 'javascript', icon: 'logos:javascript' },
  { id: 'nodejs', name: 'Node.js (Axios)', mode: 'javascript', icon: 'logos:nodejs-icon' },
  { id: 'python', name: 'Python (Requests)', mode: 'python', icon: 'logos:python' },
  { id: 'php', name: 'PHP (cURL)', mode: 'php', icon: 'logos:php' },
  { id: 'go', name: 'Go', mode: 'go', icon: 'logos:go' },
  { id: 'java', name: 'Java', mode: 'java', icon: 'logos:java' },
  { id: 'rust', name: 'Rust', mode: 'rust', icon: 'logos:rust' },
  { id: 'csharp', name: 'C# (RestSharp)', mode: 'csharp', icon: 'logos:c-sharp' },
  { id: 'ruby', name: 'Ruby', mode: 'ruby', icon: 'logos:ruby' },
  { id: 'powershell', name: 'PowerShell', mode: 'powershell', icon: 'logos:powershell' }
];

interface CurlConverterState {
  curlCommand: string;
  selectedLanguage: Language;
  convertedCode: string;
  error: string | null;
  copySuccess: boolean;
}

const CurlConverter = () => {
  const [state, setState] = useState<CurlConverterState>({
    curlCommand: '',
    selectedLanguage: 'javascript',
    convertedCode: '',
    error: null,
    copySuccess: false
  });
  const [executeResult, setExecuteResult] = useState<{
    loading: boolean;
    response: string | null;
    error: string | null;
  }>({
    loading: false,
    response: null,
    error: null
  });

  // 处理curl命令输入变化
  const handleCurlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState({
      ...state,
      curlCommand: e.target.value,
      error: null
    });
  };

  // 处理语言选择变化
  const handleLanguageChange = (language: Language) => {
    setState({
      ...state,
      selectedLanguage: language
    });
  };

  // 清除所有内容
  const clearAll = () => {
    setState({
      curlCommand: '',
      selectedLanguage: 'javascript',
      convertedCode: '',
      error: null,
      copySuccess: false
    });
  };

  // 复制转换后的代码到剪贴板
  const copyToClipboard = async () => {
    if (state.convertedCode) {
      try {
        await navigator.clipboard.writeText(state.convertedCode);
        setState({ ...state, copySuccess: true });

        // 2秒后重置复制成功状态
        setTimeout(() => {
          setState(prevState => ({ ...prevState, copySuccess: false }));
        }, 2000);
      } catch (err) {
        console.error('复制失败:', err);
        alert('复制失败');
      }
    }
  };

  // 解析curl命令
  const parseCurlCommand = (curlCommand: string) => {
    // 基本验证
    if (!curlCommand.trim().toLowerCase().startsWith('curl ')) {
      throw new Error('命令必须以 "curl" 开头');
    }

    // 初始化结果对象
    const result = {
      method: 'GET', // 默认方法
      url: '',
      headers: {} as Record<string, string>,
      data: null as string | null,
      isJson: false,
      isForm: false,
      isMultipart: false
    };

    // 将命令按空格分割，但保留引号内的内容
    const regex = /("[^"]*")|('[^']*')|(\S+)/g;
    const tokens: string[] = [];
    let match;

    while ((match = regex.exec(curlCommand)) !== null) {
      tokens.push(match[0].replace(/^['"]|['"]$/g, ''));
    }

    // 移除第一个token (curl)
    tokens.shift();

    // 解析选项
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (token === '-X' || token === '--request') {
        result.method = tokens[++i];
      }
      else if (token === '-H' || token === '--header') {
        const header = tokens[++i];
        const separatorIndex = header.indexOf(':');

        if (separatorIndex !== -1) {
          const key = header.substring(0, separatorIndex).trim();
          const value = header.substring(separatorIndex + 1).trim();
          result.headers[key] = value;

          // 检查内容类型
          if (key.toLowerCase() === 'content-type') {
            result.isJson = value.includes('application/json');
            result.isForm = value.includes('application/x-www-form-urlencoded');
            result.isMultipart = value.includes('multipart/form-data');
          }
        }
      }
      else if (token === '-d' || token === '--data' || token === '--data-binary') {
        result.data = tokens[++i];
        // 如果没有指定方法，默认为POST
        if (result.method === 'GET') {
          result.method = 'POST';
        }
      }
      else if (token === '--data-raw') {
        result.data = tokens[++i];
        if (result.method === 'GET') {
          result.method = 'POST';
        }
      }
      else if (token === '--url') {
        result.url = tokens[++i];
      }
      // 如果没有特定选项，则假定为URL
      else if (!token.startsWith('-') && !result.url) {
        result.url = token;
      }
    }

    // 如果没有找到URL，抛出错误
    if (!result.url) {
      throw new Error('未找到URL');
    }

    return result;
  };

  // 将解析结果转换为对应语言的代码
  const convertToLanguage = (parsed: ReturnType<typeof parseCurlCommand>, language: Language): string => {
    switch (language) {
      case 'javascript':
        return convertToJavaScript(parsed);
      case 'nodejs':
        return convertToNodeJS(parsed);
      case 'python':
        return convertToPython(parsed);
      case 'php':
        return convertToPhp(parsed);
      case 'go':
        return convertToGo(parsed);
      case 'java':
        return convertToJava(parsed);
      case 'rust':
        return convertToRust(parsed);
      case 'csharp':
        return convertToCSharp(parsed);
      case 'ruby':
        return convertToRuby(parsed);
      case 'powershell':
        return convertToPowerShell(parsed);
      default:
        return '// 不支持的语言';
    }
  };

  // JavaScript (Fetch) 转换器
  const convertToJavaScript = (parsed: ReturnType<typeof parseCurlCommand>): string => {
    const { method, url, headers, data, isJson } = parsed;

    let code = `// 使用 JavaScript Fetch API 发送请求\n`;
    code += `const options = {\n`;
    code += `  method: '${method}',\n`;

    // 添加请求头
    if (Object.keys(headers).length > 0) {
      code += `  headers: {\n`;
      Object.entries(headers).forEach(([key, value]) => {
        code += `    '${key}': '${value.replace(/'/g, "\\'")}',\n`;
      });
      code += `  },\n`;
    }

    // 添加请求体
    if (data) {
      if (isJson) {
        try {
          // 尝试格式化 JSON
          const jsonData = JSON.parse(data);
          code += `  body: JSON.stringify(${JSON.stringify(jsonData, null, 4).replace(/^/gm, '  ').trim()}),\n`;
        } catch {
          code += `  body: '${data.replace(/'/g, "\\'")}',\n`;
        }
      } else {
        code += `  body: '${data.replace(/'/g, "\\'")}',\n`;
      }
    }

    code += `};\n\n`;
    code += `fetch('${url}', options)\n`;
    code += `  .then(response => response.json())\n`;
    code += `  .then(data => console.log(data))\n`;
    code += `  .catch(error => console.error('请求错误:', error));\n`;

    return code;
  };

  // Node.js (Axios) 转换器
  const convertToNodeJS = (parsed: ReturnType<typeof parseCurlCommand>): string => {
    const { method, url, headers, data, isJson, isForm } = parsed;

    let code = `// 使用 Node.js Axios 发送请求\n`;
    code += `const axios = require('axios');\n\n`;

    code += `const options = {\n`;
    code += `  method: '${method.toLowerCase()}',\n`;
    code += `  url: '${url}',\n`;

    // 添加请求头
    if (Object.keys(headers).length > 0) {
      code += `  headers: {\n`;
      Object.entries(headers).forEach(([key, value]) => {
        code += `    '${key}': '${value.replace(/'/g, "\\'")}',\n`;
      });
      code += `  },\n`;
    }

    // 添加请求体
    if (data) {
      if (isJson) {
        try {
          // 尝试格式化 JSON
          const jsonData = JSON.parse(data);
          code += `  data: ${JSON.stringify(jsonData, null, 4).replace(/^/gm, '  ').trim()},\n`;
        } catch {
          code += `  data: '${data.replace(/'/g, "\\'")}',\n`;
        }
      } else if (isForm) {
        code += `  data: new URLSearchParams('${data}').toString(),\n`;
      } else {
        code += `  data: '${data.replace(/'/g, "\\'")}',\n`;
      }
    }

    code += `};\n\n`;
    code += `axios(options)\n`;
    code += `  .then(response => console.log(response.data))\n`;
    code += `  .catch(error => console.error('请求错误:', error));\n`;

    return code;
  };

  // Python 转换器
  const convertToPython = (parsed: ReturnType<typeof parseCurlCommand>): string => {
    const { method, url, headers, data, isJson, isForm } = parsed;

    let code = `# 使用 Python Requests 库发送请求\n`;
    code += `import requests\n\n`;

    // 添加请求头
    if (Object.keys(headers).length > 0) {
      code += `headers = {\n`;
      Object.entries(headers).forEach(([key, value]) => {
        code += `    '${key}': '${value.replace(/'/g, "\\'")}',\n`;
      });
      code += `}\n\n`;
    } else {
      code += `headers = {}\n\n`;
    }

    // 添加请求体
    if (data) {
      if (isJson) {
        try {
          // 尝试格式化 JSON
          const jsonData = JSON.parse(data);
          code += `data = ${JSON.stringify(jsonData, null, 4)}\n\n`;
          code += `response = requests.${method.toLowerCase()}('${url}', headers=headers, json=data)\n`;
        } catch {
          code += `data = '${data.replace(/'/g, "\\'")}'  # 原始数据\n\n`;
          code += `response = requests.${method.toLowerCase()}('${url}', headers=headers, data=data)\n`;
        }
      } else if (isForm) {
        code += `data = '${data.replace(/'/g, "\\'")}'  # 表单数据\n\n`;
        code += `response = requests.${method.toLowerCase()}('${url}', headers=headers, data=data)\n`;
      } else {
        code += `data = '${data.replace(/'/g, "\\'")}'  # 原始数据\n\n`;
        code += `response = requests.${method.toLowerCase()}('${url}', headers=headers, data=data)\n`;
      }
    } else {
      code += `response = requests.${method.toLowerCase()}('${url}', headers=headers)\n`;
    }

    code += `\n# 打印响应\n`;
    code += `print(response.status_code)\n`;
    code += `print(response.text)\n`;

    return code;
  };

  // PHP 转换器
  const convertToPhp = (parsed: ReturnType<typeof parseCurlCommand>): string => {
    const { method, url, headers, data } = parsed;

    let code = `<?php\n// 使用 PHP cURL 发送请求\n`;
    code += `$curl = curl_init();\n\n`;

    code += `$options = [\n`;
    code += `    CURLOPT_URL => '${url}',\n`;
    code += `    CURLOPT_RETURNTRANSFER => true,\n`;
    code += `    CURLOPT_ENCODING => '',\n`;
    code += `    CURLOPT_MAXREDIRS => 10,\n`;
    code += `    CURLOPT_TIMEOUT => 30,\n`;
    code += `    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,\n`;
    code += `    CURLOPT_CUSTOMREQUEST => '${method}',\n`;

    // 添加请求体
    if (data) {
      code += `    CURLOPT_POSTFIELDS => '${data.replace(/'/g, "\\'")}',\n`;
    }

    // 添加请求头
    if (Object.keys(headers).length > 0) {
      code += `    CURLOPT_HTTPHEADER => [\n`;
      Object.entries(headers).forEach(([key, value]) => {
        code += `        '${key}: ${value.replace(/'/g, "\\'")}',\n`;
      });
      code += `    ],\n`;
    }

    code += `];\n\n`;
    code += `curl_setopt_array($curl, $options);\n\n`;
    code += `$response = curl_exec($curl);\n`;
    code += `$err = curl_error($curl);\n\n`;
    code += `curl_close($curl);\n\n`;
    code += `if ($err) {\n`;
    code += `    echo "cURL Error #:" . $err;\n`;
    code += `} else {\n`;
    code += `    echo $response;\n`;
    code += `}\n`;

    return code;
  };

  // Go 转换器
  const convertToGo = (parsed: ReturnType<typeof parseCurlCommand>): string => {
    const { method, url, headers, data, isJson } = parsed;

    let code = `// 使用 Go 发送请求\n`;
    code += `package main\n\n`;
    code += `import (\n`;
    code += `    "fmt"\n`;
    code += `    "io/ioutil"\n`;
    code += `    "net/http"\n`;
    code += `    "strings"\n`;
    code += `)\n\n`;
    code += `func main() {\n`;

    // 请求体
    if (data) {
      code += `    payload := strings.NewReader(\`${data}\`)\n\n`;
    } else {
      code += `    payload := strings.NewReader(\"\")\n\n`;
    }

    code += `    req, _ := http.NewRequest("${method}", "${url}", payload)\n\n`;

    // 添加请求头
    if (Object.keys(headers).length > 0) {
      Object.entries(headers).forEach(([key, value]) => {
        code += `    req.Header.Add("${key}", "${value.replace(/"/g, '\\"')}")\n`;
      });
      code += `\n`;
    }

    code += `    res, _ := http.DefaultClient.Do(req)\n\n`;
    code += `    defer res.Body.Close()\n`;
    code += `    body, _ := ioutil.ReadAll(res.Body)\n\n`;
    code += `    fmt.Println(res.Status)\n`;
    code += `    fmt.Println(string(body))\n`;
    code += `}\n`;

    return code;
  };

  // Java 转换器
  const convertToJava = (parsed: ReturnType<typeof parseCurlCommand>): string => {
    const { method, url, headers, data } = parsed;

    let code = `// 使用 Java HttpClient 发送请求 (Java 11+)\n`;
    code += `import java.io.IOException;\n`;
    code += `import java.net.URI;\n`;
    code += `import java.net.http.HttpClient;\n`;
    code += `import java.net.http.HttpRequest;\n`;
    code += `import java.net.http.HttpResponse;\n`;
    code += `import java.time.Duration;\n\n`;

    code += `public class HttpRequestExample {\n`;
    code += `    public static void main(String[] args) throws IOException, InterruptedException {\n`;
    code += `        HttpClient client = HttpClient.newBuilder()\n`;
    code += `                .version(HttpClient.Version.HTTP_2)\n`;
    code += `                .connectTimeout(Duration.ofSeconds(30))\n`;
    code += `                .build();\n\n`;

    code += `        HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()\n`;
    code += `                .uri(URI.create("${url}"))\n`;

    // 添加请求头
    if (Object.keys(headers).length > 0) {
      Object.entries(headers).forEach(([key, value]) => {
        code += `                .header("${key}", "${value.replace(/"/g, '\\"')}")\n`;
      });
    }

    // 添加请求体和方法
    if (data) {
      code += `                .method("${method}", HttpRequest.BodyPublishers.ofString("${data.replace(/"/g, '\\"')}"))\n`;
    } else {
      code += `                .method("${method}", HttpRequest.BodyPublishers.noBody())\n`;
    }

    code += `                .timeout(Duration.ofSeconds(30));\n\n`;
    code += `        HttpRequest request = requestBuilder.build();\n\n`;

    code += `        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());\n\n`;
    code += `        System.out.println(response.statusCode());\n`;
    code += `        System.out.println(response.body());\n`;
    code += `    }\n`;
    code += `}\n`;

    return code;
  };

  // Rust 转换器
  const convertToRust = (parsed: ReturnType<typeof parseCurlCommand>): string => {
    const { method, url, headers, data } = parsed;

    let code = `// 使用 Rust reqwest 发送请求\n`;
    code += `use reqwest::Client;\n`;
    code += `use std::collections::HashMap;\n\n`;

    code += `#[tokio::main]\n`;
    code += `async fn main() -> Result<(), Box<dyn std::error::Error>> {\n`;
    code += `    let client = Client::new();\n\n`;

    code += `    let mut request_builder = client.${method.toLowerCase()}("${url}");\n\n`;

    // 添加请求头
    if (Object.keys(headers).length > 0) {
      Object.entries(headers).forEach(([key, value]) => {
        code += `    request_builder = request_builder.header("${key}", "${value.replace(/"/g, '\\"')}");\n`;
      });
      code += `\n`;
    }

    // 添加请求体
    if (data) {
      code += `    let response = request_builder\n`;
      code += `        .body("${data.replace(/"/g, '\\"')}")\n`;
      code += `        .send()\n`;
      code += `        .await?;\n\n`;
    } else {
      code += `    let response = request_builder\n`;
      code += `        .send()\n`;
      code += `        .await?;\n\n`;
    }

    code += `    println!("Status: {}", response.status());\n`;
    code += `    println!("Body: {}", response.text().await?);\n\n`;
    code += `    Ok(())\n`;
    code += `}\n`;

    return code;
  };

  // C# 转换器
  const convertToCSharp = (parsed: ReturnType<typeof parseCurlCommand>): string => {
    const { method, url, headers, data } = parsed;

    let code = `// 使用 C# RestSharp 发送请求\n`;
    code += `using System;\n`;
    code += `using RestSharp;\n\n`;

    code += `namespace HttpRequestExample\n`;
    code += `{\n`;
    code += `    class Program\n`;
    code += `    {\n`;
    code += `        static void Main(string[] args)\n`;
    code += `        {\n`;
    code += `            var client = new RestClient("${url}");\n`;
    code += `            var request = new RestRequest(Method.${method.toUpperCase()});\n\n`;

    // 添加请求头
    if (Object.keys(headers).length > 0) {
      Object.entries(headers).forEach(([key, value]) => {
        code += `            request.AddHeader("${key}", "${value.replace(/"/g, '\\"')}");\n`;
      });
      code += `\n`;
    }

    // 添加请求体
    if (data) {
      code += `            request.AddParameter("application/json", @"${data.replace(/"/g, '\\"')}", ParameterType.RequestBody);\n\n`;
    }

    code += `            IRestResponse response = client.Execute(request);\n\n`;
    code += `            Console.WriteLine(response.StatusCode);\n`;
    code += `            Console.WriteLine(response.Content);\n`;
    code += `        }\n`;
    code += `    }\n`;
    code += `}\n`;

    return code;
  };

  // Ruby 转换器
  const convertToRuby = (parsed: ReturnType<typeof parseCurlCommand>): string => {
    const { method, url, headers, data } = parsed;

    let code = `# 使用 Ruby 发送请求\n`;
    code += `require 'net/http'\n`;
    code += `require 'uri'\n`;
    code += `require 'json'\n\n`;

    code += `uri = URI.parse('${url}')\n`;
    code += `http = Net::HTTP.new(uri.host, uri.port)\n`;

    if (url.startsWith('https')) {
      code += `http.use_ssl = true\n`;
    }

    code += `\n`;
    code += `request = Net::HTTP::${method.charAt(0).toUpperCase() + method.slice(1).toLowerCase()}.new(uri.request_uri)\n\n`;

    // 添加请求头
    if (Object.keys(headers).length > 0) {
      Object.entries(headers).forEach(([key, value]) => {
        code += `request['${key}'] = '${value.replace(/'/g, "\\'")}'\n`;
      });
      code += `\n`;
    }

    // 添加请求体
    if (data) {
      code += `request.body = '${data.replace(/'/g, "\\'")}'\n\n`;
    }

    code += `response = http.request(request)\n\n`;
    code += `puts response.code\n`;
    code += `puts response.body\n`;

    return code;
  };

  // PowerShell 转换器
  const convertToPowerShell = (parsed: ReturnType<typeof parseCurlCommand>): string => {
    const { method, url, headers, data } = parsed;

    let code = `# 使用 PowerShell 发送请求\n`;

    // 添加请求头
    if (Object.keys(headers).length > 0) {
      code += `$headers = @{\n`;
      Object.entries(headers).forEach(([key, value]) => {
        code += `    "${key}" = "${value.replace(/"/g, '`"')}"\n`;
      });
      code += `}\n\n`;
    } else {
      code += `$headers = @{}\n\n`;
    }

    // 添加请求参数
    code += `$params = @{\n`;
    code += `    Uri = "${url}"\n`;
    code += `    Method = "${method}"\n`;
    code += `    Headers = $headers\n`;

    // 添加请求体
    if (data) {
      code += `    Body = '${data.replace(/'/g, "''")}'\n`;
    }

    code += `    ContentType = "application/json"\n`;
    code += `}\n\n`;

    code += `$response = Invoke-RestMethod @params\n\n`;
    code += `$response | ConvertTo-Json -Depth 5\n`;

    return code;
  };

  // 执行转换
  const convertCurl = () => {
    try {
      const parsed = parseCurlCommand(state.curlCommand);
      const code = convertToLanguage(parsed, state.selectedLanguage);

      setState({
        ...state,
        convertedCode: code,
        error: null
      });
    } catch (err) {
      setState({
        ...state,
        error: (err as Error).message,
        convertedCode: ''
      });
    }
  };

  // 执行curl命令（模拟执行，实际通过HTTP请求实现）
  const executeCurl = async () => {
    if (!state.curlCommand.trim()) {
      setExecuteResult({
        loading: false,
        response: null,
        error: '请输入curl命令'
      });
      return;
    }

    try {
      setExecuteResult({
        loading: true,
        response: null,
        error: null
      });

      // 解析curl命令
      const parsed = parseCurlCommand(state.curlCommand);

      // 通过前端发送实际的HTTP请求
      const headers: Record<string, string> = {};
      Object.entries(parsed.headers).forEach(([key, value]) => {
        headers[key] = value;
      });

      const options: RequestInit = {
        method: parsed.method,
        headers,
        mode: 'cors', // 尝试跨域请求
        credentials: 'omit',
      };

      // 如果有请求体数据，添加到请求中
      if (parsed.data) {
        options.body = parsed.data;
      }

      // 执行请求
      const response = await fetch(parsed.url, options);
      const contentType = response.headers.get('content-type') || '';

      let responseBody: string;
      if (contentType.includes('application/json')) {
        const jsonData = await response.json();
        responseBody = JSON.stringify(jsonData, null, 2);
      } else {
        responseBody = await response.text();
      }

      // 构建完整响应
      const fullResponse = `状态码: ${response.status} ${response.statusText}\n\n` +
        `Headers:\n${Array.from(response.headers.entries())
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n')}\n\n` +
        `响应体:\n${responseBody}`;

      setExecuteResult({
        loading: false,
        response: fullResponse,
        error: null
      });
    } catch (err) {
      setExecuteResult({
        loading: false,
        response: null,
        error: `执行失败: ${(err as Error).message}`
      });
      console.error('执行curl失败:', err);
    }
  };

  // 当curl命令或语言选择变化时执行转换
  useEffect(() => {
    if (state.curlCommand) {
      convertCurl();
    }
  }, [state.curlCommand, state.selectedLanguage]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* 主内容区 */}
      <div className="flex flex-col gap-8">
        {/* 指令区 */}
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-500 hover:shadow-2xl">
          <div className="backdrop-blur-sm backdrop-filter bg-white/70 dark:bg-gray-800/70 p-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl text-white shadow-md">
                <FiTerminal className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">cURL 命令</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">粘贴您的 cURL 命令，转换为多种语言的代码</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 opacity-20 rounded-xl pointer-events-none"></div>
              <textarea
                value={state.curlCommand}
                onChange={handleCurlChange}
                className="w-full h-36 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-inner focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white resize-none font-mono text-sm transition-all duration-300"
                placeholder="curl -X GET https://api.example.com/endpoint"
                spellCheck="false"
              />

              <div className="absolute top-3 right-3 flex space-x-2">
                <button
                  onClick={executeCurl}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all duration-200 hover:shadow flex items-center gap-1.5 text-sm"
                  title="执行"
                >
                  <FiPlay className="h-4 w-4" />
                  <span>执行</span>
                </button>
                <button
                  onClick={clearAll}
                  className="p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm transition-all duration-200"
                  title="清除"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {state.error && (
              <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-start">
                <FiAlertTriangle className="inline-block mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>{state.error}</span>
              </div>
            )}
          </div>
        </div>

        {/* 执行结果区 */}
        {(executeResult.response || executeResult.error || executeResult.loading) && (
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-500">
            <div className="backdrop-blur-sm backdrop-filter bg-white/70 dark:bg-gray-800/70 p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl text-white shadow-md">
                    <FiSend className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">执行结果</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">HTTP 请求的完整响应</p>
                  </div>
                </div>

                {executeResult.response && (
                  <button
                    onClick={() => navigator.clipboard.writeText(executeResult.response || '')}
                    className="p-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm transition-all duration-200 hover:shadow flex items-center gap-1.5 text-sm"
                    title="复制结果"
                  >
                    <FiClipboard className="h-4 w-4" />
                    <span>复制</span>
                  </button>
                )}
              </div>

              {executeResult.loading && (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="w-14 h-14 rounded-full border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 animate-spin mb-3"></div>
                  <p className="text-gray-600 dark:text-gray-400">请求执行中...</p>
                </div>
              )}

              {executeResult.error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
                  <div className="flex items-start">
                    <FiAlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{executeResult.error}</span>
                  </div>
                </div>
              )}

              {executeResult.response && (
                <div className="relative overflow-hidden rounded-xl">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/10 dark:to-teal-900/10 opacity-20 pointer-events-none"></div>
                  <pre className="p-4 bg-white dark:bg-gray-900 rounded-xl overflow-x-auto text-sm border border-gray-200 dark:border-gray-700 shadow-inner max-h-96 overflow-y-auto">
                    <code className="font-mono">{executeResult.response}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 输出区 */}
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-500">
          <div className="backdrop-blur-sm backdrop-filter bg-white/70 dark:bg-gray-800/70 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-white shadow-md">
                  <FiCode className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">代码转换</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">选择目标编程语言，生成对应代码</p>
                </div>
              </div>
            </div>

            {/* 语言选择器 - 更现代化的Pills设计 */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                选择语言
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {languages.map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => handleLanguageChange(lang.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 flex items-center gap-1.5 ${state.selectedLanguage === lang.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                      }`}
                  >
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 转换后的代码 */}
            {state.convertedCode && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    转换结果
                  </label>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full transition-all duration-200"
                    title="复制代码"
                  >
                    {state.copySuccess ? (
                      <>
                        <FiCheck className="h-4 w-4" />
                        <span>已复制</span>
                      </>
                    ) : (
                      <>
                        <FiCopy className="h-4 w-4" />
                        <span>复制代码</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative overflow-hidden rounded-xl">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 opacity-20 pointer-events-none"></div>
                  <pre className="p-4 bg-white dark:bg-gray-900 rounded-xl overflow-x-auto text-sm border border-gray-200 dark:border-gray-700 shadow-inner">
                    <code className="font-mono">{state.convertedCode}</code>
                  </pre>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      const blob = new Blob([state.convertedCode], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `curl-${state.selectedLanguage}-code.${state.selectedLanguage === 'javascript' || state.selectedLanguage === 'nodejs'
                        ? 'js'
                        : state.selectedLanguage
                        }`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full transition-all duration-200"
                  >
                    <FiDownload className="h-4 w-4" />
                    <span>下载代码</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const tool: Tool = {
  id: 'curl-converter',
  name: 'cURL 命令转换器',
  description: '将 cURL 命令转换为各种编程语言的 HTTP 请求代码，也可直接执行查看结果',
  category: 'dev',
  icon: FiCode,
  component: CurlConverter,
  meta: {
    keywords: ['curl', 'convert', 'http', 'request', 'api', 'client', 'code', 'generator', 'execute'],
    examples: [
      'curl -X GET https://api.example.com/endpoint',
      'curl -H "Content-Type: application/json" -d \'{"key":"value"}\' https://api.example.com/post'
    ],
    version: '1.0.0'
  }
};

export default tool; 
