import { useRouter } from 'next/navigation';
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';


const BackAndForWardButton: React.FC = () => {
  const router = useRouter()
  return (
    <div className='
            hidden
            md:flex
            gap-x-2
            items-center
            opacity-50
          '>
            <button className='p-2 rounded-full hover:bg-gray-400 bg-gray-300'
              onClick={() => router.back()}
            >
              <ArrowLeft />
            </button>
            <button className='p-2 rounded-full hover:bg-gray-400 bg-gray-300'
              onClick={() => router.forward()}
            >
              <ArrowRight />
            </button>
          </div>
  );
};

export default BackAndForWardButton;