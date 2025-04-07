'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Box,
  Text,
  Flex,
  Kbd,
  Spinner,
  Badge,
  useColorModeValue,
  Divider,
  Icon,
  HStack,
  VStack,
  Avatar,
  useToken
} from '@chakra-ui/react';
import { FiSearch, FiArrowRight, FiTag, FiStar, FiHeart, FiZap, FiClock, FiTrendingUp, FiCommand, FiCornerDownRight, FiX } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import BaseModal from './BaseModal';
import { useModalContext } from '../../contexts/ModalContext';
import { searchTools, getPopularTools, getAllTools } from '../../lib/tools-registry/register-tools';
import { Tool } from '../../lib/tools-registry/types';
import { categoryBadgeColorMap } from '../../lib/tools-registry/categories';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  url: string;
  popularity: number; // 受欢迎程度，用于排序
}

interface SearchModalProps { }

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const SearchModal: React.FC<SearchModalProps> = () => {
  const { isOpen, closeModal, modalType } = useModalContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [toolsRegistered, setToolsRegistered] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'results' | 'popular' | 'recent'>('results');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Chakra颜色变量
  const bgHover = useColorModeValue('gray.50', 'gray.700');
  const bgSelected = useColorModeValue('orange.50', 'orange.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgCard = useColorModeValue('white', 'gray.800');
  const textPrimary = useColorModeValue('gray.800', 'white');
  const textSecondary = useColorModeValue('gray.600', 'gray.300');
  const highlightColor = useColorModeValue('orange.500', 'orange.400');
  const [orange400, orange500] = useToken('colors', ['orange.400', 'orange.500']);

  // 获取本地存储的最近搜索
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recentSearches');
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (e) {
          console.error('解析最近搜索失败:', e);
          setRecentSearches([]);
        }
      }
    }
  }, []);

  // 保存最近搜索到本地存储
  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;

    const updatedSearches = [
      term,
      ...recentSearches.filter(item => item !== term)
    ].slice(0, 5);

    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  // 当模态框打开时自动注册工具
  useEffect(() => {
    if (isOpen && modalType === 'search' && !toolsRegistered) {
      const registerTools = async () => {
        setIsLoading(true);
        try {
          const { registerAllTools } = await import('../../lib/tools-registry/register-tools');
          await registerAllTools();
          setToolsRegistered(true);
          console.log('工具注册已完成');
        } catch (error) {
          console.error('工具注册失败:', error);
        } finally {
          setIsLoading(false);
        }
      };

      registerTools();
    }
  }, [isOpen, modalType, toolsRegistered]);

  // 当模态框打开时，聚焦到搜索输入框
  useEffect(() => {
    if (isOpen && modalType === 'search') {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      // 重置搜索状态
      setSearchTerm('');
      setResults([]);
      setSelectedIndex(-1);
      setActiveTab('results');
    }
  }, [isOpen, modalType]);

  // 处理键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || modalType !== 'search') return;

      // 如果按下ESC键，关闭模态框
      if (e.key === 'Escape') {
        closeModal();
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev =>
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
          break;
        case 'Enter':
          if (selectedIndex >= 0 && results[selectedIndex]) {
            e.preventDefault();
            navigateToResult(results[selectedIndex]);
          } else if (searchTerm.trim()) {
            // 如果有搜索词但没有选中结果，将搜索词保存到最近搜索
            saveRecentSearch(searchTerm);
          }
          break;
        case 'Tab':
          // 循环切换标签
          e.preventDefault();
          setActiveTab(prev =>
            prev === 'results' ? 'popular' :
              prev === 'popular' ? 'recent' : 'results'
          );
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, modalType, results, selectedIndex, searchTerm, closeModal]);

  // 搜索逻辑
  useEffect(() => {
    const fetchResults = async () => {
      if (!searchTerm.trim() || !toolsRegistered) {
        // 当搜索词为空或工具未注册时，不显示结果
        setResults([]);
        return;
      }

      setIsLoading(true);
      setActiveTab('results');

      try {
        // 工具已在模态框打开时注册，直接使用搜索功能
        const foundTools = searchTools(searchTerm);

        // 将Tool对象转换为SearchResult格式
        const searchResults: SearchResult[] = foundTools.map(tool => ({
          id: tool.id,
          title: tool.name,
          description: tool.description,
          category: tool.category,
          tags: tool.meta.keywords || [],
          url: `/tools/${tool.category}/${tool.id}`,
          popularity: 0 // 默认为0，不使用meta.popularity
        }));

        setResults(searchResults);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, toolsRegistered]);

  const navigateToResult = (result: SearchResult) => {
    saveRecentSearch(result.title);
    closeModal();
    router.push(result.url);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedIndex(-1);
  };

  const handleTabChange = (tab: 'results' | 'popular' | 'recent') => {
    setActiveTab(tab);
    setSelectedIndex(-1);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleRecentSearchClick = (term: string) => {
    setSearchTerm(term);
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const renderResultItem = (result: SearchResult, index: number) => {
    const isSelected = index === selectedIndex;

    return (
      <MotionBox
        key={result.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: index * 0.05 }}
        p={3}
        borderRadius="lg"
        bg={isSelected ? bgSelected : 'transparent'}
        _hover={{ bg: isSelected ? bgSelected : bgHover }}
        cursor="pointer"
        onClick={() => navigateToResult(result)}
        onMouseEnter={() => setSelectedIndex(index)}
        borderLeft={isSelected ? '3px solid' : '3px solid transparent'}
        borderLeftColor={isSelected ? highlightColor : 'transparent'}
        position="relative"
        overflow="hidden"
      >
        <Flex justify="space-between" align="center">
          <Text fontWeight="semibold" color={textPrimary}>{result.title}</Text>
          <Badge
            colorScheme={categoryBadgeColorMap[result.category]?.split('-')[0] || 'orange'}
            variant="solid"
            px={2}
            py={0.5}
            borderRadius="full"
            fontSize="xs"
          >
            {result.category}
          </Badge>
        </Flex>

        <Text fontSize="sm" color="gray.500" mt={1} noOfLines={2}>
          {result.description}
        </Text>

        <Flex mt={2} gap={2} flexWrap="wrap">
          {result.tags.slice(0, 3).map(tag => (
            <Badge key={tag} colorScheme="gray" variant="subtle" fontSize="xs" borderRadius="full">
              <Flex align="center" gap={1}>
                <FiTag size={10} />
                {tag}
              </Flex>
            </Badge>
          ))}
          {result.tags.length > 3 && (
            <Badge colorScheme="gray" variant="subtle" fontSize="xs" borderRadius="full">
              +{result.tags.length - 3}
            </Badge>
          )}
        </Flex>

        {isSelected && (
          <Flex
            position="absolute"
            bottom={1}
            right={2}
            align="center"
            fontSize="xs"
            color="gray.500"
          >
            <Text>按</Text>
            <Kbd size="xs" mx={1}>Enter</Kbd>
            <Text>打开</Text>
          </Flex>
        )}
      </MotionBox>
    );
  };

  // 获取热门工具，确保这个过程不会失败
  const getHotTools = (): SearchResult[] => {
    try {
      const popularTools = getPopularTools(5);

      if (!popularTools.length) {
        // 备用工具数据，以防工具注册表为空
        return [
          {
            id: "json-formatter",
            title: "JSON格式化工具",
            description: "格式化和验证JSON数据的在线工具",
            category: "json",
            tags: ["JSON", "格式化", "验证"],
            url: "/tools/json/json-formatter",
            popularity: 95
          },
          {
            id: "regex-tester",
            title: "正则表达式测试器",
            description: "测试和调试正则表达式的工具",
            category: "dev",
            tags: ["Regex", "测试", "匹配"],
            url: "/tools/dev/regex-tester",
            popularity: 80
          }
        ];
      }

      return popularTools.map(tool => ({
        id: tool.id,
        title: tool.name,
        description: tool.description,
        category: tool.category,
        tags: tool.meta.keywords || [],
        url: `/tools/${tool.category}/${tool.id}`,
        popularity: 0 // 默认为0，不使用meta.popularity
      }));
    } catch (error) {
      console.error('Error getting popular tools:', error);
      // 出错时返回空数组
      return [];
    }
  };

  const hotTools = getHotTools();

  return (
    <BaseModal
      isOpen={isOpen && modalType === 'search'}
      onClose={closeModal}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4">
        {/* 搜索输入框 */}
        <MotionFlex
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
          direction="column"
          gap={4}
        >
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <FiSearch className="text-gray-400" />
            </InputLeftElement>
            <Input
              ref={searchInputRef}
              placeholder="搜索工具..."
              value={searchTerm}
              onChange={handleSearchChange}
              variant="filled"
              size="lg"
              borderRadius="xl"
              bg={useColorModeValue('gray.100', 'gray.700')}
              _hover={{ bg: useColorModeValue('gray.200', 'gray.600') }}
              _focus={{
                bg: useColorModeValue('white', 'gray.800'),
                boxShadow: `0 0 0 1px ${orange500}`,
                borderColor: 'orange.500'
              }}
              fontSize="md"
              autoComplete="off"
              pr="4rem"
            />
            {searchTerm && (
              <InputRightElement h="full" pointerEvents="auto" display="flex" alignItems="center" justifyContent="center">
                <Box
                  as="button"
                  p="1"
                  h="8"
                  w="8"
                  borderRadius="full"
                  bg={useColorModeValue('gray.200', 'gray.600')}
                  _hover={{ bg: useColorModeValue('gray.300', 'gray.500') }}
                  cursor="pointer"
                  onClick={() => setSearchTerm('')}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mr="3"
                >
                  <FiX size={16} />
                </Box>
              </InputRightElement>
            )}
          </InputGroup>

          {/* 快捷键提示与标签切换 */}
          <Flex justify="center" align="center" px={1} py={1} fontSize="xs" color="gray.500">
            <HStack spacing={4} divider={<Box as="span" mx={1} color="gray.300">|</Box>}>
              <Flex align="center" gap={1}>
                <Icon as={FiCommand} boxSize="3" />
                <Text>+</Text>
                <Kbd size="xs" mx="1px">K</Kbd>
                <Text ml="1">搜索</Text>
              </Flex>
              <Flex align="center" gap={1}>
                <Kbd size="xs">↑</Kbd>
                <Kbd size="xs">↓</Kbd>
                <Text ml="1">导航</Text>
              </Flex>
              <Flex align="center" gap={1}>
                <Kbd size="xs">Tab</Kbd>
                <Text ml="1">切换</Text>
              </Flex>
              <Flex align="center" gap={1}>
                <Kbd size="xs">Enter</Kbd>
                <Text ml="1">选择</Text>
              </Flex>
            </HStack>
          </Flex>
        </MotionFlex>

        <Divider />

        {/* 标签页切换 */}
        <HStack spacing={2} mb={2} px={1}>
          <Box
            p={2}
            cursor="pointer"
            borderRadius="md"
            bg={activeTab === 'results' ? bgSelected : 'transparent'}
            color={activeTab === 'results' ? highlightColor : textSecondary}
            fontWeight={activeTab === 'results' ? 'semibold' : 'normal'}
            onClick={() => handleTabChange('results')}
            transition="all 0.2s"
            fontSize="sm"
            flex="1"
            textAlign="center"
          >
            <Flex align="center" justify="center">
              <Icon as={FiSearch} mr={2} />
              搜索结果 {results.length > 0 && `(${results.length})`}
            </Flex>
          </Box>
          <Box
            p={2}
            cursor="pointer"
            borderRadius="md"
            bg={activeTab === 'popular' ? bgSelected : 'transparent'}
            color={activeTab === 'popular' ? highlightColor : textSecondary}
            fontWeight={activeTab === 'popular' ? 'semibold' : 'normal'}
            onClick={() => handleTabChange('popular')}
            transition="all 0.2s"
            fontSize="sm"
            flex="1"
            textAlign="center"
          >
            <Flex align="center" justify="center">
              <Icon as={FiTrendingUp} mr={2} />
              热门工具
            </Flex>
          </Box>
          <Box
            p={2}
            cursor="pointer"
            borderRadius="md"
            bg={activeTab === 'recent' ? bgSelected : 'transparent'}
            color={activeTab === 'recent' ? highlightColor : textSecondary}
            fontWeight={activeTab === 'recent' ? 'semibold' : 'normal'}
            onClick={() => handleTabChange('recent')}
            transition="all 0.2s"
            fontSize="sm"
            flex="1"
            textAlign="center"
          >
            <Flex align="center" justify="center">
              <Icon as={FiClock} mr={2} />
              最近使用
            </Flex>
          </Box>
        </HStack>

        {/* 搜索结果或热门列表 */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          maxH="60vh"
          overflowY="auto"
          px={1}
          className="custom-scrollbar"
          border="1px solid"
          borderColor={borderColor}
          borderRadius="xl"
          p={2}
          bg={bgCard}
        >
          {isLoading ? (
            <Flex justify="center" py={8} align="center" direction="column" gap={4}>
              <Spinner color="orange.500" size="lg" thickness="3px" speed="0.8s" />
              <Text color="gray.500" fontSize="sm">正在搜索中...</Text>
            </Flex>
          ) : activeTab === 'results' && results.length > 0 ? (
            <div className="space-y-2">
              {results.map((result, index) => renderResultItem(result, index))}
            </div>
          ) : activeTab === 'results' && searchTerm ? (
            <MotionFlex
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              direction="column"
              align="center"
              justify="center"
              py={8}
              color="gray.500"
            >
              <Box
                p={4}
                mb={2}
                borderRadius="full"
                bg={useColorModeValue('gray.100', 'gray.700')}
              >
                <FiSearch className="text-gray-400" size={30} />
              </Box>
              <Text fontWeight="medium" mb={1}>未找到匹配的工具</Text>
              <Text fontSize="sm" mb={4}>尝试使用不同的关键词搜索</Text>
              <Flex wrap="wrap" justify="center" gap={2} maxW="md">
                {["JSON工具", "文本转换", "编码解码", "格式化", "加密解密"].map(suggestion => (
                  <Badge
                    key={suggestion}
                    px={3}
                    py={1}
                    borderRadius="full"
                    colorScheme="gray"
                    cursor="pointer"
                    onClick={() => setSearchTerm(suggestion)}
                    _hover={{ bg: bgHover }}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </Flex>
            </MotionFlex>
          ) : activeTab === 'popular' ? (
            <VStack spacing={2} align="stretch" p={2}>
              {hotTools.map((tool, index) => (
                <MotionBox
                  key={tool.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Link href={tool.url} onClick={closeModal}>
                    <Flex
                      p={3}
                      borderRadius="lg"
                      _hover={{ bg: bgHover }}
                      align="center"
                      justify="space-between"
                      transition="all 0.2s"
                    >
                      <Flex align="center" gap={3}>
                        <Flex
                          w={10}
                          h={10}
                          borderRadius="lg"
                          bg={useColorModeValue(`${categoryBadgeColorMap[tool.category]?.split('-')[0]}.100`, `${categoryBadgeColorMap[tool.category]?.split('-')[0]}.900`)}
                          color={useColorModeValue(`${categoryBadgeColorMap[tool.category]?.split('-')[0]}.500`, `${categoryBadgeColorMap[tool.category]?.split('-')[0]}.300`)}
                          justify="center"
                          align="center"
                        >
                          <FiZap />
                        </Flex>
                        <Box>
                          <Text fontWeight="medium">{tool.title}</Text>
                          <Text fontSize="xs" color="gray.500" noOfLines={1}>{tool.description}</Text>
                        </Box>
                      </Flex>
                      <Flex align="center" gap={2}>
                        <Badge colorScheme={categoryBadgeColorMap[tool.category]?.split('-')[0] || 'orange'} variant="subtle">
                          {tool.category}
                        </Badge>
                        <FiArrowRight className="text-gray-400" />
                      </Flex>
                    </Flex>
                  </Link>
                </MotionBox>
              ))}
            </VStack>
          ) : activeTab === 'recent' ? (
            recentSearches.length > 0 ? (
              <Box>
                <Flex justify="space-between" align="center" px={3} py={2}>
                  <Text fontSize="sm" fontWeight="medium" color={textSecondary}>最近搜索</Text>
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    cursor="pointer"
                    _hover={{ color: 'red.500' }}
                    onClick={clearRecentSearches}
                  >
                    清除历史
                  </Text>
                </Flex>
                <VStack spacing={1} align="stretch">
                  {recentSearches.map((term, index) => (
                    <MotionBox
                      key={`${term}-${index}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Flex
                        p={3}
                        borderRadius="lg"
                        _hover={{ bg: bgHover }}
                        align="center"
                        justify="space-between"
                        cursor="pointer"
                        onClick={() => handleRecentSearchClick(term)}
                      >
                        <Flex align="center" gap={3}>
                          <Icon as={FiClock} color="gray.500" />
                          <Text>{term}</Text>
                        </Flex>
                        <Icon as={FiCornerDownRight} color="gray.500" />
                      </Flex>
                    </MotionBox>
                  ))}
                </VStack>
              </Box>
            ) : (
              <Flex
                direction="column"
                align="center"
                justify="center"
                py={8}
                color="gray.500"
              >
                <Icon as={FiClock} fontSize="xl" mb={2} />
                <Text>无最近搜索记录</Text>
                <Text fontSize="sm" mt={1}>
                  您的搜索历史将显示在这里
                </Text>
              </Flex>
            )
          ) : (
            <Box p={4}>
              <Text fontSize="sm" color="gray.500" mb={4}>热门工具</Text>
              <div className="space-y-2">
                {hotTools.map(tool => (
                  <Link key={tool.id} href={tool.url} onClick={closeModal}>
                    <Flex
                      p={2}
                      borderRadius="md"
                      _hover={{ bg: bgHover }}
                      align="center"
                      justify="space-between"
                    >
                      <Flex align="center">
                        <FiStar className="text-yellow-400 mr-2" />
                        <Text>{tool.title}</Text>
                      </Flex>
                      <FiArrowRight className="text-gray-400" />
                    </Flex>
                  </Link>
                ))}
              </div>
            </Box>
          )}
        </MotionBox>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(155, 155, 155, 0.5);
          border-radius: 20px;
          border: transparent;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(200, 200, 200, 0.3);
        }
      `}</style>
    </BaseModal>
  );
};

export default SearchModal;
