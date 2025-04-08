/**
 * 关键词助手工具
 * 
 * 为工具提供SEO关键词生成和管理功能
 * 支持基本关键词、特性关键词、长尾关键词和相关词生成
 */

import { categoryNameMap } from './categories';

/**
 * 关键词类型
 */
export type KeywordType = 'base' | 'feature' | 'longtail' | 'question' | 'comparison' | 'negative';

/**
 * 关键词对象
 */
export interface Keyword {
  text: string;
  type: KeywordType;
  relevance: number; // 0-100
  volume?: number; // 搜索量指标
  difficulty?: number; // 难度指标，0-100
  intent?: 'informational' | 'navigational' | 'commercial' | 'transactional';
}

/**
 * 关键词分组
 */
export interface KeywordGroup {
  name: string;
  keywords: Keyword[];
}

/**
 * 关键词扩展结果
 */
export interface KeywordExpansionResult {
  originalKeyword: string;
  relatedKeywords: Keyword[];
  groups: KeywordGroup[];
  suggestions: string[];
}

/**
 * 基础关键词模板 - 按工具类型
 */
const baseKeywordTemplates: Record<string, string[]> = {
  json: [
    'JSON格式化', 'JSON校验', 'JSON美化', 'JSON压缩', 'JSON编辑器', 
    '在线JSON工具', 'JSON语法检查', 'JSON转换器', 'JSON查看器', 'JSON解析'
  ],
  formatter: [
    '代码格式化', '代码美化', '代码缩进', '代码整理', '代码排版',
    '代码高亮', 'HTML格式化', 'CSS格式化', 'JavaScript格式化', '代码检查'
  ],
  converter: [
    '文件转换', '格式转换', '单位转换', '编码转换', '数据转换',
    '在线转换器', '文本转换', '图片转换', '时间格式转换', '进制转换'
  ],
  crypto: [
    '加密工具', '解密工具', '哈希计算', 'MD5生成', 'SHA256',
    '在线加密', '密码生成', '安全加密', 'Base64编码', '数据加密'
  ],
  text: [
    '文本处理', '文本编辑', '文本分析', '文本比较', '文本统计',
    '在线文本工具', '文本格式化', '文本转换', '文本提取', '文本过滤'
  ],
  image: [
    '图片处理', '图片编辑', '图片压缩', '图片转换', '图片效果',
    '在线图片工具', '图片裁剪', '图片调整', '图片滤镜', '图片优化'
  ],
  calculator: [
    '计算器', '在线计算', '高级计算', '科学计算', '特殊计算',
    '计算工具', '数学计算', '统计计算', '概率计算', '单位计算'
  ],
  generator: [
    '生成器', '在线生成', '随机生成', '自动生成', '批量生成',
    '代码生成', '数据生成', '文本生成', '图表生成', '表单生成'
  ],
  validator: [
    '验证工具', '格式验证', '语法检查', '代码验证', '数据验证',
    '在线验证', '正确性检查', '合规性检查', '错误检测', '质量检查'
  ],
  misc: [
    '实用工具', '开发工具', '在线工具', '效率工具', '辅助工具',
    '网页工具', '便捷工具', '开发助手', '程序员工具', '日常工具'
  ]
};

/**
 * 特性动词词组
 */
const featureVerbs = [
  '使用', '在线', '免费', '快速', '简单', '专业', '强大',
  '高效', '便捷', '安全', '实时', '自动', '智能', '定制',
  '批量', '精确', '可靠', '灵活', '直观', '即时'
];

/**
 * 目标用户词组
 */
const targetAudience = [
  '开发者', '程序员', '设计师', '学生', '教师', '研究人员',
  'IT专业人士', '网站管理员', '数据分析师', '前端工程师', '后端工程师',
  '全栈开发者', 'UI设计师', 'DevOps工程师', '测试工程师', '产品经理'
];

/**
 * 平台/场景词组
 */
const platformScenarios = [
  '网页版', '在线版', '网站', '应用', '工具箱',
  '浏览器', '移动端', '电脑', '桌面', '云端',
  '无需下载', '无需安装', '在线使用', '即时使用', '随时随地'
];

/**
 * 关键词分组
 */
const keywordGroups: Record<string, KeywordGroup> = {
  json: { name: 'JSON工具', keywords: [] },
  crypto: { name: '加密工具', keywords: [] },
  converter: { name: '转换工具', keywords: [] },
  formatter: { name: '格式化工具', keywords: [] },
  generator: { name: '生成器', keywords: [] },
  calculator: { name: '计算器', keywords: [] },
  validator: { name: '验证工具', keywords: [] },
  misc: { name: '实用工具', keywords: [] }
};

/**
 * 为工具生成基础关键词
 * @param toolType 工具类型
 * @param toolName 工具名称
 * @param alternativeNames 工具的其他名称
 * @returns 关键词数组
 */
