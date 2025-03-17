'use client'
import * as React from "react"
import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
  BookTemplate
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  ResizablePanel,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import { AccountSwitcher } from "./account-switcher"
import { type Mail } from "../../../../lib/data"
import { NavItem } from "./navItem"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { usePathname } from "next/navigation"

interface NavProps {
  // You can define any props needed here
  accounts: {
    label: string
    email: string
    icon: React.ReactNode
  }[]
  mails: Mail[]
  defaultLayout: number[] | undefined
  defaultCollapsed?: boolean
  navCollapsedSize: number
}

const Nav: React.FC<NavProps> = ({
  accounts,
  mails,
  defaultLayout = [16, 32, 48],
  defaultCollapsed = false,
  navCollapsedSize,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
  const pathname = usePathname();


  return (
    <ResizablePanel
      defaultSize={defaultLayout[0]}
      collapsedSize={navCollapsedSize}
      collapsible={true}
      minSize={16}
      maxSize={16}
      onCollapse={() => {
        setIsCollapsed(true)
        document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
          true
        )}`
      }}
      onResize={() => {
        setIsCollapsed(false)
        document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
          false
        )}`
      }}
      className={cn(
        isCollapsed &&
          "min-w-[50px] transition-all duration-300 ease-in-out relative"
      )}
    >
      <div
        className={cn(
          "flex h-[52px] items-center justify-center",
          isCollapsed ? "h-[52px]" : "px-2"
        )}
      >
        <AccountSwitcher isCollapsed={isCollapsed} accounts={accounts} />
      </div>
      <Separator />
      {/*
      //MARK: TODO
      //TODO: 尝试把NAV放到最外层的layout，把不同的内容做成子路由，切换类别只切换内容
      //TODO: 尝试仍然保留右侧部分的内容，将其作为Layout，减少点击切换路由带来的延迟
      //TODO: 


      
      //MARK: NAV top
      */}
      <NavItem
        isCollapsed={isCollapsed}
        links={[
          // TODO: 使用pathname来确定哪一个按钮应该高亮
          {
            title: "Inbox",
            label: "128",
            icon: Inbox,
            href:"/mail",
            variant: pathname === "/mail" ? "default" : "ghost",
          },
          {
            title: "Drafts",
            label: "9",
            icon: File,
            href:"/mail/draft",
            variant:pathname === "/mail/draft" ? "default" : "ghost",
          },
          {
            title: "Sent",
            label: "",
            icon: Send,
            href:"/mail/sent",
            variant:pathname === "/mail/sent" ? "default" : "ghost",
          },
          {
            title: "Junk",
            label: "23",
            icon: ArchiveX,
            href:"/mail/junk",
            variant:pathname === "/mail/junk" ? "default" : "ghost",
          },
          {
            title: "Template",
            label: "",
            icon: BookTemplate,
            href:"/mail/template",
            variant:pathname === "/mail/template" ? "default" : "ghost",
          },
        ]}
      />
      <Separator />
      {/* 
      MARK: NAV middle
      */}
      <NavItem
        isCollapsed={isCollapsed}
        links={[
          {
            title: "Trash",
            label: "",
            icon: Trash2,
            href:"/trash",
            variant: pathname === "/trash" ? "default" : "ghost",
          },
          {
            title: "Archive",
            icon: Archive,
            href:"/archive",
            variant: pathname === "/archive" ? "default" : "ghost",
          },
        ]}
      />
      <Separator />
      {/*
      //MARK: NAV bottom
      */}
      <NavItem
        isCollapsed={isCollapsed}
        links={[
          {
            title: "Social",
            label: "972",
            icon: Users2,
            variant: "ghost",
          },
          {
            title: "Updates",
            label: "342",
            icon: AlertCircle,
            variant: "ghost",
          },
          {
            title: "Forums",
            label: "128",
            icon: MessagesSquare,
            variant: "ghost",
          },
          {
            title: "Shopping",
            label: "8",
            icon: ShoppingCart,
            variant: "ghost",
          },
          {
            title: "Promotions",
            label: "21",
            icon: Archive,
            variant: "ghost",
          },
        ]}
      />
      {/* 
      //MARK: User & Mode
      */}
      <div
        className={cn(
          "absolute bottom-4 items-center justify-center",
          isCollapsed ? "px-5 h-[100px]" : "px-8 h-50"
        )}
      >
        {
          isCollapsed ?(
            <div className='flex flex-col gap-4'>
              <div className="w-10 h-10 flex items-center justify-center">
                <ModeToggle iconSize="1rem" />
              </div>
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                <span className="font-medium text-sm">LK</span>
              </div>
            </div>
          ) : (
            <div className='flex flex-col gap-4 w-full'>
              <div className='flex flex-row justify-between w-full items-center'>
                <div className="flex items-center space-x-2 bg-muted rounded-lg p-2 w-full">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-medium text-xs text-primary">LK</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Luke</span>
                    <span className="text-xs text-muted-foreground">luke@wizmail.com</span>
                  </div>
                </div>
                <div className="ml-2">
                  <ModeToggle iconSize="1rem" className="h-9 w-9" />
                </div>
              </div>
            </div>
          )
        }
      </div>
    </ResizablePanel>
  );
};

export default Nav;