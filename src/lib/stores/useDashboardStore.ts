import { create } from "zustand";
import { DashboardWidgetConfig, WidgetLayout } from "@/lib/types/local-storage";
import idbService from "@/lib/services/idb-service";

// MARK: 默认小组件配置
const defaultLayout: WidgetLayout[] = [
  {
    widgetId: "recent-emails",
    position: { x: 0, y: 0, width: 6, height: 2 },
  },
  {
    widgetId: "calendar",
    position: { x: 6, y: 0, width: 6, height: 2 },
  },
  {
    widgetId: "tasks",
    position: { x: 0, y: 2, width: 4, height: 2 },
  },
  {
    widgetId: "notifications",
    position: { x: 4, y: 2, width: 4, height: 2 },
  },
  {
    widgetId: "contacts",
    position: { x: 8, y: 2, width: 4, height: 2 },
  },
];

interface DashboardState {
  // 状态
  layout: WidgetLayout[];
  hiddenWidgets: string[];
  isLoading: boolean;
  userId: string;

  // 方法
  loadDashboardConfig: (userId: string) => Promise<void>;
  updateLayout: (newLayout: WidgetLayout[]) => Promise<void>;
  hideWidget: (widgetId: string) => Promise<void>;
  showWidget: (widgetId: string) => Promise<void>;
  resetLayout: () => Promise<void>;
  updateWidgetConfig: (
    widgetId: string,
    config: Record<string, any>
  ) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  // MARK: 初始状态
  layout: [],
  hiddenWidgets: [],
  isLoading: false,
  userId: "",

  // MARK: 加载仪表盘配置
  loadDashboardConfig: async (userId: string) => {
    set({ isLoading: true, userId });

    try {
      const savedConfig = await idbService.getDashboardConfig(userId);

      if (savedConfig) {
        set({
          layout: savedConfig.layout,
          hiddenWidgets: savedConfig.hiddenWidgets,
          isLoading: false,
        });
      } else {
        // 使用默认配置并保存
        const defaultConfig: Omit<DashboardWidgetConfig, "id"> = {
          userId,
          layout: defaultLayout,
          hiddenWidgets: [],
          lastUpdated: Date.now(),
        };

        await idbService.saveDashboardConfig(defaultConfig);
        set({
          layout: defaultLayout,
          hiddenWidgets: [],
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("加载仪表盘配置失败:", error);
      set({
        layout: defaultLayout,
        hiddenWidgets: [],
        isLoading: false,
      });
    }
  },

  // MARK: 更新布局
  updateLayout: async (newLayout: WidgetLayout[]) => {
    const { userId, hiddenWidgets } = get();

    try {
      const config: Omit<DashboardWidgetConfig, "id"> = {
        userId,
        layout: newLayout,
        hiddenWidgets,
        lastUpdated: Date.now(),
      };

      await idbService.saveDashboardConfig(config);
      set({ layout: newLayout });
    } catch (error) {
      console.error("更新仪表盘布局失败:", error);
    }
  },

  // MARK: 隐藏小组件
  hideWidget: async (widgetId: string) => {
    const { userId, layout, hiddenWidgets } = get();

    if (hiddenWidgets.includes(widgetId)) {
      return; // 已经隐藏
    }

    const newHiddenWidgets = [...hiddenWidgets, widgetId];

    try {
      const config: Omit<DashboardWidgetConfig, "id"> = {
        userId,
        layout,
        hiddenWidgets: newHiddenWidgets,
        lastUpdated: Date.now(),
      };

      await idbService.saveDashboardConfig(config);
      set({ hiddenWidgets: newHiddenWidgets });
    } catch (error) {
      console.error("隐藏小组件失败:", error);
    }
  },

  // MARK: 显示小组件
  showWidget: async (widgetId: string) => {
    const { userId, layout, hiddenWidgets } = get();

    const newHiddenWidgets = hiddenWidgets.filter((id) => id !== widgetId);

    try {
      const config: Omit<DashboardWidgetConfig, "id"> = {
        userId,
        layout,
        hiddenWidgets: newHiddenWidgets,
        lastUpdated: Date.now(),
      };

      await idbService.saveDashboardConfig(config);
      set({ hiddenWidgets: newHiddenWidgets });
    } catch (error) {
      console.error("显示小组件失败:", error);
    }
  },

  // MARK: 重置布局
  resetLayout: async () => {
    const { userId } = get();

    try {
      const config: Omit<DashboardWidgetConfig, "id"> = {
        userId,
        layout: defaultLayout,
        hiddenWidgets: [],
        lastUpdated: Date.now(),
      };

      await idbService.saveDashboardConfig(config);
      set({
        layout: defaultLayout,
        hiddenWidgets: [],
      });
    } catch (error) {
      console.error("重置仪表盘布局失败:", error);
    }
  },

  // MARK: 更新小组件配置
  updateWidgetConfig: async (widgetId: string, config: Record<string, any>) => {
    const { userId, layout, hiddenWidgets } = get();

    const newLayout = layout.map((widget) => {
      if (widget.widgetId === widgetId) {
        return {
          ...widget,
          config: { ...widget.config, ...config },
        };
      }
      return widget;
    });

    try {
      const dashboardConfig: Omit<DashboardWidgetConfig, "id"> = {
        userId,
        layout: newLayout,
        hiddenWidgets,
        lastUpdated: Date.now(),
      };

      await idbService.saveDashboardConfig(dashboardConfig);
      set({ layout: newLayout });
    } catch (error) {
      console.error("更新小组件配置失败:", error);
    }
  },
}));
