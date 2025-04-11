import React from 'react'
import Profile from './_components/profile';
import { prisma } from '@/lib/prisma';


const SettingPage = async () => {
  // TODO: AUTH -使用userProvider，把当前的用户放到全局里买呢
  // const authUser = await currentUser();
  // if(!authUser) return null;

  // TODO: 获取当前用户
  // MARK: 数据库-当前用户
  // const authUser = await getUser()
  // if (!authUser) return null
      
  // const user = await prisma.user.findUnique({
  //   where: {
  //     id: authUser.id
  //   }
  // })

  // TODO: 布局修改为所有内容纵向排列，可以一直往下滑，左侧显示大纲，根据滑动位置显示大纲的选中状态，点击大纲的标题，滑动到对应位置

  return (
    <div className="p-3 md:p-6 space-y-3 h-full overflow-scroll mb-[300px]">
      <Profile />
    </div>
  )
}

export default SettingPage;