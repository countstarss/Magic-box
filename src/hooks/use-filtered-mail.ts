// 定义 Email 类型
import { Email } from "@/lib/data";

// 定义 useFilteredEmails Hook
export function useFilteredEmails(emails: Email[], tag: string): Email[] {
  return emails.filter((email) => email.tags.includes(tag));
}
export function useTrashEmails(emails: Email[], isTrash: boolean): Email[] {
  return emails.filter((email) => email.isTrash);
}
export function useArchiveEmails(emails: Email[], isArchive: boolean): Email[] {
  return emails.filter((email) => email.isArchive);
}