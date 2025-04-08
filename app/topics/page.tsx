'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Tag,
  Button,
  useColorModeValue,
  Image,
  LinkBox,
  LinkOverlay,
  VStack,
  Skeleton,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink
} from '@chakra-ui/react';
import { FiChevronRight, FiList, FiGrid } from 'react-icons/fi';
import Link from 'next/link';
import { getAllTopics } from '@/app/lib/topics/topics-registry';
import { Topic } from '@/app/lib/topics/types';

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const allTopics = await getAllTopics();
        setTopics(allTopics);
      } catch (error) {
        console.error('Failed to load topics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const renderSkeleton = () => {
    return Array(6).fill(0).map((_, i) => (
      <Card key={`skeleton-${i}`} variant="outline" borderColor={borderColor} height="100%">
        <CardHeader>
          <Skeleton height="24px" width="70%" />
        </CardHeader>
        <CardBody>
          <Skeleton height="100px" mb={4} />
          <Skeleton height="20px" width="90%" mb={2} />
          <Skeleton height="20px" width="60%" />
        </CardBody>
        <CardFooter>
          <Skeleton height="24px" width="120px" />
        </CardFooter>
      </Card>
    ));
  };

  const renderGridView = () => {
    return topics.map((topic) => (
      <LinkBox
        as={Card}
        key={topic.slug}
        variant="outline"
        borderColor={borderColor}
        transition="all 0.3s"
        _hover={{
          transform: 'translateY(-5px)',
          boxShadow: 'lg',
          borderColor: 'blue.400',
          bg: hoverBgColor
        }}
        overflow="hidden"
        height="100%"
      >
        {topic.image && (
          <Box height="140px" position="relative" overflow="hidden">
            <Image
              src={topic.image}
              alt={topic.title}
              objectFit="cover"
              width="100%"
              height="100%"
            />
          </Box>
        )}
        <CardHeader pb={2}>
          <LinkOverlay as={Link} href={`/topics/${topic.slug}`} passHref>
            <Heading size="md">{topic.title}</Heading>
          </LinkOverlay>
        </CardHeader>
        <CardBody pt={0}>
          <Text noOfLines={3} fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
            {topic.description}
          </Text>
        </CardBody>
        <CardFooter pt={0} justifyContent="space-between" alignItems="center">
          <Flex gap={2} flexWrap="wrap">
            {topic.categories.slice(0, 3).map((category) => (
              <Tag key={category} size="sm" colorScheme="blue" variant="subtle">
                {category}
              </Tag>
            ))}
            {topic.categories.length > 3 && (
              <Tag size="sm" colorScheme="gray" variant="subtle">
                +{topic.categories.length - 3}
              </Tag>
            )}
          </Flex>
          <Text fontSize="sm" color="gray.500">
            {topic.toolCount || 0} 个工具
          </Text>
        </CardFooter>
      </LinkBox>
    ));
  };

  const renderListView = () => {
    return topics.map((topic) => (
      <Card
        key={topic.slug}
        direction={{ base: 'column', md: 'row' }}
        variant="outline"
        borderColor={borderColor}
        overflow="hidden"
        transition="all 0.3s"
        _hover={{
          borderColor: 'blue.400',
          bg: hoverBgColor
        }}
        width="100%"
        mb={4}
      >
        {topic.image && (
          <Box minWidth={{ base: '100%', md: '200px' }} maxWidth={{ base: '100%', md: '200px' }} height={{ base: '140px', md: 'auto' }}>
            <Image
              src={topic.image}
              alt={topic.title}
              objectFit="cover"
              width="100%"
              height="100%"
            />
          </Box>
        )}
        <VStack align="start" flex="1" p={4}>
          <Heading size="md" mb={2}>
            <Link href={`/topics/${topic.slug}`} passHref>
              {topic.title}
            </Link>
          </Heading>
          <Text noOfLines={2} fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
            {topic.description}
          </Text>
          <Flex mt={2} justifyContent="space-between" width="100%" alignItems="center">
            <Flex gap={2} flexWrap="wrap">
              {topic.categories.slice(0, 4).map((category) => (
                <Tag key={category} size="sm" colorScheme="blue" variant="subtle">
                  {category}
                </Tag>
              ))}
              {topic.categories.length > 4 && (
                <Tag size="sm" colorScheme="gray" variant="subtle">
                  +{topic.categories.length - 4}
                </Tag>
              )}
            </Flex>
            <Text fontSize="sm" color="gray.500">
              {topic.toolCount || 0} 个工具
            </Text>
          </Flex>
        </VStack>
      </Card>
    ));
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={6}>
        <Breadcrumb separator={<FiChevronRight />} fontSize="sm">
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} href="/">首页</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>主题专区</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>

      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading as="h1" size="xl" mb={2}>主题专区</Heading>
          <Text color="gray.600" _dark={{ color: "gray.400" }}>
            探索按不同主题组织的工具集合，找到适合特定场景的工具组合
          </Text>
        </Box>
        <Flex>
          <Button
            size="sm"
            leftIcon={<FiGrid />}
            variant={viewMode === 'grid' ? 'solid' : 'outline'}
            colorScheme={viewMode === 'grid' ? 'blue' : 'gray'}
            mr={2}
            onClick={() => setViewMode('grid')}
          >
            网格
          </Button>
          <Button
            size="sm"
            leftIcon={<FiList />}
            variant={viewMode === 'list' ? 'solid' : 'outline'}
            colorScheme={viewMode === 'list' ? 'blue' : 'gray'}
            onClick={() => setViewMode('list')}
          >
            列表
          </Button>
        </Flex>
      </Flex>

      {loading ? (
        viewMode === 'grid' ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {renderSkeleton()}
          </SimpleGrid>
        ) : (
          <VStack spacing={4} align="stretch">
            {renderSkeleton()}
          </VStack>
        )
      ) : topics.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Heading size="md" mb={3}>暂无主题内容</Heading>
          <Text>我们正在筹备更多精彩主题，敬请期待！</Text>
        </Box>
      ) : viewMode === 'grid' ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {renderGridView()}
        </SimpleGrid>
      ) : (
        <VStack spacing={4} align="stretch">
          {renderListView()}
        </VStack>
      )}
    </Container>
  );
}
