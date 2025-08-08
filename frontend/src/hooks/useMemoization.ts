import { useMemo, useCallback } from 'react';

/**
 * Custom hooks for common memoization patterns
 */

// Memoize expensive calculations
export function useExpensiveCalculation<T>(
  calculateFn: () => T,
  dependencies: React.DependencyList
): T {
  return useMemo(calculateFn, dependencies);
}

// Memoize array/object transformations
export function useArrayMemo<T, R>(
  array: T[],
  transformFn: (items: T[]) => R
): R {
  return useMemo(() => transformFn(array), [array, transformFn]);
}

// Memoize object transformations
export function useObjectMemo<T extends Record<string, any>, R>(
  obj: T,
  transformFn: (obj: T) => R
): R {
  return useMemo(() => transformFn(obj), [obj, transformFn]);
}

// Memoize callbacks with stable references
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
  dependencies: React.DependencyList
): T {
  return useCallback(callback, dependencies);
}

// Memoize filtered arrays
export function useFilteredArray<T>(
  array: T[],
  filterFn: (item: T) => boolean
): T[] {
  return useMemo(() => array.filter(filterFn), [array, filterFn]);
}

// Memoize sorted arrays
export function useSortedArray<T>(
  array: T[],
  compareFn: (a: T, b: T) => number
): T[] {
  return useMemo(() => [...array].sort(compareFn), [array, compareFn]);
}

// Memoize grouped data
export function useGroupedData<T, K extends string | number>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return useMemo(() => {
    const groups = {} as Record<K, T[]>;
    array.forEach(item => {
      const key = keyFn(item);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });
    return groups;
  }, [array, keyFn]);
}

export default {
  useExpensiveCalculation,
  useArrayMemo,
  useObjectMemo,
  useStableCallback,
  useFilteredArray,
  useSortedArray,
  useGroupedData
};

