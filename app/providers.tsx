'use client';

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { ThemeProvider } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import chakraTheme from './chakra-theme';
import { ModalProvider } from './contexts/ModalContext';
import ModalManager from './components/modals/ModalManager';

export function Providers({ children }: { children: React.ReactNode }) {
  // 添加客户端水合检测
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 在客户端水合完成前不渲染内容，防止闪烁和水合不匹配
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <>
      <ColorModeScript initialColorMode={chakraTheme.config.initialColorMode} />
      <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ChakraProvider theme={chakraTheme} resetCSS={false}>
            <ModalProvider>
              <ModalManager />
              {children}
            </ModalProvider>
          </ChakraProvider>
        </ThemeProvider>
      </SessionProvider>
    </>
  );
} 
