'use client';

import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Shield, KeyRound, History, Database, 
  FileCheck, Users, Bell, Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SecurityLayoutProps {
  children: ReactNode;
}

const SecurityLayout: React.FC<SecurityLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  
  const navItems = [
    { 
      name: '安全概览', 
      href: '/dashboard/security', 
      icon: <Shield className="h-4 w-4 mr-2" /> 
    },
    { 
      name: '访问控制', 
      href: '/dashboard/security/access-control', 
      icon: <KeyRound className="h-4 w-4 mr-2" /> 
    },
    { 
      name: '数据保留策略', 
      href: '/dashboard/security/data-retention', 
      icon: <History className="h-4 w-4 mr-2" /> 
    },
    { 
      name: '数据加密', 
      href: '/dashboard/security/encryption', 
      icon: <Database className="h-4 w-4 mr-2" /> 
    },
    { 
      name: '合规认证', 
      href: '/dashboard/security/compliance', 
      icon: <FileCheck className="h-4 w-4 mr-2" /> 
    },
    { 
      name: '用户角色', 
      href: '/dashboard/security/roles', 
      icon: <Users className="h-4 w-4 mr-2" /> 
    },
    { 
      name: '安全警报', 
      href: '/dashboard/security/alerts', 
      icon: <Bell className="h-4 w-4 mr-2" /> 
    },
    { 
      name: '安全设置', 
      href: '/dashboard/security/settings', 
      icon: <Settings className="h-4 w-4 mr-2" /> 
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

export default SecurityLayout; 