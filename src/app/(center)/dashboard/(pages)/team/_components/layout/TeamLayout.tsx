'use client'

import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, Settings, MessageSquare, CalendarClock, 
  FileText, Shield, Database, BarChart3 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface TeamLayoutProps {
  children: ReactNode;
}

const TeamLayout: React.FC<TeamLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  
  const navItems = [
    { 
      name: '团队概览', 
      href: '/dashboard/team', 
      icon: <Users className="h-4 w-4 mr-2" /> 
    },
    { 
      name: '团队设置', 
      href: '/dashboard/team/settings', 
      icon: <Settings className="h-4 w-4 mr-2" /> 
    },
    { 
      name: '聊天协作', 
      href: '/dashboard/team/chat', 
      icon: <MessageSquare className="h-4 w-4 mr-2" /> 
    },
    { 
      name: '日程管理', 
      href: '/dashboard/team/calendar', 
      icon: <CalendarClock className="h-4 w-4 mr-2" /> 
    },
    { 
      name: '文档协作', 
      href: '/dashboard/team/docs', 
      icon: <FileText className="h-4 w-4 mr-2" /> 
    },
    { 
      name: '权限管理', 
      href: '/dashboard/team/permissions', 
      icon: <Shield className="h-4 w-4 mr-2" /> 
    },
    { 
      name: '资源管理', 
      href: '/dashboard/team/resources', 
      icon: <Database className="h-4 w-4 mr-2" /> 
    },
    { 
      name: '数据分析', 
      href: '/dashboard/team/analytics', 
      icon: <BarChart3 className="h-4 w-4 mr-2" /> 
    },
  ];
  
  return (
    <div className="flex flex-col space-y-6 p-8">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6">
        <Card className="sticky top-8 left-4 w-full md:w-64 p-2 h-fit">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  "justify-start h-9",
                  pathname === item.href 
                    ? "bg-muted font-medium text-primary" 
                    : "text-muted-foreground"
                )}
                asChild
              >
                <Link href={item.href}>
                  {item.icon}
                  {item.name}
                </Link>
              </Button>
            ))}
          </div>
        </Card>
        
        <div className="flex-1 space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default TeamLayout; 