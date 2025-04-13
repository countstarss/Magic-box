'use client';
import React, { useState } from 'react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { 
  ArrowUpRight, Users, Mail, MousePointerClick, ChevronDown, 
  PlusCircle, MoreHorizontal, Search, SlidersHorizontal, ArrowUp, ArrowDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 导入自定义Tabs组件
import { 
  CustomTabs,
  CustomTabsContent,
  CustomTabsList,
  CustomTabsTrigger,
  CustomTabsIndicator
} from '@/components/ui/custom-tabs';

// 示例数据
const campaignPerformanceData = [
  { name: '周一', 打开率: 65, 点击率: 43, 订阅率: 28 },
  { name: '周二', 打开率: 59, 点击率: 40, 订阅率: 24 },
  { name: '周三', 打开率: 80, 点击率: 55, 订阅率: 36 },
  { name: '周四', 打开率: 81, 点击率: 56, 订阅率: 37 },
  { name: '周五', 打开率: 66, 点击率: 44, 订阅率: 29 },
  { name: '周六', 打开率: 55, 点击率: 36, 订阅率: 22 },
  { name: '周日', 打开率: 70, 点击率: 47, 订阅率: 31 },
];

const subscriberGrowthData = [
  { name: '1月', 用户数: 1400 },
  { name: '2月', 用户数: 2100 },
  { name: '3月', 用户数: 2400 },
  { name: '4月', 用户数: 2800 },
  { name: '5月', 用户数: 3200 },
  { name: '6月', 用户数: 3800 },
  { name: '7月', 用户数: 4300 },
];

