"use client";

import * as React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Plus } from "lucide-react";

interface GmailAccountProps {
  email: string;
  name: string;
  isCollapsed: boolean;
}

export function GmailAccount({
  email,
  name,
  isCollapsed,
}: GmailAccountProps) {
  // 获取名称首字母
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-9 w-9 p-0 data-[state=open]:bg-muted md:h-11 md:w-full md:justify-start md:px-2 md:py-2"
        >
          <Avatar className="h-7 w-7">
            <AvatarImage src="" alt={name} />
            <AvatarFallback>{initials || "GM"}</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="hidden md:ml-2 md:flex md:flex-col md:items-start md:leading-none">
              <span className="font-semibold">{name || "Gmail User"}</span>
              <span className="text-xs text-muted-foreground">{email || "user@gmail.com"}</span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/onboarding">
            <Plus className="mr-2 h-4 w-4" />
            <span>Add another account</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings/profile">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/auth/logout">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 