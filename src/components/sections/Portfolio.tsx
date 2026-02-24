import { motion } from 'motion/react'
import { ExternalLink } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { useScrollAnimation, fadeInUp, staggerContainer } from '../../hooks/useScrollAnimation'
import { portfolio } from '../../data/portfolio'

export function Portfolio() {
  const { ref, controls } = useScrollAnimation()

  return (
    <section id="portfolio" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          label="Portfolio"
          title="Our Work"
          description="Real projects we've built — from computer vision to generative AI."
        />

        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {portfolio.map((project) => (
            <motion.div key={project.title} variants={fadeInUp}>
              <div className="group relative bg-bg-card backdrop-blur-sm border border-border-subtle rounded-2xl overflow-hidden hover:border-purple/30 transition-all duration-300">
                <div className={`h-48 bg-gradient-to-br ${project.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />

                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink size={18} className="text-text-muted" />
                </div>

                <div className="p-6 -mt-12 relative">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple/10 text-accent border border-purple/20 mb-3">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">{project.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 text-text-muted border border-border-subtle"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
