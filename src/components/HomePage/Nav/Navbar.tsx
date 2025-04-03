"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "./MobileMenu";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { UserNav } from "./UserNav";
import BorderMagic from "../../global/Border-Magic";
import { twMerge } from "tailwind-merge";
import { mobileMenu } from "@/lib/data/menu";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import GmailAuthButton from "@/components/auth/GmailAuthButton";
import { Mail, UserCircle } from "lucide-react";
// import { useSession } from "next-auth/react";
// import { Spinner } from "@/components/Spinner";

export function Navbar({ className }: { className?: string }) {
  // const { data: session, status, update } = useSession();
  const [user, setUser] = useState<any>(null);
  const [hasGmailAccount, setHasGmailAccount] = useState(false);

  useEffect(() => {
    // 获取当前登录用户
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);

      // 如果用户已登录，检查是否已有Gmail账户
      if (session?.user) {
        const { data, error } = await supabase
          .from("email_accounts")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("provider", "gmail")
          .maybeSingle();

        setHasGmailAccount(!!data);
      }
    };

    getUser();

    // 监听认证状态变化
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);

        // 如果用户已登录，检查是否已有Gmail账户
        if (session?.user) {
          const { data, error } = await supabase
            .from("email_accounts")
            .select("id")
            .eq("user_id", session.user.id)
            .eq("provider", "gmail")
            .maybeSingle();

          setHasGmailAccount(!!data);
        } else {
          setHasGmailAccount(false);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav
      className={twMerge(
        "fixed top-0 left-0 right-0 w-screen flex items-center px-4 md:px-20 py-7 justify-between",
        "light:shadow-lg light:bg-white",
        "backdrop-blur-lg z-[10] border-b-[1px] border-black/50 dark:border-white/20 transition-all duration-300",
        className
      )}
    >
      {/* Logo */}
      <div>
        <Link href="/">
          <h1 className="text-2xl font-semibold truncate hidden sm:block">
            <span className="text-indigo-500">Wiz</span>Mail
          </h1>
          <h1 className="text-2xl font-semibold truncate sm:hidden">
            <span className="text-indigo-500">Wiz</span>Mail
          </h1>
        </Link>
      </div>

      {/* Navbar Items */}

      {/* Right-side items */}
      <div className="flex items-center gap-x-2 ms-auto md:col-span-3">
        <Link href="/auth" className="md:block hidden">
          <BorderMagic title="Start Trail" />
        </Link>

        {/* Gmail授权按钮 - 仅在用户登录且没有Gmail账户时显示 */}
        {user && !hasGmailAccount && <GmailAuthButton className="mr-2" />}

        {/* 已授权Gmail提示 */}
        {user && hasGmailAccount && (
          <Button
            variant="ghost"
            className="mr-2 cursor-default flex items-center gap-2"
          >
            <Mail size={18} className="text-green-500" />
            <span className="text-sm">Gmail已连接</span>
          </Button>
        )}

        <div className="mx-2">
          <ModeToggle />
        </div>

        {/* UserNav - Dynamic User Info */}
        {false ? (
          <UserCircle size="30" />
        ) : true ? (
          <UserNav
            email={user?.email || "Guest"}
            name={user?.user_metadata?.name || "Guest"}
            userImage={"https://avatar.vercel.sh/teacher"}
          />
        ) : (
          <Link href="/login">
            <Button className="px-6 py-2">Login</Button>
          </Link>
        )}

        {/* Mobile Menu */}
        <div className="md:hidden">
          <MobileMenu items={mobileMenu} />
        </div>
      </div>
    </nav>
  );
}
