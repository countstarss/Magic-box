"use client";

import React, { useEffect, useState } from "react";
import { Book, Headphones, Menu, Search, SquareChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserNav } from "@/components/HomePage/Nav/UserNav";
import RouterIndicator from "@/components/global/RouterIndicator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { menuOptions } from "@/lib/data/constant";
import Link from "next/link";
import ContextMenuWrapper from "@/components/ui/ContextMenuWrapper";

const InfoBar = () => {
  // const { data: session, status } = useSession(); // 获取用户会话信息
  const [open, setOpen] = useState(false);

  const onGetPayment = async () => {

  };

  useEffect(() => {
    onGetPayment();
  }, []);

  return (
    <ContextMenuWrapper>
      <div className="flex flex-row justify-between gap-6 items-center px-4 py-2 w-full dark:bg-black border-b-[1px] border-gray-300 dark:border-white/20">
        <div className="flex flex-row gap-4 items-center">
          <div className="md:flex gap-4 items-center hidden">
          </div>
          <div className="lg:flex lg:flex-row items-center hidden">
            <RouterIndicator />
          </div>
          <div className="flex md:hidden gap-4 items-center ">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger>
                <Menu className="text-xl text-black dark:text-white" />
              </SheetTrigger>
              <SheetContent side="left" className='w-1/2'>
                <div className="flex flex-col gap-4 p-4">
                  {menuOptions.map((menuItem) => (
                    <Link
                      href={menuItem.href}
                      key={menuItem.name}
                      onClick={() => setOpen(false)}  // 点击时关闭 Sheet
                    >
                      <h2 className="text-lg text-black dark:text-white hover:text-indigo-500">
                        {menuItem.name}
                      </h2>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex flex-row gap-4 items-center">
          {/* Search */}
          <span className="flex items-center gap-2 font-bold py-[2px]">
            <Search />
            <Input placeholder="Quick Search" className="border-none bgcolor-transsprent h-10" />
          </span>

          {/* Tooltips */}
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <Headphones />
              </TooltipTrigger>
              <TooltipContent>
                <p>Contact Support</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <Book />
              </TooltipTrigger>
              <TooltipContent>
                <p>Guide</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* User Info - 动态渲染 */}
          {
            // status === "authenticated" 
          // || session?.user ? 
          !true ?
          (
            // <UserNav
            //   email={session.user.email || "No email"}
            //   name={session.user.name || "Guest"}
            //   userImage={session.user.avatarUrl || "https://avatar.vercel.sh/teacher"}
            // />
            <></>
          ) : (
            <UserNav email="Guest" name="Guest" userImage="https://avatar.vercel.sh/luke" />
          )}
        </div>
      </div>
    </ContextMenuWrapper>
  );
};

export default InfoBar;
