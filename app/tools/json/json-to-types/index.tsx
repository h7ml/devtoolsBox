'use client';

import React, { useState, useEffect } from 'react';
import { FiRefreshCw, FiCopy, FiCheck, FiCode } from 'react-icons/fi';
import { Card, CardHeader, CardContent } from '../../../components/design-system/Card';
import Button from '../../../components/design-system/Button';
import { AnimatePresence, motion } from 'framer-motion';

const JsonToTypesComponent = () => {
  const [json, setJson] = useState<string>('{\n  "name": "John Doe",\n  "age": 30,\n  "isActive": true,\n  "address": {\n    "street": "123 Main St",\n    "city": "New York"\n  },\n  "tags": ["developer", "designer"],\n  "experience": [\n    {\n      "company": "ABC Corp",\n      "years": 3\n    },\n    {\n      "company": "XYZ Inc",\n      "years": 2\n    }\n  ]\n}');
  const [interfaceName, setInterfaceName] = useState<string>('User');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [outputType, setOutputType] = useState<'interface' | 'type'>('interface');

  useEffect(() => {
    generateTypes();
  }, []);

  const formatJson = () => {
    try {
      const obj = JSON.parse(json);
      setJson(JSON.stringify(obj, null, 2));
      setError(null);
    } catch (e) {
      setError(`JSON格式化错误: ${e.message}`);
    }
  };

  const generateTypes = () => {
    try {
      setError(null);

      // 检查接口名是否有效
      if (!interfaceName.match(/^[A-Za-z_][A-Za-z0-9_]*$/)) {
        setError("无效的接口名称。名称必须以字母或下划线开头，只能包含字母、数字和下划线。");
        return;
      }

      // 解析JSON
      const obj = JSON.parse(json);

      // 生成类型定义
      const generatedInterfaces = new Map();
      let mainInterface = '';

      if (outputType === 'interface') {
        mainInterface = `interface ${interfaceName} ${processObject(obj, interfaceName, generatedInterfaces)}`;
      } else {
        mainInterface = `type ${interfaceName} = ${processObject(obj, interfaceName, generatedInterfaces).replace(/\{\s+/, '').replace(/\s+\}$/, '')};`;
      }

      // 组合所有生成的接口
      const interfaces = Array.from(generatedInterfaces.values());
      const result = [...interfaces, mainInterface].join('\n\n');

      setOutput(result);
    } catch (e) {
      setError(`类型生成错误: ${e.message}`);
    }
  };

  const processObject = (obj: any, parentName: string, generatedInterfaces: Map<string, string>): string => {
    let result = '{\n';

    for (const [key, value] of Object.entries(obj)) {
      // 生成属性名称，处理特殊字符
      const propName = isValidIdentifier(key) ? key : `"${key}"`;

      // 生成属性类型
      const propType = getPropertyType(value, `${parentName}${capitalizeFirstLetter(key)}`, generatedInterfaces);

      // 添加到结果
      result += `  ${propName}: ${propType};\n`;
    }

    result += '}';
    return result;
  };

  const isValidIdentifier = (name: string): boolean => {
    return /^[A-Za-z_][A-Za-z0-9_]*$/.test(name);
  };

  const getPropertyType = (value: any, typeName: string, generatedInterfaces: Map<string, string>): string => {
    if (value === null) return 'null';

    switch (typeof value) {
      case 'string':
        return 'string';
      case 'number':
        return Number.isInteger(value) ? 'number' : 'number';
      case 'boolean':
        return 'boolean';
      case 'undefined':
        return 'undefined';
      case 'object':
        if (Array.isArray(value)) {
          if (value.length === 0) return 'any[]';

          // 检查数组元素类型是否一致
          const firstType = typeof value[0];
          const isHomogeneous = value.every(item => typeof item === firstType);

          if (isHomogeneous) {
            if (firstType !== 'object') {
              return `${firstType}[]`;
            } else {
              if (Array.isArray(value[0])) {
                return 'any[][]'; // 处理嵌套数组，简化
              } else {
                const arrayTypeName = `${typeName}Item`;
                const objectType = processObject(value[0], arrayTypeName, generatedInterfaces);

                if (outputType === 'interface') {
                  generatedInterfaces.set(arrayTypeName, `interface ${arrayTypeName} ${objectType}`);
                  return `${arrayTypeName}[]`;
                } else {
                  generatedInterfaces.set(arrayTypeName, `type ${arrayTypeName} = ${objectType.replace(/\{\s+/, '').replace(/\s+\}$/, '')};`);
                  return `${arrayTypeName}[]`;
                }
              }
            }
          } else {
            // 异构数组，尝试生成联合类型
            const types = new Set(value.map(item => {
              if (item === null) return 'null';
              return typeof item;
            }));

            // 检查是否有对象类型
            const hasObjects = value.some(item => item !== null && typeof item === 'object' && !Array.isArray(item));

            if (hasObjects) {
              return 'any[]'; // 对象异构数组，简化为any[]
            } else {
              return `(${Array.from(types).join(' | ')})[]`;
            }
          }
        } else {
          // 处理普通对象
          const objectType = processObject(value, typeName, generatedInterfaces);

          if (outputType === 'interface') {
            generatedInterfaces.set(typeName, `interface ${typeName} ${objectType}`);
            return typeName;
          } else {
            // 如果是顶层类型，则直接返回内联类型
            if (typeName === interfaceName) {
              return objectType;
            } else {
              generatedInterfaces.set(typeName, `type ${typeName} = ${objectType.replace(/\{\s+/, '').replace(/\s+\}$/, '')};`);
              return typeName;
            }
          }
        }
      default:
        return 'any';
    }
  };

  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader
        icon={<FiCode className="h-6 w-6" />}
        title="JSON转TypeScript"
        description="将JSON转换为TypeScript接口或类型定义"
        gradientColors="from-green-500 to-green-600"
      />
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              JSON输入
            </label>
            <Button
              variant="ghost"
              size="sm"
              icon={<FiRefreshCw className="h-4 w-4" />}
              onClick={formatJson}
            >
              格式化
            </Button>
          </div>
          <textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                      font-mono text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="输入JSON..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              接口/类型名称
            </label>
            <input
              type="text"
              value={interfaceName}
              onChange={(e) => setInterfaceName(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                      font-mono text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="输入接口名称..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              输出类型
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-green-500 focus:ring-green-500"
                  checked={outputType === 'interface'}
                  onChange={() => setOutputType('interface')}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Interface</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-green-500 focus:ring-green-500"
                  checked={outputType === 'type'}
                  onChange={() => setOutputType('type')}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Type</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <Button
            onClick={generateTypes}
            icon={<FiRefreshCw className="h-4 w-4" />}
            className="w-full md:w-auto"
          >
            生成TypeScript定义
          </Button>

          <div className="hidden md:flex items-center space-x-2">
            <AnimatePresence>
              {output && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    icon={copied ? <FiCheck className="h-4 w-4" /> : <FiCopy className="h-4 w-4" />}
                    onClick={handleCopy}
                  >
                    {copied ? '已复制' : '复制代码'}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="mb-2 flex justify-between items-center">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            TypeScript定义
          </div>
          <div className="md:hidden">
            {output && (
              <Button
                variant="ghost"
                size="sm"
                icon={copied ? <FiCheck className="h-4 w-4" /> : <FiCopy className="h-4 w-4" />}
                onClick={handleCopy}
              >
                {copied ? '已复制' : '复制'}
              </Button>
            )}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 font-mono text-sm overflow-auto max-h-96">
          <pre>{output || '// 生成的TypeScript定义将显示在这里'}</pre>
        </div>
      </CardContent>
    </Card>
  );
};

// 工具元数据
const jsonToTypes = {
  id: 'json-to-types',
  name: 'JSON转TypeScript',
  description: '将JSON转换为TypeScript接口或类型定义',
  category: 'json',
  icon: FiCode,
  component: JsonToTypesComponent,
  meta: {
    keywords: ['json', 'typescript', '接口', 'interface', 'type', '类型', '转换', '生成'],
    author: 'DevTools Box',
    version: '1.0.0'
  }
};

export default jsonToTypes;
