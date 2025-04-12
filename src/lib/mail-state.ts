import { atom } from "jotai";
import { EmailMessage } from "@/lib/types/nylas-types";

// 定义邮件状态原子
export interface MailState {
  selectedId: string | null;
  currentFolder: string;
  isSidebarCollapsed: boolean;
}

// 创建初始状态
const initialMailState: MailState = {
  selectedId: null,
  currentFolder: "inbox",
  isSidebarCollapsed: false,
};

// 创建原子状态
export const mailStateAtom = atom<MailState>(initialMailState);

// 创建一个原子来存储当前选中的邮件对象
export const selectedMailAtom = atom<EmailMessage | null>(null);

// 创建派生原子用于获取持久化状态
export const persistedMailStateAtom = atom(
  // 获取函数
  (get) => get(mailStateAtom),
  // 设置函数，包含持久化逻辑
  (get, set, update: Partial<MailState>) => {
    const nextState = { ...get(mailStateAtom), ...update };
    set(mailStateAtom, nextState);

    // 保存到 localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "mail-state",
          JSON.stringify({
            selectedId: nextState.selectedId,
            currentFolder: nextState.currentFolder,
          })
        );
      } catch (e) {
        console.error("Failed to save mail state:", e);
      }
    }
  }
);

// 初始化函数，从localStorage加载状态
export function initializeMailState(set: (update: Partial<MailState>) => void) {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("mail-state");
      if (saved) {
        const savedState = JSON.parse(saved);
        set({
          selectedId: savedState.selectedId || null,
          currentFolder: savedState.currentFolder || "inbox",
        });
      }
    } catch (e) {
      console.error("Failed to load mail state:", e);
    }
  }
}
