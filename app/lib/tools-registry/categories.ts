import { ToolCategory } from './types';

/**
 * 工具类别名称映射表
 */
export const categoryNameMap: Record<ToolCategory, string> = {
  'text': '文本处理',
  'dev': '开发工具',
  'runtime': '运行时工具',
  'web': '网络/爬虫',
  'json': 'JSON工具',
  'misc': '其他工具',
  'formatter': '格式化工具',
  'conversion': '数据转换',
  'encoding': '编码解码',
  'datetime': '日期时间',
  'time': '时间工具',
  'crypto': '加密解密',
  'image': '图像工具',
  'calculator': '计算工具',
  'generator': '生成工具',
  'network': '网络工具',
  'frontend': '前端助手',
  'password': '密码工具',
  'testing': '测试工具',
  'color': '颜色工具',
  'geo': '地理工具',
  'unit': '单位转换',
  'format': '格式化工具',
  'math': '数学工具'
};

/**
 * 工具类别徽章颜色映射表
 */
export const categoryBadgeColorMap: Record<ToolCategory, string> = {
  'text': 'from-blue-500 to-blue-600',
  'dev': 'from-purple-500 to-purple-600',
  'runtime': 'from-orange-500 to-orange-600',
  'web': 'from-teal-500 to-teal-600',
  'json': 'from-green-500 to-green-600',
  'misc': 'from-gray-500 to-gray-600',
  'formatter': 'from-blue-500 to-cyan-600',
  'conversion': 'from-yellow-500 to-amber-600',
  'encoding': 'from-green-500 to-emerald-600',
  'datetime': 'from-amber-500 to-yellow-600',
  'time': 'from-amber-500 to-yellow-600',
  'crypto': 'from-purple-500 to-blue-600',
  'image': 'from-pink-500 to-rose-600',
  'calculator': 'from-indigo-500 to-blue-600',
  'generator': 'from-blue-500 to-indigo-600',
  'network': 'from-teal-500 to-cyan-600',
  'frontend': 'from-sky-500 to-blue-600',
  'password': 'from-red-500 to-pink-600',
  'testing': 'from-violet-500 to-purple-600',
  'color': 'from-rose-500 to-pink-600',
  'geo': 'from-emerald-500 to-green-600',
  'unit': 'from-cyan-500 to-blue-600',
  'format': 'from-blue-500 to-cyan-600',
  'math': 'from-indigo-500 to-blue-600'
};

/**
 * 工具类别颜色样式映射（用于列表页分组标题）
 */
export const categoryColorMap: Record<ToolCategory, string> = {
  'text': 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300',
  'dev': 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300',
  'runtime': 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-300',
  'web': 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-300',
  'json': 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300',
  'misc': 'bg-gray-50 dark:bg-gray-700/30 text-gray-600 dark:text-gray-300',
  'formatter': 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300',
  'conversion': 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-300',
  'encoding': 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300',
  'datetime': 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-300',
  'time': 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-300',
  'crypto': 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300',
  'image': 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-300',
  'calculator': 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300',
  'generator': 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300',
  'network': 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-300',
  'frontend': 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-300',
  'password': 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300',
  'testing': 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-300',
  'color': 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-300',
  'geo': 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-300',
  'unit': 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-300',
  'format': 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300',
  'math': 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300'
}; 
