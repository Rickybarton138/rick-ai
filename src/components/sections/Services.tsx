import { motion } from 'motion/react'
import { SectionHeading } from '../ui/SectionHeading'
import { Card } from '../ui/Card'
import { useScrollAnimation, fadeInUp, staggerContainer } from '../../hooks/useScrollAnimation'
import { services } from '../../data/services'

export function Services() {
  const { ref, controls } = useScrollAnimation()

  return (
    <section id="services" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          label="Services"
          title="What We Build"
          description="End-to-end AI application development, from initial concept to production deployment."
        />

        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => (
            <motion.div key={service.title} variants={fadeInUp}>
              <Card className="h-full">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple/20 to-cyan/20 flex items-center justify-center mb-4">
                  <service.icon size={24} className="text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{service.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
