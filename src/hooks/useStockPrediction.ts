import { useState, useCallback, useRef } from 'react'

interface PredictionResult {
  symbol: string
  currentPrice: number
  predictedPrice: number
  confidence: number
  change: number
  changePercent: number
  trend: 'up' | 'down' | 'neutral'
}

// Simple in-memory cache with TTL
const cache = new Map<string, { data: PredictionResult; timestamp: number }>()
const CACHE_TTL = 30000 // 30 seconds

export const useStockPrediction = () => {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const predict = useCallback(async (symbol: string) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const cacheKey = symbol.toUpperCase()
    const cachedResult = cache.get(cacheKey)
    
    // Return cached result if still valid
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_TTL) {
      setPrediction(cachedResult.data)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)
    
    // Create new abort controller for this request
    abortControllerRef.current = new AbortController()
    
    try {
      // Simulate API delay with optimized mock data
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return
      }

      const result = await generateMockPrediction(symbol)
      
      // Cache the result
      cache.set(cacheKey, { data: result, timestamp: Date.now() })
      
      setPrediction(result)
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError('Failed to fetch prediction. Please try again.')
      }
    } finally {
      setLoading(false)
      abortControllerRef.current = null
    }
  }, [])

  return { prediction, loading, error, predict }
}

// Optimized mock prediction generator
const generateMockPrediction = async (symbol: string): Promise<PredictionResult> => {
  // Simulate more realistic stock prices based on symbol
  const basePrice = getBasePriceForSymbol(symbol)
  const volatility = 0.15 // 15% volatility
  
  const randomFactor = (Math.random() - 0.5) * volatility
  const currentPrice = basePrice * (1 + randomFactor * 0.5)
  const predictedPrice = basePrice * (1 + randomFactor)
  
  const change = predictedPrice - currentPrice
  const changePercent = (change / currentPrice) * 100
  
  let trend: 'up' | 'down' | 'neutral'
  if (changePercent > 1) trend = 'up'
  else if (changePercent < -1) trend = 'down'
  else trend = 'neutral'

  const confidence = Math.floor(75 + Math.random() * 20) // 75-95% confidence

  return {
    symbol: symbol.toUpperCase(),
    currentPrice: Math.round(currentPrice * 100) / 100,
    predictedPrice: Math.round(predictedPrice * 100) / 100,
    confidence,
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
    trend
  }
}

const getBasePriceForSymbol = (symbol: string): number => {
  // Create deterministic but varied base prices for different symbols
  const hash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return 50 + (hash % 200) + (hash % 50) * 0.01
}