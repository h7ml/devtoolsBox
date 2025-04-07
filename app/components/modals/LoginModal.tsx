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
  InputLeftElement,
  Checkbox,
  Flex,
  Text,
  Divider,
  useToast
} from '@chakra-ui/react';
import { FiEye, FiEyeOff, FiGithub, FiLock, FiMail } from 'react-icons/fi';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import BaseModal from './BaseModal';
import { useModalContext } from '../../contexts/ModalContext';

interface LoginModalProps { }

const LoginModal: React.FC<LoginModalProps> = () => {
  const { isOpen, closeModal, modalType, openModal } = useModalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<{ email: string; password: string; rememberMe: boolean }>();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const onSubmit = async (data: { email: string; password: string; rememberMe: boolean }) => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        toast({
          title: '登录失败',
          description: result.error,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: '登录成功',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        closeModal();
        reset();
        router.refresh();
      }
    } catch (error) {
      toast({
        title: '登录出错',
        description: '请稍后再试',
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

  const handleOpenRegisterModal = () => {
    closeModal();
    setTimeout(() => {
      openModal('register');
    }, 100);
  };

  const handleOpenForgotPasswordModal = () => {
    closeModal();
    setTimeout(() => {
      openModal('forgotPassword');
    }, 100);
  };

  return (
    <BaseModal
      isOpen={isOpen && modalType === 'login'}
      onClose={closeModal}
      title="登录账户"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormControl isInvalid={!!errors.email}>
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

        <FormControl isInvalid={!!errors.password}>
          <FormLabel htmlFor="password">密码</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FiLock className="ml-3 text-gray-500" />
            </InputLeftElement>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="输入密码"
              {...register('password', {
                required: '请输入密码',
                minLength: {
                  value: 6,
                  message: '密码至少需要6个字符',
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

        <Flex justify="space-between" align="center">
          <Checkbox
            id="rememberMe"
            colorScheme="orange"
            {...register('rememberMe')}
          >
            记住我
          </Checkbox>
          <Button
            variant="link"
            colorScheme="orange"
            size="sm"
            onClick={handleOpenForgotPasswordModal}
          >
            忘记密码?
          </Button>
        </Flex>

        <Button
          type="submit"
          colorScheme="orange"
          w="full"
          isLoading={isLoading}
          loadingText="登录中..."
        >
          登录
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
          使用 GitHub 登录
        </Button>

        <Flex justify="center" mt={4}>
          <Text fontSize="sm" color="gray.600" mr={1}>
            还没有账户?
          </Text>
          <Button
            variant="link"
            colorScheme="orange"
            size="sm"
            onClick={handleOpenRegisterModal}
          >
            立即注册
          </Button>
        </Flex>
      </form>
    </BaseModal>
  );
};

export default LoginModal;