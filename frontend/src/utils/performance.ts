/**
 * Performance monitoring utilities
 */

// Performance metrics interface
export interface PerformanceMetrics {
  navigationTiming: {
    dnsLookup: number;
    tcpConnection: number;
    serverResponse: number;
    pageLoad: number;
    domInteractive: number;
    firstContentfulPaint?: number;
    largestContentfulPaint?: number;
  };
  resourceTiming: {
    totalResources: number;
    slowResources: Array<{
      name: string;
      duration: number;
      size: number;
    }>;
  };
  memory?: {
    used: number;
    total: number;
    limit: number;
  };
}

// Get navigation timing metrics
export function getNavigationMetrics(): PerformanceMetrics['navigationTiming'] {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  if (!navigation) {
    return {
      dnsLookup: 0,
      tcpConnection: 0,
      serverResponse: 0,
      pageLoad: 0,
      domInteractive: 0
    };
  }

  return {
    dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcpConnection: navigation.connectEnd - navigation.connectStart,
    serverResponse: navigation.responseEnd - navigation.requestStart,
    pageLoad: navigation.loadEventEnd - navigation.fetchStart,
    domInteractive: navigation.domInteractive - navigation.fetchStart
  };
}

// Get resource timing metrics
export function getResourceMetrics(): PerformanceMetrics['resourceTiming'] {
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  const slowThreshold = 1000; // 1 second
  
  const slowResources = resources
    .filter(resource => resource.duration > slowThreshold)
    .map(resource => ({
      name: resource.name,
      duration: resource.duration,
      size: resource.transferSize || 0
    }))
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 10); // Top 10 slowest

  return {
    totalResources: resources.length,
    slowResources
  };
}

// Get memory usage (if available)
export function getMemoryMetrics(): PerformanceMetrics['memory'] | undefined {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit
    };
  }
  return undefined;
}

// Get Web Vitals metrics
export function getWebVitalsMetrics(): Promise<{
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
}> {
  return new Promise((resolve) => {
    const metrics: any = {};
    
    // First Contentful Paint
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          metrics.fcp = entry.startTime;
        }
      }
    });
    observer.observe({ entryTypes: ['paint'] });
    
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      metrics.lcp = lastEntry.startTime;
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    
    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        metrics.fid = (entry as any).processingStart - entry.startTime;
      }
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
    
    // Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      metrics.cls = clsValue;
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
    
    // Resolve after a delay to collect metrics
    setTimeout(() => {
      resolve(metrics);
    }, 5000);
  });
}

// Performance mark utilities
export function markStart(name: string): void {
  performance.mark(`${name}-start`);
}

export function markEnd(name: string): number {
  performance.mark(`${name}-end`);
  performance.measure(name, `${name}-start`, `${name}-end`);
  
  const measure = performance.getEntriesByName(name, 'measure')[0];
  return measure.duration;
}

// Bundle size analyzer
export function analyzeBundleSize(): Promise<{
  totalSize: number;
  chunks: Array<{ name: string; size: number }>;
}> {
  return new Promise((resolve) => {
    const chunks: Array<{ name: string; size: number }> = [];
    let totalSize = 0;
    
    // Get all script tags
    const scripts = document.querySelectorAll('script[src]');
    let loadedCount = 0;
    
    scripts.forEach((script) => {
      const src = (script as HTMLScriptElement).src;
      if (src.includes('static/js/')) {
        fetch(src, { method: 'HEAD' })
          .then((response) => {
            const size = parseInt(response.headers.get('content-length') || '0');
            chunks.push({
              name: src.split('/').pop() || 'unknown',
              size
            });
            totalSize += size;
          })
          .finally(() => {
            loadedCount++;
            if (loadedCount === scripts.length) {
              resolve({ totalSize, chunks });
            }
          });
      }
    });
    
    if (scripts.length === 0) {
      resolve({ totalSize: 0, chunks: [] });
    }
  });
}

// Performance monitoring class
export class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];
  
  start(): void {
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.warn('Long task detected:', {
            duration: entry.duration,
            startTime: entry.startTime
          });
        }
      });
      
      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);
      } catch (e) {
        // LongTask API not supported
      }
    }
  }
  
  stop(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
  
  async getMetrics(): Promise<PerformanceMetrics> {
    const navigation = getNavigationMetrics();
    const resource = getResourceMetrics();
    const memory = getMemoryMetrics();
    const webVitals = await getWebVitalsMetrics();
    
    return {
      navigationTiming: {
        ...navigation,
        firstContentfulPaint: webVitals.fcp,
        largestContentfulPaint: webVitals.lcp
      },
      resourceTiming: resource,
      memory
    };
  }
  
  logMetrics(): void {
    this.getMetrics().then(metrics => {
      console.group('📊 Performance Metrics');
      console.log('Navigation:', metrics.navigationTiming);
      console.log('Resources:', metrics.resourceTiming);
      if (metrics.memory) {
        console.log('Memory:', metrics.memory);
      }
      console.groupEnd();
    });
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Auto-start in development
if (process.env.NODE_ENV === 'development') {
  performanceMonitor.start();
  
  // Log metrics after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      performanceMonitor.logMetrics();
    }, 2000);
  });
}