export function generateBaseKeywords(
  toolType: string,
  toolName: string,
  alternativeNames: string[] = []
): Keyword[] {
  const baseKeywords: Keyword[] = [];
  const typeKeywords = baseKeywordTemplates[toolType] || baseKeywordTemplates.misc;
  
  // 添加核心关键词
  baseKeywords.push({
    text: toolName,
    type: 'base',
    relevance: 100
  });
  
  // 添加替代名称
  alternativeNames.forEach(name => {
    baseKeywords.push({
      text: name,
      type: 'base',
      relevance: 90
    });
  });
  
  // 添加类型关键词
  typeKeywords.forEach((keyword, index) => {
    baseKeywords.push({
      text: keyword,
      type: 'base',
      relevance: 85 - (index * 5)
    });
  });
  
  return baseKeywords;
}

/**
 * 生成特性关键词
 * @param toolName 工具名称
 * @param features 工具特性数组
 * @returns 关键词数组
 */
export function generateFeatureKeywords(
  toolName: string,
  features: string[]
): Keyword[] {
  const keywords: Keyword[] = [];
  
  // 添加特性关键词
  features.forEach(feature => {
    keywords.push({
      text: `${feature}${toolName}`,
      type: 'feature',
      relevance: 80
    });
  });
  
  // 添加常见特性关键词
  featureVerbs.forEach((feature, index) => {
    keywords.push({
      text: `${feature}${toolName}`,
      type: 'feature',
      relevance: 75 - Math.min(index, 10)
    });
  });
  
  return keywords;
}

/**
 * 生成长尾关键词
 * @param toolName 工具名称
 * @param useCases 使用场景数组
 * @returns 关键词数组
 */
export function generateLongtailKeywords(
  toolName: string,
  useCases: string[]
): Keyword[] {
  const keywords: Keyword[] = [];
  
  // 基于使用场景生成
  useCases.forEach(useCase => {
    keywords.push({
      text: `${toolName}用于${useCase}`,
      type: 'longtail',
      relevance: 70,
      intent: 'informational'
    });
    
    keywords.push({
      text: `如何使用${toolName}进行${useCase}`,
      type: 'longtail',
      relevance: 65,
      intent: 'informational'
    });
  });
  
  // 基于动作生成
  const actionKeywords = [
    '使用', '创建', '转换', '格式化', '验证', '分析', '检查',
    '编辑', '查看', '修复', '清理', '压缩', '加密', '解密',
    '比较', '合并', '分割', '搜索', '替换', '提取'
  ];
  
  actionKeywords.forEach((action, index) => {
    if (index < 5) {
      keywords.push({
        text: `${action}${toolName}`,
        type: 'longtail',
        relevance: 60 - index,
        intent: 'transactional'
      });
      
      keywords.push({
        text: `在线${action}${toolName}`,
        type: 'longtail',
        relevance: 60 - index,
        intent: 'transactional'
      });
    }
  });
  
  return keywords;
}

/**
 * 生成问题型关键词
 * @param toolName 工具名称
 * @param toolType 工具类型
 * @returns 关键词数组
 */
export function generateQuestionKeywords(
  toolName: string,
  toolType: string
): Keyword[] {
  const keywords: Keyword[] = [];
  const questions = [
    `什么是${toolName}`,
    `如何使用${toolName}`,
    `${toolName}如何工作`,
    `${toolName}有什么功能`,
    `最好的${baseKeywordTemplates[toolType]?.[0] || toolName}是什么`,
    `${toolName}安全吗`,
    `${toolName}免费吗`,
    `${toolName}和其他工具有什么区别`
  ];
  
  questions.forEach((question, index) => {
    keywords.push({
      text: question,
      type: 'question',
      relevance: 70 - (index * 3),
      intent: 'informational'
    });
  });
  
  return keywords;
}

/**
 * 生成比较关键词
 * @param toolName 工具名称
 * @param competitors 竞争对手数组
 * @returns 关键词数组
 */
export function generateComparisonKeywords(
  toolName: string,
  competitors: string[]
): Keyword[] {
  const keywords: Keyword[] = [];
  
  competitors.forEach(competitor => {
    keywords.push({
      text: `${toolName}与${competitor}比较`,
      type: 'comparison',
      relevance: 65,
      intent: 'commercial'
    });
    
    keywords.push({
      text: `${toolName}还是${competitor}`,
      type: 'comparison',
      relevance: 63,
      intent: 'commercial'
    });
    
    keywords.push({
      text: `${toolName}和${competitor}哪个好`,
      type: 'comparison',
      relevance: 60,
      intent: 'commercial'
    });
  });
  
  return keywords;
}

/**
 * 生成所有类型的关键词
 * @param toolName 工具名称
 * @param toolType 工具类型
 * @param options 选项
 * @returns 关键词扩展结果
 */
