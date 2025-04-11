import React from 'react'

type Props = { children: React.ReactNode }

const Layout = ({ children }: Props) => {
    return (
        <div className="h-screen border-muted-foreground/20 overflow-auto">
            {children}
        </div>
    )
}

export default Layout;

/*
NOTE:: 这个布局文件可以匹配所有同级的路由页面
MARK: - 匹配同级页面
*/