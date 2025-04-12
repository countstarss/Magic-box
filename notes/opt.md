请你完成以下操作: 
1. 整理出一套你认为合适的关于Nylas邮件授权的env命名
让它更加规范和统一
未完全实现的方法：
use-mail.ts中的多个空实现方法（markAsRead, analyzeEmail等）
建议实现或删除这些方法声明
2. 重复的增强型邮件服务：
src/lib/server/mail-service-enhanced.ts和src/lib/services/enhanced-mail-service.ts功能重叠
统一使用一个增强型服务,并且更新前端引用到的地方
3. 统一缓存策略：整合不同层的缓存机制，避免重复工作
4. 合并冗余服务：统一mailAccountService和enhancedMailService的功能
5. 优化React Query配置：进一步调整staleTime和cacheTime配置

有些邮件会影响到整体的主题颜色,需要解决这个问题