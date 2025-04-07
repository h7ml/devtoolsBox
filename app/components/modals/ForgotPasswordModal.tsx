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
  useToast,
  Text,
  VStack,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
  InputLeftElement
} from '@chakra-ui/react';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import BaseModal from './BaseModal';
import { useModalContext } from '../../contexts/ModalContext';

interface ForgotPasswordModalProps { }

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = () => {
  const { isOpen, closeModal, modalType, openModal } = useModalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const toast = useToast();
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      // TODO: 实现忘记密码API调用
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '请求失败');
      }

      // 显示成功发送邮件的状态
      setEmailSent(true);
      reset();

    } catch (error: any) {
      toast({
        title: '重置密码请求失败',
        description: error.message || '请稍后再试',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    closeModal();
    setTimeout(() => {
      openModal('login');
      // 重置状态以便下次打开
      setEmailSent(false);
    }, 100);
  };

  return (
    <BaseModal
      isOpen={isOpen && modalType === 'forgotPassword'}
      onClose={() => {
        closeModal();
        // 重置状态以便下次打开
        setTimeout(() => {
          setEmailSent(false);
        }, 300);
      }}
      title="找回密码"
    >
      {!emailSent ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Text color={textColor} mb={4}>
            请输入您的注册邮箱，我们将向您发送重置密码的链接。
          </Text>

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

          <VStack spacing={4} mt={6}>
            <Button
              type="submit"
              colorScheme="orange"
              w="full"
              isLoading={isLoading}
              loadingText="发送中..."
            >
              发送重置链接
            </Button>

            <Button
              variant="ghost"
              w="full"
              leftIcon={<FiArrowLeft />}
              onClick={handleBackToLogin}
            >
              返回登录
            </Button>
          </VStack>
        </form>
      ) : (
        <Box>
          <Alert
            status="success"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            borderRadius="md"
            py={6}
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              重置链接已发送！
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              我们已向您的邮箱发送了重置密码的链接，请查收邮件并按照指引完成密码重置。
            </AlertDescription>
          </Alert>

          <Button
            mt={6}
            w="full"
            colorScheme="orange"
            onClick={handleBackToLogin}
          >
            返回登录
          </Button>
        </Box>
      )}
    </BaseModal>
  );
};

export default ForgotPasswordModal; 
