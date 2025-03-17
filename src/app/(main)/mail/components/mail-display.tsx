import {addDays} from "date-fns/addDays"
import {addHours} from "date-fns/addHours"
import {format} from "date-fns/format"
import {nextSaturday} from "date-fns/nextSaturday"
import {
  Archive,
  ArchiveX,
  Clock,
  Forward,
  MoreVertical,
  Reply,
  ReplyAll,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Mail } from "../../../../lib/data"
import { useMail } from "@/hooks/use-mail"

interface MailDisplayProps {
  mail: Mail | null
}

export function MailDisplay({ mail }: MailDisplayProps) {
  const today = new Date()
  const { setConfig } = useMail()

  // 归档邮件
  const handleArchive = () => {
    if (!mail) return
    setConfig(prev => ({
      ...prev,
      mails: prev.mails.map(m => 
        m.id === mail.id 
          ? { ...m, folder: "archive" }
          : m
      )
    }))
    toast.success(`Email archived`, {
      description: `"${mail.subject}" has been moved to archive`,
      position: "bottom-right",
    })
  }

  // 移到垃圾邮件
  const handleMoveToJunk = () => {
    if (!mail) return
    setConfig(prev => ({
      ...prev,
      mails: prev.mails.map(m => 
        m.id === mail.id 
          ? { ...m, folder: "junk" }
          : m
      )
    }))
    toast.success(`Email moved to junk`, {
      description: `"${mail.subject}" has been moved to junk folder`,
      position: "bottom-right",
    })
  }

  // 移到垃圾箱
  const handleMoveToTrash = () => {
    if (!mail) return
    setConfig(prev => ({
      ...prev,
      mails: prev.mails.map(m => 
        m.id === mail.id 
          ? { ...m, folder: "trash" }
          : m
      )
    }))
    toast.success(`Email trashed`, {
      description: `"${mail.subject}" has been moved to trash`,
      position: "bottom-right",
    })
  }

  // 标记为未读
  const handleMarkAsUnread = () => {
    if (!mail) return
    setConfig(prev => ({
      ...prev,
      mails: prev.mails.map(m => 
        m.id === mail.id 
          ? { ...m, read: false }
          : m
      )
    }))
    toast.success(`Marked as unread`, {
      description: `"${mail.subject}" has been marked as unread`,
      position: "bottom-right",
    })
  }

  // 添加星标
  const handleStarThread = () => {
    if (!mail) return
    const hasLabel = mail.labels.includes("important")
    
    setConfig(prev => ({
      ...prev,
      mails: prev.mails.map(m => 
        m.id === mail.id 
          ? { 
              ...m, 
              labels: hasLabel 
                ? m.labels.filter(label => label !== "important") 
                : [...m.labels, "important"] 
            }
          : m
      )
    }))
    
    toast.success(hasLabel ? `Star removed` : `Starred`, {
      description: hasLabel 
        ? `Star removed from "${mail.subject}"` 
        : `"${mail.subject}" has been starred`,
      position: "bottom-right",
    })
  }

  // 处理回复邮件
  const handleReply = () => {
    if (!mail) return
    toast.info(`Replying`, {
      description: `Composing reply to "${mail.subject}"`,
      position: "bottom-right",
    })
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                disabled={!mail}
                onClick={handleArchive}
              >
                <Archive className="h-4 w-4" />
                <span className="sr-only">Archive</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Archive</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                disabled={!mail}
                onClick={handleMoveToJunk}
              >
                <ArchiveX className="h-4 w-4" />
                <span className="sr-only">Move to junk</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent >Move to junk</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                disabled={!mail}
                onClick={handleMoveToTrash}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Move to trash</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to trash</TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Tooltip>
            <Popover>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={!mail}>
                    <Clock className="h-4 w-4" />
                    <span className="sr-only">Snooze</span>
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>
              <PopoverContent className="flex w-[535px] p-0">
                <div className="flex flex-col gap-2 border-r px-2 py-4">
                  <div className="px-4 text-sm font-medium">Snooze until</div>
                  <div className="grid min-w-[250px] gap-1">
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                      onClick={() => {
                        if (!mail) return
                        toast.success(`Email snoozed`, {
                          description: `"${mail.subject}" will return later today`,
                          position: "bottom-right",
                        })
                      }}
                    >
                      Later today{" "}
                      <span className="ml-auto text-muted-foreground">
                        {format(addHours(today, 4), "E, h:m b")}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                      onClick={() => {
                        if (!mail) return
                        toast.success(`Email snoozed`, {
                          description: `"${mail.subject}" will return tomorrow`,
                          position: "bottom-right",
                        })
                      }}
                    >
                      Tomorrow
                      <span className="ml-auto text-muted-foreground">
                        {format(addDays(today, 1), "E, h:m b")}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                      onClick={() => {
                        if (!mail) return
                        toast.success(`Email snoozed`, {
                          description: `"${mail.subject}" will return this weekend`,
                          position: "bottom-right",
                        })
                      }}
                    >
                      This weekend
                      <span className="ml-auto text-muted-foreground">
                        {format(nextSaturday(today), "E, h:m b")}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                      onClick={() => {
                        if (!mail) return
                        toast.success(`Email snoozed`, {
                          description: `"${mail.subject}" will return next week`,
                          position: "bottom-right",
                        })
                      }}
                    >
                      Next week
                      <span className="ml-auto text-muted-foreground">
                        {format(addDays(today, 7), "E, h:m b")}
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="p-2">
                  <Calendar />
                </div>
              </PopoverContent>
            </Popover>
            <TooltipContent>Snooze</TooltipContent>
          </Tooltip>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                disabled={!mail}
                onClick={handleReply}
              >
                <Reply className="h-4 w-4" />
                <span className="sr-only">Reply</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                disabled={!mail}
                onClick={() => {
                  if (!mail) return
                  toast.info(`Reply all`, {
                    description: `Composing reply to all recipients of "${mail.subject}"`,
                    position: "bottom-right",
                  })
                }}
              >
                <ReplyAll className="h-4 w-4" />
                <span className="sr-only">Reply all</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply all</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                disabled={!mail}
                onClick={() => {
                  if (!mail) return
                  toast.info(`Forward`, {
                    description: `Forwarding "${mail.subject}"`,
                    position: "bottom-right",
                  })
                }}
              >
                <Forward className="h-4 w-4" />
                <span className="sr-only">Forward</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Forward</TooltipContent>
          </Tooltip>
        </div>
        <Separator orientation="vertical" className="mx-2 h-6" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={!mail}>
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleMarkAsUnread}>
              Mark as unread
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleStarThread}>
              {mail?.labels.includes("important") ? "Remove star" : "Star thread"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              if (!mail) return
              toast.info(`Adding label`, {
                description: `Choose a label for "${mail.subject}"`,
                position: "bottom-right",
              })
            }}>
              Add label
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              if (!mail) return
              toast.success(`Thread muted`, {
                description: `"${mail.subject}" has been muted`,
                position: "bottom-right",
              })
            }}>
              Mute thread
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      {mail ? (
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <Avatar>
                <AvatarImage alt={mail.name} />
                <AvatarFallback>
                  {mail.name
                    .split(" ")
                    .map((chunk) => chunk[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">{mail.name}</div>
                <div className="line-clamp-1 text-xs">{mail.subject}</div>
                <div className="line-clamp-1 text-xs">
                  <span className="font-medium">Reply-To:</span> {mail.email}
                </div>
              </div>
            </div>
            {mail.date && (
              <div className="ml-auto text-xs text-muted-foreground">
                {format(new Date(mail.date), "PPpp")}
              </div>
            )}
          </div>
          <Separator />
          <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
            {mail.text}
          </div>
          <Separator className="mt-auto" />
          <div className="p-4">
            <form>
              <div className="grid gap-4">
                <Textarea
                  className="p-4"
                  placeholder={`Reply ${mail.name}...`}
                />
                <div className="flex items-center">
                  <Label
                    htmlFor="mute"
                    className="flex items-center gap-2 text-xs font-normal"
                  >
                    <Switch id="mute" aria-label="Mute thread" /> Mute this
                    thread
                  </Label>
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      toast.success(`Reply sent`, {
                        description: `Your reply to "${mail.subject}" has been sent`,
                        position: "bottom-right",
                      })
                    }}
                    size="sm"
                    className="ml-auto"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No message selected
        </div>
      )}
    </div>
  )
}
