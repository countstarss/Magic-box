'use client';

import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Shield, 
  Lock, 
  FileCheck, 
  KeyRound, 
  History, 
  Eye, 
  AlertCircle 
} from 'lucide-react';
import Link from 'next/link';

const SecurityOverview: React.FC = () => {
  // 安全状态示例数据
  const securityScore = 85;
  const securityAlerts = [
    { id: 1, level: 'critical', message: '检测到异常登录尝试', date: '2023-11-20', resolved: false },
    { id: 2, level: 'warning', message: '数据保留策略即将过期', date: '2023-11-18', resolved: false },
    { id: 3, level: 'info', message: '新用户已添加到管理员组', date: '2023-11-15', resolved: true },
  ];
  
  const securityItems = [
    { 
      name: '双因素认证', 
      status: 'enabled', 
      description: '已为管理员启用，推荐为所有用户启用', 
      lastUpdate: '2023-11-10',
      href: '/dashboard/security/access-control'
    },
    { 
      name: '数据加密', 
      status: 'enabled', 
      description: '所有存储和传输中的数据均已加密', 
      lastUpdate: '2023-10-25',
      href: '/dashboard/security/encryption'
    },
    { 
      name: '合规认证', 
      status: 'warning', 
      description: 'GDPR合规检查需要更新', 
      lastUpdate: '2023-09-15',
      href: '/dashboard/security/compliance'
    },
    { 
      name: '访问日志', 
      status: 'disabled', 
      description: '未启用详细的访问日志记录', 
      lastUpdate: '2023-11-05',
      href: '/dashboard/security/settings'
    },
    { 
      name: '数据保留策略', 
      status: 'warning', 
      description: '部分数据未设置保留策略', 
      lastUpdate: '2023-11-01',
      href: '/dashboard/security/data-retention'
    },
    { 
      name: '角色权限审查', 
      status: 'enabled', 
      description: '上次权限审查是在30天前', 
      lastUpdate: '2023-10-20',
      href: '/dashboard/security/roles'
    },
  ];
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'enabled':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'disabled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enabled':
        return 'bg-green-500/10 text-green-700 border-green-200 dark:border-green-800 dark:text-green-400';
      case 'disabled':
        return 'bg-red-500/10 text-red-700 border-red-200 dark:border-red-800 dark:text-red-400';
      case 'warning':
        return 'bg-amber-500/10 text-amber-700 border-amber-200 dark:border-amber-800 dark:text-amber-400';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200 dark:border-gray-800 dark:text-gray-400';
    }
  };
  
  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'border-red-200 dark:border-red-800';
      case 'warning':
        return 'border-amber-200 dark:border-amber-800';
      case 'info':
        return 'border-blue-200 dark:border-blue-800';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">安全与合规</h1>
        <p className="text-muted-foreground">
          监控和管理您的安全状态、合规性和数据保护措施
        </p>
      </div>
      
      {/* 安全评分卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>安全评分</CardTitle>
            <CardDescription>基于您当前的安全设置和最佳实践的综合评分</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="text-6xl font-bold">{securityScore}<span className="text-2xl text-muted-foreground">/100</span></div>
                <div className="rounded-full p-3 bg-green-50 dark:bg-green-900/20">
                  <Shield className="h-8 w-8 text-green-500 dark:text-green-400" />
                </div>
              </div>
              <Progress value={securityScore} className="h-2" />
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">不安全</span>
                  <span>0-50</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">一般</span>
                  <span>51-80</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground font-medium">安全</span>
                  <span className="font-medium">81-100</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/security/settings">
                改进安全评分
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>访问控制</CardTitle>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">双因素认证</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400">已启用</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">单点登录</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400">已启用</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">IP 限制</span>
                <Badge variant="outline" className="bg-red-500/10 text-red-700 dark:text-red-400">未启用</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link href="/dashboard/security/access-control">
                管理访问控制
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>合规状态</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">GDPR</span>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400">需更新</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">HIPAA</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400">合规</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">SOC 2</span>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400">进行中</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link href="/dashboard/security/compliance">
                查看合规详情
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* 安全警报 */}
      <Card>
        <CardHeader>
          <CardTitle>安全警报</CardTitle>
          <CardDescription>需要您关注的安全事件和通知</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityAlerts.length > 0 ? (
              securityAlerts.map(alert => (
                <Alert key={alert.id} className={`border ${getAlertColor(alert.level)}`}>
                  <div className="flex justify-between">
                    <div>
                      {alert.level === 'critical' && <AlertCircle className="h-4 w-4 text-red-500" />}
                      {alert.level === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                      {alert.level === 'info' && <Eye className="h-4 w-4 text-blue-500" />}
                      <AlertTitle className="ml-2 inline-block">
                        {alert.message}
                      </AlertTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      {alert.resolved && (
                        <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400">已解决</Badge>
                      )}
                      <span className="text-xs text-muted-foreground">{alert.date}</span>
                    </div>
                  </div>
                  <AlertDescription>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {alert.level === 'critical' && '这是一个紧急问题，需要立即处理。'}
                      {alert.level === 'warning' && '这可能会影响系统安全性，请尽快处理。'}
                      {alert.level === 'info' && '这是一条信息通知，不需要立即操作。'}
                    </div>
                  </AlertDescription>
                </Alert>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>没有待处理的安全警报</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard/security/alerts">
              查看所有安全警报
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
      
      {/* 安全设置状态 */}
      <Card>
        <CardHeader>
          <CardTitle>安全设置状态</CardTitle>
          <CardDescription>您系统中关键安全功能的状态</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {securityItems.map((item, index) => (
              <Card key={index} className={`border ${getStatusColor(item.status)}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">{item.name}</CardTitle>
                    {getStatusIcon(item.status)}
                  </div>
                </CardHeader>
                <CardContent className="pb-2 pt-0">
                  <p className="text-sm">{item.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">最后更新: {item.lastUpdate}</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button asChild variant="ghost" size="sm" className="px-0 h-8">
                    <Link href={item.href}>
                      配置设置
                      <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* 安全建议 */}
      <Card>
        <CardHeader>
          <CardTitle>安全建议</CardTitle>
          <CardDescription>基于您当前设置的改进建议</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="rounded-full p-1 bg-amber-100 dark:bg-amber-900/20">
                <KeyRound className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium">为所有用户启用双因素认证</h4>
                <p className="text-sm text-muted-foreground">目前仅为管理员启用了双因素认证。建议为所有用户启用此功能，以增强账户安全性。</p>
                <Button asChild variant="link" className="px-0 h-8 mt-1">
                  <Link href="/dashboard/security/access-control">
                    配置双因素认证
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="rounded-full p-1 bg-blue-100 dark:bg-blue-900/20">
                <History className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium">完善数据保留策略</h4>
                <p className="text-sm text-muted-foreground">部分数据类型未设置保留策略。为确保合规性和数据管理，建议为所有数据类型设置适当的保留策略。</p>
                <Button asChild variant="link" className="px-0 h-8 mt-1">
                  <Link href="/dashboard/security/data-retention">
                    完善数据保留策略
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="rounded-full p-1 bg-red-100 dark:bg-red-900/20">
                <Eye className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium">启用详细访问日志</h4>
                <p className="text-sm text-muted-foreground">目前未启用详细的访问日志记录。建议启用此功能，以便于安全审计和问题排查。</p>
                <Button asChild variant="link" className="px-0 h-8 mt-1">
                  <Link href="/dashboard/security/settings">
                    配置访问日志
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityOverview; 