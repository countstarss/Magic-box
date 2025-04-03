"use client"

import React, { useState } from 'react'
import Sidebar from './dashboard/_components/Sidebar'
import InfoBar from './dashboard/_components/Infobar'

type Props = { children: React.ReactNode }

const DashboardSharedLayout = (props: Props) => {
    const [isCollapsed, setIsCollapsed] = useState(false)
    return (
        <div className='flex overflow-hidden h-screen'>
            <Sidebar 
                isCollapsed={isCollapsed} 
                setIsCollapsed={setIsCollapsed} 
            />
            <div className='w-full'>
                <InfoBar 
                    isCollapsed={isCollapsed} 
                    setIsCollapsed={setIsCollapsed} 
                />
                {props.children}
            </div>
        </div>
    )
}

export default DashboardSharedLayout;