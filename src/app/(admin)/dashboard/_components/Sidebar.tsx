"use client"

import { usePathname } from 'next/navigation'
import React from 'react'
import Link from 'next/link'
import { menuOptions } from '@/lib/data/constant'
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from '@/components/ui/mode-toggle'
import { MailIcon, PenBox } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const Sidebar = () => {
  const pathName = usePathname()

  return (
    <div className="flex flex-col items-center w-[80px] min-w-[80px] bg-background border-r h-screen overflow-hidden">
      {/* 头部区域 */}
      <div className="flex items-center justify-center w-full p-4">
        <h2 className="font-semibold text-sm">WizMail</h2>
      </div>

      {/* 主菜单区域 */}
      <div className="flex-1 w-full flex flex-col items-center gap-4 pb-6 pt-2">
        {menuOptions.map((menuItem) => (
          <Link
            key={menuItem.name}
            href={menuItem.href}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-md pr-1",
              pathName?.split('/')[2] === menuItem.href.split('/')[2]
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <div className="h-5 w-5">
              <menuItem.Component
                selected={pathName?.split('/')[2] === menuItem.href.split('/')[2]} 
              />
            </div>
          </Link>
        ))}

        <Separator className="w-4/5 my-4" />
      </div>

      {/* 底部控制区域 */}
      <div className="mb-4 flex flex-col gap-4 items-center">
        <div className="w-10 h-10 flex items-center justify-center">
          <Link href="/mail">
            <Button variant="outline" size="icon">
              <MailIcon className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        <div className="w-10 h-10 flex items-center justify-center">
          <ModeToggle iconSize="1rem" />
        </div>
        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center overflow-hidden">
          <span className="font-medium text-sm">LK</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar;