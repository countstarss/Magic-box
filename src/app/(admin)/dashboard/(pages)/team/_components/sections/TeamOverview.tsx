'use client';

import React, { useState } from 'react';
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle, CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, Users, Mail, MessageSquare, 
  Clock, FileText, User, Star, ShieldCheck 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTeamStore } from '../../store/useTeamStore';
import CreateTeamDialog from '../dialogs/CreateTeamDialog';

const TeamOverview: React.FC = () => {
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const { selectedTeam } = useTeamStore();
  
  return (
    <>
      {/* 团队头部信息 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">团队管理</h1>
          <p className="text-muted-foreground">
            管理您的团队和成员，协同工作更高效
          </p>
        </div>
        
        <Button onClick={() => setIsCreateTeamOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          创建团队
        </Button>
      </div>
      
      {selectedTeam ? (
        <>
          {/* 选中团队信息 */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedTeam.avatarUrl} alt={selectedTeam.name} />
                  <AvatarFallback className="text-xl">{selectedTeam.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-2xl">{selectedTeam.name}</CardTitle>
                    {selectedTeam.isVerified && (
                      <ShieldCheck className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <CardDescription>{selectedTeam.description}</CardDescription>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{selectedTeam.type}</Badge>
                    <span className="text-xs text-muted-foreground">
                      创建于 {new Date(selectedTeam.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
          
          {/* 团队数据卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">团队成员</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">
                    {selectedTeam.members.length}
                  </div>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {selectedTeam.plan.maxMembers > 0 
                    ? `${selectedTeam.members.length}/${selectedTeam.plan.maxMembers} 成员` 
                    : "无限制成员"}
                </div>
                {selectedTeam.plan.maxMembers > 0 && (
                  <Progress 
                    value={(selectedTeam.members.length / selectedTeam.plan.maxMembers) * 100} 
                    className="h-1 mt-2" 
                  />
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">已发送邮件</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">
                    {selectedTeam.stats.totalEmails}
                  </div>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  本月 +{selectedTeam.stats.monthlyEmails} 封
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">活跃会话</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">
                    {selectedTeam.stats.activeChats}
                  </div>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {selectedTeam.stats.pendingMessages} 条未读消息
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">共享文档</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">
                    {selectedTeam.stats.sharedDocs}
                  </div>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {selectedTeam.stats.recentDocs} 个最近更新
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* 成员列表 */}
          <Card>
            <CardHeader>
              <CardTitle>团队成员</CardTitle>
              <CardDescription>
                管理您团队的成员和权限
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedTeam.members.map(member => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                        <AvatarFallback>{member.name.substring(0,2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium flex items-center gap-1">
                          {member.name}
                          {member.role === 'owner' && (
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{member.email}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        member.role === 'owner' 
                          ? 'default' 
                          : member.role === 'admin' 
                            ? 'secondary' 
                            : 'outline'
                      }>
                        {member.role === 'owner' 
                          ? '拥有者' 
                          : member.role === 'admin' 
                            ? '管理员' 
                            : '成员'}
                      </Badge>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {member.lastActive
                          ? new Date(member.lastActive).toLocaleDateString()
                          : '从未活动'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <User className="mr-2 h-4 w-4" />
                邀请新成员
              </Button>
            </CardFooter>
          </Card>
        </>
      ) : (
        // 没有选中团队时的提示
        <Card className="py-12">
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <Users className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-medium">没有选中的团队</h3>
            <p className="text-center text-muted-foreground max-w-md">
              创建一个新团队或从列表中选择一个团队来管理成员和设置。
            </p>
            <Button onClick={() => setIsCreateTeamOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              创建团队
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* 创建团队对话框 */}
      <CreateTeamDialog 
        isOpen={isCreateTeamOpen} 
        onClose={() => setIsCreateTeamOpen(false)} 
      />
    </>
  );
};

export default TeamOverview; 