// Performance monitoring utilities

export interface PerformanceMetrics {
  loadTime: number
  firstContentfulPaint?: number
  largestContentfulPaint?: number
  firstInputDelay?: number
  cumulativeLayoutShift?: number
}

// Measure page load performance
export const measurePageLoad = (): Promise<PerformanceMetrics> => {
  return new Promise((resolve) => {
    if (document.readyState === 'complete') {
      resolve(collectMetrics())
    } else {
      window.addEventListener('load', () => {
        // Small delay to ensure all metrics are captured
        setTimeout(() => resolve(collectMetrics()), 100)
      })
    }
  })
}

// Collect performance metrics
const collectMetrics = (): PerformanceMetrics => {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  const paint = performance.getEntriesByType('paint')
  
  const metrics: PerformanceMetrics = {
    loadTime: navigation.loadEventEnd - navigation.loadEventStart,
  }

  // First Contentful Paint
  const fcp = paint.find(entry => entry.name === 'first-contentful-paint')
  if (fcp) {
    metrics.firstContentfulPaint = fcp.startTime
  }

  // Get Web Vitals if available
  if ('PerformanceObserver' in window) {
    try {
      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        metrics.largestContentfulPaint = lastEntry.startTime
      }).observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          metrics.firstInputDelay = entry.processingStart - entry.startTime
        })
      }).observe({ entryTypes: ['first-input'] })

      // Cumulative Layout Shift
      let clsValue = 0
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            metrics.cumulativeLayoutShift = clsValue
          }
        }
      }).observe({ entryTypes: ['layout-shift'] })
    } catch (e) {
      console.warn('Performance Observer not fully supported')
    }
  }

  return metrics
}

// Measure component render time
export const measureRender = (componentName: string) => {
  const start = performance.now()
  
  return () => {
    const end = performance.now()
    const renderTime = end - start
    
    if (import.meta.env.DEV) {
      console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`)
    }
    
    return renderTime
  }
}

// Bundle size analyzer helper
export const logBundleInfo = () => {
  if (import.meta.env.DEV) {
    console.group('Bundle Information')
    console.log('Use `npm run analyze` to analyze bundle size')
    console.log('Performance tips:')
    console.log('- Keep components under 100 lines')
    console.log('- Use React.memo for expensive components')
    console.log('- Implement code splitting for routes')
    console.log('- Optimize images and assets')
    console.groupEnd()
  }
}

// Report Web Vitals
export const reportWebVitals = (onReport?: (metric: any) => void) => {
  if (onReport && 'PerformanceObserver' in window) {
    measurePageLoad().then((metrics) => {
      Object.entries(metrics).forEach(([name, value]) => {
        onReport({
          name,
          value,
          id: `${name}-${Date.now()}`,
          rating: getRating(name, value),
        })
      })
    })
  }
}

// Get performance rating
const getRating = (metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
  const thresholds: Record<string, [number, number]> = {
    firstContentfulPaint: [1800, 3000],
    largestContentfulPaint: [2500, 4000],
    firstInputDelay: [100, 300],
    cumulativeLayoutShift: [0.1, 0.25],
    loadTime: [1000, 3000],
  }

  const threshold = thresholds[metricName]
  if (!threshold) return 'good'

  if (value <= threshold[0]) return 'good'
  if (value <= threshold[1]) return 'needs-improvement'
  return 'poor'
}