'use client';

import * as React from "react"
import {
  Search,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useMail } from "@/hooks/use-mail"
import { MailDisplay } from "./mail-display"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { getBadgeVariantFromLabel } from "./badgeHighlight"
import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { useEmails, useEmailDetail, useMarkEmailAsRead } from "@/hooks/use-mail-queries"
import { EmailMessage } from "@/lib/types/nylas-types"
import { useAtom } from "jotai"
import { mailStateAtom, persistedMailStateAtom, selectedMailAtom, initializeMailState } from "@/lib/mail-state"

interface MailListProps {
  defaultLayout?: number[]
  children?: React.ReactNode
  layoutDirection?: "horizontal" | "vertical"
  isVerticalLayout?: boolean
}

const MailScroll: React.FC<MailListProps> = ({
  defaultLayout = [20, 32, 48],
  layoutDirection = "horizontal",
  isVerticalLayout = false
}) => {
  const { currentFolder } = useMail();
  const pathname = usePathname();
  
  // 使用全局状态
  const [mailState, setMailState] = useAtom(persistedMailStateAtom);
  const [selectedMail, setSelectedMail] = useAtom(selectedMailAtom);
  
  // 从localStorage初始化状态 - 只在组件首次挂载时执行一次
  React.useEffect(() => {
    initializeMailState(setMailState);
  }, [setMailState]);
  
  // 使用React Query缓存获取邮件列表 - 使用memo避免重复创建配置对象
  const emailQueryOptions = React.useMemo(() => ({ 
    limit: 50, 
    unread: false 
  }), []);
  
  // 获取邮件列表
  const { data: emails = [], isLoading } = useEmails(emailQueryOptions);
  
  // 创建一个函数来从邮件列表中查找选定的邮件
  const findEmailInList = React.useCallback((id: string | null) => {
    if (!id) return null;
    return emails.find(email => email.id === id) || null;
  }, [emails]);

  // 获取选中邮件的详情 - 先尝试从列表中获取，如果不存在再使用API
  const foundEmail = React.useMemo(() => 
    findEmailInList(mailState.selectedId), 
    [findEmailInList, mailState.selectedId]
  );
  
  // 只有当本地找不到完整邮件信息时才使用API请求
  const shouldFetchDetail = React.useMemo(() => 
    !!mailState.selectedId && (!foundEmail || !foundEmail.body),
    [mailState.selectedId, foundEmail]
  );
  
  // 使用memo避免不必要的请求
  const emailDetailQueryKey = React.useMemo(() => 
    shouldFetchDetail ? mailState.selectedId : null,
    [shouldFetchDetail, mailState.selectedId]
  );
  
  // 只有在必要时才从API获取邮件详情
  const { data: selectedEmailDetail } = useEmailDetail(emailDetailQueryKey);
  
  // 合并本地邮件和API获取的邮件详情
  const currentEmail = React.useMemo(() => {
    // 优先使用已有的选中邮件
    if (selectedMail && selectedMail.id === mailState.selectedId) {
      return selectedMail;
    }
    
    // 其次使用本地邮件列表中的邮件
    if (foundEmail) {
      return foundEmail;
    }
    
    // 最后使用API获取的邮件详情
    return selectedEmailDetail || null;
  }, [selectedMail, foundEmail, selectedEmailDetail, mailState.selectedId]);
  
  // 已读标记功能
  const markEmailAsRead = useMarkEmailAsRead();
  
  // 确定布局方向
  const direction = layoutDirection === "vertical" || isVerticalLayout ? "vertical" : "horizontal";

  // 使用useCallback减少不必要的函数重建
  const handleMailClick = React.useCallback((mailId: string) => {
    // 如果已经选中了同一个邮件，不要重新设置
    if (mailState.selectedId === mailId) return;
    
    // 更新选中的邮件ID到全局状态
    setMailState({ selectedId: mailId });
    
    // 在邮件列表中查找该邮件并更新全局选中邮件状态
    const email = emails.find(email => email.id === mailId);
    if (email) {
      setSelectedMail(email);
    }
    
    // 如果邮件未读，标记为已读
    const emailToMark = emails.find(mail => mail.id === mailId);
    if (emailToMark && emailToMark.unread) {
      markEmailAsRead.mutate(mailId);
    }
  }, [emails, mailState.selectedId, markEmailAsRead, setMailState, setSelectedMail]);

  // 为每个选项卡创建过滤后的邮件列表 - 使用useMemo缓存结果
  const filteredMailLists = React.useMemo(() => {
    const allMails = emails;
    const unreadMails = emails.filter(mail => mail.unread);
    const importantMails = emails.filter(mail => mail.labels?.includes('important') || mail.labels?.includes('重要'));
    return { allMails, unreadMails, importantMails };
  }, [emails]);

  // 自动选择第一封邮件（如果没有选中的邮件且有邮件列表）- 只在emails变化或初始化时执行
  React.useEffect(() => {
    if (filteredMailLists.allMails.length > 0 && !mailState.selectedId) {
      handleMailClick(filteredMailLists.allMails[0].id);
    }
  }, [filteredMailLists.allMails, mailState.selectedId, handleMailClick]);

  // 当邮件详情加载完成后，更新全局选中邮件 - 使用依赖数组更精确地控制执行
  React.useEffect(() => {
    if (currentEmail && (!selectedMail || selectedMail.id !== currentEmail.id)) {
      setSelectedMail(currentEmail);
    }
  }, [currentEmail, selectedMail, setSelectedMail]);

  // 渲染邮件列表的辅助函数 - 使用memo减少重新渲染
  const renderMailList = React.useCallback((mailsToRender: EmailMessage[]) => (
    <div className="flex flex-col gap-2 p-4 pt-0">
      <AnimatePresence initial={false}>
        {mailsToRender.map((item) => (
          <motion.button
            key={item.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              mailState.selectedId === item.id && "bg-muted"
            )}
            onClick={() => handleMailClick(item.id)}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{item.sender.name}</div>
                  {item.unread && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <div
                  className={cn(
                    "ml-auto text-xs",
                    mailState.selectedId === item.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {formatDistanceToNow(new Date(item.date), {
                    addSuffix: true,
                  })}
                </div>
              </div>
              <div className="text-xs font-medium">{item.subject}</div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {item.snippet}
            </div>
            {item.labels && item.labels.length > 0 ? (
              <div className="flex items-center gap-2">
                {item.labels.map((label) => (
                  <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  ), [handleMailClick, mailState.selectedId]);

  // 计算滚动区域的高度
  const scrollHeight = direction === "vertical" 
    ? "h-[calc(50vh-8rem)]" // 垂直布局时，限制高度为视口高度的一半减去头部空间
    : "h-[calc(100vh-10rem)]"; // 水平布局时，使用全部可用高度减去头部空间

  // 获取当前文件夹的标题（首字母大写）
  const folderTitle = mailState.currentFolder.charAt(0).toUpperCase() + mailState.currentFolder.slice(1);

  // 使用 React.memo 优化渲染
  const MailListPanel = React.useMemo(() => (
    <Tabs defaultValue="all">
      <div className="flex items-center px-4 py-2">
        <h1 className="text-xl font-bold capitalize">{folderTitle}</h1>
        <TabsList className="ml-auto">
          <TabsTrigger value="all">All mail</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="important">Important</TabsTrigger>
        </TabsList>
      </div>
      <Separator />
      <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-8" />
          </div>
        </form>
      </div>
      <TabsContent value="all" className="m-0">
        <ScrollArea className={scrollHeight}>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-muted-foreground">Loading emails...</p>
            </div>
          ) : filteredMailLists.allMails.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-muted-foreground">No emails found</p>
            </div>
          ) : (
            renderMailList(filteredMailLists.allMails)
          )}
        </ScrollArea>
      </TabsContent>
      <TabsContent value="unread" className="m-0">
        <ScrollArea className={scrollHeight}>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-muted-foreground">Loading emails...</p>
            </div>
          ) : filteredMailLists.unreadMails.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-muted-foreground">No unread emails</p>
            </div>
          ) : (
            renderMailList(filteredMailLists.unreadMails)
          )}
        </ScrollArea>
      </TabsContent>
      <TabsContent value="important" className="m-0">
        <ScrollArea className={scrollHeight}>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-muted-foreground">Loading emails...</p>
            </div>
          ) : filteredMailLists.importantMails.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-muted-foreground">No important emails</p>
            </div>
          ) : (
            renderMailList(filteredMailLists.importantMails)
          )}
        </ScrollArea>
      </TabsContent>
    </Tabs>
  ), [folderTitle, isLoading, renderMailList, scrollHeight, filteredMailLists]);

  // 邮件显示面板 - 使用memo缓存
  const MailDisplayPanel = React.useMemo(() => (
    <MailDisplay
      mail={currentEmail}
    />
  ), [currentEmail]);

  return (
    <ResizablePanelGroup
      direction={direction}
      className="h-full"
    >
      <ResizablePanel defaultSize={direction === "vertical" ? 50 : 40} minSize={30}>
        {MailListPanel}
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={direction === "vertical" ? 50 : 60} minSize={30}>
        {MailDisplayPanel}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default React.memo(MailScroll);