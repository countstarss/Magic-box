// MARK: 订阅信息
export interface Subscription {
  id: string; // 唯一标识符
  teamId: string; // 团队ID
  planId: string; // 价格方案ID
  status: "active" | "cancelled" | "expired" | "trialing" | "past_due"; // 订阅状态
  startDate: number; // 开始日期
  endDate: number; // 结束日期
  trialEndDate?: number; // 试用期结束日期
  quantity: number; // 座位数/用户数量
  autoRenew: boolean; // 是否自动续费
  cancellationDate?: number; // 取消日期
  cancellationReason?: string; // 取消原因
  paymentMethodId?: string; // 支付方式ID
  billingCycleAnchor: number; // 账单周期锚点
  nextBillingDate: number; // 下次账单日期
  addons?: SubscriptionAddon[]; // 附加项
  metadata?: Record<string, any>; // 元数据
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
}

// MARK: 订阅附加项
export interface SubscriptionAddon {
  id: string; // 唯一标识符
  name: string; // 附加项名称
  description?: string; // 附加项描述
  price: number; // 价格
  quantity: number; // 数量
  billingFrequency: "one_time" | "recurring"; // 计费频率
}

// MARK: 账单历史
export interface BillingHistory {
  id: string; // 唯一标识符
  teamId: string; // 团队ID
  subscriptionId: string; // 订阅ID
  invoiceNumber: string; // 发票编号
  amount: number; // 金额
  currency: string; // 货币类型
  status: "draft" | "open" | "paid" | "uncollectible" | "void"; // 账单状态
  dueDate: number; // 截止日期
  paidDate?: number; // 支付日期
  billingPeriodStart: number; // 账单周期开始
  billingPeriodEnd: number; // 账单周期结束
  invoiceUrl?: string; // 发票URL
  invoicePdfUrl?: string; // 发票PDF URL
  paymentMethodId?: string; // 支付方式ID
  lineItems: BillingLineItem[]; // 账单明细项
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
}

// MARK: 账单明细项
export interface BillingLineItem {
  id: string; // 唯一标识符
  description: string; // 描述
  quantity: number; // 数量
  unitPrice: number; // 单价
  amount: number; // 总金额
  taxAmount?: number; // 税额
  discountAmount?: number; // 折扣金额
  period?: {
    start: number;
    end: number;
  }; // 计费周期
  type: "subscription" | "addon" | "credit" | "tax" | "other"; // 类型
  metadata?: Record<string, any>; // 元数据
}

// MARK: 支付方式
export interface PaymentMethod {
  id: string; // 唯一标识符
  teamId: string; // 团队ID
  type: "card" | "bank_account" | "paypal" | "other"; // 支付方式类型
  isDefault: boolean; // 是否默认支付方式
  status: "active" | "inactive" | "expired"; // 状态
  lastFour?: string; // 卡号后四位
  expiryMonth?: number; // 到期月
  expiryYear?: number; // 到期年
  cardBrand?: string; // 卡品牌
  cardholderName?: string; // 持卡人姓名
  billingAddress?: BillingAddress; // 账单地址
  paymentProviderData?: Record<string, any>; // 支付提供商数据
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
}

// MARK: 账单地址
export interface BillingAddress {
  line1: string; // 地址行1
  line2?: string; // 地址行2
  city: string; // 城市
  state?: string; // 州/省
  postalCode: string; // 邮编
  country: string; // 国家
}

// MARK: 价格方案
export interface PricingPlan {
  id: string; // 唯一标识符
  name: string; // 方案名称
  description: string; // 方案描述
  isPublic: boolean; // 是否公开方案
  basePrice: number; // 基础价格
  currency: string; // 货币类型
  billingFrequency: "monthly" | "quarterly" | "yearly" | "custom"; // 计费频率
  customBillingCycle?: number; // 自定义计费周期(天)
  trialDays?: number; // 试用期天数
  features: PlanFeature[]; // 功能特性
  limits: PlanLimit[]; // 使用限制
  metadata?: Record<string, any>; // 元数据
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
  isActive: boolean; // 是否激活
  displayOrder: number; // 显示顺序
}

// MARK: 方案功能特性
export interface PlanFeature {
  id: string; // 唯一标识符
  name: string; // 功能名称
  description?: string; // 功能描述
  isIncluded: boolean; // 是否包含
  highlight?: boolean; // 是否高亮显示
}

// MARK: 方案使用限制
export interface PlanLimit {
  id: string; // 唯一标识符
  name: string; // 限制名称
  type: "number" | "boolean" | "storage"; // 限制类型
  quota?: number; // 配额
  unit?: string; // 单位
  isUnlimited: boolean; // 是否无限制
}

// MARK: 优惠券/促销码
export interface PromotionCode {
  id: string; // 唯一标识符
  code: string; // 优惠码
  description?: string; // 描述
  discountType: "percentage" | "fixed_amount"; // 折扣类型
  discountValue: number; // 折扣值
  validFrom: number; // 有效期开始
  validUntil: number; // 有效期结束
  maxRedemptions?: number; // 最大兑换次数
  timesRedeemed: number; // 已兑换次数
  isActive: boolean; // 是否激活
  restrictions?: {
    minAmount?: number; // 最小订单金额
    maxAmount?: number; // 最大订单金额
    applicablePlans?: string[]; // 适用的价格方案
    newCustomersOnly?: boolean; // 仅限新客户
  }; // 使用限制
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
  createdBy: string; // 创建者ID
}
