'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Checkbox,
  Flex,
  Text,
  Divider,
  useToast,
  VStack,
  HStack,
  InputLeftElement
} from '@chakra-ui/react';
import { FiEye, FiEyeOff, FiGithub, FiLock, FiMail, FiUser } from 'react-icons/fi';
import { signIn } from 'next-auth/react';
import BaseModal from './BaseModal';
import { useModalContext } from '../../contexts/ModalContext';

interface RegisterModalProps { }

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

const RegisterModal: React.FC<RegisterModalProps> = () => {
  const { isOpen, closeModal, modalType, openModal } = useModalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const onSubmit = async (data: RegisterFormData) => {
    if (!data.agreeTerms) {
      toast({
        title: '请同意服务条款',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: 实现注册接口调用
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '注册失败');
      }

      toast({
        title: '注册成功',
        description: '请登录您的账户',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      reset();
      closeModal();

      // 打开登录模态框
      setTimeout(() => {
        openModal('login');
      }, 100);

    } catch (error: any) {
      toast({
        title: '注册失败',
        description: error.message || '请稍后再试',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setIsLoading(true);
    try {
      await signIn('github', { callbackUrl: '/' });
    } catch (error) {
      toast({
        title: 'GitHub登录失败',
        description: '请稍后再试',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

  const handleOpenLoginModal = () => {
    closeModal();
    setTimeout(() => {
      openModal('login');
    }, 100);
  };

  return (
    <BaseModal
      isOpen={isOpen && modalType === 'register'}
      onClose={closeModal}
      title="创建新账户"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormControl isInvalid={!!errors.name} isRequired>
          <FormLabel htmlFor="name">用户名</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FiUser className="ml-3 text-gray-500" />
            </InputLeftElement>
            <Input
              id="name"
              placeholder="请输入用户名"
              {...register('name', {
                required: '请输入用户名',
                minLength: {
                  value: 3,
                  message: '用户名至少需要3个字符',
                },
              })}
            />
          </InputGroup>
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.email} isRequired>
          <FormLabel htmlFor="email">邮箱地址</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FiMail className="ml-3 text-gray-500" />
            </InputLeftElement>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...register('email', {
                required: '请输入邮箱地址',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: '请输入有效的邮箱地址',
                },
              })}
            />
          </InputGroup>
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>

        <HStack spacing={4} align="start">
          <FormControl isInvalid={!!errors.password} isRequired>
            <FormLabel htmlFor="password">密码</FormLabel>
            <InputGroup>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="请输入密码"
                {...register('password', {
                  required: '请输入密码',
                  minLength: {
                    value: 8,
                    message: '密码至少需要8个字符',
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                    message: '密码需包含大小写字母和数字',
                  },
                })}
              />
              <InputRightElement>
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={togglePasswordVisibility}
                  variant="ghost"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.confirmPassword} isRequired>
            <FormLabel htmlFor="confirmPassword">确认密码</FormLabel>
            <InputGroup>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="确认密码"
                {...register('confirmPassword', {
                  required: '请确认密码',
                  validate: value => value === password || '密码不匹配',
                })}
              />
              <InputRightElement>
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={toggleConfirmPasswordVisibility}
                  variant="ghost"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
          </FormControl>
        </HStack>

        <FormControl isInvalid={!!errors.agreeTerms}>
          <Checkbox
            id="agreeTerms"
            colorScheme="orange"
            {...register('agreeTerms', {
              required: '请同意服务条款',
            })}
          >
            <Text fontSize="sm">
              我已阅读并同意
              <Button
                as="a"
                href="/terms"
                target="_blank"
                variant="link"
                colorScheme="orange"
                size="sm"
                ml={1}
              >
                服务条款
              </Button>
              和
              <Button
                as="a"
                href="/privacy"
                target="_blank"
                variant="link"
                colorScheme="orange"
                size="sm"
                ml={1}
              >
                隐私政策
              </Button>
            </Text>
          </Checkbox>
          <FormErrorMessage>{errors.agreeTerms?.message}</FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          colorScheme="orange"
          w="full"
          isLoading={isLoading}
          loadingText="注册中..."
          mt={4}
        >
          创建账户
        </Button>

        <Flex align="center" my={4}>
          <Divider />
          <Text px={2} color="gray.500">
            或者
          </Text>
          <Divider />
        </Flex>

        <Button
          w="full"
          leftIcon={<FiGithub />}
          onClick={handleGithubLogin}
          isLoading={isLoading}
          variant="outline"
        >
          使用 GitHub 注册
        </Button>

        <Flex justify="center" mt={4}>
          <Text fontSize="sm" color="gray.600" mr={1}>
            已有账户?
          </Text>
          <Button
            variant="link"
            colorScheme="orange"
            size="sm"
            onClick={handleOpenLoginModal}
          >
            立即登录
          </Button>
        </Flex>
      </form>
    </BaseModal>
  );
};

export default RegisterModal; 
