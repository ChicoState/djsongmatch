"use client";

import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  /**
   * Hook that returns a debounced value
   * @param value - The value to be debounced
   * @param delay - The delay in milliseconds
   * @returns debouncedValue - The debounced value
   */
  const [debounceValue, setDebounceValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debounceValue;
}