export function generateAllKeywords(
  toolName: string,
  toolType: string,
  options: {
    alternativeNames?: string[];
    features?: string[];
    useCases?: string[];
    competitors?: string[];
  } = {}
): KeywordExpansionResult {
  const baseKeywords = generateBaseKeywords(
    toolType,
    toolName,
    options.alternativeNames || []
  );
  
  const featureKeywords = generateFeatureKeywords(
    toolName,
    options.features || []
  );
  
  const longtailKeywords = generateLongtailKeywords(
    toolName,
    options.useCases || []
  );
  
  const questionKeywords = generateQuestionKeywords(toolName, toolType);
  
  const comparisonKeywords = generateComparisonKeywords(
    toolName,
    options.competitors || []
  );
  
  // 合并所有关键词
  const allKeywords = [
    ...baseKeywords,
    ...featureKeywords,
    ...longtailKeywords,
    ...questionKeywords,
    ...comparisonKeywords
  ];
  
  // 按相关性排序
  allKeywords.sort((a, b) => b.relevance - a.relevance);
  
  // 创建分组
  const groups: KeywordGroup[] = [
    { name: '核心关键词', keywords: baseKeywords },
    { name: '特性关键词', keywords: featureKeywords },
    { name: '长尾关键词', keywords: longtailKeywords },
    { name: '问题关键词', keywords: questionKeywords },
    { name: '比较关键词', keywords: comparisonKeywords }
  ];
  
  // 提取建议（前10个最相关的关键词）
  const suggestions = allKeywords
    .slice(0, 10)
    .map(keyword => keyword.text);
  
  return {
    originalKeyword: toolName,
    relatedKeywords: allKeywords,
    groups,
    suggestions
  };
}

/**
 * 根据相关性和搜索意图过滤关键词
 * @param keywords 关键词数组
 * @param minRelevance 最小相关性
 * @param intent 搜索意图
 * @returns 过滤后的关键词数组
 */
export function filterKeywords(
  keywords: Keyword[],
  minRelevance = 60,
  intent?: Keyword['intent']
): Keyword[] {
  return keywords.filter(keyword => {
    const relevanceMatch = keyword.relevance >= minRelevance;
    const intentMatch = intent ? keyword.intent === intent : true;
    return relevanceMatch && intentMatch;
  });
}

/**
 * 生成页面的元标签关键词（逗号分隔字符串）
 * @param keywords 关键词数组
 * @param maxCount 最大关键词数量
 * @returns 关键词字符串
 */
export function generateMetaKeywords(
  keywords: Keyword[],
  maxCount = 10
): string {
  return keywords
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, maxCount)
    .map(keyword => keyword.text)
    .join(', ');
}

/**
 * 获取特定类别工具的推荐关键词
 * 
 * @param category 工具类别
 * @returns 推荐关键词数组
 */
export function getSuggestedKeywords(category: string): string[] {
  return baseKeywordTemplates[category.toLowerCase()] || 
         baseKeywordTemplates.misc;
}

/**
 * 分析关键词竞争度（简化版，实际应用中可能需要调用外部API）
 * 
 * @param keyword 关键词
 * @returns 竞争度评估（0-1之间，值越大竞争越激烈）
 */
export function analyzeKeywordCompetition(keyword: string): number {
  // 这里是简化实现，实际应用中可能调用SEO API
  // 当前实现基于关键词长度和特定关键词的存在进行简单估算
  
  // 长尾关键词竞争度通常较低
  const length = keyword.length;
  let competition = 0;
  
  if (length <= 2) {
    competition = 0.9; // 短关键词通常竞争激烈
  } else if (length <= 5) {
    competition = 0.7; // 中等长度关键词
  } else if (length <= 10) {
    competition = 0.5; // 较长关键词
  } else {
    competition = 0.3; // 长尾关键词
  }
  
  // 常见高竞争关键词
  const highCompetitionWords = ['免费', '在线', '工具', '软件', '下载', '怎么'];
  highCompetitionWords.forEach(word => {
    if (keyword.includes(word)) {
      competition += 0.1;
    }
  });
  
  // 确保结果在0-1范围内
  return Math.min(Math.max(competition, 0), 1);
}

/**
 * 对关键词进行优先级排序
 * 
 * @param keywords 关键词数组
 * @returns 排序后的关键词数组
 */
export function prioritizeKeywords(keywords: string[]): string[] {
  // 按关键词长度和复杂度排序（这是简化实现）
  // 实际应用中可能基于搜索量、竞争度等数据排序
  return keywords.sort((a, b) => {
    const competitionA = analyzeKeywordCompetition(a);
    const competitionB = analyzeKeywordCompetition(b);
    
    // 优先级排序：竞争度低的关键词优先
    return competitionA - competitionB;
  });
}

/**
 * 获取常见问题的关键词变种
 * 
 * @param toolName 工具名称
 * @returns 常见问题关键词数组
 */
export function getFaqKeywordVariants(toolName: string): string[] {
  return [
    `${toolName}教程`,
    `${toolName}使用方法`,
    `${toolName}指南`,
    `${toolName}攻略`,
    `${toolName}常见问题`,
    `${toolName}FAQ`,
    `${toolName}问题解答`,
    `${toolName}使用技巧`,
    `${toolName}高级用法`,
    `${toolName}最佳实践`
  ];
} 
