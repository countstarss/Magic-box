"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { Mail, Lock, Loader2 } from "lucide-react";
import GoogleAuthButton from "./GoogleAuthButton";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === "signup") {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;

        if (data.user?.identities?.length === 0) {
          setError("该邮箱已注册，请直接登录或使用其他邮箱");
        } else {
          // 显示验证邮件已发送的提示
          setError("验证邮件已发送到您的邮箱，请查收并验证");
        }
      } else {
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // 登录成功，跳转到邮件页面
        router.push("/mail");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">
          {mode === "signin" ? "欢迎回来" : "创建账户"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {mode === "signin"
            ? "登录您的账户以开始使用邮件管理工具"
            : "注册一个新账户以开始使用邮件管理工具"}
        </p>
      </div>

      {error && (
        <div
          className={`p-3 text-sm rounded ${
            error.includes("验证邮件")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {error}
        </div>
      )}

      <div className="space-y-4">
        <GoogleAuthButton className="w-full justify-center" />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              或使用邮箱密码
            </span>
          </div>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">电子邮箱</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">密码</Label>
              {mode === "signin" && (
                <Button variant="link" className="p-0 h-auto text-xs" asChild>
                  <a href="/auth/forgot-password">忘记密码?</a>
                </Button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder={
                  mode === "signup" ? "创建一个强密码" : "输入您的密码"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                处理中...
              </>
            ) : mode === "signin" ? (
              "登录"
            ) : (
              "注册"
            )}
          </Button>
        </form>

        <div className="text-center text-sm">
          {mode === "signin" ? (
            <p>
              还没有账户?{" "}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => setMode("signup")}
              >
                注册
              </Button>
            </p>
          ) : (
            <p>
              已有账户?{" "}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => setMode("signin")}
              >
                登录
              </Button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
