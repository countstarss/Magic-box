import { Metadata } from "next";
import { checkAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Gmail - Mail Box",
  description: "Gmail integration for Mail Box application",
};

export default async function GmailPage() {
  // 检查是否已登录
  const user = await checkAuth();
  
  if (!user) {
    // 如果未登录，重定向到登录页面
    redirect("/auth");
  }
  
  return (
    <div className="flex-1 h-full">
      {/* 页面内容在layout.tsx中的GmailView组件中处理 */}
    </div>
  );
} 