import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className='w-full h-full flex items-center justify-center'>
      <Link href={'mail'}>
        <Button type="button" className='h-fit translate-y-[200px]'>
          <h1 className='text-2xl font-extrabold'>Open Magic Box</h1>
        </Button>
      </Link>
    </main>
  );
}
