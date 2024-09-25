import { cookies } from 'next/headers';
import React from 'react';
import { accounts, mails } from "../../../lib/data"
import { Mail } from '../mail/components/mail';


interface LayoutProps {
  // You can define any props needed here
  children:React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({
  children
}) => {
  const layout = cookies().get("react-resizable-panels:layout:mail")
  const collapsed = cookies().get("react-resizable-panels:collapsed")

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined
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