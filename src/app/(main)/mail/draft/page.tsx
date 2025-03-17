import React from 'react';
import { cookies } from 'next/headers';
import MailScroll from '../components/MailScroll';

const Draft: React.FC = () => {
  const layout = cookies().get("react-resizable-panels:layout:mail")
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined

  return (
    <MailScroll defaultLayout={defaultLayout} folder="draft" />
  );
};

export default Draft;