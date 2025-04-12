import { format, addDays, addHours, nextSaturday } from "date-fns"
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
import { useRouter } from "next/navigation"
import React from "react"

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
import { useMail } from "@/hooks/use-mail"
import { EmailMessage } from "@/lib/types/nylas-types"
import { useMarkEmailAsRead } from "@/hooks/use-mail-queries"

interface MailDisplayProps {
  mail: EmailMessage | null
}

export function MailDisplay({ mail }: MailDisplayProps) {
  const today = new Date()
  const { setConfig } = useMail()
  const router = useRouter()
  const markEmailAsRead = useMarkEmailAsRead()

  // 归档邮件
  const handleArchive = () => {
    if (!mail) return
    
    toast.success(`Email archived`, {
      description: `"${mail.subject}" has been moved to archive`,
      position: "bottom-right",
    })
  }

  // 移到垃圾邮件
  const handleMoveToJunk = () => {
    if (!mail) return
    
    toast.success(`Email moved to junk`, {
      description: `"${mail.subject}" has been moved to junk folder`,
      position: "bottom-right",
    })
  }

  // 移到垃圾箱
  const handleMoveToTrash = () => {
    if (!mail) return
    
    toast.success(`Email trashed`, {
      description: `"${mail.subject}" has been moved to trash`,
      position: "bottom-right",
    })
  }

  // 标记为未读
  const handleMarkAsUnread = () => {
    if (!mail) return
    
    toast.success(`Marked as unread`, {
      description: `"${mail.subject}" has been marked as unread`,
      position: "bottom-right",
    })
  }

  // 添加星标
  const handleStarThread = () => {
    if (!mail) return
    const hasLabel = mail.labels?.includes("important") || false
    
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
    const query = new URLSearchParams({
      to: mail.sender.email,
      subject: `Re: ${mail.subject}`,
      content: `\n\n--- Original message from ${mail.sender.name} (${mail.sender.email}) ---\n${mail.snippet}`
    }).toString()
    
    router.push(`/mail/compose?${query}`)
  }

  // Handle Reply All
  const handleReplyAll = () => {
    if (!mail) return
    const query = new URLSearchParams({
      to: mail.sender.email,
      subject: `Re: ${mail.subject}`,
      content: `\n\n--- Original message from ${mail.sender.name} (${mail.sender.email}) ---\n${mail.snippet}`
    }).toString()
    
    router.push(`/mail/compose?${query}`)
  }

  // Handle Forward
  const handleForward = () => {
    if (!mail) return
    const query = new URLSearchParams({
      subject: `Fwd: ${mail.subject}`,
      content: `\n\n--- Forwarded message from ${mail.sender.name} (${mail.sender.email}) ---\n${mail.snippet}`
    }).toString()
    
    router.push(`/mail/compose?${query}`)
  }

  // Mark the email as read when viewed
  React.useEffect(() => {
    if (mail?.id && mail.unread) {
      markEmailAsRead.mutate(mail.id);
    }
  }, [mail?.id, mail?.unread, markEmailAsRead]);

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
                onClick={handleReplyAll}
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
                onClick={handleForward}
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
              {mail?.labels?.includes("important") ? "Remove star" : "Star thread"}
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
                <AvatarImage alt={mail.sender.name} />
                <AvatarFallback>
                  {mail.sender.name
                    .split(" ")
                    .map((chunk) => chunk[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">{mail.sender.name}</div>
                <div className="line-clamp-1 text-xs">{mail.subject}</div>
                <div className="line-clamp-1 text-xs">
                  <span className="font-medium">Reply-To:</span> {mail.sender.email}
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
            {mail.body || mail.snippet}
          </div>
          <Separator className="mt-auto" />
          <div className="p-4">
            <form>
              <div className="grid gap-4">
                <Textarea
                  className="p-4"
                  placeholder={`Reply ${mail.sender.name}...`}
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
