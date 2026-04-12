import { motion } from 'motion/react'
import { Star, Quote } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { useScrollAnimation, fadeInUp, staggerContainer } from '../../hooks/useScrollAnimation'

const testimonials = [
  {
    quote: "Ricky built our entire AI coaching platform from scratch. Session planning, drill recommendations, player tracking — all powered by Claude AI. It's transformed how I work with my players.",
    name: 'Kim',
    role: 'Personal Trainer & Coach',
    project: 'THRYVE',
    gradient: 'from-purple to-cyan',
  },
  {
    quote: "The video analysis tool picks up things I miss during matches. Formation detection, player tracking, automated performance reports — it's like having an analyst on the bench with me.",
    name: 'Grassroots Manager',
    role: 'U14 Football Coach',
    project: 'Manager Mentor',
    gradient: 'from-cyan to-accent',
  },
  {
    quote: "We went from a basic website to a full booking platform with automated SEO generating hundreds of location pages. Our online enquiries tripled within weeks of launch.",
    name: 'Astra Removals',
    role: 'South UK Removals',
    project: 'Astra Platform',
    gradient: 'from-accent to-purple',
  },
]

export function Testimonials() {
  const { ref, controls } = useScrollAnimation()

  return (
    <section id="testimonials" className="py-24 px-6 bg-bg-secondary/50">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          label="Testimonials"
          title="What Clients Say"
          description="Real feedback from real projects we've shipped."
        />

        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={fadeInUp}>
              <div className="bg-bg-card backdrop-blur-sm border border-border-subtle rounded-2xl p-6 h-full flex flex-col hover:border-purple/30 transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-accent text-accent" />
                  ))}
                </div>

                <Quote size={20} className="text-purple/40 mb-3" />

                <p className="text-text-secondary text-sm leading-relaxed flex-1 mb-6">
                  {t.quote}
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-border-subtle">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-sm font-bold text-white">{t.name[0]}</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-text-muted">{t.role}</div>
                  </div>
                  <span className="ml-auto px-2 py-0.5 rounded-full text-xs bg-purple/10 text-accent border border-purple/20">
                    {t.project}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
