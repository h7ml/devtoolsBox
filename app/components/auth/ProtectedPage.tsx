'use client';

import { useSession, SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedPageProps {
  children: React.ReactNode;
}

// 主要导出组件
export default function ProtectedPage({ children }: ProtectedPageProps) {
  return (
    <SessionProvider>
      <ProtectedPageContent>{children}</ProtectedPageContent>
    </SessionProvider>
  );
}

// 内部组件
function ProtectedPageContent({ children }: ProtectedPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.href));
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (status === 'authenticated') {
    return <>{children}</>;
  }

  // 返回null，重定向会在useEffect中处理
  return null;
} 
