"use client";
import * as React from "react";
import {
  Archive,
  ArchiveX,
  File,
  Inbox,
  PenBox,
  Send,
  Trash2,
  Settings as SettingsIcon,
  PanelLeftClose,
  Plus,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Mail } from "@/lib/data";
import { useMail } from "@/hooks/use-mail";
import { ModeToggle } from "../../../../components/ui/mode-toggle";
import { useAtom } from "jotai";
import { userCategoriesAtom } from "@/lib/user-categories";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { IconByName } from "./IconByName";
import { NavItem } from "./navItem";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CategoryManager from "./CategoryManager";
import { ResizablePanel } from "@/components/ui/resizable";
import Link from "next/link";
import { DashboardIcon } from "@radix-ui/react-icons";

interface NavLinkItem {
  title: string;
  label?: string;
  icon: React.ComponentType<{ className?: string }>;
  variant: "default" | "ghost";
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface NavProps {
  accounts: {
    name: string;
    email: string;
    icon: React.ReactNode;
  }[];
  mails: Mail[];
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  onCollapsedChange?: (collapsed: boolean) => void;
}

const Nav: React.FC<NavProps> = ({
  accounts,
  mails,
  defaultLayout = [16, 32, 48],
  defaultCollapsed = false,
  navCollapsedSize,
  onCollapsedChange,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [userCategories] = useAtom(userCategoriesAtom);
  const { getCategoryCounts, setCurrentFolder, currentFolder } = useMail();
  const categoryCounts = getCategoryCounts();
  const [isManageOpen, setIsManageOpen] = React.useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // 获取当前选中的分类
  const currentCategory = searchParams.get("category");

  // 切换分类选择
  const handleCategoryClick = (categoryId: string) => {
    // 创建新的查询参数
    const params = new URLSearchParams(searchParams);

    if (categoryId === currentCategory) {
      // 如果点击当前选中的分类，则移除该参数
      params.delete("category");
    } else {
      // 否则设置新的分类参数
      params.set("category", categoryId);
    }

    // 保持在当前路径，但更新查询参数
    router.push(`${pathname}?${params.toString()}`);
  };

  // 主要链接数据
  const mainLinks: NavLinkItem[] = [
    {
      title: "Inbox",
      label: "",
      icon: Inbox,
      variant: currentFolder === 'inbox' ? "default" : "ghost",
      onClick: () => setCurrentFolder('inbox'),
    },
    {
      title: "Drafts",
      label: "",
      icon: File,
      variant: currentFolder === 'draft' ? "default" : "ghost",
      onClick: () => setCurrentFolder('draft'),
    },
    {
      title: "Sent",
      label: "",
      icon: Send,
      variant: currentFolder === 'sent' ? "default" : "ghost",
      onClick: () => setCurrentFolder('sent'),
    },
    {
      title: "Junk",
      label: "",
      icon: ArchiveX,
      variant: currentFolder === 'junk' ? "default" : "ghost",
      onClick: () => setCurrentFolder('junk'),
    },
  ];

  // 存档和垃圾箱链接
  const secondaryLinks: NavLinkItem[] = [
    {
      title: "Trash",
      label: "",
      icon: Trash2,
      variant: currentFolder === 'trash' ? "default" : "ghost",
      onClick: () => setCurrentFolder('trash'),
    },
    {
      title: "Archive",
      label: "",
      icon: Archive,
      variant: currentFolder === 'archive' ? "default" : "ghost",
      onClick: () => setCurrentFolder('archive'),
    },
  ];

  // 生成用户分类导航链接
  const categoryLinks: NavLinkItem[] = userCategories.map((category) => {
    const count = categoryCounts[category.id] || 0;

    return {
      title: category.name,
      label: count > 0 ? count.toString() : "",
      icon: ({ className }: { className?: string }) => (
        <IconByName name={category.icon} className={className} />
      ),
      variant: "ghost",
      isActive: currentCategory === category.id,
      onClick: () => handleCategoryClick(category.id),
    };
  });

  // 保存初始layout用于保持一致性
  const initialLayout = React.useRef(defaultLayout);

  // 监听defaultCollapsed的变化
  React.useEffect(() => {
    setIsCollapsed(defaultCollapsed);
  }, [defaultCollapsed]);

  // 组件挂载时设置初始折叠状态
  React.useEffect(() => {
    if (defaultCollapsed) {
      // 如果defaultCollapsed为true，模拟触发折叠
      setIsCollapsed(true);
      document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
        true
      )}`;
      if (onCollapsedChange) onCollapsedChange(true);

      // 尝试直接设置面板状态
      const panel = document.querySelector("[data-panel-id]");
      if (panel) {
        panel.setAttribute("data-state", "collapsed");
      }
    } else {
      // 确保展开状态
      setIsCollapsed(false);
    }
  }, []);

  return (
    <ResizablePanel
      defaultSize={initialLayout.current[0]}
      collapsedSize={navCollapsedSize}
      collapsible={true}
      minSize={14}
      maxSize={14}
      onCollapse={() => {
        setIsCollapsed(true);
        document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
          true
        )}`;
        if (onCollapsedChange) onCollapsedChange(true);
      }}
      onExpand={() => {
        setIsCollapsed(false);
        document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
          false
        )}`;
        if (onCollapsedChange) onCollapsedChange(false);
      }}
      className={cn(
        "flex flex-col bg-background border-r",
        isCollapsed ? "items-center min-w-[80px]" : "min-w-[240px]"
      )}
    >
      <div className="flex items-center p-2">
        {isCollapsed ? (
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-sm">WizMail</h2>
          </div>
        ) : (
          <div className="flex w-full items-center justify-between px-2 py-2">
            <div className="flex items-center gap-2">
              <div>
                <PenBox className="h-6 w-6" />
              </div>
              <h2 className="font-semibold text-lg">WizMail</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                setIsCollapsed(true);
                onCollapsedChange?.(true);
              }}
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
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
          <Button
            variant="default"
            className={cn(
              "rounded-md bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-all",
              isCollapsed
                ? "w-10 h-10 p-0 flex items-center justify-center"
                : "w-full px-4 py-3 flex items-center justify-start"
            )}
            onClick={() => router.push('/mail/compose')}
          >
            <PenBox className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
            {!isCollapsed && <span className="font-medium">Compose</span>}
          </Button>
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

        {/* 存档和垃圾箱 */}
        <span
          className={cn(
            "text-muted-foreground text-xs px-2 mt-4",
            isCollapsed && "hidden"
          )}
        >
          System
        </span>
        <NavItem isCollapsed={isCollapsed} links={secondaryLinks} />

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
          isCollapsed ? "px-5 h-[150px]" : "px-8 h-50"
        )}
      >
        {isCollapsed ? (
          <div className="flex flex-col gap-4">
            <div className="w-10 h-10 flex items-center justify-center">
              <Link href="/dashboard">
                <Button variant="outline" size="icon">
                  <DashboardIcon />
                </Button>
              </Link>
            </div>
            <div className="w-10 h-10 flex items-center justify-center">
              <ModeToggle iconSize="1rem" />
            </div>
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center overflow-hidden">
              <span className="font-medium text-sm">LK</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-row justify-between w-full items-center">
              <div className="flex items-center space-x-2 bg-muted rounded-lg p-2 w-full">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-medium text-xs text-primary">LK</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Luke</span>
                  <span className="text-xs text-muted-foreground">
                    luke@wizmail.com
                  </span>
                </div>
              </div>
              <div className="ml-2">
                <ModeToggle iconSize="1rem" className="h-9 w-9" />
              </div>
            </div>
          </div>
        )}
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
