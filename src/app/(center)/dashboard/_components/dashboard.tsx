'use client';
import React from 'react';
import ContentCourseCard from './content-course';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';

interface DashboardProps {
  // You can define any props needed here
  userId?: string;
}

const Dashboard = ({
  userId
}: DashboardProps) => {
  const router = useRouter();
  // 流程： 
  // 注册 -> 登录 -> 完成onboarding设置 -> 进入dashboard
  // 第三方登陆   -> 完成onboarding设置 -> 进入dashboard

  const courseInfo = {
    id: '1',
    title: 'Course 1',
    smallSummary: 'This is a small summary of the course',
    price: 100,
    uploadedAt: new Date(),
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    imageUrl: 'https://vjpvvrlxkmldrqfmnnni.supabase.co/storage/v1/object/public/course-cover/better.png',
  };


  // 这里我觉得让大家自由选择一些配置更好，至少是选择自己放哪些项目
  return (
    <div className="flex flex-col border-b border-neutral-400">
      <div className="flex flex-row">
        <Tabs 
          defaultValue="courses" 
          className='select-none h-[64px] border-3 border-neutral-900 w-full'
          //MARK: tabs
        >
          <TabsList className='h-16 text-xl items-center bg-transparent'>
            <TabsTrigger value="courses" className='h-3/4 py-auto text-base rounded-full'>Courses</TabsTrigger>
            <TabsTrigger value="teachers" className='h-3/4 py-auto text-base rounded-full'>Teachers</TabsTrigger>
            <div className='flex-row hidden lg:flex'>
              <TabsTrigger value="courses1" className='h-3/4 py-auto text-base rounded-full'>Courses1</TabsTrigger>
              <TabsTrigger value="teachers1" className='h-3/4 py-auto text-base rounded-full'>Teachers1</TabsTrigger>
            </div>
          </TabsList>
          <TabsContent value="courses"
            //MARK: courses
          >
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6 h-[calc(100vh-140px)] overflow-y-scroll">
              {
                Array.from({ length: 12 }, (_, index) => (
                  <ContentCourseCard
                    courseInfo={courseInfo}
                    key={index}
                  />
                ))
              }
            </div>
          </TabsContent>
          <TabsContent value="teachers"
            //MARK: teachers
          >
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6 h-[calc(100vh-140px)] overflow-y-scroll">
              {
                Array.from({ length: 12 }, (_, index) => (
                  <ContentCourseCard
                    courseInfo={courseInfo}
                    key={index}
                  />
                ))
              }
            </div>
          </TabsContent>
        </Tabs>
      </div>

    </div >
  );
};

export default Dashboard; 