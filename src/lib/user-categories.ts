import { atom } from "jotai"

// 定义分类规则接口
export interface CategoryRule {
  id: string
  name: string
  icon: string
  description: string
  conditions: {
    type: 'sender' | 'subject' | 'content' | 'label' | 'custom'
    value: string
    operation: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'regex'
  }[]
}

// 默认的用户分类
const defaultCategories: CategoryRule[] = [
  {
    id: "social",
    name: "Social",
    icon: "Users2",
    description: "Emails from social networks",
    conditions: [
      {
        type: "sender",
        value: "@facebook.com",
        operation: "contains"
      },
      {
        type: "sender",
        value: "@twitter.com",
        operation: "contains"
      },
      {
        type: "sender",
        value: "@linkedin.com",
        operation: "contains"
      },
      {
        type: "subject",
        value: "friend request",
        operation: "contains"
      },
      {
        type: "subject",
        value: "connection",
        operation: "contains"
      }
    ]
  },
  {
    id: "updates",
    name: "Updates",
    icon: "AlertCircle",
    description: "System updates and notifications",
    conditions: [
      {
        type: "sender",
        value: "noreply@",
        operation: "contains"
      },
      {
        type: "subject",
        value: "update",
        operation: "contains"
      },
      {
        type: "subject",
        value: "notification",
        operation: "contains"
      }
    ]
  },
  {
    id: "forums",
    name: "Forums",
    icon: "MessagesSquare",
    description: "Forum notifications and discussions",
    conditions: [
      {
        type: "subject",
        value: "forum",
        operation: "contains"
      },
      {
        type: "subject",
        value: "thread",
        operation: "contains"
      },
      {
        type: "subject",
        value: "discussion",
        operation: "contains"
      }
    ]
  },
  {
    id: "shopping",
    name: "Shopping",
    icon: "ShoppingCart",
    description: "Shopping receipts and promotions",
    conditions: [
      {
        type: "sender",
        value: "@amazon.com",
        operation: "contains"
      },
      {
        type: "sender",
        value: "@ebay.com",
        operation: "contains"
      },
      {
        type: "subject",
        value: "order",
        operation: "contains"
      },
      {
        type: "subject",
        value: "receipt",
        operation: "contains"
      },
      {
        type: "subject",
        value: "shipment",
        operation: "contains"
      }
    ]
  },
  {
    id: "promotions",
    name: "Promotions",
    icon: "Archive",
    description: "Marketing emails and promotions",
    conditions: [
      {
        type: "subject",
        value: "discount",
        operation: "contains"
      },
      {
        type: "subject",
        value: "offer",
        operation: "contains"
      },
      {
        type: "subject",
        value: "sale",
        operation: "contains"
      },
      {
        type: "subject",
        value: "promo",
        operation: "contains"
      }
    ]
  }
]

// 创建全局状态
export const userCategoriesAtom = atom<CategoryRule[]>(defaultCategories)

// 添加一个新分类
export function addCategory(category: CategoryRule) {
  return (prev: CategoryRule[]) => [...prev, category]
}

// 更新现有分类
export function updateCategory(updatedCategory: CategoryRule) {
  return (prev: CategoryRule[]) => 
    prev.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat)
}

// 删除分类
export function removeCategory(categoryId: string) {
  return (prev: CategoryRule[]) => 
    prev.filter(cat => cat.id !== categoryId)
}

// 检查邮件是否匹配分类条件
export function matchesCategory(mail: any, category: CategoryRule): boolean {
  return category.conditions.some(condition => {
    const { type, value, operation } = condition
    
    let fieldValue = ""
    switch(type) {
      case 'sender':
        fieldValue = mail.email || ""
        break
      case 'subject':
        fieldValue = mail.subject || ""
        break
      case 'content':
        fieldValue = mail.text || ""
        break
      case 'label':
        return mail.labels.includes(value)
      case 'custom':
        // 可以扩展为自定义判断逻辑
        return false
      default:
        return false
    }
    
    // 字符串操作比较
    switch(operation) {
      case 'contains':
        return fieldValue.toLowerCase().includes(value.toLowerCase())
      case 'equals':
        return fieldValue.toLowerCase() === value.toLowerCase()
      case 'startsWith':
        return fieldValue.toLowerCase().startsWith(value.toLowerCase())
      case 'endsWith':
        return fieldValue.toLowerCase().endsWith(value.toLowerCase())
      case 'regex':
        try {
          const regex = new RegExp(value)
          return regex.test(fieldValue)
        } catch (e) {
          console.error('Invalid regex:', e)
          return false
        }
      default:
        return false
    }
  })
} 