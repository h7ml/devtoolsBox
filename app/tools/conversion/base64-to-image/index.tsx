'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FiImage, FiCopy, FiDownload, FiUpload, FiX, FiFileText } from 'react-icons/fi';
import { Card, CardHeader, CardContent } from '../../../components/design-system/Card';
import Button from '../../../components/design-system/Button';
import { toast } from 'sonner';

// 示例图片Base64数据
const EXAMPLE_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB+ElEQVR4nO3csU0DQRBG4XEBTpxTDQVQBG3QAJVs0g0NkJM7dEDiSCT+RL7d2dl50fdSYel5vPKuVBUAAAAAAACAOW1ut7fL4XBsD65Dv4tGO3//+Li9v73tQr+LRlsPgOl5ALLzAGTnAcjOA5Dd+nJ5zuP4NPLD1vP5KfqdjL68T8/L6XQe+d3s9/vo9zLy8tYDwGQ8ANl5ALLzAGT3UlX18fn5Hf5ljPk6j37P/76843H4R9sT+r2Mun9rAJiMByA7D0B2HoDsPADZeQCy8wBk5wHIzgOQnQcgOw9Adh6A7DwA2XkAsvMAZOcByM4DkJ0HILuqqo/d7iv8yxjzdRb9nv99ecfj8I+2J/R7GXX/1gAwGQ9Adh6A7DwA2XkAsvMAZOcByM4DkJ0HILuqh4eX0Z+G7Xa79fX19Rj9Xv59ee+fVXXb/eRy9E8GvL5U3e/Xu+9f3Aw3gwqQnQqQnQqQnQqQnQqQnQqQnQqQXYUXQDvKC6AdL+AFkN1V9j8Fy35jXsA/RbnpxgswmK4WwM2SLYCF0PEClOoCtL78cE3qAiz3E0CtL8/aqQvgR5+0ugBL/QR66wvoN3UB/Af4tLoAS/0EmupvcVbOf4AJqQDZqQDZqQDZqQDZqQDZqQDZqQDZqQAAAAAAAAAAsGL+AldQrQyLuK2tAAAAAElFTkSuQmCC';

// 图像信息类型
interface ImageInfo {
  width: number;
  height: number;
  format: string;
  size: string;
  lastModified?: string;
}

