'use client';

import React from "react";
import { UserPlus } from "lucide-react";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Section from "../Section";

interface InviteSectionProps {
  setRef: (id: string) => (el: HTMLDivElement | null) => void;
}

const InviteSection: React.FC<InviteSectionProps> = ({ setRef }) => {
  return (
    <Section
      id="invite"
      title="邀请成员"
      icon={<UserPlus className="mr-2 h-5 w-5" />}
      setRef={setRef}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>邀请新成员</CardTitle>
          <CardDescription>
            邀请新成员加入您的团队
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email-invite">邮箱地址</Label>
              <Input id="email-invite" type="email" placeholder="输入邮箱地址" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">角色</Label>
              <Select defaultValue="viewer">
                <SelectTrigger>
                  <SelectValue placeholder="选择角色" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">管理员</SelectItem>
                  <SelectItem value="editor">编辑者</SelectItem>
                  <SelectItem value="viewer">查看者</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">邀请信息</Label>
            <textarea
              id="message"
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="添加个人邀请信息（可选）"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button>发送邀请</Button>
        </CardFooter>
      </Card>
    </Section>
  );
};

export default InviteSection; 