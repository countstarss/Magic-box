"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { GmailService } from "@/lib/gmail-service";
import { Button } from "@/components/ui/button";
import {
  Inbox,
  RefreshCcw,
  Search,
  Trash,
  Archive,
  MailOpen,
  Mail,
} from "lucide-react";

// 解析Gmail邮件标题
function getHeader(headers: any[], name: string): string {
  const header = headers.find(
    (h) => h.name.toLowerCase() === name.toLowerCase()
  );
  return header ? header.value : "";
}

// 格式化邮件日期显示
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    // 今天，显示时间
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (days === 1) {
    return "昨天";
  } else if (days < 7) {
    // 一周内，显示星期
    const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    return weekdays[date.getDay()];
  } else {
    // 超过一周，显示日期
    return date.toLocaleDateString();
  }
}

export default function GmailEmailList() {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null);
  const [gmailService, setGmailService] = useState<GmailService | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"list" | "detail">("list");

  // 初始化Gmail服务和加载邮件
  useEffect(() => {
    async function initializeGmailService() {
      try {
        // 获取当前用户
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user) {
          setError("请先登录以访问Gmail邮件");
          setLoading(false);
          return;
        }

        // 检查是否有Gmail账户
        const { data: account, error: accountError } = await supabase
          .from("email_accounts")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        if (!account) {
          setError("未找到Gmail账户，请先授权Gmail");
          setLoading(false);
          return;
        }

        // 初始化Gmail服务
        const service = new GmailService(session.user.id);
        const initialized = await service.initialize();

        if (!initialized) {
          setError("初始化Gmail服务失败");
          setLoading(false);
          return;
        }

        setGmailService(service);

        // 加载邮件
        await fetchEmails(service);
      } catch (err: any) {
        console.error("初始化Gmail服务失败:", err);
        setError(err.message || "加载邮件失败");
        setLoading(false);
      }
    }

    initializeGmailService();
  }, []);

  // 获取邮件列表
  const fetchEmails = async (service: GmailService) => {
    setLoading(true);
    try {
      const query = searchQuery ? `{${searchQuery}}` : "";
      const result = await service.getMessages(20, query);

      if (result && result.emails) {
        setEmails(result.emails);
      } else {
        setEmails([]);
      }

      setError(null);
    } catch (err: any) {
      console.error("获取邮件失败:", err);
      setError(err.message || "获取邮件失败");
    } finally {
      setLoading(false);
    }
  };

  // 刷新邮件列表
  const handleRefresh = () => {
    if (gmailService) {
      fetchEmails(gmailService);
    }
  };

  // 搜索邮件
  const handleSearch = () => {
    if (gmailService) {
      fetchEmails(gmailService);
    }
  };

  // 标记邮件为已读
  const handleMarkAsRead = async (emailId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (gmailService) {
      try {
        await gmailService.markAsRead(emailId);
        // 更新本地邮件列表中的已读状态
        setEmails((prevEmails) =>
          prevEmails.map((email) =>
            email.id === emailId
              ? {
                  ...email,
                  labelIds: email.labelIds.filter(
                    (id: string) => id !== "UNREAD"
                  ),
                }
              : email
          )
        );
      } catch (err) {
        console.error("标记邮件为已读失败:", err);
      }
    }
  };

  // 标记邮件为未读
  const handleMarkAsUnread = async (emailId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (gmailService) {
      try {
        await gmailService.markAsUnread(emailId);
        // 更新本地邮件列表中的未读状态
        setEmails((prevEmails) =>
          prevEmails.map((email) =>
            email.id === emailId
              ? { ...email, labelIds: [...email.labelIds, "UNREAD"] }
              : email
          )
        );
      } catch (err) {
        console.error("标记邮件为未读失败:", err);
      }
    }
  };

  // 归档邮件
  const handleArchive = async (emailId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (gmailService) {
      try {
        await gmailService.archiveEmail(emailId);
        // 从列表中移除该邮件
        setEmails((prevEmails) =>
          prevEmails.filter((email) => email.id !== emailId)
        );
      } catch (err) {
        console.error("归档邮件失败:", err);
      }
    }
  };

  // 删除邮件
  const handleTrash = async (emailId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (gmailService) {
      try {
        await gmailService.trashEmail(emailId);
        // 从列表中移除该邮件
        setEmails((prevEmails) =>
          prevEmails.filter((email) => email.id !== emailId)
        );
      } catch (err) {
        console.error("删除邮件失败:", err);
      }
    }
  };

  // 查看邮件详情
  const handleViewEmail = (email: any) => {
    setSelectedEmail(email);
    setView("detail");

    // 如果邮件未读，标记为已读
    if (email.labelIds && email.labelIds.includes("UNREAD") && gmailService) {
      gmailService.markAsRead(email.id);
      // 更新本地邮件列表中的已读状态
      setEmails((prevEmails) =>
        prevEmails.map((e) =>
          e.id === email.id
            ? {
                ...e,
                labelIds: e.labelIds.filter((id: string) => id !== "UNREAD"),
              }
            : e
        )
      );
    }
  };

  // 返回邮件列表
  const handleBackToList = () => {
    setView("list");
    setSelectedEmail(null);
  };

  // 从邮件标签判断是否未读
  const isUnread = (email: any) => {
    return email.labelIds && email.labelIds.includes("UNREAD");
  };

  // 从HTML内容中提取纯文本
  const extractTextFromHtml = (html: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  // 渲染邮件列表视图
  const renderListView = () => (
    <div className="w-full">
      {/* 搜索栏 */}
      <div className="flex items-center mb-4 px-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索邮件..."
            className="w-full p-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Search
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={18}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-2"
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
        </Button>
      </div>

      {/* 邮件列表 */}
      {loading ? (
        <div className="flex justify-center py-8">
          <RefreshCcw size={24} className="animate-spin text-gray-500" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : emails.length === 0 ? (
        <div className="text-center py-8 text-gray-500">没有找到邮件</div>
      ) : (
        <div className="space-y-1">
          {emails.map((email) => {
            const subject = getHeader(email.payload.headers, "subject");
            const from = getHeader(email.payload.headers, "from");
            const date = getHeader(email.payload.headers, "date");
            const formattedDate = date ? formatDate(date) : "";
            const isEmailUnread = isUnread(email);

            // 获取发件人显示名称
            let fromName = from;
            if (from.includes("<")) {
              const match = from.match(/(.+) <.+>/);
              fromName = match ? match[1] : from.split("<")[0].trim();
            }

            return (
              <div
                key={email.id}
                className={`flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded-md ${
                  isEmailUnread
                    ? "font-semibold bg-blue-50 dark:bg-blue-900/20"
                    : ""
                }`}
                onClick={() => handleViewEmail(email)}
              >
                {/* 未读标记 */}
                <div className="mr-3">
                  {isEmailUnread ? (
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  ) : (
                    <div className="w-2 h-2"></div>
                  )}
                </div>

                {/* 邮件内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <div className="truncate font-medium">{fromName}</div>
                    <div className="text-xs text-gray-500 ml-2 shrink-0">
                      {formattedDate}
                    </div>
                  </div>
                  <div className="truncate">{subject}</div>
                  <div className="truncate text-sm text-gray-500">
                    {email.snippet}
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="ml-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isEmailUnread ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="标记为已读"
                      onClick={(e) => handleMarkAsRead(email.id, e)}
                    >
                      <MailOpen size={16} />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="标记为未读"
                      onClick={(e) => handleMarkAsUnread(email.id, e)}
                    >
                      <Mail size={16} />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title="归档"
                    onClick={(e) => handleArchive(email.id, e)}
                  >
                    <Archive size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title="删除"
                    onClick={(e) => handleTrash(email.id, e)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // 渲染邮件详情视图
  const renderDetailView = () => {
    if (!selectedEmail) return null;

    const subject = getHeader(selectedEmail.payload.headers, "subject");
    const from = getHeader(selectedEmail.payload.headers, "from");
    const to = getHeader(selectedEmail.payload.headers, "to");
    const date = getHeader(selectedEmail.payload.headers, "date");
    const formattedDate = date ? new Date(date).toLocaleString() : "";

    // 解析邮件内容
    let emailBody = "";
    let isHtml = false;

    if (selectedEmail.payload.parts) {
      // 多部分邮件
      const htmlPart = selectedEmail.payload.parts.find(
        (part: any) => part.mimeType === "text/html"
      );
      const textPart = selectedEmail.payload.parts.find(
        (part: any) => part.mimeType === "text/plain"
      );

      if (htmlPart && htmlPart.body && htmlPart.body.data) {
        emailBody = atob(
          htmlPart.body.data.replace(/-/g, "+").replace(/_/g, "/")
        );
        isHtml = true;
      } else if (textPart && textPart.body && textPart.body.data) {
        emailBody = atob(
          textPart.body.data.replace(/-/g, "+").replace(/_/g, "/")
        );
      }
    } else if (selectedEmail.payload.body && selectedEmail.payload.body.data) {
      // 单部分邮件
      emailBody = atob(
        selectedEmail.payload.body.data.replace(/-/g, "+").replace(/_/g, "/")
      );
      isHtml = selectedEmail.payload.mimeType === "text/html";
    }

    return (
      <div className="w-full">
        {/* 返回按钮 */}
        <div className="mb-4">
          <Button variant="ghost" onClick={handleBackToList}>
            <span className="mr-2">←</span> 返回
          </Button>
        </div>

        {/* 邮件头部 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">{subject}</h1>
          <div className="flex flex-wrap justify-between items-center mb-2">
            <div className="text-sm text-gray-600">
              <span className="font-medium">From:</span> {from}
            </div>
            <div className="text-sm text-gray-600">{formattedDate}</div>
          </div>
          <div className="text-sm text-gray-600 mb-4">
            <span className="font-medium">To:</span> {to}
          </div>
        </div>

        {/* 邮件内容 */}
        <div className="border-t pt-4">
          {isHtml ? (
            <div
              className="prose max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: emailBody }}
            />
          ) : (
            <pre className="whitespace-pre-wrap font-sans">{emailBody}</pre>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {view === "list" ? renderListView() : renderDetailView()}
    </div>
  );
}
