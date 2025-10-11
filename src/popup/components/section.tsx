import Card from '@/popup/components/card'
import { type ReactNode } from 'react'

interface SectionProps {
  title: string
  children: ReactNode
  className?: string
  icon?: ReactNode
}

function Section({ title, children, className = '', icon }: SectionProps) {
  return (
    <Card className={className}>
      <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {children}
    </Card>
  )
}

export default Section
