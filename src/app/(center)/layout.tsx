import React from 'react'
import Sidebar from './dashboard/_components/Sidebar'
import InfoBar from './dashboard/_components/Infobar'

type Props = { children: React.ReactNode }

const DashboardSharedLayout = (props: Props) => {
    return (
        <div className='flex overflow-hidden h-screen'>
            <Sidebar />
            <div className='w-full'>
                <InfoBar />
                {props.children}
            </div>
        </div>
    )
}

export default DashboardSharedLayout;