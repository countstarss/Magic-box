import { atom, useAtom } from "jotai"
import { useEffect, useState } from "react"
import { Mail, mails as defaultMails } from "@/lib/data"

type Config = {
  selected: Mail["id"] | null
  mails: Mail[]
}

const configAtom = atom<Config>({
  selected: null,
  mails: defaultMails,
})

export function useMail() {
  const [config, setConfig] = useAtom(configAtom)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 更新邮件已读状态的函数
  const markAsRead = (mailId: string) => {
    setConfig(prev => ({
      ...prev,
      mails: prev.mails.map(mail => 
        mail.id === mailId 
          ? { ...mail, read: true }
          : mail
      )
    }))
  }

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

  return {
    config,
    setConfig,
    loading,
    error,
    markAsRead
  }
}