import React from 'react';
import { mails } from '@/lib/data';
import { cookies } from 'next/headers';
import MailScroll from '../components/MailScroll';
import { useFilteredEmails } from '@/hooks/use-filtered-mail';


interface DraftsProps {
  // You can define any props needed here
}

const Junk: React.FC<DraftsProps> = ({
  
}) => {

  const layout = cookies().get("react-resizable-panels:layout:mail")
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined
  const filteredEmails = useFilteredEmails(mails,"junk")

  return (
    <MailScroll mails={filteredEmails} defaultLayout={defaultLayout}/>
  );
};

export default Junk;