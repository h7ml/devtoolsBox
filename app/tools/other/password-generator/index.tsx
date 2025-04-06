'use client';

import { useState, useEffect } from 'react';
import { FiRefreshCw, FiCopy, FiTrash2, FiSliders, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { Tool } from '../../../lib/tools-registry/types';

interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  special: boolean;
  similar: boolean;
  ambiguous: boolean;
}

const PasswordGenerator = () => {
  const [password, setPassword] = useState<string>('');
  const [passwordHistory, setPasswordHistory] = useState<string[]>([]);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    special: true,
    similar: false,
    ambiguous: false
  });

  // 定义字符集
  const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    special: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
    similar: 'iIlL1oO0',
    ambiguous: '{}[]()/\\\'"`~,;:.<>'
  };

  // 过滤掉相似和模糊字符
  const filterChars = (chars: string): string => {
    let result = chars;
    if (options.similar) {
      for (const char of charSets.similar) {
        result = result.replace(new RegExp(char, 'g'), '');
      }
    }
    if (options.ambiguous) {
      for (const char of charSets.ambiguous) {
        result = result.replace(new RegExp('\\' + char, 'g'), '');
      }
    }
    return result;
  };

  // 生成密码
  const generatePassword = () => {
    try {
      // 构建字符集
      let availableChars = '';
      if (options.uppercase) availableChars += charSets.uppercase;
      if (options.lowercase) availableChars += charSets.lowercase;
      if (options.numbers) availableChars += charSets.numbers;
      if (options.special) availableChars += charSets.special;

      // 过滤字符
      availableChars = filterChars(availableChars);

      if (availableChars.length === 0) {
        throw new Error('未选择任何字符集或过滤后无可用字符');
      }

      // 生成密码
      let newPassword = '';
      const { length } = options;

      // 确保每种所选字符集至少出现一次
      const requiredSets = [];
      if (options.uppercase && charSets.uppercase.split('').some(char => availableChars.includes(char))) {
        requiredSets.push('uppercase');
      }
      if (options.lowercase && charSets.lowercase.split('').some(char => availableChars.includes(char))) {
        requiredSets.push('lowercase');
      }
      if (options.numbers && charSets.numbers.split('').some(char => availableChars.includes(char))) {
        requiredSets.push('numbers');
      }
      if (options.special && charSets.special.split('').some(char => availableChars.includes(char))) {
        requiredSets.push('special');
      }

      // 先添加每种字符集的一个字符
      for (const setName of requiredSets) {
        const set = charSets[setName as keyof typeof charSets];
        const filteredSet = set.split('').filter(char => availableChars.includes(char)).join('');
        if (filteredSet.length > 0) {
          const randomChar = filteredSet.charAt(Math.floor(Math.random() * filteredSet.length));
          newPassword += randomChar;
        }
      }

      // 随机填充剩余的字符
      for (let i = newPassword.length; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * availableChars.length);
        newPassword += availableChars.charAt(randomIndex);
      }

      // 打乱密码字符顺序
      newPassword = newPassword.split('').sort(() => 0.5 - Math.random()).join('');

      setPassword(newPassword);
      calculatePasswordStrength(newPassword);

      // 添加到历史记录
      if (newPassword && !passwordHistory.includes(newPassword)) {
        setPasswordHistory(prev => [newPassword, ...prev].slice(0, 10));
      }
    } catch (error) {
      console.error('密码生成错误:', error);
      setPassword('错误: ' + (error as Error).message);
    }
  };

  // 计算密码强度
  const calculatePasswordStrength = (pwd: string): void => {
    let score = 0;

    // 长度评分
    score += pwd.length * 4;

    // 字符多样性评分
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasLowercase = /[a-z]/.test(pwd);
    const hasNumbers = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);

    const varietyCount =
      (hasUppercase ? 1 : 0) +
      (hasLowercase ? 1 : 0) +
      (hasNumbers ? 1 : 0) +
      (hasSpecial ? 1 : 0);

    score += varietyCount * 10;

    // 重复字符减分
    const duplicateRegex = /(.)\1+/g;
    const duplicates = pwd.match(duplicateRegex);
    if (duplicates) {
      score -= duplicates.join('').length * 2;
    }

    // 连续字符减分
    let sequentialCount = 0;
    for (let i = 0; i < pwd.length - 1; i++) {
      if (pwd.charCodeAt(i + 1) - pwd.charCodeAt(i) === 1) {
        sequentialCount++;
      }
    }
    score -= sequentialCount * 2;

    // 归一化分数 (0-100)
    const maxScore = pwd.length * 4 + 4 * 10;
    const normalizedScore = Math.min(100, Math.max(0, (score / maxScore) * 100));

    setPasswordStrength(Math.round(normalizedScore));
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

  // 处理选项变更
  const handleOptionChange = (option: keyof PasswordOptions, value: number | boolean) => {
    setOptions(prev => ({ ...prev, [option]: value }));
  };

  // 清空历史记录
  const clearHistory = () => {
    setPasswordHistory([]);
  };

  // 初始化生成密码
  useEffect(() => {
    generatePassword();
  }, [options]);

  // 获取密码强度颜色和描述
  const getStrengthColor = () => {
    if (passwordStrength >= 80) return 'bg-green-500';
    if (passwordStrength >= 60) return 'bg-blue-500';
    if (passwordStrength >= 40) return 'bg-yellow-500';
    if (passwordStrength >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStrengthDescription = () => {
    if (passwordStrength >= 80) return '非常强';
    if (passwordStrength >= 60) return '强';
    if (passwordStrength >= 40) return '中等';
    if (passwordStrength >= 20) return '弱';
    return '非常弱';
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">密码生成器</h1>
        <p className="text-gray-600 dark:text-gray-300">
          生成强大且安全的随机密码
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* 密码结果区域 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                生成的密码
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  readOnly
                  className="w-full p-4 pr-24 text-lg font-mono border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                />
                <div className="absolute inset-y-0 right-0 flex space-x-1 items-center pr-3">
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    title={showPassword ? '隐藏密码' : '显示密码'}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => copyToClipboard(password)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    title="复制到剪贴板"
                  >
                    <FiCopy className="h-5 w-5" />
                  </button>
                  <button
                    onClick={generatePassword}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    title="重新生成"
                  >
                    <FiRefreshCw className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 密码强度指示器 */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  密码强度
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {getStrengthDescription()} ({passwordStrength}%)
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getStrengthColor()}`}
                  style={{ width: `${passwordStrength}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* 密码选项控制区域 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <FiSliders className="mr-2" />
              密码选项
            </h3>

            {/* 密码长度 */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  密码长度: {options.length}
                </label>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  建议长度: 16-32
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="64"
                value={options.length}
                onChange={(e) => handleOptionChange('length', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>4</span>
                <span>64</span>
              </div>
            </div>

            {/* 字符集选择 */}
            <div className="mb-6 space-y-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                包含字符
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="uppercase"
                    checked={options.uppercase}
                    onChange={(e) => handleOptionChange('uppercase', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
                  />
                  <label htmlFor="uppercase" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    大写字母 (A-Z)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="lowercase"
                    checked={options.lowercase}
                    onChange={(e) => handleOptionChange('lowercase', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
                  />
                  <label htmlFor="lowercase" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    小写字母 (a-z)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="numbers"
                    checked={options.numbers}
                    onChange={(e) => handleOptionChange('numbers', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
                  />
                  <label htmlFor="numbers" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    数字 (0-9)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="special"
                    checked={options.special}
                    onChange={(e) => handleOptionChange('special', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
                  />
                  <label htmlFor="special" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    特殊字符 (!@#$%^&*)
                  </label>
                </div>
              </div>
            </div>

            {/* 高级选项 */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                高级选项
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="similar"
                    checked={options.similar}
                    onChange={(e) => handleOptionChange('similar', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
                  />
                  <label htmlFor="similar" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    排除相似字符 (i, l, 1, L, o, 0, O)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="ambiguous"
                    checked={options.ambiguous}
                    onChange={(e) => handleOptionChange('ambiguous', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
                  />
                  <label htmlFor="ambiguous" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    排除模糊字符 ({ }, [ ], ( ), / \, etc.)
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 密码历史记录 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">最近生成的密码</h3>
              <button
                onClick={clearHistory}
                className="flex items-center px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                disabled={passwordHistory.length === 0}
              >
                <FiTrash2 className="h-4 w-4 mr-1" />
                清除历史
              </button>
            </div>

            <div className="mt-2">
              {passwordHistory.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">历史记录为空</p>
              ) : (
                <ul className="space-y-2">
                  {passwordHistory.map((pwd, index) => (
                    <li key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <span className="font-mono text-sm text-gray-800 dark:text-gray-200">
                        {showPassword ? pwd : '••••••••••••••••'}
                      </span>
                      <button
                        onClick={() => copyToClipboard(pwd)}
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

        {/* 密码安全提示 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">密码安全提示</h3>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ul className="space-y-2">
                <li>密码长度越长，安全性越高。推荐至少使用16个字符的密码。</li>
                <li>使用大小写字母、数字和特殊字符的组合来增强密码强度。</li>
                <li>避免使用个人信息，如生日、姓名或常用词汇。</li>
                <li>为不同的网站和服务使用不同的密码。</li>
                <li>定期更换密码，特别是重要账户的密码。</li>
                <li>考虑使用密码管理器来存储和管理您的密码。</li>
                <li>启用双因素身份验证（2FA）以增加额外的安全层。</li>
                <li>永远不要通过不安全的通道（如电子邮件或即时消息）共享密码。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const tool: Tool = {
  id: 'password-generator',
  name: '密码生成器',
  description: '生成安全、强大的随机密码',
  category: 'misc',
  icon: FiLock,
  component: PasswordGenerator,
  meta: {
    keywords: ['密码', '生成器', '随机', '安全', 'password'],
    examples: [
      '长度16的随机密码',
      '仅含字母数字的密码'
    ]
  }
};

export default tool; 
