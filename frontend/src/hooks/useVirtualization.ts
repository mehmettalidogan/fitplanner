import { useState, useEffect, useMemo, useCallback } from 'react';

interface VirtualizationOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

interface VirtualItem {
  index: number;
  start: number;
  end: number;
}

/**
 * Custom hook for virtualizing large lists
 * Improves performance by only rendering visible items
 */
export function useVirtualization<T>(
  items: T[],
  options: VirtualizationOptions
) {
  const { itemHeight, containerHeight, overscan = 3 } = options;
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  
  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + visibleCount + overscan,
      items.length - 1
    );
    const start = Math.max(0, startIndex - overscan);
    
    return { start, end: endIndex };
  }, [scrollTop, itemHeight, visibleCount, overscan, items.length]);

  const visibleItems: VirtualItem[] = useMemo(() => {
    const result = [];
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      result.push({
        index: i,
        start: i * itemHeight,
        end: (i + 1) * itemHeight
      });
    }
    return result;
  }, [visibleRange, itemHeight]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY: visibleRange.start * itemHeight,
    onScroll: handleScroll
  };
}

/**
 * Hook for infinite scrolling with virtualization
 */
export function useInfiniteVirtualization<T>(
  items: T[],
  options: VirtualizationOptions & {
    loadMore: () => Promise<void>;
    hasNextPage: boolean;
    isLoading: boolean;
  }
) {
  const { loadMore, hasNextPage, isLoading, ...virtualOptions } = options;
  const virtualization = useVirtualization(items, virtualOptions);
  
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleScroll = useCallback(async (e: React.UIEvent<HTMLDivElement>) => {
    virtualization.onScroll(e);
    
    // Check if we need to load more items
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const threshold = scrollHeight - clientHeight - 100; // 100px threshold
    
    if (
      scrollTop >= threshold &&
      hasNextPage &&
      !isLoading &&
      !isLoadingMore
    ) {
      setIsLoadingMore(true);
      try {
        await loadMore();
      } finally {
        setIsLoadingMore(false);
      }
    }
  }, [virtualization.onScroll, hasNextPage, isLoading, isLoadingMore, loadMore]);

  return {
    ...virtualization,
    onScroll: handleScroll,
    isLoadingMore
  };
}

export default { useVirtualization, useInfiniteVirtualization };

