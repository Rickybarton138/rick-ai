import { motion } from 'motion/react'
import { ArrowRight, Zap } from 'lucide-react'
import { GradientText } from '../ui/GradientText'
import { Button } from '../ui/Button'
import { ParticleBackground } from '../ui/ParticleBackground'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleBackground />

      <div className="absolute inset-0 bg-gradient-to-b from-purple/5 via-transparent to-bg-primary pointer-events-none" />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple/10 border border-purple/20 mb-8"
        >
          <Zap size={14} className="text-accent" />
          <span className="text-sm text-text-secondary">AI-Powered Development Studio</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6"
        >
          We Build{' '}
          <GradientText>AI Apps</GradientText>
          <br />
          That Actually Ship
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10"
        >
          From concept to production — we design, build, and deploy custom AI applications
          that solve real problems and drive measurable results.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button href="#contact" variant="primary">
            Start Your Project <ArrowRight size={16} />
          </Button>
          <Button href="#portfolio" variant="secondary">
            View Our Work
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-20 flex items-center justify-center gap-8 text-text-muted text-sm"
        >
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-text-primary">10+</span>
            <span>AI Apps Built</span>
          </div>
          <div className="w-px h-10 bg-border-subtle" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-text-primary">100%</span>
            <span>Shipped</span>
          </div>
          <div className="w-px h-10 bg-border-subtle" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-text-primary">UK</span>
            <span>Based</span>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border-2 border-text-muted flex items-start justify-center pt-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-text-muted" />
        </motion.div>
      </div>
    </section>
  )
}
