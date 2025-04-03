"use client";

import { useLocalSession } from "@/providers/SessionProvider";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Image from "next/image";

const NotePage = () => {
  const { session } = useLocalSession();

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/images/banner1.png"
        height="300"
        width="300"
        alt="Empty"
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        height="300"
        width="300"
        alt="Empty"
        className="hidden dark:block"
      />
      <h2 className="text-lg font-medium">
        Welcome to {session?.user?.name}&apos;s Notes
      </h2>
      <Button>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a note
      </Button>
    </div>
  );
};

export default NotePage;