"use client";

import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { GmailNav } from "./gmail-nav";
import { GmailMailList } from "./gmail-mail-list";
import { GmailMailDisplay } from "./gmail-mail-display";
import { GmailAccount } from "./gmail-account";
import { cn } from "@/lib/utils";
import { EmailAccount, EmailMessage } from "@/lib/types/nylas-types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// 硬编码API key和账户信息
const API_KEY = "nyk_v0_xeZH9pWZZxlRdL4GBLivGNYMKaAGduLzhJO1u91CTIU57bV0YDpFuqPnP7v7uRtp";
const API_URL = "https://api.us.nylas.com";
const GRANT_ID = "9c575cb5-9f41-45db-a5fd-02da4ea72514"; // 使用实际授权ID

// 预设的已授权Gmail账户信息
const AUTHORIZED_ACCOUNT: EmailAccount = {
  id: "preset-account-id",
  grantId: GRANT_ID,
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
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const router = useRouter();

  // 直接从API获取邮件
  const fetchEmails = async (showUnreadOnly = false) => {
    setRefreshing(true);
    setLoading(true);
    
    try {
      console.log("正在直接从API获取邮件...");
      
      // 构建查询参数
      const queryParams = new URLSearchParams({
        limit: "20",
        offset: "0",
      });
      
      if (showUnreadOnly) {
        queryParams.append("unread", "true");
      }
      
      // 直接调用Nylas API
      const response = await fetch(
        `${API_URL}/v3/grants/${GRANT_ID}/messages?${queryParams.toString()}`,
        {
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`API错误: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("成功获取邮件:", data.data?.length || 0);
      
      if (data.data && data.data.length > 0) {
        // 将API响应转换为EmailMessage格式
        const mappedEmails: EmailMessage[] = data.data.map((message: any) => ({
          id: message.id,
          subject: message.subject || "(无主题)",
          snippet: message.snippet || "",
          body: message.body,
          sender: {
            name: message.from?.[0]?.name || "未知",
            email: message.from?.[0]?.email || "unknown@email.com",
          },
          recipients: (message.to || []).map((to: any) => ({
            name: to.name || "未知",
            email: to.email || "",
          })),
          date: new Date(message.date * 1000),
          unread: message.unread || false,
          hasAttachments: !!message.attachments?.length,
          attachments: message.attachments?.map((att: any) => ({
            id: att.id,
            filename: att.filename,
            contentType: att.content_type,
            size: att.size,
            contentId: att.content_id,
          })),
        }));
        
        setEmails(mappedEmails);
        
        toast({
          title: "邮件加载成功",
          description: `已成功加载${mappedEmails.length}封邮件`
        });
      } else {
        console.log("API未返回邮件");
        setEmails([]);
        toast({
          title: "未找到邮件",
          description: "您的邮箱中没有符合条件的邮件"
        });
      }
    } catch (error) {
      console.error("加载邮件出错:", error);
      toast({
        title: "加载邮件失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
      
      // 如果API失败，设置空数组
      setEmails([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 直接从API获取邮件详情
  const fetchEmailDetail = async (emailId: string) => {
    setLoading(true);
    
    try {
      console.log(`正在直接从API获取邮件详情: ${emailId}`);
      
      const response = await fetch(
        `${API_URL}/v3/grants/${GRANT_ID}/messages/${emailId}`,
        {
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Accept": "application/json"
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`API错误: ${response.status} ${response.statusText}`);
      }
      
      const message = await response.json();
      
      // 将API响应转换为EmailMessage格式
      const emailData: EmailMessage = {
        id: message.id,
        subject: message.subject || "(无主题)",
        snippet: message.snippet || "",
        body: message.body,
        sender: {
          name: message.from?.[0]?.name || "未知",
          email: message.from?.[0]?.email || "unknown@email.com",
        },
        recipients: (message.to || []).map((to: any) => ({
          name: to.name || "未知",
          email: to.email || "",
        })),
        date: new Date(message.date * 1000),
        unread: message.unread || false,
        hasAttachments: !!message.attachments?.length,
        attachments: message.attachments?.map((att: any) => ({
          id: att.id,
          filename: att.filename,
          contentType: att.content_type,
          size: att.size,
          contentId: att.content_id,
        })),
      };
      
      setSelectedEmail(emailData);
    } catch (error) {
      console.error("获取邮件详情出错:", error);
      toast({
        title: "加载邮件详情失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
      
      setSelectedEmail(null);
    } finally {
      setLoading(false);
    }
  };

  // 初始化和过滤器变更时加载邮件
  useEffect(() => {
    fetchEmails(filter === "unread");
  }, [filter]);

  // 处理标签切换
  const handleTabChange = (value: string) => {
    setFilter(value as "all" | "unread");
  };

  // 刷新邮件列表
  const handleRefresh = async () => {
    await fetchEmails(filter === "unread");
  };

  // 处理邮件选择
  const handleEmailSelect = async (emailId: string) => {
    await fetchEmailDetail(emailId);
  };

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
                已直接连接到Gmail API
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
                loading={loading || refreshing}
              />
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <GmailMailList
                emails={emails.filter(item => item.unread)}
                onSelectEmail={handleEmailSelect}
                loading={loading || refreshing}
              />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]}>
          <GmailMailDisplay
            email={selectedEmail}
            loading={loading}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
} 