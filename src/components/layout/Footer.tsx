import { Github, Linkedin, Mail } from 'lucide-react'
import { GradientText } from '../ui/GradientText'

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg-secondary/50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <a href="#" className="text-xl font-bold tracking-tight">
              <GradientText>RICK</GradientText>
              <span className="text-text-primary">.AI</span>
            </a>
            <p className="text-text-muted text-sm mt-1">Custom AI App Development</p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Rickybarton138"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-text-primary transition-colors p-2 rounded-lg hover:bg-bg-card"
            >
              <Github size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-text-primary transition-colors p-2 rounded-lg hover:bg-bg-card"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="mailto:rickybarton138@btinternet.com"
              className="text-text-muted hover:text-text-primary transition-colors p-2 rounded-lg hover:bg-bg-card"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">
            &copy; {new Date().getFullYear()} RICK.AI. All rights reserved.
          </p>
          <p className="text-text-muted text-xs">
            Built with AI
          </p>
        </div>
      </div>
    </footer>
  )
}
