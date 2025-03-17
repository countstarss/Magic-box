"use client";

import React, { useState } from "react";
import {
  useMailsQuery,
  useMarkMailAsReadMutation,
  useTrashMailMutation,
  useArchiveMailMutation,
} from "@/hooks/use-query-mail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Archive, Eye, EyeOff } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const MailListExample = () => {
  // 过滤参数
  const [filters, setFilters] = useState({
    folder: "inbox",
    search: "",
    page: 1,
    pageSize: 20,
  });

  // 搜索输入
  const [searchInput, setSearchInput] = useState("");

  // 获取邮件列表
  const { data, isLoading, isError, error, refetch, isFetching } =
    useMailsQuery(filters);

  // 标记邮件为已读/未读的mutation
  const markAsReadMutation = useMarkMailAsReadMutation();

  // 将邮件移至垃圾箱的mutation
  const trashMailMutation = useTrashMailMutation();

  // 将邮件归档的mutation
  const archiveMailMutation = useArchiveMailMutation();

  // 处理搜索提交
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      search: searchInput,
      page: 1, // 重置到第一页
    }));
  };

  // 处理文件夹变更
  const handleFolderChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      folder: value,
      page: 1, // 重置到第一页
    }));
  };

  // 处理分页
  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  // 标记邮件为已读/未读
  const toggleReadStatus = (id: string, currentStatus: boolean) => {
    markAsReadMutation.mutate({ id, read: !currentStatus });
  };

  // 将邮件移至垃圾箱
  const trashMail = (id: string) => {
    trashMailMutation.mutate(id);
  };

  // 将邮件归档
  const archiveMail = (id: string) => {
    archiveMailMutation.mutate(id);
  };

  // 加载状态
  if (isLoading) {
    return <div className="p-4">Loading emails...</div>;
  }

  // 错误状态
  if (isError) {
    return (
      <div className="p-4 text-red-500">
        Error loading emails:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
        <Button onClick={() => refetch()} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  // 无数据状态
  if (!data || data.data.length === 0) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-medium mb-2">No emails found</h3>
        <p className="text-muted-foreground">
          {filters.search
            ? "Try a different search term"
            : "Your folder is empty"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 工具栏 */}
      <div className="p-4 border-b flex flex-col sm:flex-row gap-2">
        <form onSubmit={handleSearch} className="flex-1 flex">
          <Input
            placeholder="Search emails..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="mr-2"
          />
          <Button type="submit">Search</Button>
        </form>

        <Select value={filters.folder} onValueChange={handleFolderChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Folder" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="inbox">Inbox</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="trash">Trash</SelectItem>
            <SelectItem value="archive">Archive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 邮件列表 */}
      <ScrollArea className="flex-1">
        <div className="divide-y">
          {data.data.map((mail) => (
            <div
              key={mail.id}
              className="p-4 hover:bg-muted/50 flex items-start justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-medium ${!mail.read ? "font-bold" : ""}`}
                  >
                    {mail.name}
                  </span>
                  {!mail.read && (
                    <span className="h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <h4 className="text-sm">{mail.subject}</h4>
                <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                  {mail.text.substring(0, 120)}...
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {mail.labels.map((label) => (
                    <Badge key={label} variant="outline">
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  title={mail.read ? "Mark as unread" : "Mark as read"}
                  onClick={() => toggleReadStatus(mail.id, mail.read)}
                >
                  {mail.read ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  title="Archive"
                  onClick={() => archiveMail(mail.id)}
                >
                  <Archive size={16} />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  title="Move to trash"
                  onClick={() => trashMail(mail.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* 分页控件 */}
      <div className="p-4 border-t flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {(filters.page - 1) * filters.pageSize + 1} to{" "}
          {Math.min(filters.page * filters.pageSize, data.total)} of{" "}
          {data.total} emails
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={filters.page === 1 || isLoading || isFetching}
            onClick={() => handlePageChange(filters.page - 1)}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            disabled={
              filters.page === data.totalPages || isLoading || isFetching
            }
            onClick={() => handlePageChange(filters.page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
