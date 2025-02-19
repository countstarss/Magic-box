"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

// 增加一些与 WizMail 相关的用户反馈
const testimonials = [
  {
    content: "使用 WizMail 后，我们的邮件营销效果提升了 30%。通过自动化的邮件发送和跟踪，我们能够更精准地触及潜在客户。",
    author: "Anna Williams",
    title: "营销经理, 美国",
    avatar: "https://images.unsplash.com/photo-1528747040-93ed4a4f0f55?q=80&w=250&h=250&auto=format&fit=crop",
  },
  {
    content: "WizMail 提供的多渠道支持让我们的邮件能够更广泛地传播到目标受众，特别是在移动端的表现非常好。",
    author: "Carlos Garcia",
    title: "产品负责人, 西班牙",
    avatar: "https://images.unsplash.com/photo-1602150168-742529a7a3ac?q=80&w=250&h=250&auto=format&fit=crop",
  },
  {
    content: "我非常喜欢 WizMail 提供的邮件模板。它们帮助我们节省了很多设计时间，并且很容易定制。",
    author: "James Lee",
    title: "企业主, 英国",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&h=250&auto=format&fit=crop",
  },
  {
    content: "WizMail 的用户管理功能让我们的邮件订阅者管理变得轻松，自动化工作流提高了我们的邮件营销效率。",
    author: "Mika Tanaka",
    title: "市场营销专家, 日本",
    avatar: "https://images.unsplash.com/photo-1543640420-1d58b4e43b76?q=80&w=250&h=250&auto=format&fit=crop",
  },
  {
    content: "通过 WizMail 的实时报告，我们能够实时追踪邮件营销效果，及时调整策略，效果显著。",
    author: "Liam O'Connor",
    title: "数据分析师, 爱尔兰",
    avatar: "https://images.unsplash.com/photo-1543979217-8475bfc81b2d?q=80&w=250&h=250&auto=format&fit=crop",
  },
];

export function FeedbackSection() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container px-4 md:px-12 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            用户反馈
          </h2>
          <p className="text-lg text-muted-foreground">
            听听我们的用户怎么说
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-10">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <Quote className="w-8 h-8 text-primary/20" />
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">{testimonial.content}</p>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                      <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <p className="text-sm font-medium">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}