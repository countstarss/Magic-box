import React from 'react';

interface LayoutProps {
  // You can define any props needed here
  children:React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({
  children
}) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default Layout;