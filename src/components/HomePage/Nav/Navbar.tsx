"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "./MobileMenu";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { UserNav } from "./UserNav";
import BorderMagic from "../../global/Border-Magic";
import { twMerge } from "tailwind-merge";
import { mobileMenu } from "@/lib/data/menu";
// import { useSession } from "next-auth/react";
import { UserCircle } from "lucide-react";
// import { Spinner } from "@/components/Spinner";

export function Navbar({ className }: { className?: string }) {
  // const { data: session, status, update } = useSession();




  return (
    <nav
      className={twMerge(
        "fixed top-0 left-0 right-0 w-screen flex items-center px-4 md:px-20 py-7 justify-between",
        "light:shadow-lg light:bg-white",
        "backdrop-blur-lg z-[10] border-b-[1px] border-black/50 dark:border-white/20 transition-all duration-300",
        className
      )}
    >
      {/* Logo */}
      <div>
        <Link href="/">
          <h1 className="text-2xl font-semibold truncate hidden sm:block">
          <span className="text-indigo-500">Wiz</span>Mail
          </h1>
          <h1 className="text-2xl font-semibold truncate sm:hidden">
            <span className="text-indigo-500">Wiz</span>Mail
          </h1>
        </Link>
      </div>

      {/* Navbar Items */}

      {/* Right-side items */}
      <div className="flex items-center gap-x-2 ms-auto md:col-span-3">
        <Link href="/mail" className="md:block hidden">
          <BorderMagic title="Start Trail" />
        </Link>
        <div className="mx-2">
          <ModeToggle />
        </div>

        {/* UserNav - Dynamic User Info */}
        {false ? (
          <UserCircle size="30" />
        ) : true ? (
          <UserNav
            email={"No email"}
            name={"Guest"}
            userImage={"https://avatar.vercel.sh/teacher"}
          />
        ) : (
          <Link href="/login">
            <Button className="px-6 py-2">Login</Button>
          </Link>
        )}

        {/* Mobile Menu */}
        <div className="md:hidden">
          <MobileMenu items={mobileMenu} />
        </div>
      </div>
    </nav>
  );
}
