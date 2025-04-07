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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const bgHover = useColorModeValue('gray.50', 'gray.700');
  const bgSelected = useColorModeValue('orange.50', 'orange.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

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
      if (!searchTerm.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        // TODO: 替换为实际的API调用
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 500));

        // 模拟搜索结果数据
        const mockResults: SearchResult[] = [
          {
            id: '1',
            title: 'JSON格式化工具',
            description: '格式化和验证JSON数据的在线工具',
            category: '开发工具',
            tags: ['JSON', '格式化', '验证'],
            url: '/tools/json-formatter',
            popularity: 95
          },
          {
            id: '2',
            title: 'Base64编解码工具',
            description: '在线转换Base64编码和解码',
            category: '编码工具',
            tags: ['Base64', '编码', '解码'],
            url: '/tools/base64',
            popularity: 90
          },
          {
            id: '3',
            title: 'Markdown编辑器',
            description: '所见即所得的Markdown编辑工具',
            category: '文本工具',
            tags: ['Markdown', '编辑器', '预览'],
            url: '/tools/markdown-editor',
            popularity: 85
          },
          {
            id: '4',
            title: '正则表达式测试器',
            description: '测试和调试正则表达式的工具',
            category: '开发工具',
            tags: ['Regex', '测试', '匹配'],
            url: '/tools/regex-tester',
            popularity: 80
          },
          {
            id: '5',
            title: 'URL编解码工具',
            description: 'URL编码和解码转换工具',
            category: '编码工具',
            tags: ['URL', '编码', '解码'],
            url: '/tools/url-encoder',
            popularity: 75
          }
        ];

        // 根据搜索词过滤结果
        const filteredResults = mockResults.filter(item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        setResults(filteredResults);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

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
                <Link href="/tools/json-formatter" onClick={closeModal}>
                  <Flex
                    p={2}
                    borderRadius="md"
                    _hover={{ bg: bgHover }}
                    align="center"
                    justify="space-between"
                  >
                    <Flex align="center">
                      <FiStar className="text-yellow-400 mr-2" />
                      <Text>JSON格式化工具</Text>
                    </Flex>
                    <FiArrowRight className="text-gray-400" />
                  </Flex>
                </Link>
                <Link href="/tools/markdown-editor" onClick={closeModal}>
                  <Flex
                    p={2}
                    borderRadius="md"
                    _hover={{ bg: bgHover }}
                    align="center"
                    justify="space-between"
                  >
                    <Flex align="center">
                      <FiHeart className="text-red-400 mr-2" />
                      <Text>Markdown编辑器</Text>
                    </Flex>
                    <FiArrowRight className="text-gray-400" />
                  </Flex>
                </Link>
              </div>
            </Box>
          )}
        </Box>
      </div>
    </BaseModal>
  );
};

export default SearchModal;
