'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  Text,
  Flex,
  Kbd,
  Spinner,
  Badge,
  useColorModeValue,
  Divider
} from '@chakra-ui/react';
import { FiSearch, FiArrowRight, FiTag, FiStar, FiHeart } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BaseModal from './BaseModal';
import { useModalContext } from '../../contexts/ModalContext';
import { searchTools, getPopularTools, getAllTools } from '../../lib/tools-registry/register-tools';
import { Tool } from '../../lib/tools-registry/types';

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

const SearchModal: React.FC<SearchModalProps> = () => {
  const { isOpen, closeModal, modalType } = useModalContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [toolsRegistered, setToolsRegistered] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const bgHover = useColorModeValue('gray.50', 'gray.700');
  const bgSelected = useColorModeValue('orange.50', 'orange.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

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
    }
  }, [isOpen, modalType]);

  // 处理键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || modalType !== 'search') return;

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
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, modalType, results, selectedIndex]);

  // 搜索逻辑
  useEffect(() => {
    const fetchResults = async () => {
      if (!searchTerm.trim() || !toolsRegistered) {
        // 当搜索词为空或工具未注册时，不显示结果
        setResults([]);
        return;
      }

      setIsLoading(true);
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
          popularity: 0 // 暂时没有流行度数据
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
    closeModal();
    router.push(result.url);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedIndex(-1);
  };

  const renderResultItem = (result: SearchResult, index: number) => {
    const isSelected = index === selectedIndex;

    return (
      <Box
        key={result.id}
        p={3}
        borderRadius="md"
        bg={isSelected ? bgSelected : 'transparent'}
        _hover={{ bg: isSelected ? bgSelected : bgHover }}
        cursor="pointer"
        onClick={() => navigateToResult(result)}
        onMouseEnter={() => setSelectedIndex(index)}
        transition="background-color 0.2s"
      >
        <Flex justify="space-between" align="center">
          <Text fontWeight="medium">{result.title}</Text>
          <Badge colorScheme="orange" variant="subtle">
            {result.category}
          </Badge>
        </Flex>

        <Text fontSize="sm" color="gray.500" mt={1} noOfLines={2}>
          {result.description}
        </Text>

        <Flex mt={2} gap={2} flexWrap="wrap">
          {result.tags.map(tag => (
            <Badge key={tag} colorScheme="gray" variant="subtle" fontSize="xs">
              <Flex align="center" gap={1}>
                <FiTag size={10} />
                {tag}
              </Flex>
            </Badge>
          ))}
        </Flex>
      </Box>
    );
  };

  // 获取热门工具，确保这个过程不会失败
  const getHotTools = (): SearchResult[] => {
    try {
      const popularTools = getPopularTools(2);

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
        popularity: 0
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
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* 搜索输入框 */}
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
            _focus={{ boxShadow: 'none', borderColor: 'orange.500' }}
          />
        </InputGroup>

        {/* 快捷键提示 */}
        <Flex justify="space-between" px={2} fontSize="xs" color="gray.500">
          <Flex align="center" gap={1}>
            使用
            <Kbd size="xs">↑</Kbd>
            <Kbd size="xs">↓</Kbd>
            导航
          </Flex>
          <Flex align="center" gap={1}>
            <Kbd size="xs">Enter</Kbd>
            选择
          </Flex>
        </Flex>

        <Divider />

        {/* 搜索结果 */}
        <Box maxH="60vh" overflowY="auto" px={1}>
          {isLoading ? (
            <Flex justify="center" py={8}>
              <Spinner color="orange.500" />
            </Flex>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              {results.map((result, index) => renderResultItem(result, index))}
            </div>
          ) : searchTerm ? (
            <Flex
              direction="column"
              align="center"
              justify="center"
              py={8}
              color="gray.500"
            >
              <FiSearch className="mb-2" size={24} />
              <Text>未找到匹配的工具</Text>
              <Text fontSize="sm" mt={1}>
                尝试使用不同的关键词搜索
              </Text>
            </Flex>
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
        </Box>
      </div>
    </BaseModal>
  );
};

export default SearchModal;
