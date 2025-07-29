import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { logBundleInfo, reportWebVitals } from './utils/performance'

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .catch(() => {
      // Silently fail if service worker registration fails
    })
}

// Log bundle information in development
logBundleInfo()

// Report Web Vitals for performance monitoring
reportWebVitals((metric) => {
  if (import.meta.env.DEV) {
    console.log(`${metric.name}: ${metric.value} (${metric.rating})`)
  }
  // In production, send to analytics service
  // analytics.track('Web Vital', metric)
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)