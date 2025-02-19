"use client";

import { Mail, Users, Settings, MessageCircle, Award, Mailbox } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    name: "邮件营销服务",
    description: "全方位的邮件营销解决方案，帮助你精准触达目标用户",
    icon: Mail,
  },
  {
    name: "自动化工作流",
    description: "定制化邮件自动化工作流，提高营销效率",
    icon: Settings,
  },
  {
    name: "用户管理",
    description: "方便的用户管理功能，轻松分组和管理邮件订阅者",
    icon: Users,
  },
  {
    name: "实时报告",
    description: "详细的实时邮件营销报告，分析打开率、点击率等关键数据",
    icon: MessageCircle,
  },
  {
    name: "邮件模板",
    description: "丰富的邮件模板库，助你快速创建美观且专业的邮件",
    icon: Mailbox,
  },
  {
    name: "多渠道支持",
    description: "支持多种邮件发送渠道，确保你的邮件到达每个收件箱",
    icon: Award,
  },
];

export function FeaturesSection() {
  return (
    <div className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">为什么选择 WizMail</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            强大的邮件营销解决方案
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            WizMail 提供全面的邮件营销工具，助力你实现高效的邮件营销与用户管理
          </p>
        </div>
        <div className="mx-4 md:mx-20 mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                  <feature.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}