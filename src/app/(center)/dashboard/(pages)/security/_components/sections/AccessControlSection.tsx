'use client';

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { 
  KeyRound, 
  Smartphone, 
  Shield, 
  Network, 
  LockKeyhole, 
  Eye, 
  Clock, 
  UserX, 
  AlertTriangle,
  Check,
  X,
  Fingerprint,
  Globe
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AccessControlSection: React.FC = () => {
  // 示例状态
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [ssoEnabled, setSsoEnabled] = useState(true);
  const [ipRestrictionEnabled, setIpRestrictionEnabled] = useState(false);
  const [sessionTimeoutValue, setSessionTimeoutValue] = useState("30");
  const [passwordPolicyStrength, setPasswordPolicyStrength] = useState("strong");
  
  // IP白名单示例数据
  const [ipWhitelist, setIpWhitelist] = useState([
    { id: 1, ip: "192.168.1.0/24", description: "公司总部", createdAt: "2023-10-15" },
    { id: 2, ip: "10.0.0.0/16", description: "分支机构", createdAt: "2023-11-01" }
  ]);
  
  // 登录尝试记录示例数据
  const loginAttempts = [
    { 
      id: 1, 
      user: "zhang.san@example.com", 
      status: "success", 
      ip: "192.168.1.105", 
      location: "北京, 中国", 
      device: "Chrome on Windows", 
      time: "2023-11-20 15:30:45" 
    },
    { 
      id: 2, 
      user: "li.si@example.com", 
      status: "failed", 
      ip: "203.0.113.42", 
      location: "上海, 中国", 
      device: "Safari on MacOS", 
      time: "2023-11-20 14:22:10",
      reason: "密码错误"
    },
    { 
      id: 3, 
      user: "wang.wu@example.com", 
      status: "failed", 
      ip: "198.51.100.73", 
      location: "雅加达, 印度尼西亚", 
      device: "Firefox on Ubuntu", 
      time: "2023-11-20 13:15:32",
      reason: "IP限制"
    },
    { 
      id: 4, 
      user: "li.si@example.com", 
      status: "success", 
      ip: "203.0.113.42", 
      location: "上海, 中国", 
      device: "Safari on MacOS", 
      time: "2023-11-20 14:25:33" 
    }
  ];
  
  // 处理保存设置
  const handleSaveSettings = () => {
    // 实际应用中这里会调用API保存设置
    console.log("保存设置");
  };
  
  // 添加IP地址
  const [newIP, setNewIP] = useState("");
  const [newIPDescription, setNewIPDescription] = useState("");
  
  const handleAddIP = () => {
    if (newIP) {
      setIpWhitelist([
        ...ipWhitelist,
        { 
          id: ipWhitelist.length + 1, 
          ip: newIP, 
          description: newIPDescription,
          createdAt: new Date().toISOString().split('T')[0]
        }
      ]);
      setNewIP("");
      setNewIPDescription("");
    }
  };
  
  // 删除IP地址
  const handleRemoveIP = (id: number) => {
    setIpWhitelist(ipWhitelist.filter(item => item.id !== id));
  };
  
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">访问控制</h1>
        <p className="text-muted-foreground">
          管理用户认证方式和访问权限设置
        </p>
      </div>
      
      <Tabs defaultValue="authentication">
        <TabsList>
          <TabsTrigger value="authentication">认证设置</TabsTrigger>
          <TabsTrigger value="ip-restrictions">IP 限制</TabsTrigger>
          <TabsTrigger value="password-policy">密码策略</TabsTrigger>
          <TabsTrigger value="login-history">登录记录</TabsTrigger>
        </TabsList>
        
        {/* 认证设置 */}
        <TabsContent value="authentication">
          <Card>
            <CardHeader>
              <CardTitle>认证方式设置</CardTitle>
              <CardDescription>
                配置用户访问系统时需要满足的认证要求
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-primary" />
                    <Label className="text-base font-medium">两因素认证 (2FA)</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    要求用户使用手机验证码或认证应用验证身份
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={twoFactorEnabled} 
                      onCheckedChange={setTwoFactorEnabled}
                    />
                    <Badge variant={twoFactorEnabled ? "default" : "outline"}>
                      {twoFactorEnabled ? "已启用" : "已禁用"}
                    </Badge>
                  </div>
                  {twoFactorEnabled && (
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px] mt-2">
                        <SelectValue placeholder="适用对象" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有用户</SelectItem>
                        <SelectItem value="admin">仅管理员</SelectItem>
                        <SelectItem value="optional">用户可选</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <Label className="text-base font-medium">单点登录 (SSO)</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    允许用户通过其组织的身份服务登录
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={ssoEnabled} 
                      onCheckedChange={setSsoEnabled}
                    />
                    <Badge variant={ssoEnabled ? "default" : "outline"}>
                      {ssoEnabled ? "已启用" : "已禁用"}
                    </Badge>
                  </div>
                  {ssoEnabled && (
                    <Select defaultValue="saml">
                      <SelectTrigger className="w-[180px] mt-2">
                        <SelectValue placeholder="SSO类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="saml">SAML 2.0</SelectItem>
                        <SelectItem value="oidc">OpenID Connect</SelectItem>
                        <SelectItem value="oauth">OAuth 2.0</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-primary" />
                    <Label className="text-base font-medium">设备记忆</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    记住用户的已验证设备，减少频繁验证的需要
                  </p>
                </div>
                <Select defaultValue="30">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="有效期" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7天</SelectItem>
                    <SelectItem value="30">30天</SelectItem>
                    <SelectItem value="90">90天</SelectItem>
                    <SelectItem value="0">不记住</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <Label className="text-base font-medium">会话超时</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    用户在指定时间内无活动后自动登出
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number" 
                    className="w-20" 
                    value={sessionTimeoutValue}
                    onChange={(e) => setSessionTimeoutValue(e.target.value)}
                    min="1" 
                    max="1440"
                  />
                  <span>分钟</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <UserX className="h-4 w-4 text-primary" />
                    <Label className="text-base font-medium">登录失败锁定</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    多次登录失败后锁定账户，防止暴力破解
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={true} />
                  <span>5次失败后锁定30分钟</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="h-4 w-4 text-primary" />
                    <Label className="text-base font-medium">生物认证</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    允许用户使用指纹、面部识别等方式登录
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Switch checked={true} />
                    <Badge>试验性功能</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>保存认证设置</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* IP限制 */}
        <TabsContent value="ip-restrictions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>IP地址限制</CardTitle>
                  <CardDescription>
                    限制只有来自特定IP地址或范围的访问请求才能登录系统
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={ipRestrictionEnabled} 
                    onCheckedChange={setIpRestrictionEnabled}
                  />
                  <span>{ipRestrictionEnabled ? "已启用" : "已禁用"}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {ipRestrictionEnabled ? (
                <>
                  <Alert variant="default" className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <AlertTitle>启用IP限制可能会阻止合法用户</AlertTitle>
                    <AlertDescription>
                      请确保添加所有必要的IP地址，特别是在移动办公和远程办公场景下
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="new-ip">IP地址或范围</Label>
                      <Input 
                        id="new-ip" 
                        placeholder="例如: 192.168.1.0/24" 
                        value={newIP}
                        onChange={(e) => setNewIP(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ip-description">描述</Label>
                      <Input 
                        id="ip-description" 
                        placeholder="例如: 公司办公室" 
                        value={newIPDescription}
                        onChange={(e) => setNewIPDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={handleAddIP} disabled={!newIP}>添加IP地址</Button>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">已允许的IP地址</h3>
                    {ipWhitelist.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>IP地址/范围</TableHead>
                            <TableHead>描述</TableHead>
                            <TableHead>添加日期</TableHead>
                            <TableHead className="text-right">操作</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ipWhitelist.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Network className="h-4 w-4 text-primary" />
                                  <span>{item.ip}</span>
                                </div>
                              </TableCell>
                              <TableCell>{item.description}</TableCell>
                              <TableCell>{item.createdAt}</TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleRemoveIP(item.id)}
                                >
                                  删除
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <p>尚未添加任何IP地址</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center py-6 space-y-4">
                  <Globe className="h-12 w-12 text-muted-foreground" />
                  <div className="text-center">
                    <h3 className="text-lg font-medium">IP限制已禁用</h3>
                    <p className="text-muted-foreground">
                      当前允许来自任何IP地址的访问请求
                    </p>
                  </div>
                  <Button onClick={() => setIpRestrictionEnabled(true)}>
                    启用IP限制
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>保存IP限制设置</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* 密码策略 */}
        <TabsContent value="password-policy">
          <Card>
            <CardHeader>
              <CardTitle>密码策略</CardTitle>
              <CardDescription>
                设置用户密码的复杂度和有效期要求
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>密码强度</Label>
                <div className="grid gap-2">
                  <div 
                    className={`flex items-center justify-between p-3 rounded-md border ${
                      passwordPolicyStrength === "basic" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                    onClick={() => setPasswordPolicyStrength("basic")}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`rounded-full w-4 h-4 flex items-center justify-center ${
                        passwordPolicyStrength === "basic" ? "bg-blue-500" : "border border-gray-400"
                      }`}>
                        {passwordPolicyStrength === "basic" && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">基本</h4>
                        <p className="text-xs text-muted-foreground">最少8个字符</p>
                      </div>
                    </div>
                    <Badge variant="outline">低安全性</Badge>
                  </div>
                  
                  <div 
                    className={`flex items-center justify-between p-3 rounded-md border ${
                      passwordPolicyStrength === "medium" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                    onClick={() => setPasswordPolicyStrength("medium")}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`rounded-full w-4 h-4 flex items-center justify-center ${
                        passwordPolicyStrength === "medium" ? "bg-blue-500" : "border border-gray-400"
                      }`}>
                        {passwordPolicyStrength === "medium" && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">中等</h4>
                        <p className="text-xs text-muted-foreground">最少8个字符，包含数字和字母</p>
                      </div>
                    </div>
                    <Badge variant="outline">中等安全性</Badge>
                  </div>
                  
                  <div 
                    className={`flex items-center justify-between p-3 rounded-md border ${
                      passwordPolicyStrength === "strong" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                    onClick={() => setPasswordPolicyStrength("strong")}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`rounded-full w-4 h-4 flex items-center justify-center ${
                        passwordPolicyStrength === "strong" ? "bg-blue-500" : "border border-gray-400"
                      }`}>
                        {passwordPolicyStrength === "strong" && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">强</h4>
                        <p className="text-xs text-muted-foreground">最少10个字符，包含大小写字母、数字和特殊字符</p>
                      </div>
                    </div>
                    <Badge variant="outline">高安全性</Badge>
                  </div>
                  
                  <div 
                    className={`flex items-center justify-between p-3 rounded-md border ${
                      passwordPolicyStrength === "custom" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                    onClick={() => setPasswordPolicyStrength("custom")}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`rounded-full w-4 h-4 flex items-center justify-center ${
                        passwordPolicyStrength === "custom" ? "bg-blue-500" : "border border-gray-400"
                      }`}>
                        {passwordPolicyStrength === "custom" && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">自定义</h4>
                        <p className="text-xs text-muted-foreground">自定义密码规则</p>
                      </div>
                    </div>
                    <Badge>高级</Badge>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">密码过期</Label>
                  <p className="text-sm text-muted-foreground">
                    要求用户定期更改密码
                  </p>
                </div>
                <Select defaultValue="90">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="密码有效期" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30天</SelectItem>
                    <SelectItem value="60">60天</SelectItem>
                    <SelectItem value="90">90天</SelectItem>
                    <SelectItem value="180">180天</SelectItem>
                    <SelectItem value="never">永不过期</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">历史密码限制</Label>
                  <p className="text-sm text-muted-foreground">
                    防止用户重复使用最近使用过的密码
                  </p>
                </div>
                <Select defaultValue="5">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="历史密码数量" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">最近3个</SelectItem>
                    <SelectItem value="5">最近5个</SelectItem>
                    <SelectItem value="10">最近10个</SelectItem>
                    <SelectItem value="0">不限制</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>保存密码策略</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* 登录记录 */}
        <TabsContent value="login-history">
          <Card>
            <CardHeader>
              <CardTitle>登录记录</CardTitle>
              <CardDescription>
                查看系统的登录尝试记录和可疑活动
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>用户</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>IP地址</TableHead>
                      <TableHead>位置</TableHead>
                      <TableHead>设备</TableHead>
                      <TableHead>时间</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loginAttempts.map((attempt) => (
                      <TableRow key={attempt.id}>
                        <TableCell>{attempt.user}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {attempt.status === "success" ? (
                              <>
                                <Check className="h-4 w-4 text-green-500" />
                                <span className="text-green-600 dark:text-green-400">成功</span>
                              </>
                            ) : (
                              <>
                                <X className="h-4 w-4 text-red-500" />
                                <span className="text-red-600 dark:text-red-400">失败</span>
                                {attempt.reason && (
                                  <span className="text-xs text-muted-foreground">({attempt.reason})</span>
                                )}
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{attempt.ip}</TableCell>
                        <TableCell>{attempt.location}</TableCell>
                        <TableCell>{attempt.device}</TableCell>
                        <TableCell>{attempt.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">导出记录</Button>
              <Button variant="outline">查看更多</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccessControlSection;