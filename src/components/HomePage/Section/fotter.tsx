"use client";

import React from "react";
import Link from "next/link";
import { AiFillTikTok, AiFillWechat } from "react-icons/ai";
import { FaFacebook, FaInstagram, FaPinterest, FaMedium, FaTwitter, FaYoutube } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { twMerge } from 'tailwind-merge';

export function Fotter() {
  
  return (
    <>
      <TopFotter />
      <BottomFooter />
    </>
  );
}

export const TopFotter = () => {
  return (
    <footer className="border-t bg-background">
      <div className="w-full max-w-[1450px] p-6 md:px-10 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Section 1: Brand Description */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold">WizMail</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              WizMail 为企业和个人提供专业的邮件营销服务，帮助您高效管理邮件模板、发送邮件和分析数据。
            </p>
          </div>

          {/* Section 2: Quick Links */}
          <div className="flex-1">
            <h4 className="font-medium">快速链接</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/features" className="text-sm text-muted-foreground hover:text-primary">
                  功能介绍
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary">
                  定价计划
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary">
                  常见问题
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 3: Resources */}
          <div className="flex-1">
            <h4 className="font-medium">学习资源</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">
                  博客
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm text-muted-foreground hover:text-primary">
                  客服支持
                </Link>
              </li>
              <li>
                <Link href="/webinars" className="text-sm text-muted-foreground hover:text-primary">
                  网络研讨会
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 4: Contact */}
          <div className="flex-1">
            <h4 className="font-medium">联系我们</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="mailto:support@wizmail.com" className="text-sm text-muted-foreground hover:text-primary">
                  support@wizmail.com
                </a>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                  在线客服
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export const BottomFooter = () => {
  const style = "hover:text-gray-700 hover:scale-125 transition-all duration-300";
  return (
    <footer className="w-full max-w-[1450px] p-6 md:px-10 mx-auto mt-auto flex flex-row justify-between items-center text-sm text-center dark:text-white/70">
      {/* Copyright Section */}
      <div className="flex justify-start items-center">
        <p>
          <b className="text-xl text-black/70 dark:text-white/70 truncate">WizMail</b>{" "}
          <span className="md:block hidden">© 2024 All rights reserved</span>
        </p>
      </div>

      <div className="flex justify-between items-center gap-4">
        {/* Social Links Section */}
        <div className="flex justify-center gap-4 text-xl">
          <a href="#tiktok" aria-label="TikTok" className={twMerge(style)}>
            <AiFillTikTok />
          </a>
          <a href="#linkedin" aria-label="LinkedIn" className={twMerge(style)}>
            <FaPinterest />
          </a>
          <a href="#medium" aria-label="Medium" className={twMerge(style)}>
            <FaMedium />
          </a>
          <a href="#whatsapp" aria-label="WhatsApp" className={twMerge(style)}>
            <FaWhatsapp />
          </a>
          <a href="#twitter" aria-label="Twitter" className={twMerge(style)}>
            <FaTwitter />
          </a>
          <a href="#instagram" aria-label="Instagram" className={twMerge(style)}>
            <FaInstagram />
          </a>
        </div>
        <div className="md:flex justify-center gap-4 text-xl hidden">
          <a href="#wechat" aria-label="WeChat" className={twMerge(style)}>
            <AiFillWechat />
          </a>
          <a href="#facebook" aria-label="Facebook" className={twMerge(style)}>
            <FaFacebook />
          </a>
          <a href="#youtube" aria-label="YouTube" className={twMerge(style)}>
            <FaYoutube />
          </a>
        </div>
      </div>
    </footer>
  );
}