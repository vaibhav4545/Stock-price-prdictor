import { useState, useCallback, useMemo, memo } from 'react'
import { TrendingUp, DollarSign, BarChart3, AlertCircle } from 'lucide-react'
import Card from './ui/Card'
import Button from './ui/Button'
import Input from './ui/Input'
import { useStockPrediction } from '../hooks/useStockPrediction'
import { formatCurrency } from '../utils/formatters'



const StockPredictor = memo(() => {
  const [symbol, setSymbol] = useState('')
  const { prediction, loading, error, predict } = useStockPrediction()

  const handleSymbolChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSymbol(e.target.value.toUpperCase())
  }, [])

  const handlePredict = useCallback(async () => {
    if (symbol.trim()) {
      await predict(symbol.trim())
    }
  }, [symbol, predict])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePredict()
    }
  }, [handlePredict])

  const isValidSymbol = useMemo(() => {
    return symbol.length >= 1 && symbol.length <= 5 && /^[A-Z]+$/.test(symbol)
  }, [symbol])

  const predictionStats = useMemo(() => {
    if (!prediction) return null

    return {
      formattedCurrent: formatCurrency(prediction.currentPrice),
      formattedPredicted: formatCurrency(prediction.predictedPrice),
      formattedChange: formatCurrency(Math.abs(prediction.change)),
      trendIcon: prediction.trend === 'up' ? TrendingUp : prediction.trend === 'down' ? TrendingUp : BarChart3,
      trendColor: prediction.trend === 'up' ? 'text-green-400' : prediction.trend === 'down' ? 'text-red-400' : 'text-yellow-400'
    }
  }, [prediction])

  return (
    <div className="max-w-4xl mx-auto animate-slide-up">
      <Card className="p-8 mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
            <BarChart3 className="mr-2" />
            Stock Price Prediction
          </h2>
          <p className="text-gray-400">
            Enter a stock symbol to get an AI-powered price prediction
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Enter stock symbol (e.g., AAPL)"
              value={symbol}
              onChange={handleSymbolChange}
              onKeyPress={handleKeyPress}
              error={symbol && !isValidSymbol ? 'Please enter a valid stock symbol' : undefined}
              helperText="1-5 uppercase letters only"
            />
          </div>
          <Button
            onClick={handlePredict}
            disabled={!isValidSymbol || loading}
            loading={loading}
            size="lg"
            className="sm:w-auto w-full"
          >
            Predict Price
          </Button>
        </div>

        {error && (
          <Card variant="solid" className="p-4 mb-6 border-red-500/30 bg-red-900/20">
            <div className="flex items-center text-red-400">
              <AlertCircle className="mr-2 h-5 w-5" />
              <span>{error}</span>
            </div>
          </Card>
        )}

        {prediction && predictionStats && (
          <Card variant="glass" className="p-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <DollarSign className="mx-auto h-8 w-8 text-blue-400 mb-2" />
                <h3 className="text-lg font-semibold text-white mb-1">Current Price</h3>
                <p className="text-2xl font-bold text-blue-400">{predictionStats.formattedCurrent}</p>
              </div>

              <div className="text-center">
                <predictionStats.trendIcon className={`mx-auto h-8 w-8 ${predictionStats.trendColor} mb-2`} />
                <h3 className="text-lg font-semibold text-white mb-1">Predicted Price</h3>
                <p className={`text-2xl font-bold ${predictionStats.trendColor}`}>
                  {predictionStats.formattedPredicted}
                </p>
              </div>

              <div className="text-center">
                <BarChart3 className="mx-auto h-8 w-8 text-purple-400 mb-2" />
                <h3 className="text-lg font-semibold text-white mb-1">Confidence</h3>
                <p className="text-2xl font-bold text-purple-400">{prediction.confidence}%</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Price Change:</span>
                <span className={`font-semibold ${predictionStats.trendColor}`}>
                  {prediction.change >= 0 ? '+' : '-'}{predictionStats.formattedChange} ({prediction.changePercent >= 0 ? '+' : ''}{prediction.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </Card>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center hover:scale-105 transition-transform">
          <TrendingUp className="mx-auto h-12 w-12 text-green-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">AI-Powered</h3>
          <p className="text-gray-400 text-sm">
            Advanced algorithms analyze market patterns and trends
          </p>
        </Card>

        <Card className="p-6 text-center hover:scale-105 transition-transform">
          <BarChart3 className="mx-auto h-12 w-12 text-blue-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Real-time Data</h3>
          <p className="text-gray-400 text-sm">
            Get predictions based on the latest market information
          </p>
        </Card>

        <Card className="p-6 text-center hover:scale-105 transition-transform">
          <DollarSign className="mx-auto h-12 w-12 text-purple-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">High Accuracy</h3>
          <p className="text-gray-400 text-sm">
            Our models achieve high accuracy rates in price predictions
          </p>
        </Card>
      </div>
    </div>
  )
})

StockPredictor.displayName = 'StockPredictor'

export default StockPredictor