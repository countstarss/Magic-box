This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


=================================

1. 用户自定义分类系统
2. 创建了分类规则接口和默认分类
3. 实现了分类的增删改查操作
4. 创建了分类管理界面，支持用户自定义规则
2. 使用查询参数过滤邮件
- 更新了导航组件，使用查询参数而非路由来进行分类过滤
- 实现了点击导航项时的参数切换逻辑
3. AI邮件分析框架
- 设计了可扩展的多层级AI分析系统
- 创建了本地分析作为fallback方案
- 提供了多种分析维度：情感、优先级、分类、关键词等
4. 集成API路由
- 创建了邮件分析API
- 实现了与Auth.js的集成
- 添加了数据库集成和错误处理
5. 用户界面组件
- 实现了分类管理界面
- 创建了邮件详情分析视图
- 使用徽章高亮不同类型的标签

该实现以模块化方式构建，便于未来扩展和维护。AI分析框架特别设计为可扩展的，可以轻松添加更多分析功能或集成其他AI提供商的API。
用户现在可以：
- 创建自定义邮件分类
- 定义复杂的分类规则
- 在侧边栏中快速切换不同分类查看
- 获取每封邮件的AI分析洞见
- 分析结果包括情感、优先级、摘要和行动项
这个系统为您后续开发更复杂的邮件智能处理功能奠定了坚实基础



=================================


我已经成功地为您的项目引入了React Query，创建了必要的文件并提供了示例实现。下面是我实现的内容摘要：
1. 添加了必要的依赖
  @tanstack/react-query - 用于数据获取和缓存
  @tanstack/react-query-devtools - 用于开发调试
2. 创建了React Query核心配置
  src/lib/query-client.ts - 配置全局查询客户端，设置默认选项如缓存时间和重试策略
3. 实现了查询提供者
  src/providers/query-provider.tsx - 提供了一个React组件，用于在应用程序中提供React Query功能，包括开发工具
4. 实现了API服务层
  src/lib/api/mail-service.ts - 创建了一个完整的API服务，包含了与邮件相关的所有API调用（获取、发送、更新等）
5. 创建了React Query hooks
  src/hooks/use-query-mail.ts - 实现了一系列自定义hooks，包装了API服务，提供了查询键管理和缓存失效策略
6. 提供了一个实际示例
  src/components/examples/mail-list-example.tsx - 创建了一个功能完整的示例组件，展示了如何使用React Query获取和操作邮件数据
  src/app/query-demo/page.tsx - 创建了一个演示页面，以展示React Query的实际应用

## 优势和特点
- 模块化设计 - 每个功能都有明确的责任边界
- 类型安全 - 完全利用TypeScript提供类型检查
- 缓存管理 - 智能缓存和重新验证策略
- 乐观更新 - 通过mutations处理乐观更新
- 错误处理 - 内置错误处理和加载状态
- 无缝集成 - 可以轻松集成到实际后端
## 使用方法
当您准备好后端时，只需要:
- 更新API_BASE_URL指向您的实际API
- 如有必要，调整API服务中的请求和响应处理
- 其余部分（包括React组件和hooks）可以保持不变
这个实现提供了一个可扩展的基础，用于构建具有高性能数据获取和状态管理的现代React应用程序。