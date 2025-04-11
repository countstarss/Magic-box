import { openDB, DBSchema, IDBPDatabase } from "idb";
import {
  DB_NAME,
  UIPreferences,
  RecentlyViewed,
  DraftItem,
  SearchHistory,
  ViewSettings,
  NotificationState,
  DashboardWidgetConfig,
  ViewType,
} from "@/lib/types/local-storage";

// 为了解决计算属性问题，定义具体的store名称
const UI_PREFERENCES = "uiPreferences";
const RECENTLY_VIEWED = "recentlyViewed";
const DRAFTS = "drafts";
const SEARCH_HISTORY = "searchHistory";
const VIEW_SETTINGS = "viewSettings";
const NOTIFICATION_STATES = "notificationStates";
const DASHBOARD_WIDGETS = "dashboardWidgets";

// 定义各个存储的索引名称
interface StoreIndexMap {
  uiPreferences: {
    "by-user": "userId";
  };
  recentlyViewed: {
    "by-user": "userId";
    "by-type": "itemType";
    "by-timestamp": "viewedAt";
  };
  drafts: {
    "by-user": "userId";
    "by-type": "draftType";
    "by-updated": "updatedAt";
  };
  searchHistory: {
    "by-user": "userId";
    "by-area": "searchArea";
    "by-timestamp": "timestamp";
  };
  viewSettings: {
    "by-user": "userId";
    "by-type": "viewType";
  };
  notificationStates: {
    "by-user": "userId";
    "by-notification": "notificationId";
  };
  dashboardWidgets: {
    "by-user": "userId";
  };
}

type UIPreferencesIndex = keyof StoreIndexMap["uiPreferences"];

// 为每个store定义具体的索引类型
interface UIPreferencesStore {
  key: number;
  value: UIPreferences;
  indexes: { [K in UIPreferencesIndex]: string };
}

interface RecentlyViewedStore {
  key: number;
  value: RecentlyViewed;
  indexes: {
    "by-user": string;
    "by-type": string;
    "by-timestamp": number;
  };
}

interface DraftsStore {
  key: number;
  value: DraftItem;
  indexes: {
    "by-user": string;
    "by-type": string;
    "by-updated": number;
  };
}

interface SearchHistoryStore {
  key: number;
  value: SearchHistory;
  indexes: {
    "by-user": string;
    "by-area": string;
    "by-timestamp": number;
  };
}

interface ViewSettingsStore {
  key: number;
  value: ViewSettings;
  indexes: {
    "by-user": string;
    "by-type": ViewType;
  };
}

interface NotificationStatesStore {
  key: number;
  value: NotificationState;
  indexes: {
    "by-user": string;
    "by-notification": string;
  };
}

interface DashboardWidgetsStore {
  key: number;
  value: DashboardWidgetConfig;
  indexes: {
    "by-user": string;
  };
}

// 使用显式字符串索引
interface MailBoxDBSchema extends DBSchema {
  [UI_PREFERENCES]: UIPreferencesStore;
  [RECENTLY_VIEWED]: RecentlyViewedStore;
  [DRAFTS]: DraftsStore;
  [SEARCH_HISTORY]: SearchHistoryStore;
  [VIEW_SETTINGS]: ViewSettingsStore;
  [NOTIFICATION_STATES]: NotificationStatesStore;
  [DASHBOARD_WIDGETS]: DashboardWidgetsStore;
}

// 最大记录限制
const MAX_RECORDS = {
  RECENTLY_VIEWED: 50,
  SEARCH_HISTORY: 20,
  DRAFTS: 30,
};

class IDBService {
  private dbPromise: Promise<IDBPDatabase<MailBoxDBSchema>> | null = null;

  constructor() {
    this.initDB();
  }

