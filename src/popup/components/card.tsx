import { cn } from '@/utils/helper'
import { type ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[#0f0f12] rounded-lg p-5 border border-gray-800',
        className
      )}
    >
      {children}
    </div>
  )
}

export default Card
