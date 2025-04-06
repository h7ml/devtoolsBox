import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * 页面过渡动画组件
 * 为页面内容添加平滑的过渡动画
 */
const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ 
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1.0], // 使用easeInOutQuart曲线提供优雅的过渡
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;