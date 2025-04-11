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