  private initDB() {
    if (!this.dbPromise) {
      this.dbPromise = openDB<MailBoxDBSchema>(DB_NAME, 1, {
        upgrade(db) {
          // 用户界面偏好
          if (!db.objectStoreNames.contains(UI_PREFERENCES)) {
            const uiPrefsStore = db.createObjectStore(UI_PREFERENCES, {
              keyPath: "id",
              autoIncrement: true,
            });
            uiPrefsStore.createIndex("by-user", "userId");
          }

          // 最近查看记录
          if (!db.objectStoreNames.contains(RECENTLY_VIEWED)) {
            const recentStore = db.createObjectStore(RECENTLY_VIEWED, {
              keyPath: "id",
              autoIncrement: true,
            });
            recentStore.createIndex("by-user", "userId");
            recentStore.createIndex("by-type", "itemType");
            recentStore.createIndex("by-timestamp", "viewedAt");
          }

          // 草稿内容
          if (!db.objectStoreNames.contains(DRAFTS)) {
            const draftsStore = db.createObjectStore(DRAFTS, {
              keyPath: "id",
              autoIncrement: true,
            });
            draftsStore.createIndex("by-user", "userId");
            draftsStore.createIndex("by-type", "draftType");
            draftsStore.createIndex("by-updated", "updatedAt");
          }

          // 搜索历史
          if (!db.objectStoreNames.contains(SEARCH_HISTORY)) {
            const searchStore = db.createObjectStore(SEARCH_HISTORY, {
              keyPath: "id",
              autoIncrement: true,
            });
            searchStore.createIndex("by-user", "userId");
            searchStore.createIndex("by-area", "searchArea");
            searchStore.createIndex("by-timestamp", "timestamp");
          }

          // 视图设置
          if (!db.objectStoreNames.contains(VIEW_SETTINGS)) {
            const viewsStore = db.createObjectStore(VIEW_SETTINGS, {
              keyPath: "id",
              autoIncrement: true,
            });
            viewsStore.createIndex("by-user", "userId");
            viewsStore.createIndex("by-type", "viewType");
          }

          // 通知状态
          if (!db.objectStoreNames.contains(NOTIFICATION_STATES)) {
            const notifStore = db.createObjectStore(NOTIFICATION_STATES, {
              keyPath: "id",
              autoIncrement: true,
            });
            notifStore.createIndex("by-user", "userId");
            notifStore.createIndex("by-notification", "notificationId");
          }

          // 仪表盘小组件配置
          if (!db.objectStoreNames.contains(DASHBOARD_WIDGETS)) {
            const widgetsStore = db.createObjectStore(DASHBOARD_WIDGETS, {
              keyPath: "id",
              autoIncrement: true,
            });
            widgetsStore.createIndex("by-user", "userId");
          }
        },
      });
    }
    return this.dbPromise;
  }

  // 用户界面偏好操作
  async getUserPreferences(userId: string): Promise<UIPreferences | undefined> {
    const db = await this.initDB();
    const tx = db.transaction(UI_PREFERENCES, "readonly");
    const index = tx.store.index("by-user");
    return index.get(userId);
  }

  async saveUserPreferences(preferences: UIPreferences): Promise<number> {
    const db = await this.initDB();
    const tx = db.transaction(UI_PREFERENCES, "readwrite");

    // 检查是否已有用户记录
    const index = tx.store.index("by-user");
    const existingPref = await index.get(preferences.userId);

    // 更新或添加
    if (existingPref) {
      preferences.id = existingPref.id;
    }

    preferences.lastUpdated = Date.now();
    return tx.store.put(preferences);
  }

  // 最近查看记录操作
  async addRecentlyViewed(item: RecentlyViewed): Promise<void> {
    const db = await this.initDB();
    const tx = db.transaction(RECENTLY_VIEWED, "readwrite");
    const store = tx.store;
    const index = store.index("by-user");
    const userId = item.userId;

    // 检查是否已存在相同项
    const existingItems = await index.getAll(userId);
    const existingIndex = existingItems.findIndex(
      (i) => i.itemId === item.itemId && i.itemType === item.itemType
    );

    if (existingIndex >= 0) {
      // 更新已存在项的时间戳
      const existingItem = existingItems[existingIndex];
      existingItem.viewedAt = Date.now();
      await store.put(existingItem);
    } else {
      // 添加新项
      item.viewedAt = Date.now();
      await store.add(item);

      // 检查是否超过最大记录数
      if (existingItems.length >= MAX_RECORDS.RECENTLY_VIEWED) {
        // 找出最旧的项并删除
        const oldestItem = existingItems.reduce((oldest, current) =>
          oldest.viewedAt < current.viewedAt ? oldest : current
        );
        await store.delete(oldestItem.id!);
      }
    }
  }

