import { useState, useRef, useEffect, useCallback } from "react";
import { setCookie, getCookieValue } from "@/lib/cookies";
import * as ResizablePrimitive from "react-resizable-panels";

/**
 * 创建侧边栏状态的工厂函数
 * 避免在 hook 内部直接使用 useState 和 useRef
 */
function createSidebarState(
  defaultLayout: number[] = [20, 40, 40],
  defaultCollapsed: boolean = false,
  cookieKey: string = "sidebar"
) {
  // 从 cookie 中读取初始状态
  const getInitialCollapsed = () => {
    // 只在客户端执行
    if (typeof window === "undefined") return defaultCollapsed;

    const cookieValue = getCookieValue(`${cookieKey}-collapsed`);
    if (cookieValue !== undefined) {
      return cookieValue === "true";
    }
    return defaultCollapsed;
  };

  // 从 cookie 中读取初始布局
  const getInitialLayout = () => {
    // 只在客户端执行
    if (typeof window === "undefined") return defaultLayout;

    const savedLayout = getCookieValue(`${cookieKey}-layout`);
    if (savedLayout) {
      try {
        const parsedLayout = JSON.parse(savedLayout);
        if (Array.isArray(parsedLayout) && parsedLayout.length > 0) {
          return parsedLayout;
        }
      } catch (error) {
        console.error("Failed to parse saved layout:", error);
      }
    }
    return defaultLayout;
  };

  // 返回初始状态
  return {
    initialCollapsed: getInitialCollapsed(),
    initialLayout: getInitialLayout(),
  };
}

/**
 * 可调整大小的侧边栏 Hook
 * 提供了折叠/展开、调整大小以及持久化功能
 */
export const useResizableSidebar = ({
  defaultLayout = [20, 40, 40],
  defaultCollapsed = false,
  navCollapsedSize,
  cookieKey = "sidebar",
}: {
  defaultLayout?: number[];
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  cookieKey?: string;
}) => {
  // 提前准备好所有需要的初始状态，避免条件性调用 hooks
  const initialState = createSidebarState(
    defaultLayout,
    defaultCollapsed,
    cookieKey
  );

  // 现在所有的 hooks 都在 React 组件函数顶层按照固定顺序调用
  const panelGroupRef =
    useRef<React.ElementRef<typeof ResizablePrimitive.PanelGroup>>(null);
  const [sizes, setSizes] = useState<number[]>(initialState.initialLayout);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(
    initialState.initialCollapsed
  );

  // 处理布局变化
  const onLayoutChange = useCallback(
    (sizes: number[]) => {
      if (sizes.length > 0 && typeof window !== "undefined") {
        setSizes(sizes);
        setCookie(`${cookieKey}-layout`, JSON.stringify(sizes));
      }
    },
    [cookieKey]
  );

  // 处理折叠状态变化
  const onCollapse = useCallback(
    (collapsed: boolean) => {
      if (typeof window !== "undefined") {
        setIsCollapsed(collapsed);
        setCookie(`${cookieKey}-collapsed`, String(collapsed));
      }
    },
    [cookieKey]
  );

  // 切换侧边栏折叠状态
  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => {
      const newState = !prev;
      if (typeof window !== "undefined") {
        setCookie(`${cookieKey}-collapsed`, String(newState));
      }
      return newState;
    });
  }, [cookieKey]);

  // 重置面板布局到默认值
  const resetLayout = useCallback(() => {
    setSizes(defaultLayout);
    if (typeof window !== "undefined") {
      setCookie(`${cookieKey}-layout`, JSON.stringify(defaultLayout));
    }
    // 如果panelGroupRef可用，尝试通过API重置
    if (panelGroupRef.current) {
      try {
        // 使用setTimeout确保在下一个渲染周期执行
        setTimeout(() => {
          if (panelGroupRef.current) {
            // 尝试调用面板的setLayout方法
            const panel = panelGroupRef.current as any;
            if (panel.setLayout) {
              panel.setLayout(defaultLayout);
            } else {
              console.warn("面板组没有setLayout方法");
            }
          }
        }, 0);
      } catch (error) {
        console.error("重置面板布局失败:", error);
      }
    }
  }, [defaultLayout, cookieKey]);

  // 当面板引用改变时，应用当前状态
  useEffect(() => {
    if (panelGroupRef.current && isCollapsed) {
      // 对于已折叠的侧边栏，确保DOM状态正确
      try {
        const panel = document.querySelector("[data-panel-id]");
        if (panel) {
          panel.setAttribute("data-state", "collapsed");
        }
      } catch (error) {
        console.error("设置面板折叠状态失败:", error);
      }
    }
  }, [panelGroupRef, isCollapsed]);

  return {
    isCollapsed,
    sizes,
    panelGroupRef,
    onLayoutChange,
    onCollapse,
    toggleSidebar,
    resetLayout,
  };
};