const emailTypeData = [
  { name: '推广邮件', value: 45 },
  { name: '通知邮件', value: 30 },
  { name: '新闻邮件', value: 15 },
  { name: '商品推荐', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const recentCampaigns = [
  { 
    id: '1', 
    name: '夏季促销活动', 
    sentDate: new Date('2023-06-15'), 
    status: '已完成',
    sent: 12500,
    opened: 5625,
    clickRate: 12.4,
    trend: 'up'
  },
  { 
    id: '2', 
    name: '新产品发布通知', 
    sentDate: new Date('2023-06-10'), 
    status: '已完成',
    sent: 8200,
    opened: 3936,
    clickRate: 15.1,
    trend: 'up'
  },
  { 
    id: '3', 
    name: '会员专享优惠', 
    sentDate: new Date('2023-06-05'), 
    status: '已完成',
    sent: 5400,
    opened: 2106,
    clickRate: 9.8,
    trend: 'down'
  },
  { 
    id: '4', 
    name: '节日问候邮件', 
    sentDate: new Date('2023-05-28'), 
    status: '已完成',
    sent: 15800,
    opened: 6794,
    clickRate: 11.2,
    trend: 'up'
  },
  { 
    id: '5', 
    name: '满意度调查', 
    sentDate: new Date('2023-05-20'), 
    status: '已完成',
    sent: 9600,
    opened: 2880,
    clickRate: 8.6,
    trend: 'down'
  },
];

const scheduledCampaigns = [
  { 
    id: '6', 
    name: '秋季新品预告', 
    scheduledDate: new Date('2023-07-15'), 
    status: '计划中',
    recipientsCount: 14500,
    readiness: 85,
  },
  { 
    id: '7', 
    name: '会员周年庆', 
    scheduledDate: new Date('2023-07-10'), 
    status: '计划中',
    recipientsCount: 7800,
    readiness: 60,
  },
  { 
    id: '8', 
    name: '限时特惠', 
    scheduledDate: new Date('2023-07-05'), 
    status: '草稿',
    recipientsCount: 9200,
    readiness: 40,
  },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  // 处理标签页切换逻辑
  const handleTabChange = (value: string) => {
    // 根据当前和目标标签的位置关系确定滑动方向
    const tabOrder = ['overview', 'campaigns', 'subscribers'];
    const currentIndex = tabOrder.indexOf(activeTab);
    const newIndex = tabOrder.indexOf(value);
    
    if (newIndex > currentIndex) {
      setSlideDirection('right');
    } else {
      setSlideDirection('left');
    }
    
    setActiveTab(value);
  };

  return (
    <div className="flex flex-col p-6 space-y-6 h-full overflow-auto pb-24">
      {/* 顶部标题和操作区 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">WizMail 仪表盘</h1>
          <p className="text-muted-foreground">邮件营销活动一览</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal size={16} />
            筛选
          </Button>
          <Button className="gap-2">
            <PlusCircle size={16} />
            新建活动
          </Button>
        </div>
      </div>
      
      {/* 标签页切换 - 使用CustomTabs替换 */}
      <CustomTabs defaultValue="overview" className="w-full" value={activeTab} onValueChange={handleTabChange}>
        <CustomTabsList className="grid w-full max-w-md grid-cols-3">
          <CustomTabsTrigger value="overview">数据概览</CustomTabsTrigger>
          <CustomTabsTrigger value="campaigns">邮件活动</CustomTabsTrigger>
          <CustomTabsTrigger value="subscribers">订阅用户</CustomTabsTrigger>
          <CustomTabsIndicator />
        </CustomTabsList>
        
        <CustomTabsContent value="overview" className="space-y-6" slideDirection={slideDirection}>
          {/* 统计卡片区域 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">总订阅用户</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24,368</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <span className="text-green-500 flex items-center mr-1">
                    <ArrowUpRight className="h-3 w-3" />
                    12%
                  </span>
                  较上月
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">已发送邮件</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156,892</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <span className="text-green-500 flex items-center mr-1">
                    <ArrowUpRight className="h-3 w-3" />
                    8.5%
                  </span>
                  较上月
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">平均打开率</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42.8%</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <span className="text-green-500 flex items-center mr-1">
                    <ArrowUpRight className="h-3 w-3" />
                    3.2%
                  </span>
                  较上月
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">平均点击率</CardTitle>
                <MousePointerClick className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.4%</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <span className="text-green-500 flex items-center mr-1">
                    <ArrowUpRight className="h-3 w-3" />
                    2.1%
                  </span>
                  较上月
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* 图表区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>活动表现趋势</CardTitle>
                <CardDescription>最近7天的邮件活动表现指标</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={campaignPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="打开率" fill="#8884d8" />
                      <Bar dataKey="点击率" fill="#82ca9d" />
                      <Bar dataKey="订阅率" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>用户增长趋势</CardTitle>
                <CardDescription>近7个月的订阅用户增长情况</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={subscriberGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="用户数" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>邮件类型分布</CardTitle>
                <CardDescription>按类型统计的邮件分布</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-[300px] w-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={emailTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {emailTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>最近活动</CardTitle>
                <CardDescription>最近5个邮件营销活动</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentCampaigns.slice(0, 5).map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(campaign.sentDate, 'yyyy年MM月dd日')}
                        </div>
                      </div>
                      <div className="text-sm text-right">
                        <div className="flex items-center gap-1">
                          点击率: {campaign.clickRate}%
                          {campaign.trend === 'up' ? (
                            <ArrowUp size={14} className="text-green-500" />
                          ) : (
                            <ArrowDown size={14} className="text-red-500" />
                          )}
                        </div>
                        <div className="text-muted-foreground">
                          发送: {campaign.sent.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">查看所有活动</Button>
              </CardFooter>
            </Card>
          </div>
        </CustomTabsContent>
        
        <CustomTabsContent value="campaigns" className="space-y-6" slideDirection={slideDirection}>
          {/* 活动管理区域 */}
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <Input
                placeholder="搜索活动..."
                className="max-w-sm"
              />
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="状态筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部活动</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                  <SelectItem value="scheduled">计划中</SelectItem>
                  <SelectItem value="draft">草稿</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              创建活动
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>已完成活动</CardTitle>
              <CardDescription>所有已发送的邮件活动</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>活动名称</TableHead>
                    <TableHead>发送日期</TableHead>
                    <TableHead>发送量</TableHead>
                    <TableHead>打开数</TableHead>
                    <TableHead>点击率</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCampaigns.map(campaign => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>{format(campaign.sentDate, 'yyyy-MM-dd')}</TableCell>
                      <TableCell>{campaign.sent.toLocaleString()}</TableCell>
                      <TableCell>{campaign.opened.toLocaleString()}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        {campaign.clickRate}%
                        {campaign.trend === 'up' ? (
                          <ArrowUp size={14} className="text-green-500" />
                        ) : (
                          <ArrowDown size={14} className="text-red-500" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>计划中活动</CardTitle>
              <CardDescription>即将发送的邮件活动</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>活动名称</TableHead>
                    <TableHead>计划日期</TableHead>
                    <TableHead>目标受众</TableHead>
                    <TableHead>准备进度</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledCampaigns.map(campaign => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>{format(campaign.scheduledDate, 'yyyy-MM-dd')}</TableCell>
                      <TableCell>{campaign.recipientsCount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={campaign.readiness} className="h-2 w-[100px]" />
                          <span className="text-sm">{campaign.readiness}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={campaign.status === '计划中' ? 'outline' : 'secondary'} 
                               className={campaign.status === '计划中' 
                                  ? "bg-blue-50 text-blue-700 border-blue-200" 
                                  : "bg-gray-100 text-gray-700"}>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </CustomTabsContent>
        
        <CustomTabsContent value="subscribers" className="space-y-6" slideDirection={slideDirection}>
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <Input
                placeholder="搜索用户..."
                className="max-w-sm"
              />
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="订阅状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部用户</SelectItem>
                  <SelectItem value="active">活跃用户</SelectItem>
                  <SelectItem value="inactive">不活跃</SelectItem>
                  <SelectItem value="unsubscribed">已退订</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              导入用户
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>用户增长趋势</CardTitle>
              <CardDescription>近期用户增长情况</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={subscriberGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="用户数" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>用户列表</CardTitle>
                <CardDescription>所有订阅用户</CardDescription>
              </div>
              <Input
                placeholder="搜索用户..."
                className="max-w-sm"
              />
            </CardHeader>
            <CardContent>
              {/* 这里会放用户列表，但为了简化我们不实现完整列表 */}
              <div className="text-center py-12 text-muted-foreground">
                <p>此部分将展示用户订阅列表</p>
                <p className="text-sm">可通过用户管理功能维护订阅者信息</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">导出用户</Button>
              <Button variant="outline">管理群组</Button>
            </CardFooter>
          </Card>
        </CustomTabsContent>
      </CustomTabs>
    </div>
  );
};

export default Dashboard; 