  async getRecentlyViewed(
    userId: string,
    itemType?: string,
    limit = 10
  ): Promise<RecentlyViewed[]> {
    const db = await this.initDB();
    const tx = db.transaction(RECENTLY_VIEWED, "readonly");
    let cursor;

    if (itemType) {
      // 按类型过滤
      const typeIndex = tx.store.index("by-type");
      cursor = await typeIndex.openCursor(itemType, "prev");
    } else {
      // 按时间排序所有记录
      const timeIndex = tx.store.index("by-timestamp");
      cursor = await timeIndex.openCursor(null, "prev");
    }

    const results: RecentlyViewed[] = [];
    let count = 0;

    while (cursor && count < limit) {
      const item = cursor.value;
      if (item.userId === userId) {
        results.push(item);
        count++;
      }
      cursor = await cursor.continue();
    }

    return results;
  }

  // 草稿操作
  async saveDraft(draft: DraftItem): Promise<number> {
    const db = await this.initDB();
    const tx = db.transaction(DRAFTS, "readwrite");
    draft.updatedAt = Date.now();

    if (!draft.createdAt) {
      draft.createdAt = draft.updatedAt;
    }

    return tx.store.put(draft);
  }

  async getDrafts(userId: string, draftType?: string): Promise<DraftItem[]> {
    const db = await this.initDB();
    const tx = db.transaction(DRAFTS, "readonly");

    if (draftType) {
      const typeIdx = tx.store.index("by-type");
      const typeCursor = await typeIdx.openCursor(draftType);
      const results: DraftItem[] = [];

      while (typeCursor) {
        if (typeCursor.value.userId === userId) {
          results.push(typeCursor.value);
        }
        await typeCursor.continue();
      }

      // 按更新时间排序
      return results.sort((a, b) => b.updatedAt - a.updatedAt);
    } else {
      const userIdx = tx.store.index("by-user");
      return userIdx.getAll(userId);
    }
  }

  async getDraftById(id: number): Promise<DraftItem | undefined> {
    const db = await this.initDB();
    return db.get(DRAFTS, id);
  }

  async deleteDraft(id: number): Promise<void> {
    const db = await this.initDB();
    await db.delete(DRAFTS, id);
  }

  async clearOldDrafts(userId: string, olderThanDays = 30): Promise<void> {
    const db = await this.initDB();
    const tx = db.transaction(DRAFTS, "readwrite");
    const userIdx = tx.store.index("by-user");
    const cursor = await userIdx.openCursor(userId);

    const cutoffTime = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;

    while (cursor) {
      if (cursor.value.updatedAt < cutoffTime) {
        await cursor.delete();
      }
      await cursor.continue();
    }
  }

  // 搜索历史操作
  async addSearchHistory(search: SearchHistory): Promise<number> {
    const db = await this.initDB();
    const tx = db.transaction(SEARCH_HISTORY, "readwrite");
    search.timestamp = Date.now();

    // 检查是否需要清理旧记录
    const userIdx = tx.store.index("by-user");
    const existingSearches = await userIdx.getAll(search.userId);

    if (existingSearches.length >= MAX_RECORDS.SEARCH_HISTORY) {
      // 按时间排序
      existingSearches.sort((a, b) => a.timestamp - b.timestamp);
      // 删除最旧的记录
      await tx.store.delete(existingSearches[0].id!);
    }

    return tx.store.add(search);
  }

  async getSearchHistory(
    userId: string,
    searchArea?: string,
    limit = 10
  ): Promise<SearchHistory[]> {
    const db = await this.initDB();
    const tx = db.transaction(SEARCH_HISTORY, "readonly");

    let results: SearchHistory[] = [];

    if (searchArea) {
      const areaIdx = tx.store.index("by-area");
      const cursor = await areaIdx.openCursor(searchArea);

      while (cursor && results.length < limit) {
        if (cursor.value.userId === userId) {
          results.push(cursor.value);
        }
        await cursor.continue();
      }
    } else {
      const userIdx = tx.store.index("by-user");
      results = await userIdx.getAll(userId);
    }

    // 按时间降序排序并限制数量
    return results.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
  }

