'use client';

import React from 'react';
import { useModalContext } from '../../contexts/ModalContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import SearchModal from './SearchModal';

/**
 * 模态框管理器组件
 * 
 * 此组件负责管理和渲染所有模态框。
 * 它应该放在应用的顶层，通常在布局组件或提供者中。
 */
const ModalManager: React.FC = () => {
  // 使用模态框上下文来确定哪个模态框应该被显示
  const { modalType } = useModalContext();

  return (
    <>
      {/* 登录模态框 */}
      <LoginModal />

      {/* 注册模态框 */}
      <RegisterModal />

      {/* 忘记密码模态框 */}
      <ForgotPasswordModal />

      {/* 搜索模态框 */}
      <SearchModal />

      {/* 可以根据需要添加更多模态框 */}
    </>
  );
};

export default ModalManager; 
