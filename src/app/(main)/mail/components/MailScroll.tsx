"use client"

import * as React from "react"
import {
  Search,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  ResizableHandle,
  ResizablePanel,
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
import { usePathname } from "next/navigation"

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
  const [mail, setMail] = useMail()
  const pathName = usePathname()

  return (
    <>
    <ResizableHandle withHandle />
    <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2">
              {/* 
              //TODO: 在这里添加一个数据筛选，显示不同种类的mail数据。比如inbox，sent，junk
              */}
              <h1 className="text-xl font-bold">{pathName.split("/")[2] || "all mail"}</h1>
              {/* 
              //MARK: Tab: All | Unread
              */}
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  All mail
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Unread
                </TabsTrigger>
                <TabsTrigger
                  value="importent"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Importent
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />

            {/* 
            //MARK: Search
            //TODO: Search是实现关键字搜索,添加一个筛选功能
              -- 在Search尾部添加一个下拉箭头，里面有所有的mail具有的label
              -- 可以单独设置某一个label一直高亮
              -- 可以通过点击选择来筛选mail
            */}
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            {/* 
            //MARK: MailList
            */}
            <TabsContent value="all" className="m-0">
              {/* <MailList items={mails} mail={mail} /> */}
              <div className='flex flex-col h-fit'>
                <ScrollArea className="flex-grow max-h-screen h-screen overflow-y-auto pb-32">
                  <div className="flex flex-col gap-2 p-4 pt-0">
                    {mails.map((item) => (
                      // MARK: Mail item
                      <button
                        key={item.id}
                        className={cn(
                          "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                          mail.selected === item.id && "bg-muted"
                        )}
                        onClick={() =>
                          // INFO: 使用Atom全局变量
                          // INFO: 点击之后把当前email变成selectedEmail，传递给emailDisplay展示出来
                          setMail({
                            ...mail,
                            selected: item.id,
                          })
                        }
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
                                mail.selected === item.id
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
                        {/* 
                        // MARK: Attr Badge
                        */}
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
                </ScrollArea>
              </div>
            </TabsContent>

            {/* 
            // MARK: Unread
            */}
            <TabsContent value="unread" className="m-0">
              <div className='flex flex-col h-fit'>
                <ScrollArea className="flex-grow max-h-screen h-screen overflow-y-auto pb-32">
                  <div className="flex flex-col gap-2 p-4 pt-0">
                    {mails
                    .filter((item) => item.read === false)
                    .map((item) => (
                      // MARK: Mail item
                      <button
                        key={item.id}
                        className={cn(
                          "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                          mail.selected === item.id && "bg-muted"
                        )}
                        onClick={() =>
                          // INFO: 使用Atom全局变量
                          // INFO: 点击之后把当前email变成selectedEmail，传递给emailDisplay展示出来
                          setMail({
                            ...mail,
                            selected: item.id,
                          })
                        }
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
                                mail.selected === item.id
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
                        {/* 
                        // MARK: Attr Badge
                        */}
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
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </ResizablePanel>

        <ResizableHandle withHandle />
        {/* 
        //MARK: MailDisplay
        */}
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
          <MailDisplay
            mail={mails.find((item) => item.id === mail.selected) || null}
          />
        </ResizablePanel>

    </>
  );
};

export default MailScroll;