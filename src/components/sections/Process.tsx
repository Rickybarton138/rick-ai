import { motion } from 'motion/react'
import { Search, PenTool, Code2, Rocket } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { useScrollAnimation, fadeInUp, staggerContainer } from '../../hooks/useScrollAnimation'

const steps = [
  {
    icon: Search,
    title: 'Discovery',
    description: 'We dig into your problem, understand your users, and identify where AI creates the most value.',
    step: '01',
  },
  {
    icon: PenTool,
    title: 'Design',
    description: 'We architect the solution — data pipelines, model selection, UX flows, and technical roadmap.',
    step: '02',
  },
  {
    icon: Code2,
    title: 'Build',
    description: 'Rapid development in focused sprints. Regular demos so you see progress every week.',
    step: '03',
  },
  {
    icon: Rocket,
    title: 'Deploy & Iterate',
    description: 'Ship to production, monitor performance, and continuously improve based on real-world data.',
    step: '04',
  },
]

export function Process() {
  const { ref, controls } = useScrollAnimation()

  return (
    <section id="process" className="py-24 px-6 bg-bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          label="Process"
          title="How We Work"
          description="A proven process that takes you from idea to production-ready AI application."
        />

        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, i) => (
            <motion.div key={step.title} variants={fadeInUp} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-purple/30 to-transparent z-0" />
              )}
              <div className="relative z-10">
                <div className="text-6xl font-black text-purple/10 mb-2">{step.step}</div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple to-cyan flex items-center justify-center mb-4">
                  <step.icon size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
