'use client';

import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  MoreHorizontal, 
  Mail, 
  Trash2, 
  Edit, 
  Tag, 
  ChevronsLeft, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsRight
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { User, PaginationParams, useCrmStore } from '../../store/useCrmStore';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// 用户标签颜色
const tagColorMap: Record<string, string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  premium: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  inactive: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  highValue: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  lead: "bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-400",
};

// 用户标签中文名称
const tagNameMap: Record<string, string> = {
  active: "活跃",
  premium: "付费",
  new: "新用户",
  inactive: "沉睡",
  highValue: "高价值",
  lead: "潜在",
};

// 用户来源中文名称
const sourceNameMap: Record<string, string> = {
  form: "表单",
  import: "导入",
  webhook: "Webhook",
  manual: "手动",
};

interface UsersTableProps {
  users: User[];
  pagination: PaginationParams;
  onPageChange: (page: number) => void;
  onUserSelect: (userId: string) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ 
  users,
  pagination,
  onPageChange,
  onUserSelect
}) => {
  const { deleteUser } = useCrmStore();
  
  // 计算当前页显示的用户
  const startIndex = (pagination.page - 1) * pagination.pageSize;
  const endIndex = Math.min(startIndex + pagination.pageSize, users.length);
  const displayedUsers = users.slice(startIndex, endIndex);
  
  // 处理分页
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      onPageChange(newPage);
    }
  };
  
  // 获取用户头像
  const getUserAvatar = (user: User) => {
    const initials = user.fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
    
    return (
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.avatar} alt={user.fullName} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
    );
  };
  
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[300px]">用户信息</TableHead>
            <TableHead>标签</TableHead>
            <TableHead>来源</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead>最后活动</TableHead>
            <TableHead>消费金额</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                没有找到匹配的用户
              </TableCell>
            </TableRow>
          ) : (
            displayedUsers.map((user) => (
              <TableRow 
                key={user.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onUserSelect(user.id)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    {getUserAvatar(user)}
                    <div>
                      <div className="font-medium">{user.fullName}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                      {user.company && (
                        <div className="text-xs text-muted-foreground">{user.company}</div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className={tagColorMap[tag] || ""}
                      >
                        {tagNameMap[tag] || tag}
                      </Badge>
                    ))}
                    {user.customTags?.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                    {sourceNameMap[user.source] || user.source}
                  </Badge>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-sm">
                          {formatDistanceToNow(new Date(user.createdAt), { 
                            addSuffix: true,
                            locale: zhCN
                          })}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {format(new Date(user.createdAt), 'yyyy年MM月dd日 HH:mm', {
                          locale: zhCN
                        })}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-sm">
                          {formatDistanceToNow(new Date(user.lastLoginAt), { 
                            addSuffix: true,
                            locale: zhCN
                          })}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {format(new Date(user.lastLoginAt), 'yyyy年MM月dd日 HH:mm', {
                          locale: zhCN
                        })}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium">
                    ¥{user.totalSpent.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>操作</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `mailto:${user.email}`;
                      }}>
                        <Mail className="h-4 w-4 mr-2" />
                        发送邮件
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onUserSelect(user.id);
                      }}>
                        <Edit className="h-4 w-4 mr-2" />
                        编辑用户
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        // 这里可以打开标签管理对话框
                      }}>
                        <Tag className="h-4 w-4 mr-2" />
                        管理标签
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`确定要删除用户"${user.fullName}"吗？`)) {
                            deleteUser(user.id);
                          }
                        }}
                        className="text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        删除用户
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* 分页控制 */}
      {users.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2 border-t">
          <div className="text-sm text-muted-foreground">
            显示 {startIndex + 1}-{endIndex} 条，共 {users.length} 条
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handlePageChange(1)}
              disabled={pagination.page <= 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="mx-2 text-sm">
              {pagination.page} / {pagination.totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={pagination.page >= pagination.totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable; 