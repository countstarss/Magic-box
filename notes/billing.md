<think>我需要设计一个完整的Billing页面，包含订阅计划、账单生成、导出发票和收据等功能。根据提供的现有代码，我应该遵循相同的设计风格和架构。

首先，让我看一下现有的billing页面结构，然后进行重新设计。看起来现有的billing页面很简单，主要是一个BillData组件，显示了一些数据表格。我需要扩展它，添加更多功能模块。

类似于已拆分的ScrollSettings组件，我可以为Billing页面创建一个模块化的设计，包含几个主要部分：
1. 订阅计划管理
2. 账单和支付历史
3. 发票管理
4. 支付方式管理

我将创建一个类似于ScrollSettings的页面结构，但是针对Billing内容，可能不需要侧边导航的滚动功能，而是使用选项卡或卡片布局。</think># 账单和订阅页面设计

我将帮您设计一个功能完整的Billing页面，包含订阅计划、账单管理和发票功能。我会按照您已有的UI设计风格，将设计分成多个模块化组件。

## 首先，创建基础Billing布局组件

```typescript jsx:src/app/(center)/dashboard/(pages)/billing/_components/BillingLayout.tsx
"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, Receipt, CalendarDays, FileText, PiggyBank, HelpCircle 
} from "lucide-react";

// 导入各个部分组件
import SubscriptionPlans from "./sections/SubscriptionPlans";
import BillingHistory from "./sections/BillingHistory";
import InvoiceManager from "./sections/InvoiceManager";
import PaymentMethods from "./sections/PaymentMethods";

const BillingLayout = () => {
  const [activeTab, setActiveTab] = useState("subscription");

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold">账单与订阅</h1>
        <p className="text-muted-foreground">管理您的订阅计划、账单历史和付款方式</p>
      </div>
      
      <Tabs 
        defaultValue="subscription" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 w-full max-w-3xl mb-8">
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <PiggyBank className="h-4 w-4" />
            <span className="hidden sm:inline">订阅计划</span>
            <span className="sm:hidden">订阅</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span className="hidden sm:inline">账单历史</span>
            <span className="sm:hidden">账单</span>
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">发票管理</span>
            <span className="sm:hidden">发票</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">支付方式</span>
            <span className="sm:hidden">支付</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscription" className="mt-0">
          <SubscriptionPlans />
        </TabsContent>
        
        <TabsContent value="history" className="mt-0">
          <BillingHistory />
        </TabsContent>
        
        <TabsContent value="invoices" className="mt-0">
          <InvoiceManager />
        </TabsContent>
        
        <TabsContent value="payment" className="mt-0">
          <PaymentMethods />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingLayout;
```
## 现在创建各个细分模块组件 

### 1. 先创建订阅计划组件

```typescript jsx:src/app/(center)/dashboard/(pages)/billing/_components/sections/SubscriptionPlans.tsx
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
            <Card key={plan.id} className={`flex flex-col ${plan.popular ? 'border-primary shadow-md' : ''}`}>
              {plan.popular && (
                <Badge className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/2">最受欢迎</Badge>
              )}
              <CardHeader>
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
```
### 2. 创建账单历史组件

