import { extendTheme } from '@chakra-ui/react';

// 调整Chakra UI主题，使其与Tailwind兼容
const chakraTheme = extendTheme({
  styles: {
    global: {
      // 移除所有全局样式重置以防止与Tailwind冲突
      body: {
        fontFamily: 'inherit',
        color: 'inherit',
        bg: 'inherit',
        lineHeight: 'inherit',
      },
      '*': {
        borderColor: 'inherit',
      },
      '*::placeholder': {
        color: 'inherit',
      },
    },
  },
  fonts: {
    // 使用Tailwind已经设置的字体
    body: 'inherit',
    heading: 'inherit',
  },
  // 修改组件样式
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'md',
      },
    },
    // 其他组件样式...
  },
  // 保持默认配置
  config: {
    initialColorMode: 'system',
    useSystemColorMode: true,
  },
});

export default chakraTheme; 
