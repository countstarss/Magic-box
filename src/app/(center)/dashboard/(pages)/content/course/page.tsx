"use client"

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupClassList } from "./_components/group-class-list";

// MARK: - Course Management Page
export default function Course() {

  const [mounted, setMounted] = useState(false);

  // 确保组件完全挂载后再渲染
  useEffect(() => {
    setMounted(true);
    
    // 可选：添加一个小延迟来确保布局计算完成
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return null; // 或者返回一个加载状态
  }

  return (
    <div className="container px-0 md:px-4 pb-24 md:mx-auto mx-0  w-full h-full overflow-scroll">
      <div className="w-full mx-auto mb-8 ml-2 my-2">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          课程管理
        </h1>
        <p className="text-gray-600 text-sm dark:text-gray-200">
          管理所有类型的课程
        </p>
      </div>

      <Tabs defaultValue="regular" className="w-full">
        <TabsList>
          <TabsTrigger value="regular">常规课程</TabsTrigger>
          <TabsTrigger value="group">小班课程</TabsTrigger>
          <TabsTrigger value="one-on-one">一对一课程</TabsTrigger>
        </TabsList>

        <TabsContent value="group"
          //MARK: - Group Course
        >
          <GroupClassList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
