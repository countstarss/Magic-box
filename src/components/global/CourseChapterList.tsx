"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { useState } from "react";

interface CourseChapterListProps {
  items: {
    title: string;
    description?: string;
  }[];
  style?: boolean;
  onChapterClick: (index: number) => void;
  currentChapterIndex: number;
}

export function CourseChapterList({
  items,
  style,
  onChapterClick,
  currentChapterIndex
}: CourseChapterListProps) {
  const [open, setOpen] = useState(false);
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
          {items.map((item, index) => (
              <Label
                key={item.title + index}
                onClick={() => {
                  onChapterClick?.(index);
                  setOpen(false);
                }}
                className={cn(
                  `group flex items-center px-2 py-2 font-medium rounded-md 
                   hover:bg-neutral-100 cursor-pointer justify-center text-md`,
                  currentChapterIndex === index && "bg-neutral-200"
                )}
              >
              {item.title}
            </Label>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
