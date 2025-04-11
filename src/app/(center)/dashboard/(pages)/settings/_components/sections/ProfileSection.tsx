'use client';

import React from "react";
import { UserCircle } from "lucide-react";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Section from "../Section";

interface ProfileSectionProps {
  setRef: (id: string) => (el: HTMLDivElement | null) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ setRef }) => {
  return (
    <Section 
      id="profile" 
      title="个人信息" 
      icon={<UserCircle className="mr-2 h-5 w-5" />}
      setRef={setRef}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>个人资料</CardTitle>
          <CardDescription>
            管理您的个人资料信息
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button size="sm">更换头像</Button>
              <p className="text-xs text-muted-foreground">
                推荐使用至少 300×300 像素的JPG, GIF或PNG格式图片
              </p>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              <Input id="name" placeholder="输入您的姓名" defaultValue="陈明" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job-title">职位</Label>
              <Input id="job-title" placeholder="输入您的职位" defaultValue="市场营销总监" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">邮箱地址</Label>
              <Input id="email" type="email" placeholder="输入您的邮箱" defaultValue="contact@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">手机号码</Label>
              <Input id="phone" placeholder="输入您的手机号" defaultValue="138****1234" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">个人简介</Label>
            <textarea
              id="bio"
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="简单介绍一下自己"
              defaultValue="10年邮件营销经验，擅长客户关系管理和精准营销策略制定。"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button>保存修改</Button>
        </CardFooter>
      </Card>
    </Section>
  );
};

export default ProfileSection; 