import React from 'react'

/*
NOTE:: 这个Layout决定了网站的整体布局
MARK: - 整体布局
*/

type Props = { children: React.ReactNode }

const Layout = (props: Props) => {
    return (
        <>
            {props.children}
        </>
    )
}

export default Layout;