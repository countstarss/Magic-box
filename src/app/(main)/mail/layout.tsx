import { cookies } from 'next/headers';
import React from 'react';
import { accounts, mails } from "../../../lib/data"
import { Mail } from "./components/mail"

interface LayoutProps {
  children:React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({
  children
}) => {
  // 从cookie中获取布局配置和折叠状态
  const layoutCookie = cookies().get("react-resizable-panels:layout:mail")
  const collapsedCookie = cookies().get("react-resizable-panels:collapsed")

  // 解析折叠状态
  const defaultCollapsed = collapsedCookie ? JSON.parse(collapsedCookie.value) : false
  
  // 解析布局配置
  let defaultLayout = layoutCookie ? JSON.parse(layoutCookie.value) : [16, 32, 48]
  
  // 如果侧边栏折叠但布局不匹配，调整布局
  if (defaultCollapsed) {
    const navMinSize = 4; // 最小侧边栏宽度
    
    // 检查当前侧边栏尺寸是否已经是最小值
    if (defaultLayout[0] > navMinSize) {
      // 计算需要减少的尺寸
      const reducedSize = defaultLayout[0] - navMinSize;
      
      // 如果有三个面板，按比例分配空间
      if (defaultLayout.length >= 3) {
        const panel2Size = defaultLayout[1];
        const panel3Size = defaultLayout[2];
        const totalSize = panel2Size + panel3Size;
        
        // 按比例分配给第二和第三个面板
        const panel2NewSize = panel2Size + (reducedSize * (panel2Size / totalSize));
        const panel3NewSize = panel3Size + (reducedSize * (panel3Size / totalSize));
        
        // 创建新的布局数组
        defaultLayout = [navMinSize, panel2NewSize, panel3NewSize];
      } else {
        // 如果只有两个面板，全部分配给第二个面板
        defaultLayout = [navMinSize, 100 - navMinSize];
      }
    }
  }

  return (
    <div className="hidden flex-col md:flex h-screen">
      <Mail
        accounts={accounts}
        mails={mails}
        defaultLayout={defaultLayout}
        defaultCollapsed={defaultCollapsed}
        navCollapsedSize={4}
      >
        {children}
      </Mail>
    </div>
  );
};

export default Layout;