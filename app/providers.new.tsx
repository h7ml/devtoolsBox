'use client';

import { ThemeProvider } from 'next-themes';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import { ModalProvider } from './contexts/ModalContext';
import ModalManager from './components/modals/ModalManager';
import NavBarWithModals from './components/NavBarWithModals';

export function Providers({ children }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class">
        <CacheProvider>
          <ChakraProvider>
            <ModalProvider>
              <NavBarWithModals />
              <ModalManager />
              {children}
            </ModalProvider>
          </ChakraProvider>
        </CacheProvider>
      </ThemeProvider>
    </SessionProvider>
  );
} 
