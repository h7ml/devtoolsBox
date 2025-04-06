'use client';

import { useState, useEffect } from 'react';
import { FiDroplet, FiCopy, FiCheck, FiRefreshCw, FiEdit } from 'react-icons/fi';
import { Tool } from '../../../lib/tools-registry/types';
import { Card, CardHeader, Button, Input } from '../../../components/design-system';

// 颜色格式类型
type ColorFormat = 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla' | 'hwb' | 'cmyk';

// 颜色值接口
interface ColorValues {
  hex: string;
  rgb: string;
  rgba: string;
  hsl: string;
  hsla: string;
  hwb: string;
  cmyk: string;
}

// 样例颜色
const sampleColors = [
  '#1976D2', // 蓝色
  '#4CAF50', // 绿色
  '#F44336', // 红色
  '#9C27B0', // 紫色
  '#FF9800', // 橙色
  '#607D8B', // 蓝灰色
  '#E91E63', // 粉色
  '#00BCD4'  // 青色
];

const ColorConverter = () => {
  const [input, setInput] = useState<string>('#1976D2');
  const [inputFormat, setInputFormat] = useState<ColorFormat>('hex');
  const [colors, setColors] = useState<ColorValues>({
    hex: '',
    rgb: '',
    rgba: '',
    hsl: '',
    hsla: '',
    hwb: '',
    cmyk: ''
  });
  const [copied, setCopied] = useState<ColorFormat | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 解析输入的颜色并转换为各种格式
  useEffect(() => {
    if (!input.trim()) {
      return;
    }

    try {
      setError(null);
      const parsedColors = parseAndConvertColor(input, inputFormat);
      setColors(parsedColors);
    } catch (err: any) {
      setError(err.message || '颜色格式无效');
    }
  }, [input, inputFormat]);

  // 解析和转换颜色
  const parseAndConvertColor = (value: string, format: ColorFormat): ColorValues => {
    let r = 0, g = 0, b = 0, a = 1;
    let h = 0, s = 0, l = 0;

    // 解析输入值
    if (format === 'hex') {
      // 处理HEX格式
      const hexColor = value.trim().replace(/^#/, '');

      if (![3, 4, 6, 8].includes(hexColor.length)) {
        throw new Error('无效的Hex颜色格式');
      }

      // 转换3位或4位的短格式为6位或8位
      let fullHex: string;
      if (hexColor.length === 3 || hexColor.length === 4) {
        fullHex = hexColor.split('').map(c => c + c).join('');
      } else {
        fullHex = hexColor;
      }

      if (fullHex.length === 6) {
        r = parseInt(fullHex.substring(0, 2), 16);
        g = parseInt(fullHex.substring(2, 4), 16);
        b = parseInt(fullHex.substring(4, 6), 16);
        a = 1;
      } else if (fullHex.length === 8) {
        r = parseInt(fullHex.substring(0, 2), 16);
        g = parseInt(fullHex.substring(2, 4), 16);
        b = parseInt(fullHex.substring(4, 6), 16);
        a = parseInt(fullHex.substring(6, 8), 16) / 255;
      }
    } else if (format === 'rgb' || format === 'rgba') {
      // 处理RGB/RGBA格式
      const rgbMatch = value.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/i);
      if (!rgbMatch) {
        throw new Error('无效的RGB颜色格式');
      }

      r = parseInt(rgbMatch[1], 10);
      g = parseInt(rgbMatch[2], 10);
      b = parseInt(rgbMatch[3], 10);
      a = rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1;
    } else if (format === 'hsl' || format === 'hsla') {
      // 处理HSL/HSLA格式
      const hslMatch = value.match(/hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%(?:\s*,\s*([\d.]+))?\s*\)/i);
      if (!hslMatch) {
        throw new Error('无效的HSL颜色格式');
      }

      h = parseInt(hslMatch[1], 10);
      s = parseInt(hslMatch[2], 10) / 100;
      l = parseInt(hslMatch[3], 10) / 100;
      a = hslMatch[4] ? parseFloat(hslMatch[4]) : 1;

      // 将HSL转换为RGB
      const result = hslToRgb(h, s, l);
      r = result.r;
      g = result.g;
      b = result.b;
    } else if (format === 'hwb') {
      // 处理HWB格式
      const hwbMatch = value.match(/hwb\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%(?:\s*,\s*([\d.]+))?\s*\)/i);
      if (!hwbMatch) {
        throw new Error('无效的HWB颜色格式');
      }

      const hwbH = parseInt(hwbMatch[1], 10);
      const hwbW = parseInt(hwbMatch[2], 10) / 100;
      const hwbB = parseInt(hwbMatch[3], 10) / 100;
      a = hwbMatch[4] ? parseFloat(hwbMatch[4]) : 1;

      // 将HWB转换为RGB
      const result = hwbToRgb(hwbH, hwbW, hwbB);
      r = result.r;
      g = result.g;
      b = result.b;
    } else if (format === 'cmyk') {
      // 处理CMYK格式
      const cmykMatch = value.match(/cmyk\(\s*(\d+)%\s*,\s*(\d+)%\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/i);
      if (!cmykMatch) {
        throw new Error('无效的CMYK颜色格式');
      }

      const c = parseInt(cmykMatch[1], 10) / 100;
      const m = parseInt(cmykMatch[2], 10) / 100;
      const y = parseInt(cmykMatch[3], 10) / 100;
      const k = parseInt(cmykMatch[4], 10) / 100;

      // 将CMYK转换为RGB
      r = Math.round(255 * (1 - c) * (1 - k));
      g = Math.round(255 * (1 - m) * (1 - k));
      b = Math.round(255 * (1 - y) * (1 - k));
      a = 1;
    }

    // 验证RGB值是否有效
    if (isNaN(r) || isNaN(g) || isNaN(b) ||
      r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255 ||
      a < 0 || a > 1) {
      throw new Error('颜色值超出有效范围');
    }

    // 计算HSL值
    const hslResult = rgbToHsl(r, g, b);
    h = hslResult.h;
    s = hslResult.s;
    l = hslResult.l;

    // 生成各种格式的颜色字符串
    const formattedHex = rgbToHex(r, g, b);
    const formattedHexA = a < 1 ? `${formattedHex}${Math.round(a * 255).toString(16).padStart(2, '0')}` : formattedHex;

    return {
      hex: `#${formattedHex}`,
      rgb: `rgb(${r}, ${g}, ${b})`,
      rgba: `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`,
      hsl: `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
      hsla: `hsla(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%, ${a.toFixed(2)})`,
      hwb: `hwb(${Math.round(h)}, ${Math.round(rgbToHwb(r, g, b).w * 100)}%, ${Math.round(rgbToHwb(r, g, b).b * 100)}%)`,
      cmyk: `cmyk(${Math.round(rgbToCmyk(r, g, b).c * 100)}%, ${Math.round(rgbToCmyk(r, g, b).m * 100)}%, ${Math.round(rgbToCmyk(r, g, b).y * 100)}%, ${Math.round(rgbToCmyk(r, g, b).k * 100)}%)`
    };
  };

  // RGB转HEX
  const rgbToHex = (r: number, g: number, b: number): string => {
    return [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
  };

  // RGB转HSL
  const rgbToHsl = (r: number, g: number, b: number): { h: number, s: number, l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }

      h /= 6;
    }

    return { h: h * 360, s, l };
  };

  // HSL转RGB
  const hslToRgb = (h: number, s: number, l: number): { r: number, g: number, b: number } => {
    h /= 360;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  // RGB转HWB
  const rgbToHwb = (r: number, g: number, b: number): { h: number, w: number, b: number } => {
    const { h } = rgbToHsl(r, g, b);
    r /= 255;
    g /= 255;
    b /= 255;

    const w = Math.min(r, g, b);
    const v = Math.max(r, g, b);
    const black = 1 - v;

    return { h, w, b: black };
  };

  // HWB转RGB
  const hwbToRgb = (h: number, w: number, b: number): { r: number, g: number, b: number } => {
    if (w + b >= 1) {
      const gray = Math.round(w / (w + b) * 255);
      return { r: gray, g: gray, b: gray };
    }

    const rgb = hslToRgb(h, 1, 0.5);
    const white = w * 255;
    const black = b * 255;

    return {
      r: Math.round((rgb.r * (1 - w - b) + white) * (1 - b / (1 - w))),
      g: Math.round((rgb.g * (1 - w - b) + white) * (1 - b / (1 - w))),
      b: Math.round((rgb.b * (1 - w - b) + white) * (1 - b / (1 - w)))
    };
  };

  // RGB转CMYK
  const rgbToCmyk = (r: number, g: number, b: number): { c: number, m: number, y: number, k: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const k = 1 - Math.max(r, g, b);

    if (k === 1) {
      return { c: 0, m: 0, y: 0, k: 1 };
    }

    return {
      c: (1 - r - k) / (1 - k),
      m: (1 - g - k) / (1 - k),
      y: (1 - b - k) / (1 - k),
      k
    };
  };

  // 复制到剪贴板
  const copyToClipboard = (text: string, format: ColorFormat) => {
    navigator.clipboard.writeText(text);
    setCopied(format);
    setTimeout(() => setCopied(null), 2000);
  };

  // 清空输入
  const clearInput = () => {
    setInput('');
    setError(null);
  };

  // 选择示例颜色
  const selectSampleColor = (color: string) => {
    setInput(color);
    setInputFormat('hex');
  };

  // 尝试从颜色选择器获取颜色
  const pickColor = async () => {
    try {
      // 如果浏览器支持EyeDropper API
      if ('EyeDropper' in window) {
        // @ts-ignore - EyeDropper API可能还不在TypeScript定义中
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        setInput(result.sRGBHex);
        setInputFormat('hex');
      } else {
        setError('您的浏览器不支持颜色拾取功能');
      }
    } catch (err) {
      console.error('颜色拾取错误:', err);
      // 用户取消拾取时不显示错误
    }
  };

  // 渲染颜色格式输入选项
  const renderFormatOptions = () => {
    const formats: { value: ColorFormat; label: string }[] = [
      { value: 'hex', label: 'HEX' },
      { value: 'rgb', label: 'RGB' },
      { value: 'rgba', label: 'RGBA' },
      { value: 'hsl', label: 'HSL' },
      { value: 'hsla', label: 'HSLA' },
      { value: 'hwb', label: 'HWB' },
      { value: 'cmyk', label: 'CMYK' }
    ];

    return formats.map(format => (
      <Button
        key={format.value}
        size="sm"
        variant={inputFormat === format.value ? 'primary' : 'outline'}
        onClick={() => setInputFormat(format.value)}
      >
        {format.label}
      </Button>
    ));
  };

  // 获取输入格式的占位符示例
  const getInputPlaceholder = (): string => {
    switch (inputFormat) {
      case 'hex': return '#1976D2 或 #1976D2FF';
      case 'rgb': return 'rgb(25, 118, 210)';
      case 'rgba': return 'rgba(25, 118, 210, 1.0)';
      case 'hsl': return 'hsl(207, 79%, 46%)';
      case 'hsla': return 'hsla(207, 79%, 46%, 1.0)';
      case 'hwb': return 'hwb(207, 10%, 18%)';
      case 'cmyk': return 'cmyk(88%, 44%, 0%, 18%)';
      default: return '';
    }
  };

  // 获取颜色预览样式
  const getColorPreviewStyle = () => {
    if (error) {
      return { backgroundColor: '#eee' };
    }
    return { backgroundColor: colors.rgba || colors.rgb || colors.hex };
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader
            icon={<FiDroplet className="h-6 w-6" />}
            title="颜色格式转换"
            description="在HEX、RGB、HSL等不同颜色格式之间转换"
            gradientColors="from-rose-500 to-pink-600"
          />

          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">颜色输入格式</div>
            <Button
              size="sm"
              variant="ghost"
              onClick={pickColor}
              className="w-full justify-center"
              icon={<FiEdit className="h-3.5 w-3.5" />}
            >
              选取颜色
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {renderFormatOptions()}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左侧输入区域 */}
            <div>
              <div className="mb-4">
                <Input
                  label={`输入${inputFormat.toUpperCase()}格式的颜色`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={getInputPlaceholder()}
                  gradient
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm mb-4">
                  <p className="font-medium">错误:</p>
                  <p>{error}</p>
                </div>
              )}

              <div className="mt-4">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">示例颜色</div>
                <div className="flex flex-wrap gap-2">
                  {sampleColors.map((color, index) => (
                    <button
                      key={index}
                      className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 transition-transform hover:scale-110"
                      style={{ backgroundColor: color }}
                      onClick={() => selectSampleColor(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">颜色预览</div>
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 flex items-center">
                  <div
                    className="w-16 h-16 rounded-lg shadow-inner"
                    style={getColorPreviewStyle()}
                  />
                  <div className="flex-1 ml-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        <div><span className="font-medium">HEX:</span> {colors.hex || '—'}</div>
                        <div><span className="font-medium">RGB:</span> {colors.rgb || '—'}</div>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        <div><span className="font-medium">HSL:</span> {colors.hsl?.split(',')[0]?.replace('hsl(', '') || '—'}°</div>
                        <div><span className="font-medium">S/L:</span> {colors.hsl?.split(',').slice(1).join(',').replace(')', '') || '—'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧转换结果区域 */}
            <div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  转换结果
                </label>
              </div>

              <div className="space-y-3">
                {/* 渲染所有转换结果 */}
                {Object.entries(colors).map(([format, value]) => (
                  <div
                    key={format}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase mb-1">
                        {format}
                      </h3>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded px-3 py-1.5 text-sm font-mono">
                        {value || '—'}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={!value}
                      onClick={() => copyToClipboard(value, format as ColorFormat)}
                      icon={copied === format ? <FiCheck className="h-3.5 w-3.5" /> : <FiCopy className="h-3.5 w-3.5" />}
                    >
                      {copied === format ? '已复制' : '复制'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <h3 className="font-medium text-sm mb-1">格式说明:</h3>
            <p>• <strong>HEX</strong>: 十六进制表示，如 #1976D2</p>
            <p>• <strong>RGB/RGBA</strong>: 红绿蓝（和透明度）表示，如 rgb(25, 118, 210)</p>
            <p>• <strong>HSL/HSLA</strong>: 色相、饱和度、亮度（和透明度）表示，如 hsl(207, 79%, 46%)</p>
            <p>• <strong>HWB</strong>: 色相、白度、黑度表示，如 hwb(207, 10%, 18%)</p>
            <p>• <strong>CMYK</strong>: 青色、品红色、黄色和黑色表示，如 cmyk(88%, 44%, 0%, 18%)</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

const tool: Tool = {
  id: 'color-converter',
  name: '颜色格式转换',
  description: '在HEX、RGB、HSL等不同颜色格式之间转换',
  category: 'conversion',
  icon: FiDroplet,
  component: ColorConverter,
  meta: {
    keywords: ['color', 'converter', 'hex', 'rgb', 'hsl', 'cmyk', 'format', '颜色', '转换', '十六进制', 'HEX', 'RGB'],
    examples: [
      '#1976D2',
      'rgb(25, 118, 210)',
      'hsl(207, 79%, 46%)'
    ],
    version: '1.0.0'
  }
};

export default tool; 
