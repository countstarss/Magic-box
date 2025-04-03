"use client";
import { ChatRoom } from "./_components/chat/chat-room";

export default function Square() {
  //MARK: 获取频道信息

  return (
    <div className="flex flex-col h-full">
      {/* <PublicChat /> */}
      <ChatRoom channelId="public" type="public"/>
    </div>
  );
}