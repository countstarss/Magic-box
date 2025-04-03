"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // 引入路由钩子
import Dashboard from "./_components/dashboard";
import Loading from "@/components/global/Loading";
import ContextMenuWrapper from "@/components/ui/ContextMenuWrapper";

function DashboardPage() {
  // const { data: session, status } = useSession();
  const router = useRouter();

  // 当用户未登录时，自动跳转到登录页
  // useEffect(() => {
  //   if (status === "unauthenticated") {
  //     router.push("/login");
  //   }
  // }, [status, router]);

  // if (status === "loading") {
  //   return (
  //     <Loading />
  //   ); // 会话加载状态
  // }

  // if (!session?.user?.id) {
  //   return null; // 防止未获取到 session 数据时渲染
  // }

  return (
    <ContextMenuWrapper>
      <Dashboard
        // userId={session.user.id} // 从 session 中获取 userId
      />
    </ContextMenuWrapper>
  );
}

export default DashboardPage;

