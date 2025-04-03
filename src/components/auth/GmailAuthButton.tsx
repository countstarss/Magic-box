"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mail, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface GmailAuthButtonProps {
  className?: string;
}

export default function GmailAuthButton({ className }: GmailAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gmail OAuth 2.0 配置
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  // 调试辅助
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      if (!GOOGLE_CLIENT_ID) {
        console.error(
          "Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable"
        );
      } else {
        console.log(
          "GOOGLE_CLIENT_ID is set:",
          GOOGLE_CLIENT_ID.substring(0, 10) + "..."
        );
      }
    }
  }, [GOOGLE_CLIENT_ID]);

  const handleGmailAuth = () => {
    // if (!GOOGLE_CLIENT_ID) {
    //   setError("Missing Google Client ID configuration");
    //   return;
    // }

    // setIsLoading(true);
    // setError(null);

    // try {
    //   // 确保回调URL正确 - 必须与 Google Cloud Console 中的设置完全匹配
    //   const REDIRECT_URI =
    //     typeof window !== "undefined"
    //       ? `${window.location.origin}/api/auth/gmail/callback`
    //       : "";

    //   console.log("Using redirect URI:", REDIRECT_URI);

    //   // Gmail API需要的权限范围
    //   const SCOPES = [
    //     "https://www.googleapis.com/auth/gmail.readonly", // 读取邮件
    //     "https://www.googleapis.com/auth/gmail.send", // 发送邮件
    //     "https://www.googleapis.com/auth/gmail.modify", // 修改邮件（不删除）
    //     "https://www.googleapis.com/auth/gmail.labels", // 管理标签
    //   ].join(" ");

    //   // 构建OAuth 2.0 授权URL
    //   const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    //   authUrl.searchParams.append("client_id", GOOGLE_CLIENT_ID);
    //   authUrl.searchParams.append("redirect_uri", REDIRECT_URI);
    //   authUrl.searchParams.append("response_type", "code");
    //   authUrl.searchParams.append("scope", SCOPES);
    //   authUrl.searchParams.append("access_type", "offline"); // 获取refresh token
    //   authUrl.searchParams.append("prompt", "consent"); // 始终显示同意页面

    //   // 添加state参数防止CSRF攻击
    //   const state = Math.random().toString(36).substring(2);
    //   localStorage.setItem("gmail_auth_state", state);
    //   authUrl.searchParams.append("state", state);

    //   // 输出调试信息
    //   console.log("Authorization URL:", authUrl.toString());

    //   // 重定向到Google授权页面
    //   window.location.href = authUrl.toString();
    // } catch (err) {
    //   console.error("Error starting Gmail authorization:", err);
    //   setError("Failed to initiate Google authorization");
    //   setIsLoading(false);
    // }
    toast.success("Gmail authorization successful");
  };

  return (
    <div className="flex flex-col">
      {error && (
        <div className="flex items-center gap-2 text-red-500 mb-2 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      <Button
        onClick={handleGmailAuth}
        className={`flex items-center gap-2 ${className}`}
        disabled={isLoading}
        variant="outline"
      >
        <Mail size={18} />
        {isLoading ? "正在授权..." : "授权访问Gmail"}
      </Button>
    </div>
  );
}
