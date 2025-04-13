// 模板类型定义
export interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  isFeatured: boolean;
  isStarred: boolean;
  isPublic: boolean;
  lastModified: string;
  htmlContent?: string; // 可选属性，用于存储模板的HTML内容
}

// 临时替代实际缺失的图片
export const placeholderImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' text-anchor='middle' dominant-baseline='middle' fill='%23888888'%3E邮件模板缩略图%3C/text%3E%3C/svg%3E";

// 日期格式化辅助函数
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
