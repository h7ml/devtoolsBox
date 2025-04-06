import { Tool } from './types';

// 保存已注册的工具
const registeredTools: Record<string, Tool> = {};
let isRegistered = false;

// 注册单个工具
export function registerTool(tool: Tool): void {
  registeredTools[tool.id] = tool;
}

// 注册所有工具
export async function registerAllTools(): Promise<void> {
  // 如果已经注册过，则跳过
  if (isRegistered) {
    console.log('工具已经注册过，跳过注册过程');
    return;
  }

  console.log('开始注册工具...');
  try {
    // 开发辅助工具
    const regexTester = (await import('@/app/tools/dev/regex-tester')).default;
    registerTool(regexTester);
    console.log('已注册: 正则表达式测试工具');

    const timestamp = (await import('@/app/tools/dev/timestamp')).default;
    registerTool(timestamp);
    console.log('已注册: 时间戳转换工具');

    const uuid = (await import('@/app/tools/dev/uuid')).default;
    registerTool(uuid);
    console.log('已注册: UUID生成器工具');

    // 文本处理工具
    const base64 = (await import('@/app/tools/text/base64')).default;
    registerTool(base64);
    console.log('已注册: Base64编解码工具');
    
    const urlEncoder = (await import('@/app/tools/text/url-encoder')).default;
    registerTool(urlEncoder);
    console.log('已注册: URL编解码工具');

    // JSON 工具
    // const jsonFormatter = (await import('@/app/tools/json/json-formatter')).default;
    // registerTool(jsonFormatter);

    // 爬虫工具
    const httpRequest = (await import('@/app/tools/crawler/http-request')).default;
    registerTool(httpRequest);
    console.log('已注册: HTTP请求测试工具');

    // 其他工具
    const passwordGenerator = (await import('@/app/tools/other/password-generator')).default;
    registerTool(passwordGenerator);
    console.log('已注册: 密码生成器工具');

    isRegistered = true;
    console.log('所有工具注册完成! 共注册了', Object.keys(registeredTools).length, '个工具');
  } catch (error) {
    console.error('工具注册失败:', error);
  }
}

// 获取所有已注册的工具
export function getAllTools(): Tool[] {
  return Object.values(registeredTools);
}

// 根据ID获取工具
export function getToolById(id: string): Tool | undefined {
  return registeredTools[id];
}

// 根据分类获取工具
export function getToolsByCategory(category: string): Tool[] {
  return Object.values(registeredTools).filter(tool => tool.category === category);
}

// 搜索工具
export function searchTools(query: string): Tool[] {
  if (!query) return getAllTools();
  
  const lowerQuery = query.toLowerCase();
  return Object.values(registeredTools).filter(tool => {
    const nameMatch = tool.name.toLowerCase().includes(lowerQuery);
    const descMatch = tool.description.toLowerCase().includes(lowerQuery);
    const keywordMatch = tool.meta?.keywords?.some(keyword => 
      keyword.toLowerCase().includes(lowerQuery)
    );
    
    return nameMatch || descMatch || keywordMatch;
  });
}

// 获取热门工具
export function getPopularTools(limit: number = 6): Tool[] {
  // 这里可以根据实际需求添加热门工具的逻辑
  // 例如：访问次数、用户评分等
  // 目前简单返回前N个工具
  return Object.values(registeredTools).slice(0, limit);
}

// 获取收藏的工具
export function getFavoriteTools(favoriteIds: string[]): Tool[] {
  return favoriteIds
    .map(id => registeredTools[id])
    .filter(Boolean);
} 
