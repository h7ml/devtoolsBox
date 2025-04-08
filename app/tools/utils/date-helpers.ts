/**
 * 日期处理工具函数
 */

/**
 * 格式化日期
 * @param date 日期对象或时间戳
 * @param format 格式字符串，支持：YYYY, MM, DD, HH, mm, ss
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  date: Date | number | string,
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string {
  try {
    const d = date instanceof Date ? date : new Date(date);
    
    if (isNaN(d.getTime())) {
      throw new Error('无效的日期');
    }
    
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const seconds = d.getSeconds();
    
    return format
      .replace('YYYY', year.toString())
      .replace('MM', month.toString().padStart(2, '0'))
      .replace('DD', day.toString().padStart(2, '0'))
      .replace('HH', hours.toString().padStart(2, '0'))
      .replace('mm', minutes.toString().padStart(2, '0'))
      .replace('ss', seconds.toString().padStart(2, '0'));
  } catch (e) {
    console.error('日期格式化失败:', e);
    return '';
  }
}

/**
 * 获取当前的Unix时间戳（秒）
 * @returns Unix时间戳（秒）
 */
export function getCurrentUnixTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * 时间戳转日期对象
 * @param timestamp Unix时间戳（秒）或毫秒时间戳
 * @returns 日期对象
 */
export function timestampToDate(timestamp: number): Date {
  // 如果时间戳长度为10位（秒），转换为毫秒
  if (timestamp.toString().length === 10) {
    timestamp *= 1000;
  }
  return new Date(timestamp);
}

/**
 * 计算两个日期之间的差值
 * @param date1 第一个日期
 * @param date2 第二个日期
 * @returns 包含差值的对象
 */
export function dateDiff(
  date1: Date | number | string,
  date2: Date | number | string = new Date()
): {
  milliseconds: number;
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
} {
  try {
    const d1 = date1 instanceof Date ? date1 : new Date(date1);
    const d2 = date2 instanceof Date ? date2 : new Date(date2);
    
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      throw new Error('无效的日期');
    }
    
    const milliseconds = Math.abs(d2.getTime() - d1.getTime());
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    return {
      milliseconds,
      seconds,
      minutes,
      hours,
      days
    };
  } catch (e) {
    console.error('计算日期差值失败:', e);
    return {
      milliseconds: 0,
      seconds: 0,
      minutes: 0,
      hours: 0,
      days: 0
    };
  }
}

/**
 * 获取相对时间描述
 * @param date 日期
 * @param now 当前日期（默认为当前时间）
 * @returns 相对时间描述
 */
export function getRelativeTimeDescription(
  date: Date | number | string,
  now: Date | number | string = new Date()
): string {
  try {
    const d = date instanceof Date ? date : new Date(date);
    const n = now instanceof Date ? now : new Date(now);
    
    if (isNaN(d.getTime()) || isNaN(n.getTime())) {
      throw new Error('无效的日期');
    }
    
    const diff = dateDiff(d, n);
    const isFuture = d.getTime() > n.getTime();
    
    if (diff.days > 365) {
      const years = Math.floor(diff.days / 365);
      return isFuture ? `${years}年后` : `${years}年前`;
    }
    
    if (diff.days > 30) {
      const months = Math.floor(diff.days / 30);
      return isFuture ? `${months}个月后` : `${months}个月前`;
    }
    
    if (diff.days > 0) {
      return isFuture ? `${diff.days}天后` : `${diff.days}天前`;
    }
    
    if (diff.hours > 0) {
      return isFuture ? `${diff.hours}小时后` : `${diff.hours}小时前`;
    }
    
    if (diff.minutes > 0) {
      return isFuture ? `${diff.minutes}分钟后` : `${diff.minutes}分钟前`;
    }
    
    return isFuture ? '即将到来' : '刚刚';
  } catch (e) {
    console.error('获取相对时间描述失败:', e);
    return '';
  }
} 
