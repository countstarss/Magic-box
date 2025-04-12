import { useState, useCallback } from "react";
import { EmailMessage } from "@/lib/types/nylas-types";
import { useSearchParams } from "next/navigation";

// Simple type for compatibility with old components
export interface MailConfig {
  selected: string | null;
  mails: EmailMessage[];
  analysisResults: Record<string, any>;
  gmailAuthorized: boolean;
  currentFolder: string;
}

/**
 * 创建一个兼容的useMail hook，它提供与旧版本相同的接口
 * 但内部实现已经简化，不再依赖于旧的数据结构
 */
export function useMail() {
  // 检查是否有增强版邮件适配器
  if (typeof window !== "undefined" && (window as any).__enhancedMailAdapter) {
    return (window as any).__enhancedMailAdapter;
  }

  const [config, setConfig] = useState<MailConfig>({
    selected: null,
    mails: [],
    analysisResults: {},
    gmailAuthorized: false,
    currentFolder: "inbox",
  });

  const searchParams = useSearchParams();

  // 设置当前文件夹
  const setCurrentFolder = useCallback(
    (folder: string) => {
      setConfig((prev) => ({
        ...prev,
        currentFolder: folder,
      }));
    },
    [setConfig]
  );

  // 标记邮件为已读 (留空实现)
  const markAsRead = useCallback((mailId: string) => {
    console.log(`Marking mail as read: ${mailId}`);
    // 实际实现应该调用 API 或更新状态
  }, []);

  // 获取过滤后的邮件 (留空实现)
  const getFilteredMails = useCallback((folder: string) => {
    console.log(`Getting filtered mails for folder: ${folder}`);
    // 实际实现应该基于文件夹过滤邮件
    return [] as EmailMessage[];
  }, []);

  // 分析邮件 (留空实现)
  const analyzeEmail = useCallback(async (mailId: string) => {
    console.log(`Analyzing email: ${mailId}`);
    return null;
  }, []);

  // 获取邮件分析结果 (留空实现)
  const getMailAnalysis = useCallback((mailId: string) => {
    console.log(`Getting mail analysis for: ${mailId}`);
    return null;
  }, []);

  // 获取分类计数 (留空实现)
  const getCategoryCounts = useCallback(() => {
    // 返回一个空的计数对象
    return {} as Record<string, number>;
  }, []);

  // 清空垃圾箱 (留空实现)
  const emptyTrash = useCallback(() => {
    console.log("Emptying trash");
  }, []);

  // 检查Gmail授权 (留空实现)
  const checkGmailAuth = useCallback(async () => {
    console.log("Checking Gmail auth");
    return false;
  }, []);

  const mailHook = {
    config,
    setConfig,
    markAsRead,
    getFilteredMails,
    currentFolder: config.currentFolder,
    setCurrentFolder,
    analyzeEmail,
    getMailAnalysis,
    getCategoryCounts,
    emptyTrash,
    checkGmailAuth,
  };

  // 如果在浏览器环境，存储这个适配器以便可以重用
  if (typeof window !== "undefined") {
    (window as any).__enhancedMailAdapter = mailHook;
  }

  return mailHook;
}
