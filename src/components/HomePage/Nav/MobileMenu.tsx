"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface MobileMenuProps {
  items: {
    title: string;
    href: string;
    description?: string;
  }[];
  style?: boolean;  
}

export function MobileMenu({
  items,
  style
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const location = usePathname();

  //TODO: 更新MobileMenu （lib/menu）
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {
          style ? (
            <Button variant="ghost" size="icon">
              <Menu className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="outline" size="icon">
              <Menu className="w-4 h-4" />
            </Button>
          )
        }
      </SheetTrigger>
      <SheetContent side="right" className="z-[120]">
        <div className="mt-10 flex px-2 space-y-1 flex-col">
          {items.map((item) => (
            <Link
              href={item.href}
              key={item.title}
              className={cn(
                location === item.href
                  ? "bg-muted"
                  : "hover:bg-muted hover:bg-opacity-75",
                "group flex items-center px-2 py-2 font-medium rounded-md"
              )}
              onClick={() => setOpen(false)}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
