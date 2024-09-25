import React from 'react';
import Page from '../page';
import { mails } from '@/lib/data';
import { useArchiveEmails } from '@/hooks/use-filtered-mail';

interface TrashProps {
  // You can define any props needed here
}

const Archive = ({}: TrashProps) => {
  const archivedMails = useArchiveEmails(mails,true);

  return (
    <Page mails={archivedMails} />
  );
};

export default Archive;