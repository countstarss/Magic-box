// 模板类型定义
export interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  isFeatured: boolean;
  isStarred: boolean;
  lastModified: string;
}

// 类别数据
export const templateCategories = [
  "全部",
  "通讯",
  "推广活动",
  "产品发布",
  "事件邀请",
  "欢迎邮件",
  "公告",
  "促销活动",
  "调查问卷",
  "个人博客",
];

// 模板数据
export const templates: Template[] = [
  {
    id: 1,
    name: "极简周报通讯",
    description: "简洁现代的周报模板，适合发送内容摘要和重要更新",
    category: "通讯",
    thumbnail: "/templates/newsletter-minimal.jpg",
    isFeatured: true,
    isStarred: true,
    lastModified: "2023-09-15T10:30:00Z",
  },
  {
    id: 2,
    name: "产品发布公告",
    description: "突出展示新产品特性和优势的专业模板",
    category: "产品发布",
    thumbnail: "/templates/product-launch.jpg",
    isFeatured: true,
    isStarred: false,
    lastModified: "2023-08-22T14:45:00Z",
  },
  {
    id: 3,
    name: "限时促销活动",
    description: "醒目的促销模板，带有倒计时和清晰的号召性按钮",
    category: "促销活动",
    thumbnail: "/templates/promotion.jpg",
    isFeatured: false,
    isStarred: true,
    lastModified: "2023-07-10T08:15:00Z",
  },
  {
    id: 4,
    name: "欢迎新订阅者",
    description: "温馨友好的欢迎邮件，介绍您的品牌和预期内容",
    category: "欢迎邮件",
    thumbnail: "/templates/welcome.jpg",
    isFeatured: false,
    isStarred: false,
    lastModified: "2023-06-05T16:20:00Z",
  },
  {
    id: 5,
    name: "内容创作者简报",
    description: "专为博主和内容创作者设计的个性化通讯模板",
    category: "个人博客",
    thumbnail: "/templates/content-creator.jpg",
    isFeatured: true,
    isStarred: false,
    lastModified: "2023-09-01T11:00:00Z",
  },
  {
    id: 6,
    name: "数据驱动报告",
    description: "清晰展示统计数据和图表的专业报告模板",
    category: "通讯",
    thumbnail: "/templates/data-report.jpg",
    isFeatured: false,
    isStarred: false,
    lastModified: "2023-08-15T09:45:00Z",
  },
  {
    id: 7,
    name: "活动邀请函",
    description: "精美的活动邀请模板，带有日期、地点和RSVP按钮",
    category: "事件邀请",
    thumbnail: "/templates/event-invitation.jpg",
    isFeatured: true,
    isStarred: true,
    lastModified: "2023-08-30T15:30:00Z",
  },
  {
    id: 8,
    name: "客户满意度调查",
    description: "友好的反馈请求邮件，带有简洁的调查链接",
    category: "调查问卷",
    thumbnail: "/templates/survey.jpg",
    isFeatured: false,
    isStarred: false,
    lastModified: "2023-07-25T13:10:00Z",
  },
];

// 临时替代实际缺失的图片
export const placeholderImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' text-anchor='middle' dominant-baseline='middle' fill='%23888888'%3E邮件模板缩略图%3C/text%3E%3C/svg%3E";

// 日期格式化辅助函数
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
