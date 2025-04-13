import * as React from "react";
import { cookies } from "next/headers";
import MailScroll from "./components/MailScroll";
import { mailService } from "@/lib/mail";

export default async function MailPage() {
  const cookieService = await cookies();
  const layout = cookieService.get("react-resizable-panels:layout:mail");
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  // 从服务器端获取初始邮件数据
  const initialEmails = await mailService.getEmails({ 
    limit: 50,
    offset: 0,
    unread: false
  });

  // 获取当前账户信息
  const account = await mailService.getAccount();

  return (
    <>
      <MailScroll 
        defaultLayout={defaultLayout} 
        initialEmails={initialEmails}
        accountInfo={account}
      />
    </>
  );
}
