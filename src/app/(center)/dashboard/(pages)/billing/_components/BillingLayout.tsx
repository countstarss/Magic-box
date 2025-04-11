"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, Receipt, CalendarDays, FileText, PiggyBank, HelpCircle 
} from "lucide-react";

// 导入各个部分组件
import { SubscriptionPlans, BillingHistory, InvoiceManager, PaymentMethods } from "./sections/index";

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