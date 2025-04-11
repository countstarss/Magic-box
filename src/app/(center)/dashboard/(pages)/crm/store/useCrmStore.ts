import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

// 用户来源类型
export type UserSource = "form" | "import" | "webhook" | "manual";

// 用户标签/分类
export type UserTag =
  | "active" // 活跃用户
  | "premium" // 付费会员
  | "new" // 新注册用户
  | "inactive" // 沉睡用户
  | "highValue" // 高价值用户
  | "lead" // 潜在用户
  | "custom"; // 自定义标签

// 用户状态
export type UserStatus = "active" | "inactive" | "pending" | "blocked";

// 用户数据结构
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  source: UserSource;
  status: UserStatus;
  tags: UserTag[];
  customTags?: string[];
  createdAt: Date;
  lastLoginAt: Date;
  totalSpent: number;
  notes?: string;
  avatar?: string;
  metadata?: Record<string, any>;
  name?: string; // 映射到fullName
}

// 分页参数
export interface PaginationParams {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// 筛选参数
export interface FilterParams {
  search: string;
  tags: UserTag[];
  status: UserStatus | "all";
  dateRange: {
    from?: Date;
    to?: Date;
  };
  spentRange: {
    min?: number;
    max?: number;
  };
}

// 排序类型
export type SortField =
  | "name"
  | "email"
  | "createdAt"
  | "lastLoginAt"
  | "totalSpent";
export type SortDirection = "asc" | "desc";

// 排序参数
export interface SortParams {
  field: SortField;
  direction: SortDirection;
}

// CRM Store 状态
interface CrmState {
  // 用户数据
  users: User[];
  selectedUser: User | null;
  isAddingUser: boolean;
  isImportingUsers: boolean;

  // 分页和筛选
  pagination: PaginationParams;
  filter: FilterParams;
  sort: SortParams;

  // 自定义标签
  availableCustomTags: string[];

  // 用户操作
  setSelectedUser: (user: User | null) => void;
  addUser: (user: Omit<User, "id" | "createdAt">) => User;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  importUsers: (users: Omit<User, "id">[]) => User[];

  // 标签操作
  addCustomTag: (tag: string) => void;
  removeCustomTag: (tag: string) => void;
  addTagToUser: (userId: string, tag: UserTag | string) => void;
  removeTagFromUser: (userId: string, tag: UserTag | string) => void;

  // 分页和筛选操作
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilter: (filter: Partial<FilterParams>) => void;
  resetFilter: () => void;
  setSort: (sort: SortParams) => void;

  // UI 状态
  setIsAddingUser: (isAdding: boolean) => void;
  setIsImportingUsers: (isImporting: boolean) => void;

