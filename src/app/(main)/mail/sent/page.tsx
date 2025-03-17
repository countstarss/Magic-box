import React from 'react';
import { cookies } from 'next/headers';
import MailScroll from '../components/MailScroll';

const Sent: React.FC = () => {
  const layout = cookies().get("react-resizable-panels:layout:mail")
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined

  return (
    <MailScroll defaultLayout={defaultLayout} folder="sent" />
  );
};

export default Sent;