import { memo } from 'react'

export const LoadingSpinner = memo(() => {
  return (
    <div className="flex items-center justify-center py-12" role="status" aria-label="Loading">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <span className="ml-3 text-gray-300 font-medium">Loading...</span>
    </div>
  )
})

LoadingSpinner.displayName = 'LoadingSpinner'