  // 数据获取
  getFilteredUsers: () => User[];
  getUsersByTag: (tag: UserTag) => User[];
}

// 生成模拟数据
const generateMockUsers = (count: number): User[] => {
  // 创建固定数据数组
  const fixedUserData: User[] = [
    {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      fullName: "张三",
      email: "zhang.san@example.com",
      phone: "+18612345678",
      company: "ABC科技有限公司",
      position: "产品经理",
      source: "form",
      status: "active",
      tags: ["active", "premium", "highValue"],
      createdAt: new Date("2023-05-15"),
      lastLoginAt: new Date("2023-11-20"),
      totalSpent: 1580,
      notes: "重要客户，负责公司产品决策",
      name: "张三",
    },
    {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d480",
      fullName: "李四",
      email: "li.si@example.com",
      phone: "+18687654321",
      company: "XYZ咨询公司",
      position: "市场总监",
      source: "import",
      status: "active",
      tags: ["active", "premium"],
      createdAt: new Date("2023-06-20"),
      lastLoginAt: new Date("2023-11-18"),
      totalSpent: 890,
      name: "李四",
    },
    {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d481",
      fullName: "王五",
      email: "wang.wu@example.com",
      company: "未来科技",
      position: "CEO",
      source: "manual",
      status: "active",
      tags: ["active", "highValue"],
      createdAt: new Date("2023-02-10"),
      lastLoginAt: new Date("2023-11-15"),
      totalSpent: 2350,
      notes: "公司决策者，关注新技术",
      name: "王五",
    },
    {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d482",
      fullName: "赵六",
      email: "zhao.liu@example.com",
      phone: "+18698765432",
      source: "webhook",
      status: "inactive",
      tags: ["inactive"],
      createdAt: new Date("2023-01-05"),
      lastLoginAt: new Date("2023-08-01"),
      totalSpent: 320,
      name: "赵六",
    },
    {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d483",
      fullName: "孙七",
      email: "sun.qi@example.com",
      phone: "+18612398765",
      company: "阳光教育",
      position: "培训师",
      source: "form",
      status: "pending",
      tags: ["new"],
      createdAt: new Date("2023-11-02"),
      lastLoginAt: new Date("2023-11-10"),
      totalSpent: 0,
      name: "孙七",
    },
    {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d484",
      fullName: "周八",
      email: "zhou.ba@example.com",
      company: "创新工作室",
      position: "设计师",
      source: "manual",
      status: "active",
      tags: ["active", "premium"],
      createdAt: new Date("2023-04-20"),
      lastLoginAt: new Date("2023-11-12"),
      totalSpent: 760,
      name: "周八",
    },
    {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d485",
      fullName: "吴九",
      email: "wu.jiu@example.com",
      phone: "+18612345987",
      company: "智慧财务",
      position: "财务总监",
      source: "import",
      status: "active",
      tags: ["active", "highValue"],
      createdAt: new Date("2023-03-15"),
      lastLoginAt: new Date("2023-11-16"),
      totalSpent: 1890,
      name: "吴九",
    },
    {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d486",
      fullName: "郑十",
      email: "zheng.shi@example.com",
      phone: "+18698761234",
      source: "form",
      status: "blocked",
      tags: ["inactive"],
      createdAt: new Date("2022-12-10"),
      lastLoginAt: new Date("2023-05-20"),
      totalSpent: 120,
      notes: "账户异常，已被系统封禁",
      name: "郑十",
    },
    {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d487",
      fullName: "刘一",
      email: "liu.yi@example.com",
      phone: "+18687651234",
      company: "星云科技",
      position: "开发工程师",
      source: "webhook",
      status: "active",
      tags: ["active", "new"],
      createdAt: new Date("2023-10-28"),
      lastLoginAt: new Date("2023-11-19"),
      totalSpent: 150,
      name: "刘一",
    },
    {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d488",
      fullName: "陈二",
      email: "chen.er@example.com",
      company: "优质服务公司",
      position: "客服主管",
      source: "manual",
      status: "active",
      tags: ["active", "premium"],
      createdAt: new Date("2023-07-12"),
      lastLoginAt: new Date("2023-11-17"),
      totalSpent: 680,
      name: "陈二",
    },
  ];

  // 生成更多固定用户来达到请求的数量
  const result: User[] = [...fixedUserData];

  if (count > fixedUserData.length) {
    // 如果需要更多用户，则复制现有用户并修改一些基本信息
    const extraNeeded = count - fixedUserData.length;

    for (let i = 0; i < extraNeeded; i++) {
      const baseUser = fixedUserData[i % fixedUserData.length];
      const userNumber = fixedUserData.length + i + 1;

      result.push({
        ...baseUser,
        id: `generated-${i}-${uuidv4()}`,
        fullName: `用户 ${userNumber}`,
        email: `user${userNumber}@example.com`,
        name: `用户 ${userNumber}`,
      });
    }
  }

  return result.slice(0, count);
};

// 创建和导出 Zustand store
const createStore = () => {
  // 生成固定的模拟数据
  const initialUsers = generateMockUsers(100);

  return create<CrmState>()(
    persist(
      (set, get) => ({
        // 初始状态
        users: initialUsers,
        selectedUser: null,
        isAddingUser: false,
        isImportingUsers: false,

        pagination: {
          page: 1,
          pageSize: 10,
          totalItems: initialUsers.length,
          totalPages: Math.ceil(initialUsers.length / 10),
        },

        filter: {
          search: "",
          tags: [],
          status: "all",
          dateRange: {},
          spentRange: {},
        },

        sort: {
          field: "lastLoginAt",
          direction: "desc",
        },

        availableCustomTags: ["VIP", "Potential", "Churned"],

        // 用户操作
        setSelectedUser: (user) => set({ selectedUser: user }),

        addUser: (userData) => {
          const newUser: User = {
            ...userData,
            id: uuidv4(),
            createdAt: new Date(),
            name: userData.fullName,
          };

          set((state) => ({
            users: [newUser, ...state.users],
            pagination: {
              ...state.pagination,
              totalItems: state.users.length + 1,
              totalPages: Math.ceil(
                (state.users.length + 1) / state.pagination.pageSize
              ),
            },
          }));

          return newUser;
        },

        updateUser: (id, updates) => {
          set((state) => ({
            users: state.users.map((user) =>
              user.id === id ? { ...user, ...updates } : user
            ),
          }));
        },

        deleteUser: (id) => {
          set((state) => {
            const newUsers = state.users.filter((user) => user.id !== id);
            return {
              users: newUsers,
              pagination: {
                ...state.pagination,
                totalItems: newUsers.length,
                totalPages: Math.ceil(
                  newUsers.length / state.pagination.pageSize
                ),
              },
              selectedUser:
                state.selectedUser?.id === id ? null : state.selectedUser,
            };
          });
        },

        importUsers: (usersData) => {
          const newUsers = usersData.map((userData) => ({
            ...userData,
            id: uuidv4(),
            name: userData.fullName,
          }));

          set((state) => {
            const updatedUsers = [...newUsers, ...state.users];
            return {
              users: updatedUsers,
              pagination: {
                ...state.pagination,
                totalItems: updatedUsers.length,
                totalPages: Math.ceil(
                  updatedUsers.length / state.pagination.pageSize
                ),
              },
            };
          });

          return newUsers as User[];
        },

        // 标签操作
        addCustomTag: (tag) => {
          set((state) => ({
            availableCustomTags: state.availableCustomTags.includes(tag)
              ? state.availableCustomTags
              : [...state.availableCustomTags, tag],
          }));
        },

        removeCustomTag: (tag) => {
          set((state) => ({
            availableCustomTags: state.availableCustomTags.filter(
              (t) => t !== tag
            ),
            users: state.users.map((user) => ({
              ...user,
              customTags: user.customTags?.filter((t) => t !== tag),
            })),
          }));
        },

        addTagToUser: (userId, tag) => {
          set((state) => ({
            users: state.users.map((user) => {
              if (user.id !== userId) return user;

              // 处理预定义标签
              if (
                tag === "active" ||
                tag === "premium" ||
                tag === "new" ||
                tag === "inactive" ||
                tag === "highValue" ||
                tag === "lead"
              ) {
                return {
                  ...user,
                  tags: user.tags.includes(tag as UserTag)
                    ? user.tags
                    : [...user.tags, tag as UserTag],
                };
              }

              // 处理自定义标签
              return {
                ...user,
                customTags: user.customTags?.includes(tag)
                  ? user.customTags
                  : [...(user.customTags || []), tag],
              };
            }),
          }));
        },

        removeTagFromUser: (userId, tag) => {
          set((state) => ({
            users: state.users.map((user) => {
              if (user.id !== userId) return user;

              // 处理预定义标签
              if (
                tag === "active" ||
                tag === "premium" ||
                tag === "new" ||
                tag === "inactive" ||
                tag === "highValue" ||
                tag === "lead"
              ) {
                return {
                  ...user,
                  tags: user.tags.filter((t) => t !== tag),
                };
              }

              // 处理自定义标签
              return {
                ...user,
                customTags: user.customTags?.filter((t) => t !== tag),
              };
            }),
          }));
        },

        // 分页和筛选操作
        setPage: (page) => {
          set((state) => ({
            pagination: {
              ...state.pagination,
              page,
            },
          }));
        },

        setPageSize: (pageSize) => {
          set((state) => {
            const totalPages = Math.ceil(
              state.pagination.totalItems / pageSize
            );
            const page = Math.min(state.pagination.page, totalPages);

            return {
              pagination: {
                ...state.pagination,
                pageSize,
                totalPages,
                page,
              },
            };
          });
        },

        setFilter: (filterUpdates) => {
          set((state) => ({
            filter: {
              ...state.filter,
              ...filterUpdates,
            },
            pagination: {
              ...state.pagination,
              page: 1, // 重置到第一页
            },
          }));
        },

        resetFilter: () => {
          set((state) => ({
            filter: {
              search: "",
              tags: [],
              status: "all",
              dateRange: {},
              spentRange: {},
            },
            pagination: {
              ...state.pagination,
              page: 1,
            },
          }));
        },

        setSort: (sort) => {
          set({ sort });
        },

        // UI 状态
        setIsAddingUser: (isAdding) => set({ isAddingUser: isAdding }),
        setIsImportingUsers: (isImporting) =>
          set({ isImportingUsers: isImporting }),

        // 数据获取和筛选
        getFilteredUsers: () => {
          const { users, filter, sort, pagination } = get();

          // 1. 应用筛选
          let filteredUsers = users.filter((user) => {
            // 搜索筛选
            if (filter.search) {
              const searchLower = filter.search.toLowerCase();
              const matchesSearch =
                user.fullName.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower) ||
                user.company?.toLowerCase().includes(searchLower) ||
                user.position?.toLowerCase().includes(searchLower) ||
                user.phone?.includes(filter.search);

              if (!matchesSearch) return false;
            }

            // 标签筛选
            if (filter.tags.length > 0) {
              const hasMatchingTag = filter.tags.some((tag) =>
                user.tags.includes(tag)
              );
              if (!hasMatchingTag) return false;
            }

            // 状态筛选
            if (filter.status !== "all" && user.status !== filter.status) {
              return false;
            }

            // 日期范围筛选
            if (
              filter.dateRange.from &&
              user.createdAt < filter.dateRange.from
            ) {
              return false;
            }
            if (filter.dateRange.to) {
              const endDate = new Date(filter.dateRange.to);
              endDate.setDate(endDate.getDate() + 1); // 包含结束日期
              if (user.createdAt >= endDate) {
                return false;
              }
            }

            // 消费金额筛选
            if (
              (filter.spentRange.min !== undefined &&
                user.totalSpent < filter.spentRange.min) ||
              (filter.spentRange.max !== undefined &&
                user.totalSpent > filter.spentRange.max)
            ) {
              return false;
            }

            return true;
          });

          // 2. 应用排序
          filteredUsers.sort((a, b) => {
            let aValue, bValue;

            // 特殊处理name字段，它映射到fullName
            if (sort.field === "name") {
              aValue = a.fullName;
              bValue = b.fullName;
            } else {
              aValue = a[sort.field as keyof User];
              bValue = b[sort.field as keyof User];
            }

            // 根据字段类型进行排序
            if (sort.field === "totalSpent") {
              return sort.direction === "asc"
                ? (a.totalSpent || 0) - (b.totalSpent || 0)
                : (b.totalSpent || 0) - (a.totalSpent || 0);
            }

            if (sort.field === "createdAt" || sort.field === "lastLoginAt") {
              const aDate = new Date(aValue as Date).getTime();
              const bDate = new Date(bValue as Date).getTime();
              return sort.direction === "asc" ? aDate - bDate : bDate - aDate;
            }

            // 字符串排序
            const aStr = String(aValue || "").toLowerCase();
            const bStr = String(bValue || "").toLowerCase();
            return sort.direction === "asc"
              ? aStr.localeCompare(bStr)
              : bStr.localeCompare(aStr);
          });

          return filteredUsers;
        },

        getUsersByTag: (tag: UserTag) => {
          return get().users.filter((user) => user.tags.includes(tag));
        },
      }),
      {
        name: "crm-storage",
        // 选择性持久化，排除大型集合
        partialize: (state) => ({
          availableCustomTags: state.availableCustomTags,
          sort: state.sort,
          pagination: {
            pageSize: state.pagination.pageSize,
          },
        }),
      }
    )
  );
};

export const useCrmStore = createStore();