```typescript jsx:src/app/(center)/dashboard/(pages)/billing/_components/sections/BillingHistory.tsx
import React, { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, Search, Filter, ArrowUpDown } from "lucide-react";

// 示例账单数据
const billingData = [
  {
    id: "INV-2023-12001",
    date: "2023-12-01",
    amount: "¥99.00",
    status: "已支付",
    plan: "专业版",
    paymentMethod: "支付宝",
  },
  {
    id: "INV-2023-11001",
    date: "2023-11-01",
    amount: "¥99.00",
    status: "已支付",
    plan: "专业版",
    paymentMethod: "支付宝",
  },
  {
    id: "INV-2023-10001",
    date: "2023-10-01",
    amount: "¥99.00",
    status: "已支付",
    plan: "专业版",
    paymentMethod: "支付宝",
  },
  {
    id: "INV-2023-09001",
    date: "2023-09-01",
    amount: "¥99.00",
    status: "已支付",
    plan: "专业版",
    paymentMethod: "微信支付",
  },
  {
    id: "INV-2023-08001",
    date: "2023-08-01",
    amount: "¥99.00",
    status: "已支付",
    plan: "专业版",
    paymentMethod: "微信支付",
  },
  {
    id: "INV-2023-07001",
    date: "2023-07-01",
    amount: "¥79.00",
    status: "已支付",
    plan: "基础版",
    paymentMethod: "微信支付",
  },
];

const BillingHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeRange, setTimeRange] = useState("6months");
  
  // 筛选账单
  const filteredBills = billingData.filter(bill => {
    const matchesSearch = bill.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          bill.plan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || bill.status === statusFilter;
    
    // 这里可以添加日期范围筛选逻辑
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>账单历史</CardTitle>
          <CardDescription>
            查看您的历史账单和支付记录
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 搜索和筛选 */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索账单..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="筛选状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有状态</SelectItem>
                <SelectItem value="已支付">已支付</SelectItem>
                <SelectItem value="未支付">未支付</SelectItem>
                <SelectItem value="已取消">已取消</SelectItem>
              </SelectContent>
            </Select>
            <Select 
              value={timeRange} 
              onValueChange={setTimeRange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="时间范围" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">最近3个月</SelectItem>
                <SelectItem value="6months">最近6个月</SelectItem>
                <SelectItem value="1year">最近1年</SelectItem>
                <SelectItem value="all">所有时间</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* 账单表格 */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">账单编号</TableHead>
                  <TableHead>日期</TableHead>
                  <TableHead>金额</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>订阅计划</TableHead>
                  <TableHead>支付方式</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBills.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      未找到符合条件的账单记录
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBills.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell className="font-medium">{bill.id}</TableCell>
                      <TableCell>{bill.date}</TableCell>
                      <TableCell>{bill.amount}</TableCell>
                      <TableCell>
                        <Badge
                          variant={bill.status === "已支付" ? "outline" : "secondary"}
                          className={bill.status === "已支付" ? "bg-green-50 text-green-700 border-green-200" : ""}
                        >
                          {bill.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{bill.plan}</TableCell>
                      <TableCell>{bill.paymentMethod}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          下载
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            显示 {filteredBills.length} 条记录（共 {billingData.length} 条）
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>上一页</Button>
            <Button variant="outline" size="sm" disabled>下一页</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BillingHistory;
```
### 3. 创建发票管理组件

