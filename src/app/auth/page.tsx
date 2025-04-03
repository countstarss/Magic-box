"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import AuthForm from "@/components/auth/AuthForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 处理URL查询参数
  useEffect(() => {
    const errorParam = searchParams.get("error");
    const successParam = searchParams.get("success");
    const authParam = searchParams.get("auth");

    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }

    if (successParam) {
      setSuccess(decodeURIComponent(successParam));
    }

    if (authParam === "success") {
      setSuccess("登录成功！");
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left side - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-16">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              WizMail
            </h1>
            <p className="text-gray-600 dark:text-gray-400">智能邮件管理平台</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert
              variant="default"
              className="mb-6 bg-green-50 border-green-200 text-green-800"
            >
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <AuthForm />
        </div>
      </div>

      {/* Right side - Hero Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-white max-w-lg">
            <h2 className="text-4xl font-bold mb-6">智能邮件管理平台</h2>
            <p className="text-xl opacity-90 mb-8">
              使用AI驱动的功能和协作工具优化您的邮件工作流程
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Gmail 集成与自动分类</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>智能邮件分析与摘要</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>团队协作与共享邮箱</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>自动化电子邮件营销</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>跨平台访问与移动支持</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>企业级安全与加密</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
