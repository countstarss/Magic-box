"use client"

import * as React from "react"
import {
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { TooltipProvider } from "@/components/ui/tooltip"
import { type Mail } from "../../../../lib/data"
import Nav from "./nav"

interface MailProps {
  accounts: {
    label: string
    email: string
    icon: React.ReactNode
  }[]
  mails: Mail[]
  defaultLayout: number[] | undefined
  defaultCollapsed?: boolean
  navCollapsedSize: number
  children:React.ReactNode
}

export function Mail({
  accounts,
  mails,
  defaultLayout = [20, 32, 48],
  defaultCollapsed = false,
  children
}: MailProps) {

  return (
    <TooltipProvider delayDuration={0}>
      {/* 
      //MARK: Panel
      */}
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
            sizes
          )}`
        }}
        className="h-screen items-stretch"
      >
        <Nav 
            accounts={accounts}
            mails={mails}
            defaultLayout={defaultLayout}
            defaultCollapsed={defaultCollapsed}
            navCollapsedSize={4}
        />
        {children}
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
