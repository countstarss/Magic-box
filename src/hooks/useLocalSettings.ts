import { useEffect, useState } from "react";
import { useUIStore } from "@/lib/stores/useUIStore";
import { useDashboardStore } from "@/lib/stores/useDashboardStore";
import {
  useViewSettingsStore,
  ViewType,
} from "@/lib/stores/useViewSettingsStore";
import idbService from "@/lib/services/idb-service";
import {
  DraftItem,
  RecentlyViewed,
  SearchHistory,
} from "@/lib/types/local-storage";

interface UseLocalSettingsProps {
  userId: string;
}

/**
 * 统一访问本地设置的Hook
 */
export function useLocalSettings({ userId }: UseLocalSettingsProps) {
  const [isReady, setIsReady] = useState(false);

  // UI偏好
  const {
    preferences: uiPreferences,
    initializePreferences,
    setDarkMode,
    setSidebarCollapsed,
    setFontSize,
    setDensity,
    setAccentColor,
    resetToDefaults,
  } = useUIStore();

  // 仪表盘设置
  const {
    layout,
    hiddenWidgets,
    loadDashboardConfig,
    updateLayout,
    hideWidget,
    showWidget,
    resetLayout,
  } = useDashboardStore();

  // 视图设置
  const {
    settings: viewSettings,
    currentViewType,
    loadViewSettings,
    updateColumns,
    updateSorting,
    updatePageSize,
    updateFilters,
    resetViewSettings,
    setCurrentViewType,
  } = useViewSettingsStore();

  // 最近访问的项目状态
  const [recentItems, setRecentItems] = useState<RecentlyViewed[]>([]);

  // 草稿状态
  const [drafts, setDrafts] = useState<{
    email: DraftItem[];
    template: DraftItem[];
    event: DraftItem[];
    note: DraftItem[];
  }>({
    email: [],
    template: [],
    event: [],
    note: [],
  });

  // 搜索历史状态
  const [searchHistory, setSearchHistory] = useState<
    Record<string, SearchHistory[]>
  >({});

  // 初始化所有本地设置
  useEffect(() => {
    if (!userId) return;

    const initialize = async () => {
      try {
        // 初始化UI偏好
        await initializePreferences(userId);

        // 加载仪表盘配置
        await loadDashboardConfig(userId);

        // 加载CRM视图设置作为默认
        await loadViewSettings(userId, "crm");

        // 加载最近访问的项目
        const recent = await idbService.getRecentlyViewed(userId);
        setRecentItems(recent);

        // 加载草稿
        const emailDrafts = await idbService.getDrafts(userId, "email");
        const templateDrafts = await idbService.getDrafts(userId, "template");
        const eventDrafts = await idbService.getDrafts(userId, "event");
        const noteDrafts = await idbService.getDrafts(userId, "note");

        setDrafts({
          email: emailDrafts,
          template: templateDrafts,
          event: eventDrafts,
          note: noteDrafts,
        });

        // 加载搜索历史
        const globalSearchHistory = await idbService.getSearchHistory(
          userId,
          "global"
        );
        const contactsSearchHistory = await idbService.getSearchHistory(
          userId,
          "contacts"
        );
        const emailsSearchHistory = await idbService.getSearchHistory(
          userId,
          "emails"
        );

        setSearchHistory({
          global: globalSearchHistory,
          contacts: contactsSearchHistory,
          emails: emailsSearchHistory,
        });

        setIsReady(true);
      } catch (error) {
        console.error("初始化本地设置失败:", error);
      }
    };

    initialize();
  }, [userId]);

  // 添加最近查看的项目
  const addRecentItem = async (
    item: Omit<RecentlyViewed, "id" | "viewedAt">
  ) => {
    if (!userId) return;

    try {
      await idbService.addRecentlyViewed({
        ...item,
        userId,
        viewedAt: Date.now(),
      });

      // 更新状态
      const updated = await idbService.getRecentlyViewed(userId);
      setRecentItems(updated);
    } catch (error) {
      console.error("添加最近访问项目失败:", error);
    }
  };

  // 保存草稿
  const saveDraft = async (
    draft: Omit<DraftItem, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!userId) return;

    try {
      const draftWithUser: Omit<DraftItem, "id"> = {
        ...draft,
        userId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const id = await idbService.saveDraft(draftWithUser);

      // 更新状态
      const updatedDrafts = await idbService.getDrafts(userId, draft.draftType);
      setDrafts((prev) => ({
        ...prev,
        [draft.draftType]: updatedDrafts,
      }));

      return id;
    } catch (error) {
      console.error("保存草稿失败:", error);
      return null;
    }
  };

  // 更新草稿
  const updateDraft = async (id: number, content: any, title?: string) => {
    if (!userId) return;

    try {
      const draft = await idbService.getDraftById(id);
      if (!draft || draft.userId !== userId) return;

      const updatedDraft = {
        ...draft,
        content,
        title: title || draft.title,
        updatedAt: Date.now(),
      };

      await idbService.saveDraft(updatedDraft);

      // 更新状态
      const updatedDrafts = await idbService.getDrafts(userId, draft.draftType);
      setDrafts((prev) => ({
        ...prev,
        [draft.draftType]: updatedDrafts,
      }));
    } catch (error) {
      console.error("更新草稿失败:", error);
    }
  };

  // 删除草稿
  const deleteDraft = async (id: number) => {
    if (!userId) return;

    try {
      const draft = await idbService.getDraftById(id);
      if (!draft || draft.userId !== userId) return;

      const draftType = draft.draftType;
      await idbService.deleteDraft(id);

      // 更新状态
      const updatedDrafts = await idbService.getDrafts(userId, draftType);
      setDrafts((prev) => ({
        ...prev,
        [draftType]: updatedDrafts,
      }));
    } catch (error) {
      console.error("删除草稿失败:", error);
    }
  };

  // 添加搜索历史
  const addSearchHistory = async (
    searchData: Omit<SearchHistory, "id" | "timestamp">
  ) => {
    if (!userId) return;

    try {
      await idbService.addSearchHistory({
        ...searchData,
        userId,
        timestamp: Date.now(),
      });

      // 更新状态
      const updated = await idbService.getSearchHistory(
        userId,
        searchData.searchArea
      );
      setSearchHistory((prev) => ({
        ...prev,
        [searchData.searchArea]: updated,
      }));
    } catch (error) {
      console.error("添加搜索历史失败:", error);
    }
  };

  // 清除搜索历史
  const clearSearchHistory = async (searchArea?: string) => {
    if (!userId) return;

    try {
      await idbService.clearSearchHistory(userId);

      // 更新状态
      if (searchArea) {
        const updated = await idbService.getSearchHistory(userId, searchArea);
        setSearchHistory((prev) => ({
          ...prev,
          [searchArea]: updated,
        }));
      } else {
        setSearchHistory({});
      }
    } catch (error) {
      console.error("清除搜索历史失败:", error);
    }
  };

  // 加载指定类型的视图设置
  const loadViewType = (viewType: ViewType) => {
    if (!userId) return;
    if (viewType === currentViewType) return;

    setCurrentViewType(viewType);
  };

  return {
    isReady,

    // UI偏好
    uiPreferences,
    setDarkMode,
    setSidebarCollapsed,
    setFontSize,
    setDensity,
    setAccentColor,
    resetToDefaults,

    // 仪表盘配置
    dashboardLayout: layout,
    hiddenWidgets,
    updateDashboardLayout: updateLayout,
    hideWidget,
    showWidget,
    resetDashboardLayout: resetLayout,

    // 视图设置
    viewSettings,
    currentViewType,
    loadViewType,
    updateColumns,
    updateSorting,
    updatePageSize,
    updateFilters,
    resetViewSettings,

    // 最近查看的项目
    recentItems,
    addRecentItem,

    // 草稿
    drafts,
    saveDraft,
    updateDraft,
    deleteDraft,

    // 搜索历史
    searchHistory,
    addSearchHistory,
    clearSearchHistory,
  };
}
