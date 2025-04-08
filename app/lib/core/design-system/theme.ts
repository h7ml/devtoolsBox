/**
 * 设计系统主题配置
 * 定义颜色、字体、间距等设计变量
 */

const theme = {
  /**
   * 颜色系统
   */
  colors: {
    // 主要颜色
    primary: {
      50: '#EDF5FF',
      100: '#D6E4FF',
      200: '#ADC8FF',
      300: '#85ABFF',
      400: '#5C8EFF',
      500: '#3370FF',
      600: '#1A56FF',
      700: '#0040FF',
      800: '#0035DB',
      900: '#002CB8'
    },
    
    // 次要颜色
    secondary: {
      50: '#F2F2F7',
      100: '#E5E5EA',
      200: '#D1D1D6',
      300: '#C7C7CC',
      400: '#AEAEB2',
      500: '#8E8E93',
      600: '#6E6E73',
      700: '#4D4D53',
      800: '#3A3A3C',
      900: '#1C1C1E'
    },
    
    // 成功颜色
    success: {
      50: '#EAFAF1',
      100: '#D4F5E2',
      200: '#A8EBC5',
      300: '#7DE0A8',
      400: '#52D68B',
      500: '#26CC6E',
      600: '#1BAF5B',
      700: '#159147',
      800: '#0E7434',
      900: '#065720'
    },
    
    // 警告颜色
    warning: {
      50: '#FFF9E6',
      100: '#FFF2CC',
      200: '#FFE699',
      300: '#FFD966',
      400: '#FFCD33',
      500: '#FFC000',
      600: '#E6AD00',
      700: '#CC9A00',
      800: '#B38600',
      900: '#9A7300'
    },
    
    // 错误颜色
    error: {
      50: '#FEE7E7',
      100: '#FECDCD',
      200: '#FD9B9B',
      300: '#FC6969',
      400: '#FB3737',
      500: '#FA0505',
      600: '#D40505',
      700: '#AD0404',
      800: '#870303',
      900: '#610202'
    },
    
    // 背景颜色
    background: {
      light: '#FFFFFF',
      dark: '#121212'
    },
    
    // 表面颜色
    surface: {
      light: '#F7F7F9',
      dark: '#1E1E1E'
    },
    
    // 文本颜色
    text: {
      primary: {
        light: '#1F1F1F',
        dark: '#FFFFFF'
      },
      secondary: {
        light: '#6E6E73',
        dark: '#A1A1A6'
      },
      disabled: {
        light: '#AEAEB2',
        dark: '#6E6E73'
      }
    },
    
    // 边框颜色
    border: {
      light: '#E5E5EA',
      dark: '#38383A'
    }
  },
  
  /**
   * 字体系统
   */
  typography: {
    // 字体族
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      mono: 'SFMono-Regular, Menlo, Monaco, Consolas, monospace'
    },
    
    // 字体大小
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
    },
    
    // 字体粗细
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    
    // 行高
    lineHeight: {
      none: 1,
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2
    }
  },
  
  /**
   * 间距系统
   */
  spacing: {
    0: '0',
    1: '0.25rem',    // 4px
    2: '0.5rem',     // 8px
    3: '0.75rem',    // 12px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    8: '2rem',       // 32px
    10: '2.5rem',    // 40px
    12: '3rem',      // 48px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
    32: '8rem',      // 128px
    40: '10rem',     // 160px
    48: '12rem',     // 192px
    56: '14rem',     // 224px
    64: '16rem',     // 256px
  },
  
  /**
   * 边框圆角
   */
  borderRadius: {
    none: '0',
    sm: '0.125rem',     // 2px
    DEFAULT: '0.25rem', // 4px
    md: '0.375rem',     // 6px
    lg: '0.5rem',       // 8px
    xl: '0.75rem',      // 12px
    '2xl': '1rem',      // 16px
    '3xl': '1.5rem',    // 24px
    full: '9999px'
  },
  
  /**
   * 阴影
   */
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },
  
  /**
   * 过渡动画
   */
  transitions: {
    DEFAULT: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    fast: '100ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    timing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    }
  },
  
  /**
   * 断点
   */
  breakpoints: {
    xs: '0px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  /**
   * z-index层级
   */
  zIndex: {
    0: 0,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50,
    auto: 'auto',
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    drawer: 1300,
    modal: 1400,
    popover: 1500,
    toast: 1600,
    tooltip: 1700,
  }
};

export default theme; 
 