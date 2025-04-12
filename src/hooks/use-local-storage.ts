import * as React from "react";

interface UseLocalStorageOptions<T> {
  key: string;
  defaultValue: T;
}

export function useLocalStorage<T>({
  key,
  defaultValue,
}: UseLocalStorageOptions<T>): [T, React.Dispatch<React.SetStateAction<T>>] {
  // 状态初始化
  const [state, setState] = React.useState<T>(() => {
    try {
      // 尝试从localStorage获取值
      const storedValue = localStorage.getItem(key);
      // 如果找到了值，解析并返回
      if (storedValue) return JSON.parse(storedValue);
      // 否则使用默认值并存储到localStorage
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    } catch (error) {
      // 出错时返回默认值
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  // 当key或state变化时更新localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
}
