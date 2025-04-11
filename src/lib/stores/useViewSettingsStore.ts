import { create } from "zustand";
import { ViewSettings } from "@/lib/types/local-storage";
import idbService from "@/lib/services/idb-service";

// MARK: 视图类型定义
export type ViewType = "crm" | "emails" | "templates" | "events";

// MARK: 视图默认设置
const defaultViewSettings: Omit<ViewSettings, "id" | "userId" | "lastUpdated"> =
  {
    viewType: "crm",
    columns: ["name", "email", "company", "lastContact"],
    sortBy: "lastContact",
    sortDirection: "desc",
    pageSize: 20,
    filters: {},
  };

// MARK: 各类视图的默认列
const defaultColumns: Record<ViewType, string[]> = {
  crm: ["name", "email", "company", "lastContact"],
  emails: ["subject", "sender", "date", "hasAttachments"],
  templates: ["title", "category", "lastUsed", "createdBy"],
  events: ["title", "date", "location", "organizer"],
};

interface ViewSettingsState {
  // 状态
  settings: Record<string, Omit<ViewSettings, "id">>;
  currentViewType: ViewType | null;
  isLoading: boolean;
  userId: string;

  // 方法
  loadViewSettings: (userId: string, viewType: ViewType) => Promise<void>;
  updateColumns: (columns: string[]) => Promise<void>;
  updateSorting: (
    sortBy: string,
    sortDirection: "asc" | "desc"
  ) => Promise<void>;
  updatePageSize: (pageSize: number) => Promise<void>;
  updateFilters: (filters: Record<string, any>) => Promise<void>;
  resetViewSettings: (viewType?: ViewType) => Promise<void>;
  setCurrentViewType: (viewType: ViewType) => void;
}

// MARK: 初始状态
export const useViewSettingsStore = create<ViewSettingsState>((set, get) => ({
  settings: {},
  currentViewType: null,
  isLoading: false,
  userId: "",

  // MARK: 加载视图设置
  loadViewSettings: async (userId: string, viewType: ViewType) => {
    set({ isLoading: true, userId, currentViewType: viewType });

    try {
      const savedSettings = await idbService.getViewSettings(userId, viewType);

      if (savedSettings) {
        const { id, ...settingsWithoutId } = savedSettings;

        set((state) => ({
          settings: {
            ...state.settings,
            [viewType]: settingsWithoutId,
          },
          isLoading: false,
        }));
      } else {
        // 创建默认设置
        const columns = defaultColumns[viewType] || defaultViewSettings.columns;

        const newSettings: Omit<ViewSettings, "id"> = {
          ...defaultViewSettings,
          viewType,
          columns,
          userId,
          lastUpdated: Date.now(),
        };

        await idbService.saveViewSettings(newSettings);

        set((state) => ({
          settings: {
            ...state.settings,
            [viewType]: newSettings,
          },
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error("加载视图设置失败:", error);

      // 使用内存中的默认设置
      const columns = defaultColumns[viewType] || defaultViewSettings.columns;

      // 确保类型安全
      const defaultViewType: ViewType = viewType;

      set((state) => ({
        settings: {
          ...state.settings,
          [viewType]: {
            ...defaultViewSettings,
            viewType: defaultViewType,
            columns,
            userId,
            lastUpdated: Date.now(),
          },
        },
        isLoading: false,
      }));
    }
  },

  // MARK: 更新列设置
  updateColumns: async (columns: string[]) => {
    const { currentViewType, userId, settings } = get();

    if (!currentViewType || !settings[currentViewType]) {
      console.error("未加载视图设置或当前视图类型未设置");
      return;
    }

    const currentSettings = settings[currentViewType];
    const updatedSettings: Omit<ViewSettings, "id"> = {
      ...currentSettings,
      columns,
      lastUpdated: Date.now(),
    };

    try {
      await idbService.saveViewSettings(updatedSettings);

      set((state) => ({
        settings: {
          ...state.settings,
          [currentViewType]: updatedSettings,
        },
      }));
    } catch (error) {
      console.error("更新列设置失败:", error);
    }
  },

  // MARK: 更新排序
  updateSorting: async (sortBy: string, sortDirection: "asc" | "desc") => {
    const { currentViewType, userId, settings } = get();

    if (!currentViewType || !settings[currentViewType]) {
      console.error("未加载视图设置或当前视图类型未设置");
      return;
    }

    const currentSettings = settings[currentViewType];
    const updatedSettings: Omit<ViewSettings, "id"> = {
      ...currentSettings,
      sortBy,
      sortDirection,
      lastUpdated: Date.now(),
    };

    try {
      await idbService.saveViewSettings(updatedSettings);

      set((state) => ({
        settings: {
          ...state.settings,
          [currentViewType]: updatedSettings,
        },
      }));
    } catch (error) {
      console.error("更新排序设置失败:", error);
    }
  },

  // MARK: 更新每页大小
  updatePageSize: async (pageSize: number) => {
    const { currentViewType, userId, settings } = get();

    if (!currentViewType || !settings[currentViewType]) {
      console.error("未加载视图设置或当前视图类型未设置");
      return;
    }

    const currentSettings = settings[currentViewType];
    const updatedSettings: Omit<ViewSettings, "id"> = {
      ...currentSettings,
      pageSize,
      lastUpdated: Date.now(),
    };

    try {
      await idbService.saveViewSettings(updatedSettings);

      set((state) => ({
        settings: {
          ...state.settings,
          [currentViewType]: updatedSettings,
        },
      }));
    } catch (error) {
      console.error("更新每页大小失败:", error);
    }
  },

  // MARK: 更新过滤器
  updateFilters: async (filters: Record<string, any>) => {
    const { currentViewType, userId, settings } = get();

    if (!currentViewType || !settings[currentViewType]) {
      console.error("未加载视图设置或当前视图类型未设置");
      return;
    }

    const currentSettings = settings[currentViewType];
    const updatedSettings: Omit<ViewSettings, "id"> = {
      ...currentSettings,
      filters,
      lastUpdated: Date.now(),
    };

    try {
      await idbService.saveViewSettings(updatedSettings);

      set((state) => ({
        settings: {
          ...state.settings,
          [currentViewType]: updatedSettings,
        },
      }));
    } catch (error) {
      console.error("更新过滤器失败:", error);
    }
  },

  // MARK: 重置视图设置
  resetViewSettings: async (viewType?: ViewType) => {
    const { currentViewType: currentType, userId, settings } = get();
    const viewTypeToReset = viewType || currentType;

    if (!viewTypeToReset) {
      console.error("未指定要重置的视图类型");
      return;
    }

    const columns =
      defaultColumns[viewTypeToReset] || defaultViewSettings.columns;

    const resetSettings: Omit<ViewSettings, "id"> = {
      ...defaultViewSettings,
      viewType: viewTypeToReset,
      columns,
      userId,
      lastUpdated: Date.now(),
    };

    try {
      await idbService.saveViewSettings(resetSettings);

      set((state) => ({
        settings: {
          ...state.settings,
          [viewTypeToReset]: resetSettings,
        },
      }));
    } catch (error) {
      console.error("重置视图设置失败:", error);
    }
  },

  // MARK: 设置当前视图类型
  setCurrentViewType: (viewType: ViewType) => {
    const { userId, settings } = get();

    // 如果没有加载过这种类型的设置，先加载
    if (!settings[viewType]) {
      get().loadViewSettings(userId, viewType);
    } else {
      set({ currentViewType: viewType });
    }
  },
}));
