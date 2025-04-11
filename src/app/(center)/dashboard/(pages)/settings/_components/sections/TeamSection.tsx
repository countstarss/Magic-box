'use client';

import React from "react";
import { Users } from "lucide-react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Section from "../Section";

interface TeamSectionProps {
  setRef: (id: string) => (el: HTMLDivElement | null) => void;
}

const TeamSection: React.FC<TeamSectionProps> = ({ setRef }) => {
  return (
    <Section
      id="team"
      title="团队管理"
      icon={<Users className="mr-2 h-5 w-5" />}
      setRef={setRef}
    >
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>团队成员</CardTitle>
              <CardDescription>
                管理您团队中的成员和权限
              </CardDescription>
            </div>
            <Button size="sm">添加成员</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 团队成员列表 */}
            <div className="rounded-md border border-input">
              <div className="flex items-center p-4 border-b">
                <div className="flex items-center flex-1 gap-3">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">陈明</p>
                    <p className="text-sm text-muted-foreground">contact@example.com</p>
                  </div>
                </div>
                <Badge>管理员</Badge>
                <Button variant="ghost" size="sm" className="ml-2">
                  管理
                </Button>
              </div>
              
              <div className="flex items-center p-4 border-b">
                <div className="flex items-center flex-1 gap-3">
                  <Avatar>
                    <AvatarImage src="/members/member2.png" />
                    <AvatarFallback>LH</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">李华</p>
                    <p className="text-sm text-muted-foreground">lh@example.com</p>
                  </div>
                </div>
                <Badge variant="outline">编辑者</Badge>
                <Button variant="ghost" size="sm" className="ml-2">
                  管理
                </Button>
              </div>
              
              <div className="flex items-center p-4">
                <div className="flex items-center flex-1 gap-3">
                  <Avatar>
                    <AvatarImage src="/members/member3.png" />
                    <AvatarFallback>WY</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">王颖</p>
                    <p className="text-sm text-muted-foreground">wy@example.com</p>
                  </div>
                </div>
                <Badge variant="outline">查看者</Badge>
                <Button variant="ghost" size="sm" className="ml-2">
                  管理
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Section>
  );
};

export default TeamSection; 