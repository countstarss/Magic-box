"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useLocalSession } from "@/providers/SessionProvider";
import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import MessageInput from "./message-input";
import { cn } from "@/lib/utils";
import { ChatHeader } from "./chat-header";
import { Channel } from "@/types/convex/channel";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface ChatRoomProps {
  channelId: string;
  type: string;
  channel?: Channel;
}

export function ChatRoom({
  channelId,
  type,
  channel
}: ChatRoomProps) {
  const { session } = useLocalSession();
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // 没有任何权益的状态下，只加载固定的100条
  const messages = useQuery(api.messages.list, { channelId: channelId, limit: 100 });
  const sendMessage = useMutation(api.messages.send);

  // MARK: scrollToBottom
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: behavior
        });
      }
    }
  };

  // 初始加载时立即滚动到底部，不需要动画
  useEffect(() => {
    if (messages?.messages?.length) {
      scrollToBottom('instant');
    }
  }, []); // 仅在组件挂载时执行一次

  // MARK: 平滑滚动
  useEffect(() => {
    if (messages && messages?.messages?.length > 0) {
      scrollToBottom('smooth');
    }
  }, [messages?.messages?.length]);

  //MARK: handleSend
  const handleSend = async (content: string) => {
    if (!session || !content.trim()) return;

    await sendMessage({
      content,
      userId: session.user.id || "",
      userName: session.user.name || "Anonymous",
      userAvatar: session.user.image || "https://avatar.vercel.sh/default",
      type: type as "public" | "private" | "group",
      channelId: channelId
    });

    setNewMessage("");
    // 发送后平滑滚动到底部
    setTimeout(() => scrollToBottom('smooth'), 100);
  };

  // MARK: 监听滚动位置
  useEffect(() => {
    const scrollContainer = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      // 当距离底部超过500px时显示按钮
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 500;
      setShowScrollButton(!isNearBottom);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  if (!session) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>请先登录后参与聊天</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full justify-center overflow-y-auto relative">
      <ScrollArea 
        ref={scrollRef} 
        className="flex rounded-none h-full"
        style={{ scrollBehavior: 'smooth' }}
      >
        {
          channel && (
            <ChatHeader
              title={"#" + channel.name}
              channel={channel}
            />
          )
        }
        <div className="space-y-4 max-w-7xl w-full mx-auto h-fit p-4 mb-32"
          //MARK: 消息列表
        >
          {messages?.messages?.map((message: any) => (
            <div
              key={message._id}
              className={cn(
                "flex items-start gap-2 w-full",
                message.userId === session.user.id ? "justify-end" : "justify-start"
              )}
            >
              {message.userId !== session.user.id && (
                <Avatar>
                  <AvatarImage src={message.userAvatar} />
                  <AvatarFallback>
                    {message.userName[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}

              <div className={cn(
                "flex flex-col max-w-[70%]",
                message.userId === session.user.id ? "items-end" : "items-start"
              )}>
                <div className={cn(
                  "flex items-center gap-2",
                  message.userId === session.user.id ? "flex-row-reverse" : "flex-row"
                )}>
                  <span className="text-sm font-medium">{message.userName}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(message.createdAt, {
                      addSuffix: true,
                      locale: zhCN,
                    })}
                  </span>
                </div>
                <ContextMenu>
                  <ContextMenuTrigger>
                    <div className={cn(
                      "mt-1 rounded-lg p-2 break-words",
                      "max-w-full w-fit",
                      message.userId === session.user.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}>
                      {message.content}
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem>Profile</ContextMenuItem>
                    <ContextMenuItem>Billing</ContextMenuItem>
                    <ContextMenuItem>Team</ContextMenuItem>
                    <ContextMenuItem>Subscription</ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </div>

              {message.userId === session.user.id && (
                <Avatar>
                  <AvatarImage src={message.userAvatar} />
                  <AvatarFallback>
                    {message.userName[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
        
        {/* 回到底部按钮 */}
        {showScrollButton && (
          <Button
            onClick={() => scrollToBottom('smooth')}
            className="fixed bottom-24 right-8 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 bg-primary dark:bg-gray-200"
            size="icon"
          >
            <ChevronDown className="h-4 w-4 text-white dark:text-black" />
          </Button>
        )}

        <MessageInput
          onSend={handleSend}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onHandleSend={() => handleSend(newMessage)}
          className='absolute bottom-12'
        />
      </ScrollArea>

    </div>
  );
} 