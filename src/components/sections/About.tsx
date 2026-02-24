import { motion } from 'motion/react'
import { Code2, Cpu, Trophy } from 'lucide-react'
import { useScrollAnimation, fadeInUp } from '../../hooks/useScrollAnimation'
import { SectionHeading } from '../ui/SectionHeading'

export function About() {
  const { ref, controls } = useScrollAnimation()

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          label="About"
          title="The Person Behind the AI"
        />

        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={fadeInUp}
          className="bg-bg-card backdrop-blur-sm border border-border-subtle rounded-2xl p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple to-cyan flex items-center justify-center flex-shrink-0">
              <span className="text-3xl font-black text-white">R</span>
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-1">Ricky Barton</h3>
              <p className="text-accent text-sm font-medium mb-4">Founder & AI Developer</p>

              <p className="text-text-secondary leading-relaxed mb-6">
                I'm a full-stack developer with a passion for artificial intelligence. I build custom AI applications
                that solve real-world problems — from computer vision systems that analyse sports footage in real-time,
                to AI-powered platforms that help coaches develop their players. Every project is built with production
                quality, performance, and real user value in mind.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-border-subtle">
                  <Code2 size={18} className="text-purple" />
                  <div>
                    <div className="text-sm font-semibold">Full-Stack</div>
                    <div className="text-xs text-text-muted">React, Python, Node.js</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-border-subtle">
                  <Cpu size={18} className="text-cyan" />
                  <div>
                    <div className="text-sm font-semibold">AI/ML</div>
                    <div className="text-xs text-text-muted">LLMs, Vision, NLP</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-border-subtle">
                  <Trophy size={18} className="text-accent" />
                  <div>
                    <div className="text-sm font-semibold">Shipped</div>
                    <div className="text-xs text-text-muted">10+ AI apps live</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
