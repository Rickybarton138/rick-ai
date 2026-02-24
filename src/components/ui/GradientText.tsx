import type { ReactNode } from 'react'

interface GradientTextProps {
  children: ReactNode
  className?: string
}

export function GradientText({ children, className = '' }: GradientTextProps) {
  return (
    <span className={`bg-gradient-to-r from-purple via-cyan to-accent bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  )
}
