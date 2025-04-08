/**
 * 设计系统索引
 * 统一导出所有UI组件，确保一致的设计风格
 */

// 基础组件
export { default as Button } from '../../../components/design-system/Button';
export { default as Card, CardHeader, CardContent, CardFooter } from '../../../components/design-system/Card';
export { default as Input, TextArea } from '../../../components/design-system/Input';

// 主题配置
export { default as theme } from './theme';

// 类型定义
export * from './types';

// 工具函数
export * from './utils'; 
 