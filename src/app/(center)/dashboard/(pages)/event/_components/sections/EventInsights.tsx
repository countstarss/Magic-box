"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart, PieChart, LineChart, Download, Share2, RefreshCw,
  Calendar, Users, Clock, Mail, ExternalLink, MessageSquare
} from "lucide-react";
import { Event } from "../context/EventContext";
import { format, formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

// 导入图表组件
import { 
  DeliveryRateChart, 
  OpenRateChart, 
  ClickRateChart, 
  EventTimelineChart,
  AudienceSegmentChart 
} from "../charts";

interface EventInsightsProps {
  event: Event;
}

const EventInsights: React.FC<EventInsightsProps> = ({ event }) => {
  // 检查事件是否已发送
  const isSent = event.status === "sent";
  
  // 格式化发送时间
  const formattedScheduledDate = format(event.scheduledDate, 'yyyy-MM-dd HH:mm:ss', { locale: zhCN });
  const timeAgo = formatDistanceToNow(event.scheduledDate, { addSuffix: true, locale: zhCN });
  
  // 计算各项率 (如果有统计数据)
  const stats = event.stats || { sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, unsubscribed: 0, complaints: 0 };
  const deliveryRate = stats.sent > 0 ? (stats.delivered / stats.sent * 100).toFixed(1) : "0.0";
  const openRate = stats.delivered > 0 ? (stats.opened / stats.delivered * 100).toFixed(1) : "0.0";
  const clickRate = stats.opened > 0 ? (stats.clicked / stats.opened * 100).toFixed(1) : "0.0";
  const bounceRate = stats.sent > 0 ? (stats.bounced / stats.sent * 100).toFixed(1) : "0.0";
  const unsubscribeRate = stats.delivered > 0 ? (stats.unsubscribed / stats.delivered * 100).toFixed(2) : "0.00";
  
  return (
    <div className="space-y-6">
      {/* 事件概览卡片 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{event.name}</CardTitle>
              <CardDescription className="mt-1">{event.description}</CardDescription>
            </div>
            <Badge className={`
              ${event.status === "draft" ? "bg-gray-100 text-gray-800" : ""}
              ${event.status === "scheduled" ? "bg-blue-100 text-blue-800" : ""}
              ${event.status === "sending" ? "bg-amber-100 text-amber-800" : ""}
              ${event.status === "sent" ? "bg-green-100 text-green-800" : ""}
              ${event.status === "canceled" ? "bg-red-100 text-red-800" : ""}
            `}>
              {event.status === "draft" && "草稿"}
              {event.status === "scheduled" && "已计划"}
              {event.status === "sending" && "发送中"}
              {event.status === "sent" && "已发送"}
              {event.status === "canceled" && "已取消"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">计划时间</p>
                <p className="text-sm text-muted-foreground" title={formattedScheduledDate}>
                  {timeAgo}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">目标受众</p>
                <p className="text-sm text-muted-foreground">
                  {event.audience.name} ({event.audience.count.toLocaleString()}人)
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">使用模板</p>
                <p className="text-sm text-muted-foreground">
                  {event.template.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">创建时间</p>
                <p className="text-sm text-muted-foreground">
                  {format(event.createdAt, 'yyyy-MM-dd', { locale: zhCN })}
                </p>
              </div>
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-2 mt-6 justify-end">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              <span>导出报告</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              <span>分享</span>
            </Button>
            {isSent && (
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                <span>刷新数据</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* 数据分析部分 - 仅在已发送时显示 */}
      {isSent ? (
        <div className="space-y-6">
          {/* 关键指标卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">已送达</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold">{deliveryRate}%</div>
                  <div className="text-muted-foreground text-sm">
                    {stats.delivered.toLocaleString()} / {stats.sent.toLocaleString()}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  成功送达邮件的百分比
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">打开率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold">{openRate}%</div>
                  <div className="text-muted-foreground text-sm">
                    {stats.opened.toLocaleString()} / {stats.delivered.toLocaleString()}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  收件人打开邮件的百分比
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">点击率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold">{clickRate}%</div>
                  <div className="text-muted-foreground text-sm">
                    {stats.clicked.toLocaleString()} / {stats.opened.toLocaleString()}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  打开邮件后点击链接的百分比
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* 详细数据分析选项卡 */}
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview" className="gap-2">
                <BarChart className="h-4 w-4" />
                总体概览
              </TabsTrigger>
              <TabsTrigger value="audience" className="gap-2">
                <PieChart className="h-4 w-4" />
                受众分析
              </TabsTrigger>
              <TabsTrigger value="timeline" className="gap-2">
                <LineChart className="h-4 w-4" />
                时间线
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">送达状态</CardTitle>
                    <CardDescription>邮件送达情况分析</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <DeliveryRateChart stats={stats} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">打开率</CardTitle>
                    <CardDescription>邮件打开情况分析</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <OpenRateChart stats={stats} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">点击情况</CardTitle>
                    <CardDescription>邮件链接点击情况</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ClickRateChart stats={stats} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">其他指标</CardTitle>
                    <CardDescription>退订和投诉情况</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">退订率</span>
                        <span className="text-sm">{unsubscribeRate}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="bg-amber-400 h-full rounded-full" 
                          style={{ width: `${Math.min(Number(unsubscribeRate) * 20, 100)}%` }} 
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stats.unsubscribed} 人退订
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">投诉率</span>
                        <span className="text-sm">
                          {stats.delivered > 0 ? (stats.complaints / stats.delivered * 100).toFixed(3) : "0.000"}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="bg-red-400 h-full rounded-full" 
                          style={{ width: `${stats.delivered > 0 ? Math.min((stats.complaints / stats.delivered * 100) * 50, 100) : 0}%` }} 
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stats.complaints} 人投诉
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="audience" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">受众分析</CardTitle>
                  <CardDescription>按不同维度分析受众群体</CardDescription>
                </CardHeader>
                <CardContent>
                  <AudienceSegmentChart />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">交互时间线</CardTitle>
                  <CardDescription>邮件打开和点击的时间分布</CardDescription>
                </CardHeader>
                <CardContent>
                  <EventTimelineChart />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        // 未发送时显示的内容
        <Card className="py-8">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              此事件尚未发送
            </h3>
            <p className="text-muted-foreground max-w-md mb-6">
              事件发送完成后，您将在这里看到详细的数据分析报告
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                预览模板
              </Button>
              {event.status === "draft" && (
                <Button className="gap-2">
                  <Calendar className="h-4 w-4" />
                  设置发送时间
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventInsights; 