import { motion } from 'motion/react'
import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  href?: string
  onClick?: () => void
}

export function Button({ children, variant = 'primary', href, onClick }: ButtonProps) {
  const baseClasses = 'inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 cursor-pointer'

  const variants = {
    primary: 'bg-gradient-to-r from-purple to-cyan text-white hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:scale-105',
    secondary: 'border border-border-subtle text-text-primary hover:bg-bg-card hover:border-purple/40 hover:scale-105',
  }

  const classes = `${baseClasses} ${variants[variant]}`

  const Component = motion.create(href ? 'a' : 'button')

  return (
    <Component
      href={href}
      onClick={onClick}
      className={classes}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </Component>
  )
}
