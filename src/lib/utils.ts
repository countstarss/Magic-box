import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 获取姓名的首字母缩写
 * @param name 完整姓名
 * @returns 首字母缩写（最多两个字母）
 */
export function getInitials(name: string): string {
  if (!name) return "";
  
  const parts = name.trim().split(/\s+/);
  
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  // 取第一个和最后一个单词的首字母
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
