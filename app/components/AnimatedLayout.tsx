import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import NavBar from './NavBar';

interface AnimatedLayoutProps {
  children: React.ReactNode;
}

/**
 * 动画布局组件
 * 为页面切换提供平滑的过渡动画
 */
const AnimatedLayout: React.FC<AnimatedLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            duration: 0.3,
            ease: [0.25, 0.1, 0.25, 1.0] 
          }}
          className="pt-16 pb-8"
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  );
};

export default AnimatedLayout;