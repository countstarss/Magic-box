import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import React from 'react';


const Template = async ({ }) => {
  const { data: session } = await supabase.auth.getSession();

  // 这里是默认的Overview的部分
  return (
    <div className="flex flex-col gap-4">

      <div className='flex flex-col md:flex-row justify-between  gap-2 w-full md:w-auto'>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">You / Overview</h1>
        <Link href={`/${session?.session?.user?.email!}`}>
          <Button
            variant="outline"
            className="text-sm w-full md:w-auto"
          >
            Enter Personal Space
          </Button>
        </Link>
      </div>

      <p className="text-gray-600 dark:text-gray-200">Manage and view your overview</p>
    </div>
  );
};

export default Template;