import { motion } from 'motion/react'
import { useScrollAnimation, fadeInUp } from '../../hooks/useScrollAnimation'

interface SectionHeadingProps {
  label: string
  title: string
  description?: string
}

export function SectionHeading({ label, title, description }: SectionHeadingProps) {
  const { ref, controls } = useScrollAnimation()

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={fadeInUp}
      className="text-center mb-16"
    >
      <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-purple/10 text-purple border border-purple/20 mb-4">
        {label}
      </span>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </motion.div>
  )
}