const Base64ToImageComponent: React.FC = () => {
  const [base64Input, setBase64Input] = useState<string>(EXAMPLE_BASE64);
  const [imageUrl, setImageUrl] = useState<string>(EXAMPLE_BASE64);
  const [error, setError] = useState<string | null>(null);
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理Base64输入的变更
  const handleBase64Change = (value: string) => {
    setBase64Input(value);

    if (!value) {
      setImageUrl('');
      setImageInfo(null);
      return;
    }

    try {
      // 确保数据以 data: 开头
      if (!value.startsWith('data:')) {
        // 尝试自动修复，假设是图像/png
        if (value.startsWith('/9j/') || value.startsWith('iVBOR')) {
          value = 'data:image/png;base64,' + value;
        } else if (value.startsWith('/+9j/')) {
          value = 'data:image/jpeg;base64,' + value;
        } else {
          value = 'data:image/png;base64,' + value;
        }
      }

      setImageUrl(value);
      setError(null);
    } catch (e) {
      setError(`无效的Base64数据: ${e.message}`);
    }
  };

  // 当图像加载时获取信息
  useEffect(() => {
    if (imageRef.current && imageRef.current.complete && imageUrl) {
      updateImageInfo();
    }
  }, [imageUrl]);

  // 更新图像信息
  const updateImageInfo = () => {
    if (!imageRef.current || !imageUrl) {
      setImageInfo(null);
      return;
    }

    const img = imageRef.current;

    // 获取图像格式
    let format = '未知';
    if (imageUrl.startsWith('data:image/')) {
      format = imageUrl.substring(11, imageUrl.indexOf(';'));
    }

    // 计算Base64数据大小
    const base64Data = imageUrl.split(',')[1] || '';
    const dataSize = Math.ceil((base64Data.length * 3) / 4);

    setImageInfo({
      width: img.naturalWidth,
      height: img.naturalHeight,
      format: format.toUpperCase(),
      size: formatBytes(dataSize),
      lastModified: uploadedFile ? new Date(uploadedFile.lastModified).toLocaleString() : undefined
    });
  };

  // 格式化字节数为可读的字符串
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 处理图像文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    convertFileToBase64(file);
  };

  // 将文件转换为Base64
  const convertFileToBase64 = (file: File) => {
    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setBase64Input(base64);
      setImageUrl(base64);
      setError(null);
    };
    reader.onerror = () => {
      setError('读取文件失败');
    };
    reader.readAsDataURL(file);
  };

  // 下载图像
  const handleDownload = () => {
    if (!imageUrl) return;

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `image.${(imageInfo?.format || 'png').toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('图像下载成功');
  };

  // 复制Base64数据
  const handleCopyBase64 = () => {
    navigator.clipboard.writeText(base64Input);
    toast.success('Base64数据已复制到剪贴板');
  };

  // 清除
  const handleClear = () => {
    setBase64Input('');
    setImageUrl('');
    setImageInfo(null);
    setUploadedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 拖拽相关处理函数
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      convertFileToBase64(e.dataTransfer.files[0]);
    }
  };

  // 从图像URL中提取Base64数据部分
  const getBase64DataWithoutHeader = (): string => {
    if (!imageUrl) return '';

    const parts = imageUrl.split(',');
    return parts.length > 1 ? parts[1] : imageUrl;
  };

  return (
    <Card className="w-full">
      <CardHeader
        icon={<FiImage className="h-6 w-6" />}
        title="Base64 图像转换器"
        description="转换Base64编码和图像文件，预览和下载图像"
        gradientColors="from-pink-500 to-rose-600"
      />
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：Base64输入和上传 */}
          <div className="space-y-4">
            <div
              className={`
                border-2 border-dashed rounded-lg p-4
                ${dragActive
                  ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                  : 'border-gray-300 dark:border-gray-700 hover:border-pink-400 dark:hover:border-pink-600'
                }
                transition-colors duration-200
              `}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <FiUpload className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-2" />
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
                  拖放图像文件到此处
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  支持PNG, JPEG, GIF, WebP等格式
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="fileUpload"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  选择图像文件
                </Button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Base64 数据
                </label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<FiCopy className="h-4 w-4" />}
                    onClick={handleCopyBase64}
                    disabled={!base64Input}
                  >
                    复制
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<FiX className="h-4 w-4" />}
                    onClick={handleClear}
                    disabled={!base64Input}
                  >
                    清除
                  </Button>
                </div>
              </div>
              <textarea
                value={base64Input}
                onChange={(e) => handleBase64Change(e.target.value)}
                className="w-full h-60 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         font-mono text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="粘贴Base64编码数据..."
              />
            </div>

            {error && (
              <div className="p-3 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p>
                <strong>提示：</strong> 支持标准Base64图像数据（data:image/xxx;base64,...）和原始Base64编码。
              </p>
            </div>
          </div>

          {/* 右侧：图像预览和信息 */}
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                图像预览
              </h3>
              <Button
                variant="ghost"
                size="sm"
                icon={<FiDownload className="h-4 w-4" />}
                onClick={handleDownload}
                disabled={!imageUrl}
              >
                下载图像
              </Button>
            </div>

            <div className="relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-video flex items-center justify-center">
              {imageUrl ? (
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Base64图像预览"
                  className="max-w-full max-h-full object-contain"
                  onLoad={updateImageInfo}
                  onError={() => setError('无法加载图像，请检查Base64数据是否有效')}
                />
              ) : (
                <div className="text-center text-gray-400 dark:text-gray-600">
                  <FiImage className="w-12 h-12 mx-auto mb-2" />
                  <p>无图像预览</p>
                </div>
              )}
            </div>

            {imageInfo && (
              <div className="mt-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">图像信息</h4>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">格式</dt>
                    <dd className="font-medium text-gray-900 dark:text-gray-100">{imageInfo.format}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">尺寸</dt>
                    <dd className="font-medium text-gray-900 dark:text-gray-100">{imageInfo.width} × {imageInfo.height} px</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">文件大小</dt>
                    <dd className="font-medium text-gray-900 dark:text-gray-100">{imageInfo.size}</dd>
                  </div>
                  {imageInfo.lastModified && (
                    <div>
                      <dt className="text-gray-500 dark:text-gray-400">修改时间</dt>
                      <dd className="font-medium text-gray-900 dark:text-gray-100">{imageInfo.lastModified}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {imageUrl && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">原始Base64数据</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<FiCopy className="h-3 w-3" />}
                    onClick={() => {
                      navigator.clipboard.writeText(getBase64DataWithoutHeader());
                      toast.success('纯Base64数据已复制');
                    }}
                  >
                    复制原始数据
                  </Button>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                  <div className="overflow-auto max-h-24">
                    <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-all">
                      {getBase64DataWithoutHeader().substring(0, 100)}
                      {getBase64DataWithoutHeader().length > 100 ? '...' : ''}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// 工具元数据
const base64ToImage = {
  id: 'base64-to-image',
  name: 'Base64 图像转换器',
  description: '转换Base64编码和图像文件，预览和下载图像',
  category: 'conversion',
  icon: FiImage,
  component: Base64ToImageComponent,
  meta: {
    keywords: ['base64', '图像', '转换', '预览', '下载', 'png', 'jpeg', 'image'],
    author: 'DevTools Box',
    version: '1.0.0'
  }
};

export default base64ToImage; 
