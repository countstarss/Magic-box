/**
 * 根据标签名称确定徽章的样式变体
 * @param label 邮件标签
 * @returns 徽章的变体类型
 */
export function getBadgeVariantFromLabel(label: string): "default" | "secondary" | "destructive" | "outline" {
  label = label.toLowerCase();
  
  if (label === 'important' || label === 'urgent' || label === 'high-priority') {
    return "destructive";
  }
  
  if (label === 'social' || label === 'newsletter' || label === 'update' || label === 'promotion') {
    return "secondary";
  }
  
  if (label === 'personal' || label === 'work' || label === 'finance' || label === 'travel') {
    return "default";
  }
  
  // 所有其他标签使用outline变体
  return "outline";
} 