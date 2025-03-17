import React from 'react';
import { 
  Tag, Archive, Users2, AlertCircle, MessagesSquare, 
  ShoppingCart, Star, Heart, Flag, Clock, Bookmark,
  Book, Code, Coffee, FileText, Gift, Globe, Home,
  Image, Link, Mail, Map, Mic, Music, Package, Phone,
  Settings, Video, Zap, Award
} from 'lucide-react';

interface IconByNameProps {
  name: string;
  className?: string;
}

// 创建图标映射
const iconMap: Record<string, React.ComponentType<{className?: string}>> = {
  Tag,
  Archive,
  Users2,
  AlertCircle,
  MessagesSquare,
  ShoppingCart,
  Star,
  Heart,
  Flag,
  Clock,
  Bookmark,
  Book,
  Code,
  Coffee,
  FileText,
  Gift,
  Globe,
  Home,
  Image,
  Link,
  Mail,
  Map,
  Mic,
  Music,
  Package,
  Phone,
  Settings,
  Video,
  Zap,
  Award
};

export const IconByName: React.FC<IconByNameProps> = ({ name, className }) => {
  // 从图标映射中获取图标
  const IconComponent = iconMap[name];
  
  // 如果找到匹配的图标，则渲染它
  if (IconComponent) {
    return <IconComponent className={className} />;
  }
  
  // 默认fallback为标签图标
  return <Tag className={className} />;
}; 