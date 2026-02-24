import { useState, type FormEvent } from 'react'
import { motion } from 'motion/react'
import { Send, Mail, ArrowRight } from 'lucide-react'
import { useScrollAnimation, fadeInUp } from '../../hooks/useScrollAnimation'
import { Button } from '../ui/Button'
import { GradientText } from '../ui/GradientText'

export function Contact() {
  const { ref, controls } = useScrollAnimation()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple/5 to-purple/10 pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-purple/8 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-cyan/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-purple/10 text-purple border border-purple/20 mb-4">
            Get in Touch
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Ready to Build Something{' '}
            <GradientText>Incredible</GradientText>?
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Tell us about your project and we'll get back to you within 24 hours.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-bg-card backdrop-blur-sm border border-purple/20 rounded-2xl p-12 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple to-cyan flex items-center justify-center">
              <Send size={28} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
            <p className="text-text-secondary">We'll be in touch soon. Thanks for reaching out.</p>
          </motion.div>
        ) : (
          <motion.form
            initial="hidden"
            animate={controls}
            variants={fadeInUp}
            onSubmit={handleSubmit}
            className="bg-bg-card backdrop-blur-sm border border-border-subtle rounded-2xl p-8 md:p-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border-subtle text-text-primary placeholder:text-text-muted focus:outline-none focus:border-purple/50 focus:ring-1 focus:ring-purple/30 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border-subtle text-text-primary placeholder:text-text-muted focus:outline-none focus:border-purple/50 focus:ring-1 focus:ring-purple/30 transition-all"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-text-secondary mb-2">Project Details</label>
              <textarea
                required
                rows={5}
                placeholder="Tell us about your project — what problem are you solving, and where does AI fit in?"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border-subtle text-text-primary placeholder:text-text-muted focus:outline-none focus:border-purple/50 focus:ring-1 focus:ring-purple/30 transition-all resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-text-muted text-sm">
                <Mail size={16} />
                <span>or email <a href="mailto:rickybarton138@btinternet.com" className="text-accent hover:underline">rickybarton138@btinternet.com</a></span>
              </div>
              <Button variant="primary" onClick={() => {}}>
                Send Message <ArrowRight size={16} />
              </Button>
            </div>
          </motion.form>
        )}
      </div>
    </section>
  )
}
