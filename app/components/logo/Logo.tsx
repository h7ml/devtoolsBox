'use client';

import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  width = 40, 
  height = 40, 
  className = '' 
}) => {
  return (
    <svg 
      width={width} 
      height={height}
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 工具箱外壳 */}
      <rect 
        x="30" 
        y="60" 
        width="140" 
        height="110" 
        rx="10" 
        fill="url(#toolbox-gradient)" 
        stroke="currentColor" 
        strokeWidth="6"
      />
      
      {/* 工具箱把手 */}
      <path 
        d="M70 60 V40 H130 V60" 
        stroke="currentColor" 
        strokeWidth="6" 
        strokeLinecap="round"
      />
      
      {/* 工具箱横线 */}
      <line 
        x1="30" 
        y1="90" 
        x2="170" 
        y2="90" 
        stroke="currentColor" 
        strokeWidth="4" 
        strokeLinecap="round"
      />
      
      {/* 代码符号 < > */}
      <path 
        d="M60 120 L40 140 L60 160" 
        stroke="white" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M140 120 L160 140 L140 160" 
        stroke="white" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* 扳手图标 */}
      <path 
        d="M100 110 L110 130 L90 150" 
        stroke="white" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* 渐变定义 */}
      <defs>
        <linearGradient 
          id="toolbox-gradient" 
          x1="30" 
          y1="60" 
          x2="170" 
          y2="170" 
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#FF5733" />
          <stop offset="1" stopColor="#FF8C33" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo; 