import React, { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Check, X, CreditCard, Zap, Users, Mail, FileText } from "lucide-react";

// 定义不同的订阅计划
const plans = [
  {
    id: "free",
    name: "免费版",
    price: "¥0",
    description: "适合入门用户和个人邮件使用",
    features: [
      { name: "每月发送500封邮件", included: true },
      { name: "最多100个联系人", included: true },
      { name: "基础模板", included: true },
      { name: "基础分析", included: true },
      { name: "邮件调度", included: false },
      { name: "优先支持", included: false },
      { name: "高级集成", included: false },
    ],
    limits: {
      emailSent: { current: 230, max: 500 },
      contactsCount: { current: 45, max: 100 },
      templatesCount: { current: 3, max: 5 },
    }
  },
  {
    id: "pro",
    name: "专业版",
    price: "¥99",
    billing: "月",
    description: "适合中小型企业和专业团队",
    popular: true,
    features: [
      { name: "每月发送10,000封邮件", included: true },
      { name: "最多5,000个联系人", included: true },
      { name: "高级模板和自定义", included: true },
      { name: "高级分析和报告", included: true },
      { name: "邮件调度与自动化", included: true },
      { name: "优先支持", included: true },
      { name: "第三方集成", included: false },
    ],
    limits: {
      emailSent: { current: 8250, max: 10000 },
      contactsCount: { current: 3820, max: 5000 },
      templatesCount: { current: 18, max: 30 },
    }
  },
  {
    id: "enterprise",
    name: "企业版",
    price: "¥299",
    billing: "月",
    description: "适合大型企业和专业营销团队",
    features: [
      { name: "无限制邮件发送", included: true },
      { name: "无限制联系人", included: true },
      { name: "高级模板和自定义", included: true },
      { name: "高级分析和报告", included: true },
      { name: "全面的自动化工作流", included: true },
      { name: "24/7专属支持", included: true },
      { name: "全部第三方集成", included: true },
    ],
  },
];

const SubscriptionPlans = () => {
  const [currentPlan, setCurrentPlan] = useState("pro"); // 假设当前是专业版
  const [billingCycle, setBillingCycle] = useState("monthly");

  // 获取当前计划
  const activePlan = plans.find(plan => plan.id === currentPlan);

  return (
    <div className="space-y-8">
      {/* 当前订阅状态 */}
      {activePlan && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>当前订阅</CardTitle>
                <CardDescription>您的订阅计划和使用情况</CardDescription>
              </div>
              <Badge className="ml-2">{activePlan.name}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 使用情况 */}
            {activePlan.limits && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>邮件发送量</span>
                    <span>{activePlan.limits.emailSent.current.toLocaleString()} / {activePlan.limits.emailSent.max.toLocaleString()}</span>
                  </div>
                  <Progress 
                    value={(activePlan.limits.emailSent.current / activePlan.limits.emailSent.max) * 100} 
                    className="h-2" 
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>联系人数量</span>
                    <span>{activePlan.limits.contactsCount.current.toLocaleString()} / {activePlan.limits.contactsCount.max.toLocaleString()}</span>
                  </div>
                  <Progress 
                    value={(activePlan.limits.contactsCount.current / activePlan.limits.contactsCount.max) * 100} 
                    className="h-2" 
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>模板使用量</span>
                    <span>{activePlan.limits.templatesCount.current} / {activePlan.limits.templatesCount.max}</span>
                  </div>
                  <Progress 
                    value={(activePlan.limits.templatesCount.current / activePlan.limits.templatesCount.max) * 100} 
                    className="h-2" 
                  />
                </div>
              </div>
            )}
            
            {/* 订阅详情 */}
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-medium mb-2">订阅详情</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>套餐费用</span>
                  <span className="font-medium">{activePlan.price}/{activePlan.billing || '月'}</span>
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
            <Button variant="outline">取消订阅</Button>
            <Button>更改计划</Button>
          </CardFooter>
        </Card>
      )}
      
      {/* 可选计划 */}
      <div>
        <h2 className="text-xl font-bold mb-4">订阅计划选择</h2>
        
        <div className="flex justify-end mb-6">
          <Tabs 
            defaultValue="monthly" 
            value={billingCycle}
            onValueChange={setBillingCycle}
            className="w-[250px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="monthly">月付</TabsTrigger>
              <TabsTrigger value="yearly">年付<Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-0">省20%</Badge></TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className={`flex flex-col relative ${plan.popular ? 'border-primary shadow-md' : ''}`}>
              <CardHeader>
                {plan.popular && (
                  <Badge className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/2">最受欢迎</Badge>
                )}
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.billing && <span className="text-sm text-muted-foreground">/{plan.billing}</span>}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      {feature.included ? (
                        <Check className="text-green-500 h-5 w-5 mr-2 flex-shrink-0" />
                      ) : (
                        <X className="text-gray-300 h-5 w-5 mr-2 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${!feature.included ? 'text-muted-foreground' : ''}`}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {plan.id === currentPlan ? (
                  <Button className="w-full" disabled>当前方案</Button>
                ) : (
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => setCurrentPlan(plan.id)}
                  >
                    {plan.id === "free" ? "降级到免费版" : (currentPlan === "free" ? "升级" : "切换计划")}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans; 