import { Suspense, lazy } from 'react'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LoadingSpinner } from './components/LoadingSpinner'

// Lazy load components for code splitting
const StockPredictor = lazy(() => import('./components/StockPredictor'))

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <ErrorBoundary>
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
              Stock Price Predictor
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-slide-up">
              Get AI-powered predictions for your favorite stocks with lightning-fast performance
            </p>
          </div>
          
          <Suspense fallback={<LoadingSpinner />}>
            <StockPredictor />
          </Suspense>
        </main>
      </ErrorBoundary>
    </div>
  )
}

export default App