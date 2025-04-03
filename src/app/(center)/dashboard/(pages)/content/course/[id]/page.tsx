import React from 'react';

interface CourseDetailProps {
  // You can define any props needed here
  params: {
    id: string;
  }
}

// NOTE: 用于教师以及管理员查看课程的详细信息，展示所有的章节
// TODO: 需要添加权限控制，只有教师以及管理员有编辑的权限（按钮）
// 这里需要获取到course的id，然后根据id获取到course的详细信息

const CourseDetail = ({ params }: CourseDetailProps) => {
  

  return (
    <div className="container px-4 pb-24 mx-auto w-full">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Course Detail: {params.id}</h1>
    </div>
  );
};

export default CourseDetail;