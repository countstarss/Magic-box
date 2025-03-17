"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { TooltipProvider } from "@/components/ui/tooltip"
import Nav from "./nav"
import { type Mail as TMail } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { LayoutGrid, LayoutTemplate, PanelLeft, PanelLeftClose } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface MailProps {
  accounts: {
    name: string
    email: string
    icon: React.ReactNode
  }[]
  mails: TMail[]
  defaultLayout: number[] | undefined
  defaultCollapsed?: boolean
  navCollapsedSize: number
  children: React.ReactNode
}

export function Mail({
  accounts,
  mails,
  defaultLayout = [16, 32, 48],
  defaultCollapsed = false,
  navCollapsedSize,
  children,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
  const pathname = usePathname()

  // 使用useRef保存初始layout和折叠状态，避免路由变化时重置
  const initialLayout = React.useRef(defaultLayout);
  const initialCollapsed = React.useRef(defaultCollapsed);
  
  // 添加布局方向状态
  const [isVerticalLayout, setIsVerticalLayout] = React.useState(() => {
    // 从cookie中获取用户上次选择的布局方向
    const layoutDirCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('mail-layout-direction='));
    
    return layoutDirCookie ? layoutDirCookie.split('=')[1] === 'vertical' : false;
  });

  // 保存面板组引用
  const panelGroupRef = React.useRef<any>(null);
  
  // 构建自定义布局函数，用于在切换侧边栏时重新分配空间
  const [sizes, setSizes] = React.useState<number[]>([]);
  
  // 存储上一次展开状态的尺寸，用于还原
  const expandedSizesRef = React.useRef<number[]>([]);

  const onLayoutChange = React.useCallback((newSizes: number[]) => {
    setSizes(newSizes);
    
    // 只有在侧边栏展开时才保存尺寸以便后续还原
    if (!isCollapsed && newSizes.length >= 2) {
      // 检查侧边栏是否在最小尺寸附近 (±2)
      const isNearCollapsed = Math.abs(newSizes[0] - navCollapsedSize) <= 2;
      
      // 如果用户手动将侧边栏拖到最小尺寸附近，则自动触发折叠
      if (isNearCollapsed) {
        setIsCollapsed(true);
        document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`;
        return;
      }
      
      // 否则正常保存当前尺寸用于还原
      expandedSizesRef.current = newSizes;
    }
    
    // 保存布局到cookie
    document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
      newSizes
    )}`;
  }, [isCollapsed, navCollapsedSize]);

  const onCollapse = React.useCallback((collapsed: boolean) => {
    setIsCollapsed(collapsed);
    
    // 使用更通用的方式调整尺寸
    setTimeout(() => {
      if (collapsed) {
        // 保存当前尺寸到expandedSizesRef以便后续还原
        if (sizes.length >= 2 && expandedSizesRef.current.length === 0) {
          expandedSizesRef.current = [...sizes];
        }
        
        // 折叠时，重新分配空间比例
        // 1. 获取侧边栏原本的大小
        const originalNavSize = expandedSizesRef.current[0] || defaultLayout[0];
        // 2. 设置侧边栏为最小尺寸
        const navMinSize = navCollapsedSize;
        // 3. 计算减少的尺寸
        const reducedSize = originalNavSize - navMinSize;
        
        // 如果面板数组有三个元素，则需要按比例分配给第二和第三个面板
        if (sizes.length >= 3 || expandedSizesRef.current.length >= 3 || defaultLayout.length >= 3) {
          // 计算第二和第三个面板的原始大小
          const panel2Size = expandedSizesRef.current[1] || sizes[1] || defaultLayout[1];
          const panel3Size = expandedSizesRef.current[2] || sizes[2] || defaultLayout[2];
          const totalSize = panel2Size + panel3Size;
          
          // 按比例分配减少的空间
          // 例如：如果原来是 [20, 30, 50]，侧边栏减少了16个单位变成4，
          // 那么第二个面板增加 16 * (30/80) = 6，第三个面板增加 16 * (50/80) = 10
          // 结果变成 [4, 36, 60]
          const panel2NewSize = panel2Size + (reducedSize * (panel2Size / totalSize));
          const panel3NewSize = panel3Size + (reducedSize * (panel3Size / totalSize));
          
          // 设置新的尺寸数组
          const newSizes = [navMinSize, panel2NewSize, panel3NewSize];
          
          // 更新cookie中的布局尺寸
          document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(newSizes)}`;
        } else {
          // 如果只有两个面板，则所有减少的空间都给第二个面板
          const panel2Size = sizes[1] || expandedSizesRef.current[1] || defaultLayout[1];
          const panel2NewSize = panel2Size + reducedSize;
          
          // 设置新的尺寸数组
          const newSizes = [navMinSize, panel2NewSize];
          
          // 更新cookie中的布局尺寸
          document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(newSizes)}`;
        }
      } else if (expandedSizesRef.current.length >= 2) {
        // 恢复到之前保存的尺寸
        document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
          expandedSizesRef.current
        )}`;
      } else {
        // 如果没有保存的尺寸但需要展开，则使用默认布局，确保侧边栏有足够的宽度
        let expandedLayout = [...defaultLayout];
        // 如果当前侧边栏太小，则设置为合理的展开宽度
        if (expandedLayout[0] < 15) {
          expandedLayout[0] = 16;
          // 如果有三个面板，则按比例调整其他两个面板
          if (expandedLayout.length >= 3) {
            const totalOther = expandedLayout[1] + expandedLayout[2];
            const ratio = totalOther / (100 - 16); // 计算剩余空间的分配比例
            expandedLayout[1] = Math.floor((100 - 16) * (expandedLayout[1] / totalOther));
            expandedLayout[2] = 100 - 16 - expandedLayout[1];
          } else {
            // 两个面板的情况
            expandedLayout[1] = 100 - 16;
          }
        }
        document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(expandedLayout)}`;
      }
    }, 50);
    
    // 更新折叠状态到cookie
    document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
      collapsed
    )}`;
  }, [isCollapsed, sizes, navCollapsedSize, defaultLayout]);
  
  // 切换布局方向
  const toggleLayoutDirection = React.useCallback(() => {
    const newValue = !isVerticalLayout;
    setIsVerticalLayout(newValue);
    document.cookie = `mail-layout-direction=${newValue ? 'vertical' : 'horizontal'}; path=/; max-age=31536000`;
  }, [isVerticalLayout]);

  // 切换侧边栏折叠状态
  const toggleSidebar = React.useCallback(() => {
    const newValue = !isCollapsed;
    onCollapse(newValue);
  }, [isCollapsed, onCollapse]);

  // 初始化时设置正确的尺寸
  React.useEffect(() => {
    // 如果初始状态为折叠，设置适当的尺寸
    if (isCollapsed && sizes.length === 0) {
      // 尝试从默认布局中获取各面板的原始尺寸
      const originalNavSize = defaultLayout[0];
      const navMinSize = navCollapsedSize;
      const reducedSize = originalNavSize - navMinSize;
      
      // 检查是否有三个面板需要调整
      if (defaultLayout.length >= 3) {
        const panel2Size = defaultLayout[1];
        const panel3Size = defaultLayout[2];
        const totalSize = panel2Size + panel3Size;
        
        // 按比例分配给第二和第三个面板
        const panel2NewSize = panel2Size + (reducedSize * (panel2Size / totalSize));
        const panel3NewSize = panel3Size + (reducedSize * (panel3Size / totalSize));
        
        // 更新cookie中的布局尺寸
        document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
          [navMinSize, panel2NewSize, panel3NewSize]
        )}`;
      } else {
        // 如果只有两个面板，全部分配给第二个面板
        document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
          [navMinSize, 100 - navMinSize]
        )}`;
      }
    }
  }, [isCollapsed, navCollapsedSize, defaultLayout, sizes]);

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
          mails={mails}
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
                {/* 当侧边栏折叠时，在左侧显示展开按钮 */}
                {isCollapsed && (
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
                )}
              </div>
              
              {/* 右侧工具栏 */}
              <div className="flex items-center gap-1">
                {/* 布局切换按钮 */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={toggleLayoutDirection}
                    >
                      {isVerticalLayout ? <LayoutTemplate className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isVerticalLayout ? "Switch to horizontal layout" : "Switch to vertical layout"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              {/* 根据布局方向选择渲染子组件或自定义布局 */}
              {React.Children.map(children, child => 
                React.isValidElement(child) ? 
                  React.cloneElement(child as React.ReactElement<any>, { 
                    isVerticalLayout,
                    layoutDirection: isVerticalLayout ? "vertical" : "horizontal"
                  }) : 
                  child
              )}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
