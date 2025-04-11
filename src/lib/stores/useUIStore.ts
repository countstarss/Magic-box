import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UIPreferences } from "@/lib/types/local-storage";
import idbService from "@/lib/services/idb-service";

// MARK: 默认UI偏好
const defaultUIPreferences: Omit<UIPreferences, "userId" | "lastUpdated"> = {
  darkMode: false,
  sidebarCollapsed: false,
  fontSize: "medium",
  density: "comfortable",
  accentColor: "#3b82f6", // 蓝色
};

interface UIState {
  // UI状态
  preferences: Omit<UIPreferences, "id">;
  isInitialized: boolean;

  // 方法
  initializePreferences: (userId: string) => Promise<void>;
  setDarkMode: (isDark: boolean) => Promise<void>;
  setSidebarCollapsed: (isCollapsed: boolean) => Promise<void>;
  setFontSize: (size: UIPreferences["fontSize"]) => Promise<void>;
  setDensity: (density: UIPreferences["density"]) => Promise<void>;
  setAccentColor: (color: string) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

// MARK: 初始状态
export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // 初始状态
      preferences: {
        ...defaultUIPreferences,
        userId: "",
        lastUpdated: Date.now(),
      },
      isInitialized: false,

      // MARK: 初始化偏好设置
      initializePreferences: async (userId: string) => {
        try {
          // 从IndexedDB获取用户偏好
          const savedPreferences = await idbService.getUserPreferences(userId);

          if (savedPreferences) {
            // 使用保存的偏好
            const { id, ...prefsWithoutId } = savedPreferences;
            set({
              preferences: prefsWithoutId,
              isInitialized: true,
            });
          } else {
            // 使用默认偏好并保存到IndexedDB
            const newPreferences = {
              ...defaultUIPreferences,
              userId,
              lastUpdated: Date.now(),
            };

            await idbService.saveUserPreferences(newPreferences);
            set({
              preferences: newPreferences,
              isInitialized: true,
            });
          }
        } catch (error) {
          console.error("初始化UI偏好失败:", error);
          // 使用默认值
          set({
            preferences: {
              ...defaultUIPreferences,
              userId,
              lastUpdated: Date.now(),
            },
            isInitialized: true,
          });
        }
      },

      // MARK: 设置暗黑模式
      setDarkMode: async (isDark: boolean) => {
        const currentPreferences = get().preferences;
        const updatedPreferences = {
          ...currentPreferences,
          darkMode: isDark,
          lastUpdated: Date.now(),
        };

        try {
          await idbService.saveUserPreferences(updatedPreferences);
          set({ preferences: updatedPreferences });

          // 应用暗黑模式到DOM
          if (isDark) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        } catch (error) {
          console.error("设置暗黑模式失败:", error);
        }
      },

      // MARK: 设置侧边栏折叠状态
      setSidebarCollapsed: async (isCollapsed: boolean) => {
        const currentPreferences = get().preferences;
        const updatedPreferences = {
          ...currentPreferences,
          sidebarCollapsed: isCollapsed,
          lastUpdated: Date.now(),
        };

        try {
          await idbService.saveUserPreferences(updatedPreferences);
          set({ preferences: updatedPreferences });
        } catch (error) {
          console.error("设置侧边栏状态失败:", error);
        }
      },

      // MARK: 设置字体大小
      setFontSize: async (size: UIPreferences["fontSize"]) => {
        const currentPreferences = get().preferences;
        const updatedPreferences = {
          ...currentPreferences,
          fontSize: size,
          lastUpdated: Date.now(),
        };

        try {
          await idbService.saveUserPreferences(updatedPreferences);
          set({ preferences: updatedPreferences });

          // 应用字体大小到DOM
          document.documentElement.dataset.fontSize = size;
        } catch (error) {
          console.error("设置字体大小失败:", error);
        }
      },

      // MARK: 设置界面密度
      setDensity: async (density: UIPreferences["density"]) => {
        const currentPreferences = get().preferences;
        const updatedPreferences = {
          ...currentPreferences,
          density,
          lastUpdated: Date.now(),
        };

        try {
          await idbService.saveUserPreferences(updatedPreferences);
          set({ preferences: updatedPreferences });

          // 应用密度到DOM
          document.documentElement.dataset.density = density;
        } catch (error) {
          console.error("设置界面密度失败:", error);
        }
      },

      // MARK: 设置强调色
      setAccentColor: async (color: string) => {
        const currentPreferences = get().preferences;
        const updatedPreferences = {
          ...currentPreferences,
          accentColor: color,
          lastUpdated: Date.now(),
        };

        try {
          await idbService.saveUserPreferences(updatedPreferences);
          set({ preferences: updatedPreferences });

          // 应用强调色到CSS变量
          document.documentElement.style.setProperty("--accent-color", color);
        } catch (error) {
          console.error("设置强调色失败:", error);
        }
      },

      // MARK: 重置为默认设置
      resetToDefaults: async () => {
        const userId = get().preferences.userId;
        const updatedPreferences = {
          ...defaultUIPreferences,
          userId,
          lastUpdated: Date.now(),
        };

        try {
          await idbService.saveUserPreferences(updatedPreferences);
          set({ preferences: updatedPreferences });

          // 重置DOM设置
          if (updatedPreferences.darkMode) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }

          document.documentElement.dataset.fontSize =
            updatedPreferences.fontSize;
          document.documentElement.dataset.density = updatedPreferences.density;
          document.documentElement.style.setProperty(
            "--accent-color",
            updatedPreferences.accentColor
          );
        } catch (error) {
          console.error("重置UI设置失败:", error);
        }
      },
    }),
    {
      name: "ui-preferences",
      storage: createJSONStorage(() => sessionStorage), // 使用sessionStorage作为临时缓存
      partialize: (state) => ({ isInitialized: state.isInitialized }),
    }
  )
);
