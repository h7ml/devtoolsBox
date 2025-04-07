'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ModalType = 'login' | 'register' | 'forgotPassword' | 'search' | null;

interface ModalContextType {
  modalType: ModalType;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
  isOpen: boolean;
}

const initialModalContext: ModalContextType = {
  modalType: null,
  openModal: () => { },
  closeModal: () => { },
  isOpen: false,
};

const ModalContext = createContext<ModalContextType>(initialModalContext);

export const useModalContext = () => useContext(ModalContext);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (type: ModalType) => {
    setModalType(type);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    // 延迟清除modalType，以便关闭动画完成
    setTimeout(() => {
      setModalType(null);
    }, 300);
  };

  return (
    <ModalContext.Provider value={{ modalType, openModal, closeModal, isOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContext; 
