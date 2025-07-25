import { useEffect } from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public init() {
    this.measurePageLoad();
    this.measureWebVitals();
    this.startPerformanceObserver();
  }

  private measurePageLoad() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
      this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;

      this.reportMetrics('pageLoad', {
        pageLoadTime: this.metrics.pageLoadTime,
        domContentLoaded: this.metrics.domContentLoaded
      });
    });
  }

  private measureWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.metrics.largestContentfulPaint = lastEntry.startTime;
        
        this.reportMetrics('LCP', { value: lastEntry.startTime });
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const firstInput = list.getEntries()[0] as any;
        this.metrics.firstInputDelay = firstInput.processingStart - firstInput.startTime;
        
        this.reportMetrics('FID', { value: this.metrics.firstInputDelay });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        this.metrics.cumulativeLayoutShift = clsValue;
        
        this.reportMetrics('CLS', { value: clsValue });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    }
  }

  private startPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
            this.metrics.firstContentfulPaint = entry.startTime;
            this.reportMetrics('FCP', { value: entry.startTime });
          }
        }
      });
      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    }
  }

  private reportMetrics(metricName: string, data: any) {
    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Performance Metric - ${metricName}:`, data);
    }

    // Send to analytics service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Google Analytics, Mixpanel, custom analytics
      // gtag('event', 'performance_metric', {
      //   metric_name: metricName,
      //   metric_value: data.value,
      //   page_path: window.location.pathname
      // });
    }

    // Log performance issues
    this.checkPerformanceThresholds(metricName, data);
  }

  private checkPerformanceThresholds(metricName: string, data: any) {
    const thresholds = {
      FCP: 1800, // First Contentful Paint should be < 1.8s
      LCP: 2500, // Largest Contentful Paint should be < 2.5s
      FID: 100,  // First Input Delay should be < 100ms
      CLS: 0.1,  // Cumulative Layout Shift should be < 0.1
      pageLoadTime: 3000 // Page load should be < 3s
    };

    const threshold = thresholds[metricName as keyof typeof thresholds];
    if (threshold && data.value > threshold) {
      console.warn(`⚠️ Performance Issue - ${metricName}: ${data.value}ms (threshold: ${threshold}ms)`);
      
      // Send performance issue to monitoring service
      if (process.env.NODE_ENV === 'production') {
        // Example: Error reporting service
        // Sentry.captureMessage(`Performance Issue: ${metricName} exceeded threshold`, 'warning');
      }
    }
  }

  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  public cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// React Hook for using Performance Monitor
export const usePerformanceMonitor = () => {
  useEffect(() => {
    const monitor = PerformanceMonitor.getInstance();
    monitor.init();

    return () => {
      monitor.cleanup();
    };
  }, []);

  const getMetrics = () => {
    return PerformanceMonitor.getInstance().getMetrics();
  };

  return { getMetrics };
};

export default PerformanceMonitor; 