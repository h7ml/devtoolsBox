'use client';

import { useState } from 'react';
import { v4 as uuidv4, v1 as uuidv1, v3 as uuidv3, v5 as uuidv5, NIL as NIL_UUID, parse, stringify, validate } from 'uuid';
import { FiRefreshCw, FiCopy, FiTrash2, FiPlus, FiKey, FiArchive } from 'react-icons/fi';
import { Tool } from '../../../lib/tools-registry/types';

type UUIDVersion = 'v1' | 'v4' | 'v3' | 'v5' | 'nil';
type UUIDFormat = 'standard' | 'braces' | 'no-hyphens' | 'base64';

const UUIDGenerator = () => {
  const [currentUUID, setCurrentUUID] = useState<string>(uuidv4());
  const [selectedVersion, setSelectedVersion] = useState<UUIDVersion>('v4');
  const [selectedFormat, setSelectedFormat] = useState<UUIDFormat>('standard');
  const [namespace, setNamespace] = useState<string>('6ba7b810-9dad-11d1-80b4-00c04fd430c8'); // DNS namespace
  const [name, setName] = useState<string>('example.com');
  const [generatedUUIDs, setGeneratedUUIDs] = useState<string[]>([]);
  const [isValid, setIsValid] = useState<boolean>(true);

  // 生成UUID
  const generateUUID = () => {
    let newUUID = '';

    try {
      switch (selectedVersion) {
        case 'v1':
          newUUID = uuidv1();
          break;
        case 'v4':
          newUUID = uuidv4();
          break;
        case 'v3':
          newUUID = uuidv3(name, namespace);
          break;
        case 'v5':
          newUUID = uuidv5(name, namespace);
          break;
        case 'nil':
          newUUID = NIL_UUID;
          break;
        default:
          newUUID = uuidv4();
      }

      setCurrentUUID(newUUID);
      setIsValid(true);
    } catch (error) {
      console.error('UUID生成错误:', error);
      setIsValid(false);
    }
  };

  // 格式化UUID
  const formatUUID = (uuid: string): string => {
    try {
      if (!validate(uuid)) {
        return uuid;
      }

      switch (selectedFormat) {
        case 'standard':
          return uuid;
        case 'braces':
          return `{${uuid}}`;
        case 'no-hyphens':
          return uuid.replace(/-/g, '');
        case 'base64':
          // 将UUID转换为Buffer并以base64编码
          const parsed = parse(uuid);
          return Buffer.from(parsed).toString('base64');
        default:
          return uuid;
      }
    } catch (error) {
      console.error('UUID格式化错误:', error);
      return uuid;
    }
  };

  // 保存UUID到列表
  const saveUUID = () => {
    if (currentUUID && !generatedUUIDs.includes(currentUUID)) {
      setGeneratedUUIDs([currentUUID, ...generatedUUIDs]);
    }
  };

  // 复制到剪贴板
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('已复制到剪贴板');
    } catch (error) {
      console.error('复制失败:', error);
      alert('复制失败');
    }
  };

  // 复制当前UUID
  const copyCurrentUUID = () => {
    copyToClipboard(formatUUID(currentUUID));
  };

  // 复制所有生成的UUID
  const copyAllUUIDs = () => {
    const formatted = generatedUUIDs.map(formatUUID).join('\n');
    copyToClipboard(formatted);
  };

  // 清除历史记录
  const clearHistory = () => {
    setGeneratedUUIDs([]);
  };

  // 验证输入的UUID
  const validateInput = (value: string) => {
    setCurrentUUID(value);
    setIsValid(validate(value));
  };

  // 处理版本变化
  const handleVersionChange = (version: UUIDVersion) => {
    setSelectedVersion(version);
    generateUUID();
  };

  // 不同版本的描述
  const versionDescriptions = {
    v1: '基于时间戳，包含MAC地址，可能暴露网络信息',
    v3: '基于名称和命名空间的MD5哈希值，结果相同的输入总是产生相同的UUID',
    v4: '完全随机生成，最常用的UUID版本',
    v5: '基于名称和命名空间的SHA-1哈希值，比v3安全性更高',
    nil: 'Nil UUID，全部为零的特殊UUID (00000000-0000-0000-0000-000000000000)'
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">UUID 生成器</h1>
        <p className="text-gray-600 dark:text-gray-300">
          生成多种版本的通用唯一标识符 (UUID)
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* UUID生成和格式化控制 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            {/* 版本选择 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">UUID 版本</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <button
                  onClick={() => handleVersionChange('v4')}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${selectedVersion === 'v4'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  Version 4
                </button>
                <button
                  onClick={() => handleVersionChange('v1')}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${selectedVersion === 'v1'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  Version 1
                </button>
                <button
                  onClick={() => handleVersionChange('v3')}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${selectedVersion === 'v3'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  Version 3
                </button>
                <button
                  onClick={() => handleVersionChange('v5')}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${selectedVersion === 'v5'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  Version 5
                </button>
                <button
                  onClick={() => handleVersionChange('nil')}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${selectedVersion === 'nil'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  Nil UUID
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {versionDescriptions[selectedVersion]}
              </p>
            </div>

            {/* 基于名称的UUID选项 (v3和v5) */}
            {(selectedVersion === 'v3' || selectedVersion === 'v5') && (
              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    命名空间 UUID
                  </label>
                  <input
                    type="text"
                    value={namespace}
                    onChange={(e) => setNamespace(e.target.value)}
                    className={`w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white ${!validate(namespace) ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                  />
                  {!validate(namespace) && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      请输入有效的UUID作为命名空间
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    名称
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <button
                  onClick={generateUUID}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  生成 UUID
                </button>
              </div>
            )}

            {/* 当前UUID */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                当前UUID
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={currentUUID}
                  onChange={(e) => validateInput(e.target.value)}
                  className={`flex-grow p-2 border rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white ${isValid ? 'border-gray-300 dark:border-gray-600' : 'border-red-500'
                    }`}
                />
                <button
                  onClick={generateUUID}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:border-gray-600"
                  title="重新生成"
                >
                  <FiRefreshCw className="h-5 w-5" />
                </button>
                <button
                  onClick={copyCurrentUUID}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 border-t border-b border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:border-gray-600"
                  title="复制到剪贴板"
                >
                  <FiCopy className="h-5 w-5" />
                </button>
                <button
                  onClick={saveUUID}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-r-md dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:border-gray-600"
                  title="保存到历史记录"
                >
                  <FiArchive className="h-5 w-5" />
                </button>
              </div>
              {!isValid && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  无效的UUID格式
                </p>
              )}
            </div>

            {/* 格式选择 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">输出格式</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button
                  onClick={() => setSelectedFormat('standard')}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${selectedFormat === 'standard'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  标准格式
                </button>
                <button
                  onClick={() => setSelectedFormat('braces')}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${selectedFormat === 'braces'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  带括号
                </button>
                <button
                  onClick={() => setSelectedFormat('no-hyphens')}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${selectedFormat === 'no-hyphens'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  无连字符
                </button>
                <button
                  onClick={() => setSelectedFormat('base64')}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${selectedFormat === 'base64'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  Base64
                </button>
              </div>
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <span className="text-sm text-gray-800 dark:text-gray-200 font-mono">
                  {formatUUID(currentUUID)}
                </span>
              </div>
            </div>

            {/* 批量生成按钮 */}
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  generateUUID();
                  saveUUID();
                }}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                <FiPlus className="h-4 w-4 mr-2" />
                生成并保存
              </button>
              <button
                onClick={() => {
                  for (let i = 0; i < 5; i++) {
                    generateUUID();
                    saveUUID();
                  }
                }}
                className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                批量生成5个
              </button>
            </div>
          </div>
        </div>

        {/* 历史记录 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">历史记录</h3>
              <div className="flex space-x-2">
                <button
                  onClick={copyAllUUIDs}
                  className="flex items-center px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  disabled={generatedUUIDs.length === 0}
                >
                  <FiCopy className="h-4 w-4 mr-1" />
                  复制全部
                </button>
                <button
                  onClick={clearHistory}
                  className="flex items-center px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  disabled={generatedUUIDs.length === 0}
                >
                  <FiTrash2 className="h-4 w-4 mr-1" />
                  清除历史
                </button>
              </div>
            </div>

            <div className="mt-2 max-h-64 overflow-y-auto">
              {generatedUUIDs.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">历史记录为空</p>
              ) : (
                <ul className="space-y-2">
                  {generatedUUIDs.map((uuid, index) => (
                    <li key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <span className="font-mono text-sm text-gray-800 dark:text-gray-200">
                        {formatUUID(uuid)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(formatUUID(uuid))}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        <FiCopy className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* UUID信息 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">关于UUID</h3>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p>
                UUID（通用唯一标识符）是一种标识符标准，用于在分布式系统中唯一标识信息，而不需要中央协调机构。
              </p>
              <h4>UUID的主要版本：</h4>
              <ul>
                <li><strong>版本1</strong>：基于时间和MAC地址生成。</li>
                <li><strong>版本3</strong>：基于名称和命名空间，使用MD5哈希算法。</li>
                <li><strong>版本4</strong>：基于随机数生成，最常用的版本。</li>
                <li><strong>版本5</strong>：基于名称和命名空间，使用SHA-1哈希算法。</li>
              </ul>
              <h4>常见用途：</h4>
              <ul>
                <li>数据库主键</li>
                <li>分布式系统中的唯一标识符</li>
                <li>会话ID或事务ID</li>
                <li>安全令牌或文件名</li>
              </ul>
              <h4>标准格式：</h4>
              <p>标准的UUID格式为32个十六进制字符，通常以连字符分为5组：8-4-4-4-12，例如：</p>
              <p className="font-mono">550e8400-e29b-41d4-a716-446655440000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const tool: Tool = {
  id: 'uuid',
  name: 'UUID生成器',
  description: '生成多种版本的通用唯一标识符 (UUID)',
  category: 'dev',
  icon: FiKey,
  component: UUIDGenerator,
  meta: {
    keywords: ['uuid', '唯一标识符', '随机', 'GUID'],
    examples: [
      '550e8400-e29b-41d4-a716-446655440000',
      '{123e4567-e89b-12d3-a456-426655440000}'
    ]
  }
};

export default tool; 
