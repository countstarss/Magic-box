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