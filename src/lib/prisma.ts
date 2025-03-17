import { PrismaClient } from '@prisma/client';

// 声明全局变量，以防止在开发环境中创建多个Prisma实例
declare global {
  var prisma: PrismaClient | undefined;
}

// 如果在生产环境，直接创建新实例
// 如果在开发环境，重用全局实例（避免热重载时创建多个连接）
export const prisma = global.prisma || new PrismaClient();

// 在开发环境中将prisma分配给全局变量
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
} 