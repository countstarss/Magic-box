"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import ScrollSidebarItem from "@/components/global/ScrollSidebarItem";
import { 
  UserCircle, Key, BarChart3, Users, UserPlus, HelpCircle 
} from "lucide-react";

// 导入拆分后的各个部分组件
import {
  ProfileSection,
  AccountSection,
  UsageSection,
  TeamSection,
  InviteSection,
  HelpSection
} from "./sections";

// 定义设置项
interface SettingSection {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const sections: SettingSection[] = [
  { id: "profile", title: "个人信息", icon: <UserCircle className="mr-2 h-5 w-5" /> },
  { id: "account", title: "账户设置", icon: <Key className="mr-2 h-5 w-5" /> },
  { id: "usage", title: "使用情况", icon: <BarChart3 className="mr-2 h-5 w-5" /> },
  { id: "team", title: "团队管理", icon: <Users className="mr-2 h-5 w-5" /> },
  { id: "invite", title: "邀请成员", icon: <UserPlus className="mr-2 h-5 w-5" /> },
  { id: "help", title: "帮助中心", icon: <HelpCircle className="mr-2 h-5 w-5" /> },
];

const ScrollSettings = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const sectionsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const contentRef = useRef<HTMLDivElement>(null);

  // 处理侧边栏项点击
  const handleSidebarItemClick = (href: string) => {
    const id = href.replace("#", "");
    const element = sectionsRef.current[id];
    const container = contentRef.current;
    
    if (element && container) {
      // 获取元素相对于容器的偏移量
      const eleTop = element.offsetTop;
      // 计算容器的滚动位置
      container.scrollTo({
        top: eleTop - 16, // 添加一些顶部边距
        behavior: 'smooth'
      });
    }
  };

  // 设置ref的回调函数
  const setSectionRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    if (el) {
      sectionsRef.current[id] = el;
    }
  }, []);

  // 处理滚动事件
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      const scrollPosition = container.scrollTop + 80; // 添加一点偏移

      // 找到当前滚动位置最接近的部分
      for (const id of Object.keys(sectionsRef.current)) {
        const section = sectionsRef.current[id];
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;

          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    // 添加滚动事件监听到内容容器
    container.addEventListener("scroll", handleScroll, { passive: true });
    
    // 初始运行一次确保初始状态正确
    handleScroll();

    return () => {
      // 清理事件监听
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex h-full">
      {/* 固定侧边栏 */}
      <div className="w-52 border-r border-gray-200 dark:border-gray-800 flex-shrink-0 py-4 h-full">
        <nav className="space-y-1 px-3 sticky top-4">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 pl-3">
            设置选项
          </h3>
          {sections.map((section) => (
            <ScrollSidebarItem
              key={section.id}
              title={section.title}
              href={`#${section.id}`}
              active={activeSection === section.id}
              onClick={handleSidebarItemClick}
            />
          ))}
        </nav>
      </div>

      {/* 可滚动内容区域 */}
      <div 
        ref={contentRef}
        className="flex-1 p-8 pt-16 overflow-y-auto h-screen"
      >
        {/* 使用拆分后的各个部分组件 */}
        <ProfileSection setRef={setSectionRef} />
        <AccountSection setRef={setSectionRef} />
        <UsageSection setRef={setSectionRef} />
        <TeamSection setRef={setSectionRef} />
        <InviteSection setRef={setSectionRef} />
        <HelpSection setRef={setSectionRef} />
      </div>
    </div>
  );
};

export default ScrollSettings; 