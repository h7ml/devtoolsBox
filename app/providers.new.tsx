'use client';

import { ThemeProvider } from 'next-themes';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import { ModalProvider } from './contexts/ModalContext';
import ModalManager from './components/modals/ModalManager';
import NavBar from './components/NavBar';

export function Providers({ children }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class">
        <CacheProvider>
          <ChakraProvider>
            <ModalProvider>
              <NavBar />
              <ModalManager />
              {children}
            </ModalProvider>
          </ChakraProvider>
        </CacheProvider>
      </ThemeProvider>
    </SessionProvider>
  );
} 
