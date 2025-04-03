"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileIcon, ImageIcon, Send, SquarePlus, VideoIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface MessageInputProps {
    // You can define any props needed here
    onSend: (content: string) => Promise<void>;
    newMessage: string;
    setNewMessage: (content: string) => void;
    onHandleSend: () => void;
    className?: string;
}

const MessageInput = ({ 
    onSend,
    newMessage,
    setNewMessage,
    onHandleSend,
    className
}: MessageInputProps) => {


    return (
        <div className={cn("p-4 border bg-background mx-auto w-full h-20", "fixed bottom-0",className)}>
            <div className="max-w-3xl mx-auto flex gap-2 w-full mb-4 h-full">
                <div className="">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <SquarePlus strokeWidth={1.25} className="h-10 w-10 cursor-pointer text-muted-foreground" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                <FileIcon className="h-4 w-4" />
                                <span>
                                    Add File<input type="file" className="opacity-0 w-2" />
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <ImageIcon className="h-4 w-4" />
                                <span>Add Picture</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <VideoIcon className="h-4 w-4" />
                                <span>Add Video</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            onHandleSend();
                        }
                    }}
                    placeholder="输入消息..."
                    className="flex-1"
                />
                <Button onClick={() => onHandleSend()} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default MessageInput;