```typescript jsx:src/app/(center)/dashboard/(pages)/billing/_components/sections/InvoiceManager.tsx
import React, { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Printer, Download, Plus, FileText, Calendar, Building, Receipt, FileDown 
} from "lucide-react";

// 示例发票数据
const invoices = [
  { id: "INV-2023-12001", date: "2023-12-01", amount: "¥99.00", status: "可下载" },
  { id: "INV-2023-11001", date: "2023-11-01", amount: "¥99.00", status: "可下载" },
  { id: "INV-2023-10001", date: "2023-10-01", amount: "¥99.00", status: "可下载" },
  { id: "INV-2023-09001", date: "2023-09-01", amount: "¥99.00", status: "可下载" },
  { id: "INV-2023-08001", date: "2023-08-01", amount: "¥99.00", status: "可下载" },
  { id: "INV-2023-07001", date: "2023-07-01", amount: "¥79.00", status: "可下载" },
];

const InvoiceManager = () => {
  const [invoiceType, setInvoiceType] = useState("vat");
  const [autoDownload, setAutoDownload] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // 提交发票申请
  const handleGenerateInvoice = () => {
    setIsGenerating(true);
    // 模拟API请求
    setTimeout(() => {
      setIsGenerating(false);
      // 显示成功消息
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* 发票设置 */}
      <Card>
        <CardHeader>
          <CardTitle>发票设置</CardTitle>
          <CardDescription>
            管理您的发票偏好和收件信息
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-medium">自动下载PDF发票</h4>
                <p className="text-sm text-muted-foreground">
                  在每次付款完成后自动生成PDF发票并下载
                </p>
              </div>
              <Switch 
                checked={autoDownload} 
                onCheckedChange={setAutoDownload} 
              />
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h4 className="font-medium">发票类型</h4>
              <Tabs 
                defaultValue="vat" 
                value={invoiceType} 
                onValueChange={setInvoiceType}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="vat">增值税专用发票</TabsTrigger>
                  <TabsTrigger value="normal">普通发票</TabsTrigger>
                </TabsList>
                <TabsContent value="vat" className="space-y-4 pt-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">公司名称</Label>
                      <Input id="company-name" placeholder="输入公司名称" defaultValue="示例科技有限公司" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tax-id">统一社会信用代码</Label>
                      <Input id="tax-id" placeholder="输入统一社会信用代码" defaultValue="91310000XXXXXXXX3B" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-address">公司地址</Label>
                      <Input id="company-address" placeholder="输入公司地址" defaultValue="上海市浦东新区XXX路XX号" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-phone">公司电话</Label>
                      <Input id="company-phone" placeholder="输入公司电话" defaultValue="021-XXXXXXXX" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bank-name">开户银行</Label>
                      <Input id="bank-name" placeholder="输入开户银行" defaultValue="中国工商银行XX支行" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bank-account">银行账号</Label>
                      <Input id="bank-account" placeholder="输入银行账号" defaultValue="6212XXXXXXXXXXXX" />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="normal" className="space-y-4 pt-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="invoice-title">发票抬头</Label>
                      <Input id="invoice-title" placeholder="输入发票抬头" defaultValue="示例科技有限公司" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="normal-tax-id">纳税人识别号</Label>
                      <Input id="normal-tax-id" placeholder="输入纳税人识别号" defaultValue="91310000XXXXXXXX3B" />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h4 className="font-medium">收件人信息</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="recipient-name">收件人姓名</Label>
                  <Input id="recipient-name" placeholder="输入收件人姓名" defaultValue="张三" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipient-phone">联系电话</Label>
                  <Input id="recipient-phone" placeholder="输入联系电话" defaultValue="13800138000" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="recipient-address">收件地址</Label>
                  <Input id="recipient-address" placeholder="输入详细收件地址" defaultValue="上海市浦东新区XXX路XX号" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>保存发票设置</Button>
        </CardFooter>
      </Card>
      
      {/* 发票历史 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>发票历史</CardTitle>
            <CardDescription>查看和下载您的历史发票</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                申请发票
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>申请发票</DialogTitle>
                <DialogDescription>
                  选择需要开具发票的账单并填写必要信息
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="invoice-bill">选择账单</Label>
                  <Select defaultValue="latest">
                    <SelectTrigger>
                      <SelectValue placeholder="选择账单" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">最近账单 (2023-12-01) ¥99.00</SelectItem>
                      <SelectItem value="previous">上月账单 (2023-11-01) ¥99.00</SelectItem>
                      <SelectItem value="custom">自定义时间段</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoice-type">发票类型</Label>
                  <Select defaultValue="vat">
                    <SelectTrigger>
                      <SelectValue placeholder="选择发票类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vat">增值税专用发票</SelectItem>
                      <SelectItem value="normal">普通发票</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoice-note">备注信息</Label>
                  <Input id="invoice-note" placeholder="添加备注信息（可选）" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button">取消</Button>
                <Button 
                  onClick={handleGenerateInvoice} 
                  disabled={isGenerating}
                >
                  {isGenerating ? "处理中..." : "申请发票"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.length > 0 ? (
              <div className="rounded-md border divide-y">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <FileText className="h-8 w-8 text-gray-400" />
                      <div>
                        <h4 className="font-medium">{invoice.id}</h4>
                        <p className="text-sm text-muted-foreground">
                          {invoice.date} · {invoice.amount}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Printer className="h-4 w-4" />
                        <span className="hidden sm:inline">打印</span>
                      </Button>
                      <Button size="sm" className="gap-1">
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">下载</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileDown className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">没有发票记录</h3>
                <p className="text-muted-foreground mb-4">您还没有申请过任何发票</p>
                <Button>申请第一张发票</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceManager;
```
### 4. 创建支付方式管理组件