  async clearSearchHistory(userId: string): Promise<void> {
    const db = await this.initDB();
    const tx = db.transaction(SEARCH_HISTORY, "readwrite");
    const userIdx = tx.store.index("by-user");
    const cursor = await userIdx.openCursor(userId);

    while (cursor) {
      await cursor.delete();
      await cursor.continue();
    }
  }

  // 视图设置操作
  async saveViewSettings(settings: ViewSettings): Promise<number> {
    const db = await this.initDB();
    const tx = db.transaction(VIEW_SETTINGS, "readwrite");

    // 查找是否已有相同类型的视图设置
    const userIdx = tx.store.index("by-user");
    const cursor = await userIdx.openCursor(settings.userId);

    while (cursor) {
      if (cursor.value.viewType === settings.viewType) {
        // 更新现有设置
        settings.id = cursor.value.id;
        break;
      }
      await cursor.continue();
    }

    settings.lastUpdated = Date.now();
    return tx.store.put(settings);
  }

  async getViewSettings(
    userId: string,
    viewType: ViewType
  ): Promise<ViewSettings | undefined> {
    const db = await this.initDB();
    const tx = db.transaction(VIEW_SETTINGS, "readonly");
    const userIdx = tx.store.index("by-user");
    const cursor = await userIdx.openCursor(userId);

    while (cursor) {
      if (cursor.value.viewType === viewType) {
        return cursor.value;
      }
      await cursor.continue();
    }

    return undefined;
  }

  // 通知状态操作
  async updateNotificationState(state: NotificationState): Promise<number> {
    const db = await this.initDB();
    const tx = db.transaction(NOTIFICATION_STATES, "readwrite");

    // 查找是否已有相同通知的状态
    const notifIdx = tx.store.index("by-notification");
    const existing = await notifIdx.get(state.notificationId);

    if (existing) {
      state.id = existing.id;
    }

    state.updatedAt = Date.now();
    return tx.store.put(state);
  }

  async getNotificationState(
    notificationId: string
  ): Promise<NotificationState | undefined> {
    const db = await this.initDB();
    const tx = db.transaction(NOTIFICATION_STATES, "readonly");
    const notifIdx = tx.store.index("by-notification");
    return notifIdx.get(notificationId);
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    const db = await this.initDB();
    const tx = db.transaction(NOTIFICATION_STATES, "readonly");
    const userIdx = tx.store.index("by-user");
    const cursor = await userIdx.openCursor(userId);

    let count = 0;
    while (cursor) {
      if (!cursor.value.read && !cursor.value.dismissed) {
        count++;
      }
      await cursor.continue();
    }

    return count;
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    const db = await this.initDB();
    const tx = db.transaction(NOTIFICATION_STATES, "readwrite");
    const userIdx = tx.store.index("by-user");
    const cursor = await userIdx.openCursor(userId);

    const now = Date.now();
    while (cursor) {
      if (!cursor.value.read) {
        cursor.value.read = true;
        cursor.value.updatedAt = now;
        await cursor.update(cursor.value);
      }
      await cursor.continue();
    }
  }

  // 仪表盘小组件配置操作
  async saveDashboardConfig(config: DashboardWidgetConfig): Promise<number> {
    const db = await this.initDB();
    const tx = db.transaction(DASHBOARD_WIDGETS, "readwrite");

    // 查找是否已有用户的仪表盘配置
    const userIdx = tx.store.index("by-user");
    const existing = await userIdx.get(config.userId);

    if (existing) {
      config.id = existing.id;
    }

    config.lastUpdated = Date.now();
    return tx.store.put(config);
  }

  async getDashboardConfig(
    userId: string
  ): Promise<DashboardWidgetConfig | undefined> {
    const db = await this.initDB();
    const tx = db.transaction(DASHBOARD_WIDGETS, "readonly");
    const userIdx = tx.store.index("by-user");
    return userIdx.get(userId);
  }
}

// 创建单例实例
const idbService = new IDBService();
export default idbService;
