import React from 'react';

interface InnerSidebarProps {
    // You can define any props needed here
    children: React.ReactNode;
}

const InnerSidebar = ({ children }: InnerSidebarProps) => {


    return (
        <aside className="md:w-[200px] w-[100px] min-w-[100px] h-full bg-transparent  md:p-6 p-2 pr-0 border-r border-gray-200 dark:border-gray-600 sticky top-0">
            <nav className="flex flex-col h-full">
                {children}
            </nav>
        </aside>
    );
};

export default InnerSidebar;