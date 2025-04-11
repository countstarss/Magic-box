'use client';

import React from "react";
import { BarChart3 } from "lucide-react";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Section from "../Section";

interface UsageSectionProps {
  setRef: (id: string) => (el: HTMLDivElement | null) => void;
}

const UsageSection: React.FC<UsageSectionProps> = ({ setRef }) => {
  return (
    <Section
      id="usage"
      title="使用情况"
      icon={<BarChart3 className="mr-2 h-5 w-5" />}
      setRef={setRef}
    >
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>订阅计划</CardTitle>
              <CardDescription>
                当前计划和使用情况
              </CardDescription>
            </div>
            <Badge className="ml-2">专业版</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>邮件发送量</span>
              <span>48,500 / 100,000</span>
            </div>
            <Progress value={48.5} className="h-2" />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>联系人数量</span>
              <span>3,845 / 10,000</span>
            </div>
            <Progress value={38.45} className="h-2" />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>模板使用量</span>
              <span>28 / 50</span>
            </div>
            <Progress value={56} className="h-2" />
          </div>
          
          <div className="rounded-lg bg-muted p-4">
            <h4 className="font-medium mb-2">计划详情</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>月费用</span>
                <span className="font-medium">￥299/月</span>
              </li>
              <li className="flex justify-between">
                <span>下次续费日期</span>
                <span>2023年12月15日</span>
              </li>
              <li className="flex justify-between">
                <span>支付方式</span>
                <span>支付宝 **** 3456</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">查看账单历史</Button>
          <Button>升级计划</Button>
        </CardFooter>
      </Card>
    </Section>
  );
};

export default UsageSection; 