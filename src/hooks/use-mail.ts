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
  // Gmail 认证状态
  gmailAuthorized: boolean
}

const configAtom = atom<Config>({
  selected: null,
  mails: defaultMails,
  analysisResults: {},
  gmailAuthorized: false
})

export function useMail() {
  const [config, setConfig] = useAtom(configAtom)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userCategories] = useAtom(userCategoriesAtom)
  const searchParams = useSearchParams()
  
  // 获取当前的分类参数（如果存在）
  const categoryParam = searchParams.get("category")
  // 检查是否有Gmail授权成功标志
  const gmailSuccess = searchParams?.get("success") === "gmail_connected"

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

    // 如果有Gmail集成，调用API更新已读状态
    if (config.gmailAuthorized) {
      fetch(`/api/gmail/${mailId}/read`, {
        method: 'POST',
      }).catch(err => {
        console.error('Failed to mark Gmail message as read:', err);
      });
    }
  }, [setConfig, config.gmailAuthorized])

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
    
    // NOTE: 如果指定了分类参数，进一步过滤邮件
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

  // 检查 Gmail 授权状态
  const checkGmailAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/gmail');
      if (response.ok) {
        setConfig(prev => ({
          ...prev,
          gmailAuthorized: true
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking Gmail auth:', error);
      return false;
    }
  }, [setConfig]);

  // 获取 Gmail 邮件
  const fetchGmailMessages = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gmail?maxResults=50');
      
      if (!response.ok) {
        if (response.status === 401) {
          setConfig(prev => ({ ...prev, gmailAuthorized: false }));
          throw new Error('Gmail authorization required');
        }
        throw new Error(`Failed to fetch Gmail: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.emails && Array.isArray(data.emails)) {
        console.log('Fetched Gmail messages:', data.emails.length);
        
        // 转换 Gmail 邮件格式为应用格式
        const formattedMails = data.emails.map((email: any) => {
          const headers = email.payload?.headers || [];
          const fromHeader = headers.find((h: any) => h.name === 'From');
          const subjectHeader = headers.find((h: any) => h.name === 'Subject');
          const dateHeader = headers.find((h: any) => h.name === 'Date');
          
          // 尝试获取邮件正文
          let emailBody = '';
          if (email.payload?.body?.data) {
            try {
              const base64 = email.payload.body.data.replace(/-/g, '+').replace(/_/g, '/');
              emailBody = atob(base64);
            } catch (e) {
              console.error('Failed to decode email body:', e);
            }
          } else if (email.payload?.parts) {
            // 如果邮件有多个部分，尝试找到文本部分
            const textPart = email.payload.parts.find(
              (part: any) => part.mimeType === 'text/plain' && part.body?.data
            );
            if (textPart && textPart.body?.data) {
              try {
                const base64 = textPart.body.data.replace(/-/g, '+').replace(/_/g, '/');
                emailBody = atob(base64);
              } catch (e) {
                console.error('Failed to decode email part:', e);
              }
            }
          }
          
          // 处理发件人信息
          let name = '';
          let emailAddress = '';
          if (fromHeader) {
            const fromValue = fromHeader.value;
            const match = fromValue.match(/(.*?)\s*<(.+?)>/);
            if (match) {
              name = match[1].trim().replace(/"/g, '');
              emailAddress = match[2];
            } else {
              emailAddress = fromValue;
              name = fromValue.split('@')[0];
            }
          }
          
          // 获取标签和已读状态
          const labels = email.labelIds || [];
          const isRead = !labels.includes('UNREAD');
          
          // 转换为应用中的标签
          const appLabels: string[] = [];
          if (labels.includes('IMPORTANT')) appLabels.push('important');
          
          // 设置邮件标签/分类
          const tags: string[] = [];
          if (labels.includes('SENT')) tags.push('sent');
          if (labels.includes('DRAFT')) tags.push('draft');
          if (labels.includes('SPAM')) tags.push('junk');
          
          return {
            id: email.id,
            name: name || 'Unknown Sender',
            email: emailAddress || 'unknown@example.com',
            subject: subjectHeader?.value || '(No Subject)',
            text: emailBody || '(No content)',
            date: dateHeader?.value || new Date().toISOString(),
            read: isRead,
            labels: appLabels,
            tags: tags,
            isTrash: labels.includes('TRASH'),
            isArchive: labels.includes('CATEGORY_PERSONAL') && !labels.includes('INBOX'),
          };
        });
        
        setConfig(prev => ({
          ...prev,
          mails: formattedMails,
          selected: formattedMails[0]?.id || null,
          gmailAuthorized: true
        }));
      }
    } catch (err) {
      console.error('Error fetching Gmail messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch Gmail messages');
      
      // 如果授权失败，回退到默认邮件
      if (!config.mails.length) {
        setConfig(prev => ({
          ...prev,
          mails: defaultMails,
          selected: defaultMails[0]?.id || null
        }));
      }
    } finally {
      setLoading(false);
    }
  }, [setConfig, config.mails.length]);

  useEffect(() => {
    // 检查 cookie 是否表明刚刚完成了 Gmail 授权
    const checkGmailAuthCookie = () => {
      if (document.cookie.includes('gmail_authorized=true')) {
        console.log('Gmail just authorized, fetching messages');
        // 清除 cookie
        document.cookie = 'gmail_authorized=; max-age=0; path=/;';
        return true;
      }
      return false;
    };

    async function initializeData() {
      setLoading(true);
      
      const justAuthorized = gmailSuccess || (typeof window !== 'undefined' && checkGmailAuthCookie());
      
      // 如果刚刚授权成功或URL中有成功参数，直接获取Gmail消息
      if (justAuthorized) {
        console.log('Gmail authorization successful, fetching messages');
        await fetchGmailMessages();
        return;
      }
      
      // 否则，检查授权状态
      const isAuthorized = await checkGmailAuth();
      
      if (isAuthorized) {
        console.log('Gmail already authorized, fetching messages');
        await fetchGmailMessages();
      } else {
        // 如果未授权Gmail，回退到默认数据或API
        try {
          console.log('Falling back to default mail API');
          const response = await fetch('/api/mail');
          if (!response.ok) {
            throw new Error('Failed to fetch mails');
          }
          const data = await response.json();
          setConfig(prev => ({
            ...prev,
            mails: data.mails,
            selected: data.mails[0]?.id || null
          }));
        } catch (err) {
          console.error('Error fetching mails:', err);
          setError(err instanceof Error ? err.message : 'Failed to fetch mails');
          setConfig(prev => ({
            ...prev,
            mails: defaultMails,
            selected: defaultMails[0]?.id || null
          }));
        } finally {
          setLoading(false);
        }
      }
    }

    initializeData();
  }, [setConfig, fetchGmailMessages, checkGmailAuth, gmailSuccess]);

  // 获取选中的邮件
  const selectedMail = config.selected 
    ? config.mails.find(mail => mail.id === config.selected) 
    : null;

  // Add this function to the useMail hook
  const getMailById = useCallback(async (id: string) => {
    // Check if we already have this email in the state
    const existingMail = config.mails.find(mail => mail.id === id);
    if (existingMail) {
      // If we have it, mark it as read
      markAsRead(id);
      return existingMail;
    }

    // If we don't have it, fetch it from the API
    try {
      setLoading(true);
      const response = await fetch(`/api/mail/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch mail');
      }
      const data = await response.json();
      
      // Add this email to our state if it's not already there
      setConfig(prev => {
        // Check if the email is already in the state
        if (!prev.mails.some(mail => mail.id === data.id)) {
          return {
            ...prev,
            mails: [...prev.mails, data],
            selected: data.id
          };
        }
        return {
          ...prev,
          selected: data.id
        };
      });
      setLoading(false);
      return data;
    } catch (err) {
      console.error('Error fetching mail by ID:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch mail');
      setLoading(false);
      return null;
    }
  }, [config.mails, markAsRead, setConfig]);

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
    emptyTrash,
    fetchGmailMessages,
    checkGmailAuth,
    isGmailAuthorized: config.gmailAuthorized,
    getMailById
  }
}