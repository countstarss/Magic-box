"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
// import { signOut } from "next-auth/react"; // 引入 signOut 方法
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  email: string;
  name: string;
  userImage: string | undefined;
}

export function UserNav({ email, name, userImage }: Props) {
  // const handleLogout = () => {
  //   signOut({ callbackUrl: "/login" }); // 登出后重定向到登录页面
  // };
  const pathname = usePathname();
  const isDashboard = pathname?.includes("/dashboard");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={cn("relative h-10 w-10 rounded-full", isDashboard && "h-8 w-8")}>
          <Avatar className={cn("h-10 w-10", isDashboard && "h-8 w-8")}>
            <AvatarImage src={userImage} alt="User Image" />
            <AvatarFallback>{name.slice(0, 3)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      {/* DropdownMenu */}
      <DropdownMenuContent className="w-56 z-[120] mt-2" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/sell">Sell Product</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/my-account">My Account</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/billing">Billing</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Logout Button */}
        <DropdownMenuItem 
          // onClick={handleLogout}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

