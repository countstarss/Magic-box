"use client";

import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import { EmailMessage } from "@/lib/types/nylas-types";
import { Badge } from "@/components/ui/badge";
import { Paperclip, Star, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GmailMailListProps {
  emails: EmailMessage[];
  onSelectEmail: (id: string) => void;
  loading?: boolean;
}

export function GmailMailList({ emails, onSelectEmail, loading = false }: GmailMailListProps) {
  if (loading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col">
      {emails.length === 0 ? (
        <div className="flex h-[450px] items-center justify-center">
          <p className="text-muted-foreground">No emails found</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {emails.map((email) => (
            <div
              key={email.id}
              className={cn(
                "flex cursor-pointer items-center border-b p-3 hover:bg-muted/50",
                email.unread && "bg-muted/20 font-medium"
              )}
              onClick={() => onSelectEmail(email.id)}
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="flex size-5 items-center justify-center rounded-full border">
                  <Star className="size-4 text-muted-foreground/50" />
                </div>
              </div>
              <div className="ml-2 flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{email.sender.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(email.date), {
                      addSuffix: false,
                    })}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {email.subject}
                </div>
                <div className="text-xs line-clamp-1 text-muted-foreground/80">
                  {email.snippet}
                </div>
                <div className="flex items-center pt-1">
                  {email.hasAttachments && (
                    <Paperclip className="mr-1 size-3 text-muted-foreground" />
                  )}
                  {email.unread && (
                    <Badge variant="secondary" className="ml-auto rounded-full px-2 py-0 text-[10px]">
                      未读
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 