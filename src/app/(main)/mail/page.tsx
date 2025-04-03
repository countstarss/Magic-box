import * as React from "react";
import { cookies } from "next/headers";
import MailScroll from "./components/MailScroll";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

export default function MailPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const layout = cookies().get("react-resizable-panels:layout:mail");
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  // Check if we just authenticated successfully
  const showSuccessMessage = searchParams?.auth === "success";

  return (
    <>
      {showSuccessMessage && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
          <AlertDescription className="text-green-700">
            登录成功！您已连接到您的邮箱账户。
          </AlertDescription>
        </Alert>
      )}
      <MailScroll defaultLayout={defaultLayout} folder="inbox" />
    </>
  );
}
