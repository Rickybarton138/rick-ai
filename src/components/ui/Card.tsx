import { motion } from 'motion/react'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <motion.div
      className={`bg-bg-card backdrop-blur-sm border border-border-subtle rounded-2xl p-6 ${hover ? 'hover:border-purple/30 hover:bg-white/[0.07] transition-all duration-300' : ''} ${className}`}
      whileHover={hover ? { y: -4 } : undefined}
    >
      {children}
    </motion.div>
  )
}
