import { motion } from 'motion/react'
import { SectionHeading } from '../ui/SectionHeading'
import { useScrollAnimation, scaleIn, staggerContainer } from '../../hooks/useScrollAnimation'
import { techStack } from '../../data/techStack'

const categoryColors: Record<string, string> = {
  'AI/ML': 'from-purple to-cyan',
  Backend: 'from-cyan to-accent',
  Frontend: 'from-accent to-purple',
  Language: 'from-purple to-accent',
  Database: 'from-cyan to-purple',
  DevOps: 'from-accent to-cyan',
  Deploy: 'from-purple to-cyan',
  Tooling: 'from-cyan to-accent',
}

export function TechStack() {
  const { ref, controls } = useScrollAnimation()

  return (
    <section id="tech" className="py-24 px-6 bg-bg-secondary/30">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          label="Tech Stack"
          title="Tools We Use"
          description="Battle-tested technologies for building production-grade AI systems."
        />

        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={staggerContainer}
          className="flex flex-wrap justify-center gap-3"
        >
          {techStack.map((tech) => (
            <motion.div
              key={tech.name}
              variants={scaleIn}
              whileHover={{ scale: 1.05, y: -2 }}
              className="group px-5 py-3 rounded-xl bg-bg-card border border-border-subtle hover:border-purple/30 transition-all duration-300 cursor-default"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${categoryColors[tech.category] || 'from-purple to-cyan'}`} />
                <span className="text-sm font-medium text-text-primary">{tech.name}</span>
                <span className="text-xs text-text-muted hidden group-hover:inline transition-all">{tech.category}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
