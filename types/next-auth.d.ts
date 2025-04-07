import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * 扩展Session接口，添加自定义字段
   */
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
} 
