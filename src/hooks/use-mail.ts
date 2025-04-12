import { useState, useCallback, useEffect, useMemo } from "react";
import { EmailMessage } from "@/lib/types/nylas-types";
import { useSearchParams } from "next/navigation";
import { useEmails } from "./use-mail-queries";

// Simple type for compatibility with old components
export interface MailConfig {
  selected: string | null;
  mails: EmailMessage[];
  analysisResults: Record<string, any>;
  gmailAuthorized: boolean;
  currentFolder: string;
}

// 邮件缓存类型
interface EmailCache {
  [id: string]: EmailMessage;
}

/**
 * 创建一个兼容的useMail hook，它提供与旧版本相同的接口
 * 但内部实现已经简化，不再依赖于旧的数据结构
 */
export function useMail() {
  // 使用React内置的useRef机制和useState来保证只初始化一次
  // 这避免了在Hook之外保存状态的问题
  const [savedState] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const saved = localStorage.getItem("mail-state");
      if (saved) return JSON.parse(saved);
      return null;
    } catch (e) {
      console.error("Failed to parse saved mail state:", e);
      return null;
    }
  });

  const [config, setConfig] = useState<MailConfig>(() => ({
    selected: savedState?.selected || null,
    mails: [],
    analysisResults: {},
    gmailAuthorized: false,
    currentFolder: savedState?.currentFolder || "inbox",
  }));

  // 本地邮件缓存 - 用于存储已获取的完整邮件数据
  const [emailCache, setEmailCache] = useState<EmailCache>({});

  // 邮件查询配置 - 使用useMemo避免重复创建
  const emailQueryOptions = useMemo(
    () => ({
      limit: 50,
      unread: false,
    }),
    []
  );

  // 获取邮件列表 - staleTime和其他配置已在useEmails内部设置
  const { data: emails = [] } = useEmails(emailQueryOptions);

  // 更新邮件缓存
  useEffect(() => {
    // 为每封邮件更新缓存
    const newCache = { ...emailCache };
    let hasChanges = false;

    emails.forEach((email) => {
      // 只缓存有正文的完整邮件
      if (email.body && (!newCache[email.id] || !newCache[email.id].body)) {
        newCache[email.id] = email;
        hasChanges = true;
      }
      // 如果缓存中没有该邮件，也添加到缓存中
      else if (!newCache[email.id]) {
        newCache[email.id] = email;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setEmailCache(newCache);
    }
  }, [emails, emailCache]);

  // 当邮件列表加载完成后，确保至少选中第一封邮件
  useEffect(() => {
    if (emails.length > 0 && !config.selected) {
      setConfig((prev) => ({
        ...prev,
        selected: emails[0].id,
      }));
    }
  }, [emails, config.selected]);

  // 保存状态到localStorage - 添加防抖
  const [saveToStorage] = useState(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    return (data: { selected: string | null; currentFolder: string }) => {
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("mail-state", JSON.stringify(data));
          } catch (e) {
            console.error("Failed to save mail state:", e);
          }
        }
        timeoutId = null;
      }, 300);
    };
  });

  // 使用Effect监听变化并保存
  useEffect(() => {
    saveToStorage({
      selected: config.selected,
      currentFolder: config.currentFolder,
    });
  }, [config.selected, config.currentFolder, saveToStorage]);

  // 获取单个邮件的优化方法 - 尝试从缓存和列表中查找
  const getEmail = useCallback(
    (emailId: string): EmailMessage | null => {
      if (!emailId) return null;

      // 1. 首先从缓存中查找
      if (emailCache[emailId] && emailCache[emailId].body) {
        console.log(`[Mail Hook] 从缓存获取邮件: ${emailId}`);
        return emailCache[emailId];
      }

      // 2. 然后从当前邮件列表中查找
      const emailInList = emails.find((email) => email.id === emailId);
      if (emailInList) {
        console.log(`[Mail Hook] 从列表获取邮件: ${emailId}`);

        // 如果找到了完整邮件，更新缓存
        if (emailInList.body && !emailCache[emailId]) {
          setEmailCache((prev) => ({
            ...prev,
            [emailId]: emailInList,
          }));
        }

        return emailInList;
      }

      // 3. 如果没有找到，返回null（调用者需要通过API获取）
      console.log(`[Mail Hook] 邮件未在本地缓存: ${emailId}`);
      return null;
    },
    [emailCache, emails]
  );

  // 设置当前文件夹
  const setCurrentFolder = useCallback((folder: string) => {
    setConfig((prev) => ({
      ...prev,
      currentFolder: folder,
      // 切换文件夹时重置选择的邮件
      selected: null,
    }));
  }, []);

  // 标记邮件为已读 (留空实现)
  const markAsRead = useCallback((mailId: string) => {
    console.log(`Marking mail as read: ${mailId}`);
    // 实际实现应该调用 API 或更新状态
  }, []);

  // 获取过滤后的邮件 (留空实现)
  const getFilteredMails = useCallback(
    (folder: string) => {
      console.log(`Getting filtered mails for folder: ${folder}`);
      // 实际实现应该基于文件夹过滤邮件
      return emails;
    },
    [emails]
  );

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

  // 使用useMemo创建hook返回值，避免不必要的重新创建
  const mailHook = useMemo(
    () => ({
      config: {
        ...config,
        mails: emails, // 确保邮件列表总是最新的
      },
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
      // 添加获取单个邮件的方法
      getEmail,
      // 导出邮件缓存供组件使用
      emailCache,
    }),
    [
      config,
      emails,
      markAsRead,
      getFilteredMails,
      setCurrentFolder,
      analyzeEmail,
      getMailAnalysis,
      getCategoryCounts,
      emptyTrash,
      checkGmailAuth,
      getEmail,
      emailCache,
    ]
  );

  return mailHook;
}
