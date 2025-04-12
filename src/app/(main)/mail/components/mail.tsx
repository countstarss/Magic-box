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
import { useEmails } from "@/hooks/use-mail-queries"

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
}

export function Mail({
  accounts,
  defaultLayout = [16, 32, 48],
  defaultCollapsed = false,
  navCollapsedSize,
  children,
}: MailProps) {
  // 使用邮件查询钩子获取邮件列表
  const { 
    data: emails = [], 
    isLoading,
    error
  } = useEmails({ 
    unread: false,
    limit: 50  // 获取更多邮件
  });
  
  // 使用自定义Hook管理侧边栏和布局
  const {
    isCollapsed,
    panelGroupRef,
    initialLayout,
    onLayoutChange,
    onCollapse,
    toggleSidebar
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
        ref={panelGroupRef}
        direction="horizontal"
        onLayout={onLayoutChange}
        className="h-full items-stretch"
        id="mail-layout"
      >
        <Nav
          accounts={accounts}
          mails={emails}
          defaultLayout={initialLayout.current}
          defaultCollapsed={isCollapsed}
          navCollapsedSize={navCollapsedSize}
          onCollapsedChange={onCollapse}
        />
        <ResizableHandle withHandle />
        <ResizablePanel 
          defaultSize={initialLayout.current[1]}
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
