import { useState, useRef, useEffect, useCallback } from "react";
import { setCookie, getCookieValue } from "@/lib/cookies";
import * as ResizablePrimitive from "react-resizable-panels";

// 避免在 hook 内部直接使用 useState 和 useRef，而是创建一个工厂函数
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

// 简化后的 hook
export const useResizableSidebar = ({
  defaultLayout,
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
    defaultLayout || [20, 40, 40],
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

  const onLayoutChange = useCallback(
    (sizes: number[]) => {
      if (sizes.length > 0 && typeof window !== "undefined") {
        setSizes(sizes);
        setCookie(`${cookieKey}-layout`, JSON.stringify(sizes));
      }
    },
    [cookieKey]
  );

  const onCollapse = useCallback(
    (collapsed: boolean) => {
      if (typeof window !== "undefined") {
        setIsCollapsed(collapsed);
        setCookie(`${cookieKey}-collapsed`, String(collapsed));
      }
    },
    [cookieKey]
  );

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => {
      const newState = !prev;
      if (typeof window !== "undefined") {
        setCookie(`${cookieKey}-collapsed`, String(newState));
      }
      return newState;
    });
  }, [cookieKey]);

  return {
    isCollapsed,
    sizes,
    panelGroupRef,
    onLayoutChange,
    onCollapse,
    toggleSidebar,
  };
};
