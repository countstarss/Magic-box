"use client";

import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { GmailNav } from "./gmail-nav";
import { GmailMailList } from "./gmail-mail-list";
import { GmailMailDisplay } from "./gmail-mail-display";
import { GmailAccount } from "./gmail-account";
import { cn } from "@/lib/utils";
import { EmailAccount } from "@/lib/types/nylas-types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useEmails, useEmailDetail, useRefreshEmails } from "@/hooks/use-mail-queries";

// 预设的已授权Gmail账户信息
const AUTHORIZED_ACCOUNT: EmailAccount = {
  id: "preset-account-id",
  grantId: "9c575cb5-9f41-45db-a5fd-02da4ea72514",
  email: "countstarrss404@gmail.com",
  name: "Count Starrss",
  provider: "gmail",
  organizationName: "",
  profilePicture: ""
};

interface GmailViewProps {
  defaultLayout: number[];
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  children?: React.ReactNode;
}

export function GmailView({
  defaultLayout = [16, 32, 48],
  defaultCollapsed = false,
  navCollapsedSize,
  children,
}: GmailViewProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [account] = useState<EmailAccount>(AUTHORIZED_ACCOUNT);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const router = useRouter();

  // 使用React Query获取邮件列表
  const { 
    data: emails = [], 
    isLoading: emailsLoading,
    error: emailsError
  } = useEmails({ 
    unread: filter === "unread"
  });

  // 使用React Query获取选中邮件的详情
  const { 
    data: selectedEmail, 
    isLoading: emailDetailLoading
  } = useEmailDetail(selectedEmailId);

  // 使用React Query的mutation来刷新邮件
  const { mutate: refreshEmails, isPending: refreshing } = useRefreshEmails();

  // 处理标签切换
  const handleTabChange = (value: string) => {
    setFilter(value as "all" | "unread");
  };

  // 刷新邮件列表
  const handleRefresh = () => {
    refreshEmails(undefined, {
      onSuccess: () => {
        toast({
          title: "邮件已刷新",
          description: "邮件列表已更新为最新数据"
        });
      },
      onError: (error) => {
        toast({
          title: "刷新失败",
          description: error instanceof Error ? error.message : "未知错误",
          variant: "destructive"
        });
      }
    });
  };

  // 处理邮件选择
  const handleEmailSelect = (emailId: string) => {
    setSelectedEmailId(emailId);
  };

  // 如果初始加载出错，显示错误提示
  if (emailsError) {
    toast({
      title: "加载邮件失败",
      description: emailsError instanceof Error ? emailsError.message : "未知错误",
      variant: "destructive"
    });
  }

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes) => {
          document.cookie = `react-resizable-panels:layout:gmail=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsible={true}
          minSize={8}
          maxSize={20}
          collapsedSize={navCollapsedSize}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=true`;
          }}
          onExpand={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=false`;
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <div className="flex h-[52px] items-center justify-center">
            <GmailAccount
              email={account.email}
              name={account.name}
              isCollapsed={isCollapsed}
            />
          </div>
          <Separator />
          <GmailNav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "收件箱",
                label: `${emails.filter(email => email.unread).length}`,
                icon: "inbox",
                variant: "default",
              },
              {
                title: "草稿箱",
                label: "2",
                icon: "file",
                variant: "ghost",
              },
              {
                title: "已发送",
                label: "",
                icon: "send",
                variant: "ghost",
              },
              {
                title: "垃圾邮件",
                label: "5",
                icon: "alertCircle",
                variant: "ghost",
              },
              {
                title: "已删除",
                label: "",
                icon: "trash",
                variant: "ghost",
              },
              {
                title: "存档",
                label: "",
                icon: "archive",
                variant: "ghost",
              },
            ]}
          />
          <Separator />
          <div className="p-2">
            {!isCollapsed && (
              <div className="text-xs font-medium text-muted-foreground">
                已通过API路由连接到Gmail
              </div>
            )}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={24}>
          <Tabs defaultValue="all" onValueChange={handleTabChange}>
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">收件箱</h1>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleRefresh} 
                disabled={refreshing}
                className="ml-2"
              >
                <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
                <span className="sr-only">刷新</span>
              </Button>
              <TabsList className="ml-auto">
                <TabsTrigger value="all" className="text-xs">
                  全部
                </TabsTrigger>
                <TabsTrigger value="unread" className="text-xs">
                  未读
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <TabsContent value="all" className="m-0">
              <GmailMailList
                emails={emails}
                onSelectEmail={handleEmailSelect}
                loading={emailsLoading || refreshing}
              />
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <GmailMailList
                emails={emails.filter(item => item.unread)}
                onSelectEmail={handleEmailSelect}
                loading={emailsLoading || refreshing}
              />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]}>
          <GmailMailDisplay
            email={selectedEmail || null}
            loading={emailDetailLoading}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
} 