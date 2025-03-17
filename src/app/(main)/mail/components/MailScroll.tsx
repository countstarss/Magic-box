"use client"

import * as React from "react"
import {
  Search,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  ResizableHandle,
  ResizablePanel
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { type Mail } from "../../../../lib/data"
import { useMail } from "@/hooks/use-mail"
import { MailDisplay } from "./mail-display"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { getBadgeVariantFromLabel } from "./badgeHighlight"

interface MailListProps {
  // You can define any props needed here
  mails: Mail[]
  defaultLayout: number[] | undefined
  children?:React.ReactNode
}

const MailScroll: React.FC<MailListProps> = ({
  mails,
  defaultLayout = [20, 32, 48],
}) => {
  const { config, setConfig, markAsRead } = useMail();

  const handleMailClick = (mailId: string) => {
    setConfig(prev => ({ ...prev, selected: mailId }));
    markAsRead(mailId);
  };

  // 渲染邮件列表的辅助函数
  const renderMailList = (mailsToRender: Mail[]) => (
    <div className="flex flex-col gap-2 p-4 pt-0">
      {mailsToRender.map((item) => (
        <button
          key={item.id}
          className={cn(
            "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
            config.selected === item.id && "bg-muted"
          )}
          onClick={() => handleMailClick(item.id)}
        >
          <div className="flex w-full flex-col gap-1">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="font-semibold">{item.name}</div>
                {!item.read && (
                  <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                )}
              </div>
              <div
                className={cn(
                  "ml-auto text-xs",
                  config.selected === item.id
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {formatDistanceToNow(new Date(item.date), {
                  addSuffix: true,
                })}
              </div>
            </div>
            <div className="text-xs font-medium">{item.subject}</div>
          </div>
          <div className="line-clamp-2 text-xs text-muted-foreground">
            {item.text.substring(0, 300)}
          </div>
          {item.labels.length ? (
            <div className="flex items-center gap-2">
              {item.labels.map((label) => (
                <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                  {label}
                </Badge>
              ))}
            </div>
          ) : null}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
        <Tabs defaultValue="all">
          <div className="flex items-center px-4 py-2">
            <h1 className="text-xl font-bold">Inbox</h1>
            <TabsList className="ml-auto">
              <TabsTrigger value="all">All mail</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="important">Important</TabsTrigger>
            </TabsList>
          </div>
          <Separator />
          <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <form>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search" className="pl-8" />
              </div>
            </form>
          </div>
          <TabsContent value="all" className="m-0">
            <ScrollArea className="h-screen">
              {renderMailList(config.mails)}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="unread" className="m-0">
            <ScrollArea className="h-screen">
              {renderMailList(config.mails.filter(mail => !mail.read))}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="important" className="m-0">
            <ScrollArea className="h-screen">
              {renderMailList(config.mails.filter(mail => 
                mail.labels.includes('important')
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
        <MailDisplay
          mail={config.mails.find((item) => item.id === config.selected) || null}
        />
      </ResizablePanel>
    </>
  );
};

export default MailScroll;