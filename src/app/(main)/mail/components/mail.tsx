'use client';

import * as React from "react"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { TooltipProvider } from "@/components/ui/tooltip"
import Nav from "./nav"
import { Button } from "@/components/ui/button"
import { PanelLeft, PanelLeftClose } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useResizableSidebar } from "@/hooks/use-resizable-sidebar"
import { useMail } from "@/hooks/use-mail"
import { EmailMessage, EmailAccount } from "@/lib/types/nylas-types"

interface MailProps {
  accounts: {
    name: string
    email: string
    icon: React.ReactNode
  }[]
  defaultLayout: number[] | undefined
  defaultCollapsed?: boolean
  navCollapsedSize: number
  children: React.ReactNode
  initialEmails?: EmailMessage[] // 从服务器端获取的初始邮件列表
  accountInfo?: EmailAccount | null // 从服务器端获取的账户信息
}

export function Mail({
  accounts,
  defaultLayout = [16, 32, 48],
  defaultCollapsed = false,
  navCollapsedSize,
  children,
  initialEmails,
  accountInfo
}: MailProps) {
  // 使用mail hook获取邮件状态和方法
  const { config } = useMail();
  
  // 初始化mail hook的数据
  React.useEffect(() => {
    if (initialEmails && initialEmails.length > 0) {
      // 这里可以添加将初始邮件数据加载到全局状态的逻辑
      console.log('使用服务端提供的初始邮件数据:', initialEmails.length);
    }
    
    if (accountInfo) {
      // 这里可以添加将账户信息加载到全局状态的逻辑
      console.log('使用服务端提供的账户信息:', accountInfo.email);
    }
  }, [initialEmails, accountInfo]);
  
  // 使用自定义Hook管理侧边栏和布局
  const {
    isCollapsed,
    onLayoutChange,
    onCollapse,
    toggleSidebar,
    panelGroupRef,
    sizes
  } = useResizableSidebar({
    defaultLayout,
    defaultCollapsed,
    navCollapsedSize,
  });

  return (
    <TooltipProvider delayDuration={0}>
      {/* 
      //MARK: Panel
      */}
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={onLayoutChange}
        className="h-full items-stretch"
        id="mail-layout"
        ref={panelGroupRef}
      >
        <Nav
          accounts={accounts}
          mails={config.mails}
          defaultLayout={defaultLayout}
          defaultCollapsed={isCollapsed}
          navCollapsedSize={navCollapsedSize}
          onCollapsedChange={onCollapse}
          accountInfo={accountInfo}
        />
        <ResizableHandle withHandle />
        <ResizablePanel 
          defaultSize={defaultLayout[1]}
          minSize={30}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-2 border-b">
              <div>
                {isCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 mr-2"
                        onClick={toggleSidebar}
                      >
                        <PanelLeft className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Show sidebar
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onCollapse(true)}
                  >
                    <PanelLeftClose className="h-4 w-4" />
                  </Button>
                )
                }
              </div>
              
            </div>
            <div className="flex-1 overflow-hidden">
              {children}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
