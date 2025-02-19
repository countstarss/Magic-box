import { Button } from '@/components/ui/button';
// import { Cover } from '@/components/ui/cover';
import { Mail, Users, Settings } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const TitleSection = () => {
  return (
    <div className="mx-auto max-w-6xl px-10 pb-24 pt-10 sm:pb-32 lg:flex lg:py-40 flex flex-col gap-20 "
    //MARK: 首页标题
    >
      <div
      //MARK: Part 1
      >
        <div className="mt-24 sm:mt-32 lg:mt-16">
          <div className="inline-flex space-x-6">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold leading-6 text-primary ring-1 ring-inset ring-primary/20">
              新功能发布
            </span>
            <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-muted-foreground">
              <span>全新邮件营销工具</span>
            </span>
          </div>
        </div>
        <div className='flex flex-col md:flex-row items-center md:items-start mx-auto line-height-1'>
          <h1 className="mt-10 py-2 text-5xl font-bold tracking-tight text-foreground sm:text-6xl items-center">
            开启你的
          </h1>
          <h1 className="mt-10 text-5xl font-bold tracking-tight text-foreground sm:text-6xl items-center">
            {/* <Cover> */}
              邮件营销之旅
              {/* </Cover> */}
          </h1>
        </div>
        <div className='flex flex-col md:flex-row items-center md:items-start mx-auto line-height-1'>
          <h1 className="mt-10 text-2xl font-normal tracking-tight text-foreground sm:text-3xl">
            Start your email marketing journey.
          </h1>
        </div>
        <p className="mt-10 text-xl font-normal tracking-tight text-muted-foreground hidden md:block">
          专业的邮件营销平台，提供个性化的邮件发送、模板管理和自动化工作流。让你的营销更高效。
        </p>
        <div className="mt-10 flex items-center gap-x-6">
          <Button size="lg" asChild>
            <Link href="/features">
              开始使用
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/about">
              了解更多
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3"
      //MARK: Part 2
      >
        <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-lg">
          <Mail className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-lg font-semibold">邮件发送</h3>
          <p className="text-sm text-muted-foreground text-center mt-2">
            高效、精准的邮件发送平台
          </p>
        </div>
        <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-lg">
          <Settings className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-lg font-semibold">自动化工作流</h3>
          <p className="text-sm text-muted-foreground text-center mt-2">
            定制化的邮件自动化功能
          </p>
        </div>
        <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-lg">
          <Users className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-lg font-semibold">用户管理</h3>
          <p className="text-sm text-muted-foreground text-center mt-2">
            轻松管理邮件订阅者和用户群体
          </p>
        </div>
      </div>
    </div>
  );
};

export default TitleSection;