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
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  History, 
  Clock, 
  Trash2, 
  Archive, 
  AlertTriangle, 
  Info, 
  Save,
  RotateCcw,
  File,
  Mail,
  MessageSquare,
  Users,
  Cog
} from 'lucide-react';

// 数据保留策略接口
interface RetentionPolicy {
  id: string;
  dataType: string;
  description: string;
  icon: string;
  retention: string;
  deleteAction: 'permanent' | 'archived';
  isEnabled: boolean;
  lastUpdated: string;
}

// 保留历史记录接口
interface RetentionHistory {
  id: string;
  dataType: string;
  date: string;
  action: 'created' | 'updated' | 'deleted' | 'executed';
  user: string;
  details: string;
}

const DataRetentionSection: React.FC = () => {
  // 示例数据 - 实际应用中应该从API获取
  const [policies, setPolicies] = useState<RetentionPolicy[]>([
    {
      id: '1',
      dataType: '用户消息',
      description: '用户之间发送的聊天消息',
      icon: 'message',
      retention: '12个月',
      deleteAction: 'archived',
      isEnabled: true,
      lastUpdated: '2023-10-15'
    },
    {
      id: '2',
      dataType: '系统日志',
      description: '应用程序和系统生成的日志',
      icon: 'file',
      retention: '24个月',
      deleteAction: 'permanent',
      isEnabled: true,
      lastUpdated: '2023-09-20'
    },
    {
      id: '3',
      dataType: '用户文档',
      description: '用户上传的文档和文件',
      icon: 'file',
      retention: '36个月',
      deleteAction: 'archived',
      isEnabled: true,
      lastUpdated: '2023-11-05'
    },
    {
      id: '4',
      dataType: '电子邮件',
      description: '通过系统发送和接收的电子邮件',
      icon: 'mail',
      retention: '18个月',
      deleteAction: 'archived',
      isEnabled: true,
      lastUpdated: '2023-10-10'
    },
    {
      id: '5',
      dataType: '用户账户',
      description: '已删除的用户账户信息',
      icon: 'user',
      retention: '6个月',
      deleteAction: 'permanent',
      isEnabled: false,
      lastUpdated: '2023-08-12'
    },
    {
      id: '6',
      dataType: '系统配置',
      description: '系统配置历史记录',
      icon: 'settings',
      retention: '6个月',
      deleteAction: 'permanent',
      isEnabled: true,
      lastUpdated: '2023-11-01'
    }
  ]);
  
  const [history, setHistory] = useState<RetentionHistory[]>([
    {
      id: '1',
      dataType: '系统日志',
      date: '2023-11-15',
      action: 'executed',
      user: '系统',
      details: '已自动删除2022年11月15日之前的系统日志',
    },
    {
      id: '2',
      dataType: '用户消息',
      date: '2023-11-10',
      action: 'updated',
      user: '管理员',
      details: '保留期从6个月更新为12个月',
    },
    {
      id: '3',
      dataType: '用户文档',
      date: '2023-11-05',
      action: 'created',
      user: '管理员',
      details: '创建了保留策略，期限为36个月',
    },
    {
      id: '4',
      dataType: '电子邮件',
      date: '2023-10-20',
      action: 'executed',
      user: '系统',
      details: '已自动归档2022年4月20日之前的电子邮件',
    }
  ]);
  
  // 编辑状态
  const [isEditing, setIsEditing] = useState(false);
  const [editPolicy, setEditPolicy] = useState<RetentionPolicy | null>(null);
  
  // 编辑策略处理函数
  const handleEdit = (policy: RetentionPolicy) => {
    setEditPolicy({ ...policy });
    setIsEditing(true);
  };
  
  // 保存编辑处理函数
  const handleSave = () => {
    if (editPolicy) {
      setPolicies(prevPolicies => 
        prevPolicies.map(p => 
          p.id === editPolicy.id ? editPolicy : p
        )
      );
      
      // 添加到历史记录
      const newHistory: RetentionHistory = {
        id: Date.now().toString(),
        dataType: editPolicy.dataType,
        date: new Date().toISOString().split('T')[0],
        action: 'updated',
        user: '当前用户',
        details: `更新了 ${editPolicy.dataType} 的保留策略`
      };
      setHistory([newHistory, ...history]);
      
      setIsEditing(false);
      setEditPolicy(null);
    }
  };
  
  // 取消编辑处理函数
  const handleCancel = () => {
    setIsEditing(false);
    setEditPolicy(null);
  };
  
  // 切换策略启用状态
  const togglePolicy = (id: string, enabled: boolean) => {
    setPolicies(prevPolicies => 
      prevPolicies.map(p => 
        p.id === id ? { ...p, isEnabled: enabled } : p
      )
    );
    
    // 添加到历史记录
    const policy = policies.find(p => p.id === id);
    if (policy) {
      const newHistory: RetentionHistory = {
        id: Date.now().toString(),
        dataType: policy.dataType,
        date: new Date().toISOString().split('T')[0],
        action: 'updated',
        user: '当前用户',
        details: `${enabled ? '启用' : '禁用'}了 ${policy.dataType} 的保留策略`
      };
      setHistory([newHistory, ...history]);
    }
  };
  
  // 获取图标组件
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      case 'file':
        return <File className="h-4 w-4" />;
      case 'mail':
        return <Mail className="h-4 w-4" />;
      case 'user':
        return <Users className="h-4 w-4" />;
      case 'settings':
        return <Cog className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">数据保留策略</h1>
        <p className="text-muted-foreground">
          管理不同类型数据的保留期限和删除方式
        </p>
      </div>
      
      <Alert variant="default" className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertTitle>重要提示</AlertTitle>
        <AlertDescription>
          数据保留策略会自动删除或归档到达保留期限的数据。请确保设置符合您的业务需求和合规要求。
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="policies">
        <TabsList>
          <TabsTrigger value="policies">保留策略</TabsTrigger>
          <TabsTrigger value="history">执行历史</TabsTrigger>
          <TabsTrigger value="settings">全局设置</TabsTrigger>
        </TabsList>
        
        {/* 保留策略 */}
        <TabsContent value="policies">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>数据保留策略</CardTitle>
                  <CardDescription>
                    为不同类型的数据设置保留期限和删除操作
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  <History className="h-4 w-4 mr-2" />
                  添加新策略
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>数据类型</TableHead>
                    <TableHead>保留期限</TableHead>
                    <TableHead>删除操作</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>最后更新</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {policies.map((policy) => (
                    <TableRow key={policy.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="rounded bg-primary/10 p-1.5">
                            {getIcon(policy.icon)}
                          </div>
                          <div>
                            <div className="font-medium">{policy.dataType}</div>
                            <div className="text-xs text-muted-foreground">{policy.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{policy.retention}</TableCell>
                      <TableCell>
                        {policy.deleteAction === 'permanent' ? (
                          <div className="flex items-center">
                            <Trash2 className="h-4 w-4 text-red-500 mr-1" />
                            <span>永久删除</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Archive className="h-4 w-4 text-amber-500 mr-1" />
                            <span>归档</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className={`h-2 w-2 rounded-full mr-2 ${policy.isEnabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span>{policy.isEnabled ? '已启用' : '已禁用'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{policy.lastUpdated}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(policy)}>
                            编辑
                          </Button>
                          <Switch 
                            checked={policy.isEnabled} 
                            onCheckedChange={(checked) => togglePolicy(policy.id, checked)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {isEditing && editPolicy && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>编辑保留策略</CardTitle>
                <CardDescription>
                  修改 {editPolicy.dataType} 的保留策略
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dataType">数据类型</Label>
                    <Input
                      id="dataType"
                      value={editPolicy.dataType}
                      onChange={(e) => setEditPolicy({ ...editPolicy, dataType: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">描述</Label>
                    <Input
                      id="description"
                      value={editPolicy.description}
                      onChange={(e) => setEditPolicy({ ...editPolicy, description: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="retention">保留期限</Label>
                    <Select 
                      value={editPolicy.retention}
                      onValueChange={(value) => setEditPolicy({ ...editPolicy, retention: value })}
                    >
                      <SelectTrigger id="retention">
                        <SelectValue placeholder="选择保留期限" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1个月">1个月</SelectItem>
                        <SelectItem value="3个月">3个月</SelectItem>
                        <SelectItem value="6个月">6个月</SelectItem>
                        <SelectItem value="12个月">12个月</SelectItem>
                        <SelectItem value="18个月">18个月</SelectItem>
                        <SelectItem value="24个月">24个月</SelectItem>
                        <SelectItem value="36个月">36个月</SelectItem>
                        <SelectItem value="永久">永久</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="deleteAction">删除操作</Label>
                    <Select 
                      value={editPolicy.deleteAction}
                      onValueChange={(value: 'permanent' | 'archived') => 
                        setEditPolicy({ ...editPolicy, deleteAction: value })
                      }
                    >
                      <SelectTrigger id="deleteAction">
                        <SelectValue placeholder="选择删除操作" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="permanent">永久删除</SelectItem>
                        <SelectItem value="archived">归档</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleCancel}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  取消
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  保存更改
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        {/* 执行历史 */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>执行历史记录</CardTitle>
              <CardDescription>
                查看数据保留策略的执行和更改历史
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>数据类型</TableHead>
                    <TableHead>操作</TableHead>
                    <TableHead>执行者</TableHead>
                    <TableHead>日期</TableHead>
                    <TableHead>详情</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.dataType}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {item.action === 'executed' && <Clock className="h-4 w-4 text-blue-500 mr-1" />}
                          {item.action === 'created' && <Info className="h-4 w-4 text-green-500 mr-1" />}
                          {item.action === 'updated' && <History className="h-4 w-4 text-amber-500 mr-1" />}
                          {item.action === 'deleted' && <Trash2 className="h-4 w-4 text-red-500 mr-1" />}
                          <span>
                            {item.action === 'executed' && '已执行'}
                            {item.action === 'created' && '已创建'}
                            {item.action === 'updated' && '已更新'}
                            {item.action === 'deleted' && '已删除'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{item.user}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 全局设置 */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>全局保留设置</CardTitle>
              <CardDescription>
                配置数据保留策略的全局行为
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">自动执行策略</Label>
                  <p className="text-sm text-muted-foreground">
                    在每天凌晨3点自动检查和执行所有启用的保留策略
                  </p>
                </div>
                <Switch checked={true} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">执行前通知</Label>
                  <p className="text-sm text-muted-foreground">
                    在执行删除操作前通过电子邮件通知管理员
                  </p>
                </div>
                <Switch checked={true} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">保留删除日志</Label>
                  <p className="text-sm text-muted-foreground">
                    保留所有数据删除操作的详细日志记录
                  </p>
                </div>
                <Switch checked={true} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">归档存储位置</Label>
                  <p className="text-sm text-muted-foreground">
                    设置归档数据的存储位置
                  </p>
                </div>
                <Select defaultValue="cloud">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="选择存储位置" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cloud">云存储</SelectItem>
                    <SelectItem value="local">本地存储</SelectItem>
                    <SelectItem value="hybrid">混合存储</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">合规模式</Label>
                  <p className="text-sm text-muted-foreground">
                    启用严格合规模式，自动采用符合法规的保留策略
                  </p>
                </div>
                <Switch checked={false} />
              </div>
            </CardContent>
            <CardFooter>
              <Button>保存全局设置</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataRetentionSection; 