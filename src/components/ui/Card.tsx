import { forwardRef, memo, ReactNode } from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'default' | 'glass' | 'solid'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', children, ...props }, ref) => {
    const baseStyles = 'rounded-xl shadow-lg transition-all duration-300'
    
    const variants = {
      default: 'bg-gray-800/90 backdrop-blur-sm border border-gray-700/50',
      glass: 'bg-white/10 backdrop-blur-md border border-white/20',
      solid: 'bg-gray-800 border border-gray-700'
    }

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default memo(Card)