"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import nylasService from "@/lib/services/nylas-service";
import mailAccountService from "@/lib/services/mail-account-service";

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    async function handleCallback() {
      try {
        // 获取授权码
        const code = searchParams.get("code");
        const error = searchParams.get("error");

        // 检查错误
        if (error) {
          setStatus("error");
          setErrorMessage(error);
          return;
        }

        // 验证授权码
        if (!code) {
          setStatus("error");
          setErrorMessage("No authorization code received");
          return;
        }

        // 交换授权码获取访问令牌
        const { grantId, emailAccount } = await nylasService.exchangeCodeForToken(code);
        
        // 保存账户信息
        mailAccountService.addAccount(grantId, emailAccount);
        
        // 设置成功状态
        setStatus("success");
        
        // 延迟1.5秒后重定向到gmail页面
        setTimeout(() => {
          router.push("/gmail");
        }, 1500);
      } catch (error) {
        setStatus("error");
        setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred");
      }
    }

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center">
              {status === "loading" && "Connecting your account..."}
              {status === "success" && "Account Connected!"}
              {status === "error" && "Connection Failed"}
            </CardTitle>
            <CardDescription className="text-center">
              {status === "loading" && "Please wait while we finish the connection process"}
              {status === "success" && "You have successfully connected your email account"}
              {status === "error" && "There was a problem connecting your account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6">
            {status === "loading" && (
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
            )}
            {status === "success" && (
              <CheckCircle className="h-16 w-16 text-green-500" />
            )}
            {status === "error" && (
              <>
                <XCircle className="h-16 w-16 text-red-500" />
                <p className="mt-4 text-sm text-muted-foreground text-center">
                  {errorMessage || "An unknown error occurred. Please try again later."}
                </p>
              </>
            )}
            
            <div className="mt-6 w-full">
              {status === "success" && (
                <p className="text-center text-sm text-muted-foreground">
                  Redirecting you to your inbox...
                </p>
              )}
              {status === "error" && (
                <Button 
                  className="w-full" 
                  onClick={() => router.push("/onboarding")}
                >
                  Try Again
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 