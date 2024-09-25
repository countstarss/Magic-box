import React from 'react';
import Page from '../page';
import { mails } from '@/lib/data';
import { useTrashEmails } from '@/hooks/use-filtered-mail';

interface TrashProps {
  // You can define any props needed here
}

const Trash = ({}: TrashProps) => {
  const trashMails = useTrashEmails(mails,true);

  return (
    <Page mails={trashMails} />
  );
};

export default Trash;