'use client';

import {
  Box,
  Heading,
  Text,
  Divider,
  UnorderedList,
  ListItem,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  Badge,
  Link
} from '@chakra-ui/react';
import { FiCheckCircle, FiActivity, FiUsers, FiHelpCircle, FiAlertCircle } from 'react-icons/fi';

export interface DetailedDescriptionProps {
  toolName: string;
  shortDescription: string;
  introduction: string;
  features: string[];
  useCases: string[];
  advantages: string[];
  faq?: Array<{ question: string; answer: string }>;
  limitations?: string[];
  relatedLinks?: Array<{ title: string; url: string }>;
}

export default function DetailedDescription({
  toolName,
  shortDescription,
  introduction,
  features,
  useCases,
  advantages,
  faq = [],
  limitations = [],
  relatedLinks = []
}: DetailedDescriptionProps) {
  return (
    <Box
      className="detailed-description"
      lineHeight="1.7"
    >
      <Box mb={8}>
        <Heading as="h2" size="xl" mb={3}>
          {toolName}
        </Heading>
        <Text fontSize="lg" fontWeight="medium" color="gray.600" _dark={{ color: "gray.300" }}>
          {shortDescription}
        </Text>
      </Box>

      <Box mb={8}>
        <Text>{introduction}</Text>
      </Box>

      <Box mb={8}>
        <Heading as="h3" size="lg" mb={4} display="flex" alignItems="center">
          <FiCheckCircle className="mr-2 text-green-500" />
          主要功能
        </Heading>
        <UnorderedList spacing={2}>
          {features.map((feature, index) => (
            <ListItem key={index}>{feature}</ListItem>
          ))}
        </UnorderedList>
      </Box>

      <Box mb={8}>
        <Heading as="h3" size="lg" mb={4} display="flex" alignItems="center">
          <FiActivity className="mr-2 text-blue-500" />
          使用场景
        </Heading>
        <UnorderedList spacing={2}>
          {useCases.map((useCase, index) => (
            <ListItem key={index}>{useCase}</ListItem>
          ))}
        </UnorderedList>
      </Box>

      <Box mb={8}>
        <Heading as="h3" size="lg" mb={4} display="flex" alignItems="center">
          <FiUsers className="mr-2 text-purple-500" />
          优势特点
        </Heading>
        <UnorderedList spacing={2}>
          {advantages.map((advantage, index) => (
            <ListItem key={index}>{advantage}</ListItem>
          ))}
        </UnorderedList>
      </Box>

      {limitations.length > 0 && (
        <Box mb={8}>
          <Heading as="h3" size="lg" mb={4} display="flex" alignItems="center">
            <FiAlertCircle className="mr-2 text-yellow-500" />
            使用限制
          </Heading>
          <UnorderedList spacing={2}>
            {limitations.map((limitation, index) => (
              <ListItem key={index}>{limitation}</ListItem>
            ))}
          </UnorderedList>
        </Box>
      )}

      {faq.length > 0 && (
        <Box mb={8}>
          <Heading as="h3" size="lg" mb={4} display="flex" alignItems="center">
            <FiHelpCircle className="mr-2 text-orange-500" />
            常见问题
          </Heading>
          <Accordion allowMultiple>
            {faq.map((item, index) => (
              <AccordionItem key={index} borderWidth="1px" borderRadius="md" mb={2}>
                <AccordionButton py={3}>
                  <Box flex="1" textAlign="left" fontWeight="medium">
                    {item.question}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  {item.answer}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      )}

      {relatedLinks.length > 0 && (
        <Box mb={8}>
          <Heading as="h3" size="lg" mb={4}>
            相关资源
          </Heading>
          <UnorderedList spacing={2}>
            {relatedLinks.map((link, index) => (
              <ListItem key={index}>
                <Link href={link.url} color="blue.500" isExternal>
                  {link.title}
                </Link>
              </ListItem>
            ))}
          </UnorderedList>
        </Box>
      )}
    </Box>
  );
}

/**
 * 为常见工具类型提供详细描述示例
 * 可以根据需要自定义内容
 */
export const descriptionTemplates = {
  json: {
    toolName: "JSON格式化工具",
    shortDescription: "格式化、验证和美化您的JSON数据",
    introduction: `这是一个功能强大的JSON格式化工具，专为开发者设计，可以帮助您轻松处理和美化JSON数据。本工具支持各种格式化选项，包括自定义缩进、压缩模式等，同时提供语法错误检测功能，帮助您快速发现JSON中的问题。`,
    features: [
      "一键格式化混乱的JSON数据，使其具有清晰的结构和缩进",
      "自动检测和高亮JSON语法错误，帮助您快速定位问题",
      "支持树状结构展示，方便浏览复杂的JSON对象",
      "提供多种缩进选项（2空格，4空格或制表符）",
      "支持压缩JSON为单行模式，减少数据体积",
      "一键复制格式化后的结果到剪贴板",
      "支持文件导入导出，处理大型JSON文件",
      "暗色模式支持，减轻长时间使用的视觉疲劳"
    ],
    useCases: [
      "API开发过程中检查和格式化响应数据",
      "调试前端应用中的JSON数据结构",
      "处理和验证配置文件的格式",
      "在编写文档时美化JSON示例",
      "数据分析前的JSON数据预处理",
      "整理和优化数据库导出的JSON数据"
    ],
    advantages: [
      "完全在浏览器中运行，保护您的数据隐私",
      "处理速度快，即使是大型JSON文件也能迅速格式化",
      "界面直观友好，无需专业知识即可上手使用",
      "支持高级格式化选项，满足不同场景需求",
      "同时提供压缩和美化功能，一站式解决JSON处理需求"
    ],
    faq: [
      {
        question: "这个工具是否安全？我的数据会上传到服务器吗？",
        answer: "本工具完全在浏览器中运行，您的JSON数据不会被上传到任何服务器，确保数据隐私和安全。"
      },
      {
        question: "有没有JSON大小的限制？",
        answer: "理论上，工具的处理能力受限于您的浏览器性能。一般情况下，可以处理几MB大小的JSON文件，但处理超大文件时可能会出现性能延迟。"
      },
      {
        question: "如何处理含有语法错误的JSON？",
        answer: "工具会自动检测JSON中的语法错误，并高亮显示错误位置，同时提供错误提示，帮助您快速修复问题。"
      }
    ],
    limitations: [
      "处理超大JSON文件（>10MB）时可能会影响浏览器性能",
      "不支持JSON5等扩展格式的特殊语法",
      "在某些旧版浏览器中可能存在兼容性问题"
    ],
    relatedLinks: [
      {
        title: "JSON官方网站",
        url: "https://www.json.org/json-en.html"
      },
      {
        title: "JSON Schema文档",
        url: "https://json-schema.org/understanding-json-schema/"
      }
    ]
  },

  crypto: {
    toolName: "加密工具集",
    shortDescription: "安全加密、解密和哈希计算工具",
    introduction: `这是一套专业的加密工具集，提供各种常用的加密、解密和哈希计算功能。无论是生成密码哈希、计算文件校验和，还是进行数据加密，本工具都能满足您的需求。所有运算都在本地完成，确保您的数据安全。`,
    features: [
      "支持多种哈希算法：MD5、SHA-1、SHA-256、SHA-512等",
      "提供常用加密算法：AES、DES、RSA等",
      "Base64编码和解码功能",
      "URL编码和解码工具",
      "文件哈希计算功能",
      "随机密码和密钥生成器",
      "字符串比较和验证工具"
    ],
    useCases: [
      "生成安全的密码哈希用于用户认证系统",
      "验证文件完整性和真实性",
      "保护敏感数据传输和存储的安全",
      "进行Web开发中的数据编码转换",
      "密码学研究和教学演示",
      "安全审计和渗透测试"
    ],
    advantages: [
      "所有计算都在客户端完成，数据不会传输到服务器",
      "支持最新的加密标准和算法",
      "界面简洁直观，便于快速使用",
      "同时支持文本和文件处理",
      "包含详细的算法说明和使用指南"
    ],
    faq: [
      {
        question: "这个工具的加密算法安全吗？",
        answer: "是的，我们使用标准且经过验证的加密库，实现了业界认可的加密算法。不过请注意，工具的安全性取决于您如何使用这些算法以及密钥的保管方式。"
      },
      {
        question: "我可以用这个工具加密大文件吗？",
        answer: "由于是浏览器端处理，大文件加密可能会受到内存限制。建议文件大小不超过100MB，超过此大小可能需要专门的桌面应用程序。"
      }
    ],
    limitations: [
      "受浏览器性能限制，不适合处理大于100MB的文件",
      "某些高级加密功能可能不支持所有浏览器",
      "密钥管理完全依赖用户，无法提供密钥恢复服务"
    ],
    relatedLinks: [
      {
        title: "加密算法基础知识",
        url: "https://en.wikipedia.org/wiki/Encryption"
      },
      {
        title: "Web加密API文档",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API"
      }
    ]
  },

  formatter: {
    toolName: "代码格式化工具",
    shortDescription: "美化和格式化各种编程语言的代码",
    introduction: `这是一款专业的代码格式化工具，支持多种编程语言的代码美化和格式化。无论是HTML、CSS、JavaScript，还是Python、Java等语言，都能按照标准的代码风格进行格式化，使代码更加整洁、可读、易于维护。`,
    features: [
      "支持多种编程语言：HTML、CSS、JavaScript、TypeScript、Python、Java、PHP等",
      "自定义缩进选项（空格或制表符）",
      "代码高亮显示，增强可读性",
      "语法错误检测和提示",
      "可保存格式化偏好设置",
      "支持批量文件处理",
      "内置多种代码风格模板（如Google风格、Airbnb风格等）"
    ],
    useCases: [
      "整理混乱的代码，提高可读性",
      "团队协作中统一代码风格",
      "代码提交前的清理和规范化",
      "学习标准的代码格式",
      "教学演示中展示规范代码",
      "遗留代码的现代化格式调整"
    ],
    advantages: [
      "完全离线运行，保护代码安全",
      "处理速度快，支持大型代码文件",
      "精确遵循各语言的代码规范",
      "可定制化的格式设置，满足不同偏好",
      "跨平台一致性，确保团队代码风格统一"
    ],
    faq: [
      {
        question: "格式化会改变我的代码功能吗？",
        answer: "不会。代码格式化只会改变代码的排版和缩进等样式，不会修改代码的功能逻辑。"
      },
      {
        question: "我可以自定义格式化规则吗？",
        answer: "是的，工具提供了多种格式化选项，可以根据您的需求自定义缩进大小、换行风格、引号样式等规则。"
      },
      {
        question: "支持多少种编程语言？",
        answer: "目前支持超过20种主流编程语言，包括但不限于HTML、CSS、JavaScript、TypeScript、Python、Java、PHP、C/C++、C#等。"
      }
    ],
    limitations: [
      "某些特殊的语言特性可能不被完全支持",
      "极大规模的代码文件可能导致浏览器性能下降",
      "高度定制的代码风格可能无法完全满足",
      "不能自动修复所有类型的代码问题"
    ],
    relatedLinks: [
      {
        title: "Google代码风格指南",
        url: "https://google.github.io/styleguide/"
      },
      {
        title: "Prettier官方文档",
        url: "https://prettier.io/docs/en/index.html"
      },
      {
        title: "ESLint配置指南",
        url: "https://eslint.org/docs/user-guide/configuring"
      }
    ]
  },

  misc: {
    toolName: "实用工具",
    shortDescription: "提供多种便捷功能的在线工具",
    introduction: "这是一款集成了多种实用功能的在线工具，旨在提供简单、高效的解决方案，帮助用户完成各种日常任务。无需安装任何软件，直接在浏览器中即可使用所有功能。",
    features: [
      "简洁直观的用户界面，易于上手",
      "所有处理在浏览器本地完成，保护数据隐私",
      "支持多种格式和功能",
      "快速响应，即时处理",
      "完全免费使用，无需注册"
    ],
    useCases: [
      "日常工作中的数据处理需求",
      "学习和教育场景中的辅助工具",
      "开发过程中的效率提升",
      "偶尔性的特殊工具需求",
      "无法安装专业软件时的替代方案"
    ],
    advantages: [
      "跨平台支持，在任何设备上都能使用",
      "节省安装专用软件的时间和空间",
      "操作简单，无需专业知识",
      "随时可用，满足临时需求",
      "持续更新，不断优化功能"
    ],
    faq: [
      {
        question: "这个工具是免费的吗？",
        answer: "是的，所有功能完全免费使用，无隐藏费用。"
      },
      {
        question: "我的数据安全吗？",
        answer: "所有处理都在您的浏览器本地完成，数据不会上传到服务器，确保您的隐私安全。"
      }
    ],
    limitations: [
      "功能可能不如专业桌面软件全面",
      "处理大量数据时可能受到浏览器性能限制",
      "依赖网络连接才能访问工具"
    ],
    relatedLinks: [
      {
        title: "更多在线工具",
        url: "https://devtool.h7ml.cn/"
      }
    ]
  }
};

// 导出一个辅助函数，用于根据工具类型获取模板
export function getDescriptionTemplate(type: string) {
  return descriptionTemplates[type as keyof typeof descriptionTemplates] ||
    descriptionTemplates.json; // 默认返回JSON模板
} 
