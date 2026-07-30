'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * 类型安全的 localStorage Hook
 * 自动 JSON 序列化/反序列化
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // 初始化时从 localStorage 读取
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      }
    } catch {
      // 数据损坏时保持初始值
    }
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const newValue = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(newValue));
        } catch {
          // localStorage 已满
        }
        return newValue;
      });
    },
    [key]
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch {
      // ignore
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * 从 localStorage 读取值（非 Hook）
 */
export function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * 写入 localStorage（非 Hook）
 */
export function setToStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage 已满
  }
}
