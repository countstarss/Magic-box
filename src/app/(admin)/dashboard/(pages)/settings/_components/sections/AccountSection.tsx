'use client';

import React from "react";
import { Key } from "lucide-react";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import Section from "../Section";

interface AccountSectionProps {
  setRef: (id: string) => (el: HTMLDivElement | null) => void;
}

const AccountSection: React.FC<AccountSectionProps> = ({ setRef }) => {
  return (
    <Section
      id="account"
      title="账户设置"
      icon={<Key className="mr-2 h-5 w-5" />}
      setRef={setRef}
    >
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>密码与安全</CardTitle>
          <CardDescription>
            管理您的密码和账户安全设置
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">当前密码</Label>
            <Input id="current-password" type="password" />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-password">新密码</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">确认新密码</Label>
              <Input id="confirm-password" type="password" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>更新密码</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>双重认证</CardTitle>
          <CardDescription>
            提高账户安全性，添加双重认证
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="font-medium">短信验证</h4>
              <p className="text-sm text-muted-foreground">
                登录时会向您的手机发送验证码
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="font-medium">Google Authenticator</h4>
              <p className="text-sm text-muted-foreground">
                使用身份验证器应用进行验证
              </p>
            </div>
            <Button variant="outline" size="sm">设置</Button>
          </div>
        </CardContent>
      </Card>
    </Section>
  );
};

export default AccountSection; 