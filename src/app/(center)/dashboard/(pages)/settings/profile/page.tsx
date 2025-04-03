"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { settings } from "@/actions/auth/settings";
import { Card } from "@/components/ui/card";
import { ProfileForm } from "./_components/profile-form"
import { signOut } from "@/utils/auth";
import { redirect } from "next/navigation";
import { notificationExamples } from "@/utils/notification";

export default function Profile() {
  const { data: session, update: updateSession } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    console.log("start");
    try {
      const response = await settings(values);
      
      if (response?.error) {
        toast.error(response.error);
        return;
      }

      if (response?.success) {
        toast.success(response.success);
        
        // 如果更改了密码，需要重新登录
        if (values.newPassword) {
          toast.success("Password updated. Please login again");
          await signOut();
          return redirect('/login');
        }
        
        await updateSession(); // 更新会话信息
        notificationExamples.passwordChanged(session?.user?.id as string);
      }
    } catch (error) {
      // toast.error("Something went wrong!");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-3 md:p-6 space-y-3 h-full overflow-scroll mb-[300px]">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <ProfileForm 
            initialData={session?.user}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        </Card>
      </div>
    </div>
  );
}