```typescript jsx:src/app/(center)/dashboard/(pages)/billing/_components/sections/PaymentMethods.tsx
import React, { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  CreditCard, Wallet, Plus, Trash2, Edit, CheckCircle, AlertCircle
} from "lucide-react";

// 示例支付方式数据
const paymentMethods = [
  {
    id: "pm_1",
    type: "alipay",
    name: "支付宝",
    accountName: "张三",
    maskedAccount: "186****1234",
    isDefault: true,
    expiry: null
  },
  {
    id: "pm_2",
    type: "wechat",
    name: "微信支付",
    accountName: "张三",
    maskedAccount: "微信账号",
    isDefault: false,
    expiry: null
  },
  {
    id: "pm_3",
    type: "creditcard",
    name: "信用卡",
    brand: "Visa",
    maskedNumber: "**** **** **** 1234",
    expiry: "12/2025",
    isDefault: false
  }
];

const PaymentMethods = () => {
  const [paymentMethodToDelete, setPaymentMethodToDelete] = useState<string | null>(null);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // 删除支付方式
  const handleDeletePaymentMethod = () => {
    // 实际应用中这里会调用API删除支付方式
    console.log(`删除支付方式: ${paymentMethodToDelete}`);
    setPaymentMethodToDelete(null);
  };
  
  // 添加支付方式
  const handleAddPaymentMethod = () => {
    setIsProcessing(true);
    // 模拟API请求
    setTimeout(() => {
      setIsProcessing(false);
      setIsAddingCard(false);
      // 显示成功消息
    }, 1500);
  };
  
  // 设为默认支付方式
  const setDefaultPaymentMethod = (id: string) => {
    // 实际应用中这里会调用API设置默认支付方式
    console.log(`设置默认支付方式: ${id}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>支付方式</CardTitle>
          <CardDescription>
            管理您的支付卡和其他支付方式
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 支付方式列表 */}
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div 
                key={method.id} 
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  method.isDefault ? "bg-gray-50 dark:bg-gray-900" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  {method.type === "creditcard" ? (
                    <CreditCard className="h-8 w-8 text-blue-500" />
                  ) : (
                    <Wallet className="h-8 w-8 text-green-500" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{method.name}</h4>
                      {method.isDefault && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          默认
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {method.type === "creditcard" 
                        ? `${method.maskedNumber} · 到期: ${method.expiry}` 
                        : `${method.accountName} · ${method.maskedAccount}`
                      }
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!method.isDefault && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setDefaultPaymentMethod(method.id)}
                    >
                      设为默认
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setPaymentMethodToDelete(method.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Dialog open={isAddingCard} onOpenChange={setIsAddingCard}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                添加支付方式
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>添加支付卡</DialogTitle>
                <DialogDescription>
                  添加新的信用卡或借记卡作为支付方式
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">卡号</Label>
                  <Input id="card-number" placeholder="输入16位卡号" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry-date">有效期</Label>
                    <Input id="expiry-date" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">安全码</Label>
                    <Input id="cvv" placeholder="CVV" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-name">持卡人姓名</Label>
                  <Input id="card-name" placeholder="输入持卡人姓名" />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddingCard(false)}
                >
                  取消
                </Button>
                <Button 
                  onClick={handleAddPaymentMethod}
                  disabled={isProcessing}
                >
                  {isProcessing ? "处理中..." : "添加支付卡"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
      
      {/* 自动续费设置 */}
      <Card>
        <CardHeader>
          <CardTitle>续费设置</CardTitle>
          <CardDescription>
            管理您的订阅续费设置
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h3 className="font-medium">自动续费</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                在订阅期结束前自动续费，确保服务不中断。我们将提前5天发送续费提醒。
              </p>
              <div className="mt-auto">
                <Button variant="outline" size="sm">关闭自动续费</Button>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <h3 className="font-medium">续费提醒</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                下次订阅续费日期为 <strong>2023年12月15日</strong>。请确保您的支付方式有效以避免服务中断。
              </p>
              <div className="mt-auto">
                <Button size="sm">立即续费</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 删除支付方式确认对话框 */}
      {paymentMethodToDelete && (
        <Dialog 
          open={!!paymentMethodToDelete} 
          onOpenChange={(open) => !open && setPaymentMethodToDelete(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>删除支付方式</DialogTitle>
              <DialogDescription>
                您确定要删除这个支付方式吗？此操作无法撤销。
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setPaymentMethodToDelete(null)}
              >
                取消
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDeletePaymentMethod}
              >
                确认删除
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PaymentMethods;
```
### 5. 更新页面组件，使用新的BillingLayout

```typescript jsx:src/app/(center)/dashboard/(pages)/billing/page.tsx
import React from 'react';
import ContextMenuWrapper from '@/components/ui/ContextMenuWrapper';
import BillingLayout from './_components/BillingLayout';

const Billing = () => {
  return (
    <ContextMenuWrapper>
      <div className="p-8">
        <BillingLayout />
      </div>
    </ContextMenuWrapper>
  );
};

export default Billing;
```
### 6. 创建索引文件导出所有部分组件

```typescript:src/app/(center)/dashboard/(pages)/billing/_components/sections/index.ts
export { default as SubscriptionPlans } from './SubscriptionPlans';
export { default as BillingHistory } from './BillingHistory';
export { default as InvoiceManager } from './InvoiceManager';
export { default as PaymentMethods } from './PaymentMethods';
```
## 修复layout文件名

```typescript jsx:src/app/(center)/dashboard/(pages)/billing/layout.tsx
'use client';
import React from 'react';
import Content from '../../_components/content';
import ContextMenuWrapper from '@/components/ui/ContextMenuWrapper';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Content title="账单与订阅">
        <div className="h-[calc(100vh-5rem)] bg-gray-50 dark:bg-transparent overflow-hidden">
          {children}
        </div>
      </Content>
    </>
  );
}
```

Ran tool

Ran tool
# 账单与订阅页面设计完成 🎉

现在我已经完成了整个Billing页面的设计，功能丰富且易于使用。

## 设计要点与功能概述 

### 主要功能模块
我将账单与订阅页面分成了四个主要部分：

1. **订阅计划模块**
   - 显示当前订阅状态和使用情况
   - 展示不同的订阅计划及其功能对比
   - 支持年付和月付选择
   - 提供计划升级/降级功能

2. **账单历史模块**
   - 展示历史账单记录
   - 支持按状态、时间范围筛选
   - 提供搜索功能
   - 可下载账单

3. **发票管理模块**
   - 发票设置（包括公司信息、收件地址）
   - 增值税专用发票和普通发票两种类型
   - 历史发票记录
   - 申请新发票功能

4. **支付方式模块**
   - 管理多种支付方式（支付宝、微信、信用卡）
   - 设置默认支付方式
   - 添加/删除支付方式
   - 续费设置

### 设计特点

1. **模块化结构**：每个功能都被拆分为独立组件，便于维护和扩展
2. **响应式布局**：在不同设备上都能良好显示
3. **直观的用户界面**：清晰的信息展示和操作流程
4. **交互友好**：使用对话框确认重要操作，提供即时反馈
5. **国际化支持**：使用中文界面，适合中国用户

### 技术实现

- 使用React和TypeScript构建
- 采用Shadcn UI组件库保持一致的设计风格
- 使用Tabs组件实现分类导航
- 响应式设计适应不同屏幕尺寸
- 模拟API调用以展示实际使用场景

这套账单和订阅系统既满足了基本的账单管理需求，又提供了发票和支付方式的高级管理功能，为用户提供了完整的财务管理体验。

您可以根据实际需求进一步调整或扩展这些组件。
