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
import React, { useMemo } from "react"

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
import { EmailMessage } from "@/lib/types/nylas-types"
import { useMarkEmailAsRead } from "@/hooks/use-mail-queries"
import { useAtom } from "jotai"
import { selectedMailAtom, mailStateAtom } from "@/lib/mail-state"
import { useMail } from "@/hooks/use-mail"

interface MailDisplayProps {
  mail: EmailMessage | null
}

export function MailDisplay({ mail }: MailDisplayProps) {
  const today = new Date()
  const router = useRouter()
  const markEmailAsRead = useMarkEmailAsRead()
  
  // 使用全局状态
  const [selectedMail, setSelectedMail] = useAtom(selectedMailAtom);
  const [mailState] = useAtom(mailStateAtom);
  
  // 使用 useMail hook 获取邮件缓存
  const { getEmail, emailCache } = useMail();
  
  // 多级备份系统获取邮件数据
  const emailToDisplay = useMemo(() => {
    // 1. 首先尝试使用传入的邮件属性
    if (mail && mail.id) return mail;
    
    // 2. 尝试使用全局已选择的邮件
    if (selectedMail && selectedMail.id) return selectedMail;
    
    // 3. 如果有选中的ID但没有邮件数据，尝试从useMail中获取
    if (mailState.selectedId) {
      const cachedEmail = getEmail(mailState.selectedId);
      if (cachedEmail) return cachedEmail;
    }
    
    // 4. 如果都没有找到，返回 null
    return null;
  }, [mail, selectedMail, mailState.selectedId, getEmail]);

  // 用于检查是否需要加载更多邮件详情
  const needsFullDetails = useMemo(() => {
    if (!emailToDisplay) return false;
    return !emailToDisplay.body; // 如果没有正文，说明需要获取完整详情
  }, [emailToDisplay]);

  // 当没有完整邮件详情时，记录日志但不触发额外请求
  React.useEffect(() => {
    if (emailToDisplay?.id && needsFullDetails) {
      console.log(`[MailDisplay] 邮件 ${emailToDisplay.id} 缺少完整详情，可能需要额外请求`);
      // 这里不直接请求，因为父组件已经处理了API请求
    }
  }, [emailToDisplay?.id, needsFullDetails]);

  // 归档邮件
  const handleArchive = () => {
    if (!emailToDisplay) return
    
    toast.success(`Email archived`, {
      description: `"${emailToDisplay.subject}" has been moved to archive`,
      position: "bottom-right",
    })
  }

  // 移到垃圾邮件
  const handleMoveToJunk = () => {
    if (!emailToDisplay) return
    
    toast.success(`Email moved to junk`, {
      description: `"${emailToDisplay.subject}" has been moved to junk folder`,
      position: "bottom-right",
    })
  }

  // 移到垃圾箱
  const handleMoveToTrash = () => {
    if (!emailToDisplay) return
    
    toast.success(`Email trashed`, {
      description: `"${emailToDisplay.subject}" has been moved to trash`,
      position: "bottom-right",
    })
  }

  // 标记为未读
  const handleMarkAsUnread = () => {
    if (!emailToDisplay) return
    
    toast.success(`Marked as unread`, {
      description: `"${emailToDisplay.subject}" has been marked as unread`,
      position: "bottom-right",
    })
  }

  // 添加星标
  const handleStarThread = () => {
    if (!emailToDisplay) return
    const hasLabel = emailToDisplay.labels?.includes("important") || false
    
    toast.success(hasLabel ? `Star removed` : `Starred`, {
      description: hasLabel 
        ? `Star removed from "${emailToDisplay.subject}"` 
        : `"${emailToDisplay.subject}" has been starred`,
      position: "bottom-right",
    })
  }

  // 处理回复邮件
  const handleReply = () => {
    if (!emailToDisplay) return
    const query = new URLSearchParams({
      to: emailToDisplay.sender.email,
      subject: `Re: ${emailToDisplay.subject}`,
      content: `\n\n--- Original message from ${emailToDisplay.sender.name} (${emailToDisplay.sender.email}) ---\n${emailToDisplay.snippet}`
    }).toString()
    
    router.push(`/mail/compose?${query}`)
  }

  // Handle Reply All
  const handleReplyAll = () => {
    if (!emailToDisplay) return
    const query = new URLSearchParams({
      to: emailToDisplay.sender.email,
      subject: `Re: ${emailToDisplay.subject}`,
      content: `\n\n--- Original message from ${emailToDisplay.sender.name} (${emailToDisplay.sender.email}) ---\n${emailToDisplay.snippet}`
    }).toString()
    
    router.push(`/mail/compose?${query}`)
  }

  // Handle Forward
  const handleForward = () => {
    if (!emailToDisplay) return
    const query = new URLSearchParams({
      subject: `Fwd: ${emailToDisplay.subject}`,
      content: `\n\n--- Forwarded message from ${emailToDisplay.sender.name} (${emailToDisplay.sender.email}) ---\n${emailToDisplay.snippet}`
    }).toString()
    
    router.push(`/mail/compose?${query}`)
  }

  // Mark the email as read when viewed
  React.useEffect(() => {
    if (emailToDisplay?.id && emailToDisplay.unread) {
      markEmailAsRead.mutate(emailToDisplay.id);
    }
  }, [emailToDisplay?.id, emailToDisplay?.unread, markEmailAsRead]);

  // 如果没有选中的邮件，显示空状态
  if (!emailToDisplay) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold">No email selected</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            Select an email from the list to view its details
          </p>
        </div>
      </div>
    );
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
                disabled={!emailToDisplay}
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
                disabled={!emailToDisplay}
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
                disabled={!emailToDisplay}
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
                  <Button variant="ghost" size="icon" disabled={!emailToDisplay}>
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
                        if (!emailToDisplay) return
                        toast.success(`Email snoozed`, {
                          description: `"${emailToDisplay.subject}" will return later today`,
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
                        if (!emailToDisplay) return
                        toast.success(`Email snoozed`, {
                          description: `"${emailToDisplay.subject}" will return tomorrow`,
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
                        if (!emailToDisplay) return
                        toast.success(`Email snoozed`, {
                          description: `"${emailToDisplay.subject}" will return this weekend`,
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
                        if (!emailToDisplay) return
                        toast.success(`Email snoozed`, {
                          description: `"${emailToDisplay.subject}" will return next week`,
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
                disabled={!emailToDisplay}
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
                disabled={!emailToDisplay}
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
                disabled={!emailToDisplay}
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
            <Button variant="ghost" size="icon" disabled={!emailToDisplay}>
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleMarkAsUnread}>
              Mark as unread
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleStarThread}>
              {emailToDisplay?.labels?.includes("important") ? "Remove star" : "Star thread"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              if (!emailToDisplay) return
              toast.info(`Adding label`, {
                description: `Choose a label for "${emailToDisplay.subject}"`,
                position: "bottom-right",
              })
            }}>
              Add label
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              if (!emailToDisplay) return
              toast.success(`Thread muted`, {
                description: `"${emailToDisplay.subject}" has been muted`,
                position: "bottom-right",
              })
            }}>
              Mute thread
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      <div className="flex-1 overflow-auto p-4">
        <div className="flex items-start justify-between pb-4">
          <h1 className="text-xl font-bold">{emailToDisplay.subject}</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleArchive}>
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleMoveToJunk}>
                Move to junk
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleMoveToTrash}>
                Move to trash
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleMarkAsUnread}>
                Mark as unread
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleStarThread}>
                Add/remove star
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage alt={emailToDisplay.sender.name} />
            <AvatarFallback className="text-xs">
              {emailToDisplay.sender.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <div className="font-semibold">{emailToDisplay.sender.name}</div>
            <div className="line-clamp-1 text-xs">{emailToDisplay.sender.email}</div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            To:{" "}
            {emailToDisplay.recipients.map((recipient) => recipient.name).join(", ")}
          </div>
          <div className="text-sm text-muted-foreground">
            {format(new Date(emailToDisplay.date), "PPpp")}
          </div>
        </div>
        <Separator className="my-4" />
        <div className="whitespace-pre-wrap text-sm">
          {needsFullDetails ? (
            <div className="italic text-muted-foreground">
              加载邮件内容中...请稍候
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: emailToDisplay.body || emailToDisplay.snippet || '' }} />
          )}
        </div>
        {emailToDisplay.hasAttachments && emailToDisplay.attachments && emailToDisplay.attachments.length > 0 && (
          <>
            <Separator className="my-4" />
            <div>
              <h3 className="mb-2 text-sm font-medium">Attachments</h3>
              <div className="grid gap-2">
                {emailToDisplay.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center gap-2 rounded-md border p-2"
                  >
                    <div className="flex-1 truncate">
                      <div className="truncate text-sm font-medium">
                        {attachment.filename}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round(attachment.size / 1024)} KB
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <div className="flex items-center justify-between border-t p-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleReply}
          >
            <Reply className="mr-2 h-4 w-4" />
            Reply
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleReplyAll}
          >
            <ReplyAll className="mr-2 h-4 w-4" />
            Reply all
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleForward}
          >
            <Forward className="mr-2 h-4 w-4" />
            Forward
          </Button>
        </div>
      </div>
    </div>
  )
}
