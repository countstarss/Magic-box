'use client'
import * as React from "react"
import Link from "next/link"
import {
  Archive,
  ArchiveX,
  File,
  Inbox,
  PenBox,
  Send,
  Trash2,
  Settings as SettingsIcon
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Mail } from "@/lib/data"
import { useMail } from "@/hooks/use-mail"
import { ModeToggle } from "../../../../components/ui/mode-toggle"
import { useAtom } from "jotai"
import { userCategoriesAtom } from "@/lib/user-categories"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { IconByName } from "./IconByName"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import CategoryManager from "./CategoryManager"
import { ResizablePanel } from "@/components/ui/resizable"

interface NavLinkItem {
  title: string
  label?: string
  icon: React.ComponentType<{ className?: string }>
  variant: "default" | "ghost"
  href?: string
  isActive?: boolean
  onClick?: () => void
}

interface NavProps {
  accounts: {
    name: string
    email: string
    icon: React.ReactNode
  }[]
  mails: Mail[]
  defaultLayout: number[] | undefined
  defaultCollapsed?: boolean
  navCollapsedSize: number
}

interface NavItemProps {
  isCollapsed: boolean
  links: NavLinkItem[]
}

// 主要链接数据
const mainLinks: NavLinkItem[] = [
  {
    title: "Inbox",
    label: "",
    icon: Inbox,
    variant: "default",
    href: "/mail",
  },
  {
    title: "Drafts",
    label: "",
    icon: File,
    variant: "ghost",
    href: "/mail/draft",
  },
  {
    title: "Sent",
    label: "",
    icon: Send,
    variant: "ghost",
    href: "/mail/sent",
  },
  {
    title: "Junk",
    label: "",
    icon: ArchiveX,
    variant: "ghost",
    href: "/mail/junk",
  },
  {
    title: "Trash",
    label: "",
    icon: Trash2,
    variant: "ghost",
    href: "/mail/trash",
  },
  {
    title: "Archive",
    label: "",
    icon: Archive,
    variant: "ghost",
    href: "/mail/archive",
  },
]

function NavItem({ isCollapsed, links }: NavItemProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href || "#"}
            onClick={link.onClick}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              link.variant === "default" && "bg-accent text-accent-foreground",
              link.isActive && "bg-accent text-accent-foreground",
              isCollapsed ? "h-9 w-9 justify-center" : "w-full justify-start"
            )}
          >
            <link.icon className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
            {!isCollapsed && (
              <>
                <span>{link.title}</span>
                {link.label && (
                  <span
                    className={cn(
                      "ml-auto",
                      link.variant === "default" && "text-background"
                    )}
                  >
                    {link.label}
                  </span>
                )}
              </>
            )}
          </Link>
        ))}
      </nav>
    </div>
  )
}

const Nav: React.FC<NavProps> = ({
  accounts,
  mails,
  defaultLayout = [16, 32, 48],
  defaultCollapsed = false,
  navCollapsedSize,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
  const [userCategories] = useAtom(userCategoriesAtom)
  const { getCategoryCounts } = useMail()
  const categoryCounts = getCategoryCounts()
  const [isManageOpen, setIsManageOpen] = React.useState(false)
  
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // 获取当前选中的分类
  const currentCategory = searchParams.get("category")
  
  // 切换分类选择
  const handleCategoryClick = (categoryId: string) => {
    // 创建新的查询参数
    const params = new URLSearchParams(searchParams)
    
    if (categoryId === currentCategory) {
      // 如果点击当前选中的分类，则移除该参数
      params.delete("category")
    } else {
      // 否则设置新的分类参数
      params.set("category", categoryId)
    }
    
    // 保持在当前路径，但更新查询参数
    router.push(`${pathname}?${params.toString()}`)
  }
  
  // 生成用户分类导航链接
  const categoryLinks: NavLinkItem[] = userCategories.map(category => {
    const count = categoryCounts[category.id] || 0
    
    return {
      title: category.name,
      label: count > 0 ? count.toString() : "",
      icon: ({className}: {className?: string}) => <IconByName name={category.icon} className={className} />,
      variant: "ghost",
      isActive: currentCategory === category.id,
      onClick: () => handleCategoryClick(category.id)
    }
  })

  return (
    <ResizablePanel
      defaultSize={defaultLayout[0]}
      collapsedSize={navCollapsedSize}
      collapsible={true}
      minSize={15}
      maxSize={20}
      onCollapse={() => {
        setIsCollapsed(true)
      }}
      onExpand={() => {
        setIsCollapsed(false)
      }}
      className={cn(
        "flex flex-col bg-background",
        isCollapsed ? "items-center" : ""
      )}
    >
      <div className="flex items-center p-2">
        {isCollapsed ? (
          <PenBox className="mx-auto mt-2 h-6 w-6" />
        ) : (
          <div className="flex w-full items-center gap-2 px-2 py-2">
            <div>
              <PenBox className="h-6 w-6" />
            </div>
            <h2 className="font-semibold text-lg">WizMail</h2>
          </div>
        )}
      </div>
      <div
        className={cn(
          "flex flex-col",
          isCollapsed ? "items-center" : "justify-start"
        )}
      >
        <div
          className={cn(
            "my-2 w-full",
            isCollapsed ? "flex flex-col items-center" : "justify-start px-2"
          )}
        >
          <Link
            href="/mail/compose"
            className={cn(
              "w-full rounded-md bg-primary px-2 py-2 text-center font-medium text-primary-foreground shadow hover:bg-primary/90",
              isCollapsed ? "w-10 h-10 p-0 flex items-center justify-center" : ""
            )}
          >
            <PenBox className={cn("h-5 w-5", !isCollapsed && "mr-2 hidden sm:block")} />
            {!isCollapsed && <span>Compose</span>}
          </Link>
        </div>
      </div>
      <div className="mb-2 flex-1 overflow-auto">
        <span
          className={cn(
            "text-muted-foreground text-xs px-2",
            isCollapsed && "hidden"
          )}
        >
          Main
        </span>
        <NavItem isCollapsed={isCollapsed} links={mainLinks} />
        
        {/* 用户分类部分 */}
        <div className="flex items-center justify-between px-4 mt-4">
          <span
            className={cn(
              "text-muted-foreground text-xs",
              isCollapsed && "hidden"
            )}
          >
            Categories
          </span>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-5 w-5", isCollapsed && "hidden")}
            onClick={() => setIsManageOpen(true)}
          >
            <SettingsIcon className="h-3.5 w-3.5" />
          </Button>
        </div>
        
        <NavItem isCollapsed={isCollapsed} links={categoryLinks} />
      </div>
      
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
      
      {/* 分类管理对话框 */}
      <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Email Categories</DialogTitle>
            <DialogDescription>
              Create and edit custom categories to organize your emails
            </DialogDescription>
          </DialogHeader>
          <CategoryManager />
        </DialogContent>
      </Dialog>
    </ResizablePanel>
  );
};

export default Nav;