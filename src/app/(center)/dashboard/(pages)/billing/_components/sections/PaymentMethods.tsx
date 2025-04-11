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