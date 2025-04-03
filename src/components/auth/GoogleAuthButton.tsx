"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { FcGoogle } from "react-icons/fc";

interface GoogleAuthButtonProps {
  className?: string;
  redirectTo?: string;
}

export default function GoogleAuthButton({
  className = "",
  redirectTo = "/auth/callback",
}: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 使用Supabase的Google OAuth登录
      // Supabase会自动处理重定向和授权码的交换
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo, // 使用Supabase的回调路径
          queryParams: {
            access_type: "offline", // 请求刷新令牌
            prompt: "consent", // 强制显示Google同意页面
          },
          // 请求邮件访问权限的作用域
          scopes:
            "email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.labels",
        },
      });

      if (error) {
        throw error;
      }

      // 不需要手动重定向，Supabase会处理
      console.log("Google auth initiated:", data);
    } catch (err: any) {
      console.error("Google authentication error:", err);
      setError(err.message || "登录失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      className={`flex items-center gap-2 ${className}`}
      disabled={isLoading}
      variant="outline"
      size="lg"
    >
      <FcGoogle className="h-5 w-5" />
      <span>{isLoading ? "登录中..." : "使用Google账号登录"}</span>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </Button>
  );
}
