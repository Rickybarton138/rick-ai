import { motion } from 'motion/react'
import { Zap, Rocket, RefreshCw, Check } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { useScrollAnimation, fadeInUp, staggerContainer } from '../../hooks/useScrollAnimation'
import { GradientText } from '../ui/GradientText'

const plans = [
  {
    icon: Zap,
    name: 'MVP Sprint',
    price: '£2,500',
    period: 'one-off',
    description: 'Go from idea to working prototype in 2-4 weeks.',
    features: [
      'Discovery call & scoping',
      'Core feature build',
      'AI integration (LLM or Vision)',
      'Responsive UI',
      'Deployed & live',
      'Source code handover',
    ],
    gradient: 'from-purple to-cyan',
    popular: false,
  },
  {
    icon: Rocket,
    name: 'Full Build',
    price: '£7,500',
    period: 'one-off',
    description: 'Production-ready app with auth, payments, and AI.',
    features: [
      'Everything in MVP Sprint',
      'User auth & database',
      'Stripe payments',
      'Admin dashboard',
      'SEO & analytics',
      'Social media automation',
      '30 days post-launch support',
    ],
    gradient: 'from-cyan to-accent',
    popular: true,
  },
  {
    icon: RefreshCw,
    name: 'Retainer',
    price: '£1,500',
    period: '/month',
    description: 'Ongoing development, maintenance, and new features.',
    features: [
      'Priority Slack/email support',
      'Feature development',
      'Bug fixes & monitoring',
      'AI model updates',
      'Performance optimisation',
      'Monthly progress report',
    ],
    gradient: 'from-accent to-purple',
    popular: false,
  },
]

export function Pricing() {
  const { ref, controls } = useScrollAnimation()

  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          label="Pricing"
          title="Simple, Transparent Pricing"
          description="No hidden fees. No hourly billing. Just clear deliverables."
        />

        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {plans.map((plan) => (
            <motion.div key={plan.name} variants={fadeInUp}>
              <div className={`relative bg-bg-card backdrop-blur-sm border rounded-2xl p-7 h-full flex flex-col transition-all duration-300 hover:border-purple/30 ${plan.popular ? 'border-purple/40 shadow-[0_0_40px_rgba(124,58,237,0.15)]' : 'border-border-subtle'}`}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple to-cyan text-white">
                    Most Popular
                  </span>
                )}

                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4`}>
                  <plan.icon size={20} className="text-white" />
                </div>

                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-text-muted text-sm mb-4">{plan.description}</p>

                <div className="mb-6">
                  <GradientText className="text-3xl font-black">{plan.price}</GradientText>
                  <span className="text-text-muted text-sm ml-1">{plan.period}</span>
                </div>

                <ul className="space-y-3 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-text-secondary">
                      <Check size={16} className="text-accent flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`block text-center px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${plan.popular
                    ? 'bg-gradient-to-r from-purple to-cyan text-white hover:shadow-[0_0_30px_rgba(124,58,237,0.4)]'
                    : 'border border-border-subtle text-text-primary hover:bg-bg-card hover:border-purple/40'
                  }`}
                >
                  Get Started
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
