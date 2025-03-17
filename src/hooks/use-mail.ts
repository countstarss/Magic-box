import { atom, useAtom } from "jotai"
import { useCallback, useEffect, useState } from "react"
import { Mail, mails as defaultMails } from "@/lib/data"
import { useSearchParams } from "next/navigation"
import { userCategoriesAtom, matchesCategory } from "@/lib/user-categories"
import { analyzeMailWithOpenAI, type AIMailAnalysisResult } from "@/lib/ai-mail-analysis"

type Config = {
  selected: Mail["id"] | null
  mails: Mail[]
  // 存储AI分析结果
  analysisResults: Record<string, AIMailAnalysisResult>
}

const configAtom = atom<Config>({
  selected: null,
  mails: defaultMails,
  analysisResults: {},
})

export function useMail() {
  const [config, setConfig] = useAtom(configAtom)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userCategories] = useAtom(userCategoriesAtom)
  const searchParams = useSearchParams()
  
  // 获取当前的分类参数（如果存在）
  const categoryParam = searchParams.get("category")

  // 更新邮件已读状态的函数
  const markAsRead = useCallback((mailId: string) => {
    setConfig(prev => ({
      ...prev,
      mails: prev.mails.map(mail => 
        mail.id === mailId 
          ? { ...mail, read: true }
          : mail
      )
    }))
  }, [setConfig])

  // 根据不同文件夹过滤邮件
  const getFilteredMails = useCallback((folder: string) => {
    // 首先按文件夹过滤邮件
    let filteredMails = [];
    switch(folder) {
      case 'inbox':
        filteredMails = config.mails.filter(mail => 
          !mail.isTrash && !mail.isArchive && !mail.tags.includes('draft') && !mail.tags.includes('junk')
        );
        break;
      case 'draft':
        filteredMails = config.mails.filter(mail => mail.tags.includes('draft'));
        break;
      case 'sent':
        filteredMails = config.mails.filter(mail => mail.tags.includes('sent'));
        break;
      case 'junk':
        filteredMails = config.mails.filter(mail => mail.tags.includes('junk'));
        break;
      case 'trash':
        filteredMails = config.mails.filter(mail => mail.isTrash);
        break;
      case 'archive':
        filteredMails = config.mails.filter(mail => mail.isArchive);
        break;
      default:
        filteredMails = config.mails;
    }
    
    // 如果指定了分类参数，进一步过滤邮件
    if (categoryParam) {
      const category = userCategories.find(cat => cat.id === categoryParam);
      if (category) {
        filteredMails = filteredMails.filter(mail => matchesCategory(mail, category));
      }
    }
    
    return filteredMails;
  }, [config.mails, categoryParam, userCategories])

  // 手动分析指定邮件
  const analyzeEmail = useCallback(async (mailId: string) => {
    const mail = config.mails.find(m => m.id === mailId);
    if (!mail) return null;
    
    try {
      const result = await analyzeMailWithOpenAI(mail);
      
      // 保存分析结果
      setConfig(prev => ({
        ...prev,
        analysisResults: {
          ...prev.analysisResults,
          [mailId]: result
        }
      }));
      
      return result;
    } catch (error) {
      console.error('Error analyzing email:', error);
      return null;
    }
  }, [config.mails, setConfig]);

  // 获取邮件的分析结果（如果有）
  const getMailAnalysis = useCallback((mailId: string) => {
    return config.analysisResults[mailId] || null;
  }, [config.analysisResults]);

  // 按类别计数邮件
  const getCategoryCounts = useCallback(() => {
    const counts: Record<string, number> = {};
    
    userCategories.forEach(category => {
      // 只在收件箱中计数
      const inboxMails = config.mails.filter(mail => 
        !mail.isTrash && !mail.isArchive && !mail.tags.includes('draft') && !mail.tags.includes('junk')
      );
      
      counts[category.id] = inboxMails.filter(mail => 
        matchesCategory(mail, category)
      ).length;
    });
    
    return counts;
  }, [config.mails, userCategories]);

  // 清空垃圾箱
  const emptyTrash = useCallback(() => {
    setConfig(prev => ({
      ...prev,
      mails: prev.mails.filter(mail => !mail.isTrash)
    }));
    
    // 如果后端有API，可以在这里调用
    // async function deleteTrashFromServer() {
    //   try {
    //     await fetch('/api/mail/trash', {
    //       method: 'DELETE'
    //     });
    //   } catch (error) {
    //     console.error('Error emptying trash:', error);
    //   }
    // }
    // deleteTrashFromServer();
  }, [setConfig]);

  useEffect(() => {
    async function fetchMails() {
      try {
        const response = await fetch('/api/mail')
        if (!response.ok) {
          throw new Error('Failed to fetch mails')
        }
        const data = await response.json()
        setConfig(prev => ({
          ...prev,
          mails: data.mails,
          selected: data.mails[0]?.id || null
        }))
      } catch (err) {
        console.error('Error fetching mails:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch mails')
        setConfig(prev => ({
          ...prev,
          mails: defaultMails,
          selected: defaultMails[0]?.id || null
        }))
      } finally {
        setLoading(false)
      }
    }

    fetchMails()
  }, [setConfig])

  // 获取选中的邮件
  const selectedMail = config.selected 
    ? config.mails.find(mail => mail.id === config.selected) 
    : null;

  return {
    config,
    setConfig,
    loading,
    error,
    markAsRead,
    getFilteredMails,
    analyzeEmail,
    getMailAnalysis,
    getCategoryCounts,
    selectedMail,
    userCategories,
    emptyTrash
  }
}