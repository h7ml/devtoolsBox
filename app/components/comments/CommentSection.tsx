'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FiMessageSquare, FiThumbsUp, FiTrash, FiSend } from 'react-icons/fi';
import {
  Box,
  Heading,
  Text,
  Avatar,
  Flex,
  Button,
  Textarea,
  Divider,
  useToast,
  IconButton,
  HStack,
  VStack,
  Spinner
} from '@chakra-ui/react';

interface Comment {
  id: string;
  toolId: string;
  userId: string;
  userName: string;
  userImage?: string;
  content: string;
  createdAt: string;
  likes: number;
  userHasLiked?: boolean;
}

interface CommentSectionProps {
  toolId: string;
}

export default function CommentSection({ toolId }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  // 加载评论 (mock实现，实际项目需连接API)
  useEffect(() => {
    const loadComments = async () => {
      try {
        // 在实际项目中, 应该连接到真实API
        // const response = await fetch(`/api/comments?toolId=${toolId}`);
        // const data = await response.json();
        // setComments(data.comments);

        // 模拟数据
        setTimeout(() => {
          setComments([
            {
              id: '1',
              toolId,
              userId: '101',
              userName: '开发者小明',
              userImage: 'https://i.pravatar.cc/150?u=user1',
              content: '这个工具真的很有用，节省了我很多时间！',
              createdAt: new Date().toISOString(),
              likes: 5,
              userHasLiked: false
            },
            {
              id: '2',
              toolId,
              userId: '102',
              userName: '程序猿张三',
              userImage: 'https://i.pravatar.cc/150?u=user2',
              content: '界面很直观，功能也很强大，推荐给团队的同事们使用了。',
              createdAt: new Date(Date.now() - 86400000).toISOString(), // 1天前
              likes: 3,
              userHasLiked: true
            }
          ]);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('获取评论失败:', error);
        setIsLoading(false);
        toast({
          title: '评论加载失败',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    loadComments();
  }, [toolId, toast]);

  // 提交评论 (mock实现)
  const handleSubmitComment = async () => {
    if (!session || !newComment.trim()) return;

    setIsSubmitting(true);
    try {
      // 模拟API调用
      setTimeout(() => {
        const newCommentObj = {
          id: Date.now().toString(),
          toolId,
          userId: session.user?.id || '999',
          userName: session.user?.name || '匿名用户',
          userImage: session.user?.image || undefined,
          content: newComment.trim(),
          createdAt: new Date().toISOString(),
          likes: 0,
          userHasLiked: false
        };

        setComments(prev => [newCommentObj, ...prev]);
        setNewComment('');
        setIsSubmitting(false);

        toast({
          title: '评论已发布',
          status: 'success',
          duration: 2000,
        });
      }, 500);
    } catch (error) {
      console.error('提交评论失败:', error);
      setIsSubmitting(false);
      toast({
        title: '评论发布失败',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // 点赞评论 (mock实现)
  const handleLikeComment = async (commentId: string) => {
    if (!session) {
      toast({
        title: '请先登录',
        description: '登录后才能点赞评论',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    try {
      setComments(prev => prev.map(comment =>
        comment.id === commentId
          ? {
            ...comment,
            likes: comment.userHasLiked ? comment.likes - 1 : comment.likes + 1,
            userHasLiked: !comment.userHasLiked
          }
          : comment
      ));
    } catch (error) {
      console.error('点赞评论失败:', error);
      toast({
        title: '操作失败',
        status: 'error',
        duration: 2000,
      });
    }
  };

  // 删除评论 (mock实现)
  const handleDeleteComment = async (commentId: string) => {
    try {
      // 模拟删除操作
      setComments(prev => prev.filter(comment => comment.id !== commentId));

      toast({
        title: '评论已删除',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      console.error('删除评论失败:', error);
      toast({
        title: '删除失败',
        status: 'error',
        duration: 2000,
      });
    }
  };

  return (
    <Box
      mt={10}
      bg="white"
      rounded="xl"
      shadow="sm"
      p={6}
      borderWidth="1px"
      borderColor="gray.100"
      _dark={{
        bg: "gray.800",
        borderColor: "gray.700"
      }}
    >
      <Heading size="lg" mb={6} display="flex" alignItems="center">
        <FiMessageSquare className="mr-2" />
        用户评论
        <Text ml={2} fontSize="sm" fontWeight="normal" color="gray.500" _dark={{ color: "gray.400" }}>
          ({comments.length})
        </Text>
      </Heading>

      {/* 评论输入框 */}
      {session ? (
        <Box mb={8}>
          <Flex mb={4}>
            <Avatar
              size="md"
              src={session.user?.image || undefined}
              name={session.user?.name || 'U'}
              mr={3}
            />
            <Box flex="1">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="分享您对这个工具的看法..."
                resize="vertical"
                rows={3}
                borderRadius="md"
              />
            </Box>
          </Flex>
          <Flex justify="flex-end">
            <Button
              onClick={handleSubmitComment}
              isDisabled={isSubmitting || !newComment.trim()}
              colorScheme="orange"
              size="md"
              leftIcon={<FiSend />}
              isLoading={isSubmitting}
              loadingText="发布中"
            >
              发表评论
            </Button>
          </Flex>
        </Box>
      ) : (
        <Box
          bg="gray.50"
          rounded="lg"
          p={4}
          mb={6}
          textAlign="center"
          _dark={{ bg: "gray.700" }}
        >
          <Text color="gray.600" _dark={{ color: "gray.300" }}>请登录后参与评论</Text>
          <Button
            as="a"
            href="/api/auth/signin"
            variant="outline"
            size="sm"
            mt={2}
            colorScheme="orange"
          >
            登录
          </Button>
        </Box>
      )}

      {/* 评论列表 */}
      {isLoading ? (
        <Flex justify="center" py={10}>
          <Spinner color="orange.500" size="lg" />
        </Flex>
      ) : comments.length > 0 ? (
        <VStack spacing={6} align="stretch" divider={<Divider />}>
          {comments.map(comment => (
            <Box key={comment.id}>
              <Flex>
                <Avatar
                  size="md"
                  src={comment.userImage}
                  name={comment.userName[0]}
                  mr={3}
                />
                <Box flex="1">
                  <Flex justify="space-between" align="center" mb={1}>
                    <Text fontWeight="medium" color="gray.900" _dark={{ color: "white" }}>
                      {comment.userName}
                    </Text>
                    <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.400" }}>
                      {new Date(comment.createdAt).toLocaleString('zh-CN')}
                    </Text>
                  </Flex>
                  <Text color="gray.700" _dark={{ color: "gray.300" }} mb={3}>
                    {comment.content}
                  </Text>
                  <HStack spacing={4}>
                    <Button
                      size="xs"
                      variant="ghost"
                      leftIcon={<FiThumbsUp />}
                      onClick={() => handleLikeComment(comment.id)}
                      color={comment.userHasLiked ? "orange.500" : "gray.500"}
                      _dark={{
                        color: comment.userHasLiked ? "orange.300" : "gray.400"
                      }}
                    >
                      {comment.likes > 0 ? comment.likes : '点赞'}
                    </Button>

                    {session?.user?.id === comment.userId && (
                      <Button
                        size="xs"
                        variant="ghost"
                        leftIcon={<FiTrash />}
                        onClick={() => handleDeleteComment(comment.id)}
                        colorScheme="red"
                      >
                        删除
                      </Button>
                    )}
                  </HStack>
                </Box>
              </Flex>
            </Box>
          ))}
        </VStack>
      ) : (
        <Box
          textAlign="center"
          py={10}
          color="gray.500"
          _dark={{ color: "gray.400" }}
        >
          <Text mb={2}>暂无评论，成为第一个评论的用户吧！</Text>
        </Box>
      )}
    </Box>
  );
} 
