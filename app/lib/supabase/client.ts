'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './types';

// 创建Supabase客户端（前端）
export const createClient = () => {
  return createClientComponentClient<Database>();
}; 
