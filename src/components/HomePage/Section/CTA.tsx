"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-24 bg-primary">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl mb-4">
            准备好提升你的邮件营销效率了吗？
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            立即注册 WizMail，创建并优化你的邮件营销活动，提升客户参与度与转化率。我们提供智能邮件自动化、详尽的分析和多种邮件模板，帮助你成功开展营销。
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">立即注册</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link href="/contact">联系我们</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}