"use client";

import * as React from "react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  ArrowLeft,
  ArrowRight,
  Archive,
  ArchiveX,
  FileText,
  Loader2,
  Mail,
  MoreHorizontal,
  Reply,
  ReplyAll,
  Trash,
} from "lucide-react";
import { EmailMessage } from "@/lib/types/nylas-types";
import { cn } from "@/lib/utils";

interface GmailMailDisplayProps {
  email: EmailMessage | null;
  loading?: boolean;
}

export function GmailMailDisplay({ email, loading = false }: GmailMailDisplayProps) {
  // 邮件内容区域的引用，用于设置HTML内容
  const emailContentRef = React.useRef<HTMLDivElement>(null);

  // 当邮件内容变更时，更新HTML
  React.useEffect(() => {
    if (emailContentRef.current && email?.body) {
      emailContentRef.current.innerHTML = email.body;
    }
  }, [email]);

  // 获取发件人首字母用于头像
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!email) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <Mail className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">Select a message</h3>
        <p className="text-sm text-muted-foreground">
          Choose a message from the list to view its content
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button variant="ghost" size="icon">
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Archive className="h-4 w-4" />
                <span className="sr-only">Archive</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Archive</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <ArchiveX className="h-4 w-4" />
                <span className="sr-only">Move to junk</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to junk</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash className="h-4 w-4" />
                <span className="sr-only">Move to trash</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to trash</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>More</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <Separator />
      <div className="flex flex-1 flex-col overflow-auto p-4">
        <div className="flex items-start justify-between pb-4">
          <div className="flex items-start gap-4">
            <Avatar className="hidden size-10 sm:flex">
              <AvatarImage alt={email.sender.name} />
              <AvatarFallback>
                {getInitials(email.sender.name)}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <div className="font-semibold">{email.subject}</div>
              <div className="flex items-center gap-2">
                <div className="font-medium">{email.sender.name}</div>
                <div className="text-xs text-muted-foreground">
                  &lt;{email.sender.email}&gt;
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {format(new Date(email.date), "PPP 'at' p")}
              </div>
              <div className="text-xs text-muted-foreground">
                To:{" "}
                {email.recipients
                  .map((recipient) => recipient.name || recipient.email)
                  .join(", ")}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Reply className="h-4 w-4" />
              <span className="sr-only">Reply</span>
            </Button>
            <Button variant="ghost" size="icon">
              <ReplyAll className="h-4 w-4" />
              <span className="sr-only">Reply all</span>
            </Button>
          </div>
        </div>
        <Separator className="my-4" />
        <div
          ref={emailContentRef}
          className={cn(
            "prose prose-sm dark:prose-invert w-full max-w-full overflow-auto"
          )}
        />
        {email.attachments && email.attachments.length > 0 && (
          <>
            <Separator className="my-4" />
            <div>
              <h3 className="mb-2 text-sm font-medium">Attachments</h3>
              <div className="grid gap-2">
                {email.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center gap-2 rounded-md border p-2"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm font-medium">{attachment.filename}</div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round(attachment.size / 1024)} KB
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto">
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 