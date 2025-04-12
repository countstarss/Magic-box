'use client';

import React from "react";
import { HelpCircle } from "lucide-react";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Section from "../Section";

interface HelpSectionProps {
  setRef: (id: string) => (el: HTMLDivElement | null) => void;
}

const HelpSection: React.FC<HelpSectionProps> = ({ setRef }) => {
  return (
    <Section
      id="help"
      title="帮助中心"
      icon={<HelpCircle className="mr-2 h-5 w-5" />}
      setRef={setRef}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>帮助与支持</CardTitle>
          <CardDescription>
            获取帮助和查看常见问题
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">文档中心</h3>
              <p className="text-sm text-muted-foreground mb-4">
                查阅详细的产品使用文档和指南
              </p>
              <Button variant="outline" size="sm">浏览文档</Button>
            </div>
            
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">视频教程</h3>
              <p className="text-sm text-muted-foreground mb-4">
                观看产品功能演示和操作指导
              </p>
              <Button variant="outline" size="sm">查看教程</Button>
            </div>
            
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">联系客服</h3>
              <p className="text-sm text-muted-foreground mb-4">
                联系我们的客服团队获取帮助
              </p>
              <Button variant="outline" size="sm">联系我们</Button>
            </div>
            
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">常见问题</h3>
              <p className="text-sm text-muted-foreground mb-4">
                浏览常见问题解答和使用技巧
              </p>
              <Button variant="outline" size="sm">查看FAQ</Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            客服热线: 400-123-4567
          </div>
          <div className="text-sm text-muted-foreground">
            服务时间: 工作日 9:00-18:00
          </div>
        </CardFooter>
      </Card>
    </Section>
  );
};

export default HelpSection; 