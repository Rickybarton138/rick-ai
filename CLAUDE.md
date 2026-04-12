# Rick.AI — Portfolio & Social Automation Stack

**Description:** Ricky Barton's AI development studio — portfolio site + multi-brand social media automation ecosystem.
**Owner:** Ricky (rickybarton138@btinternet.com)
**Tech Stack:** React 19, Vite 7, Tailwind v4, TypeScript, Motion (animations), Lucide React (icons)
**Social Stack:** n8n workflows, Playwright setup automation, Airtable CRM, multi-platform APIs

## Agent Behaviour Rules

### 1. Plan Mode Default
- Enter plan mode for 3+ step tasks; stop and re-plan on failure

### 2. Subagent Strategy
- Offload research/exploration to subagents; one task per subagent

### 3. Self-Improvement Loop
- After any user correction, update `tasks/lessons.md`; review lessons each session

### 4. Verification Before Done
- Prove it works before marking complete; run build, check for TS errors

### 5. Demand Elegance (Balanced)
- Challenge hacky solutions on non-trivial changes; skip for simple fixes

### 6. Autonomous Bug Fixing
- Just fix bugs using logs/errors/tests; zero context switching from user

## Task Management
- `tasks/todo.md` — Plans and progress
- `tasks/lessons.md` — Captured lessons

## Core Principles
- **Simplicity First** — Minimise code impact
- **No Laziness** — Find root causes, senior-level standards
- **Brand Consistency** — Purple/cyan gradient system, dark theme, glassmorphism

## Project Structure
```
rick-ai/
├── src/                    # React portfolio site
│   ├── components/
│   │   ├── layout/         # Navbar, Footer
│   │   ├── sections/       # Hero, Services, Process, Portfolio, TechStack, About, Contact
│   │   └── ui/             # Button, Card, GradientText, SectionHeading, ParticleBackground
│   ├── data/               # portfolio.ts, services.ts, techStack.ts
│   └── hooks/              # useScrollAnimation
├── social-setup/           # Multi-brand social automation
│   ├── *.n8n.json          # n8n workflow files
│   ├── env-templates/      # Per-brand env var templates
│   ├── checklists/         # Setup checklists
│   ├── airtable-schemas/   # CRM table definitions
│   └── pinterest-boards/   # Board configs
└── vercel.json             # Deployment config
```

## Deployment
- **Site:** Vercel (SPA rewrite configured)
- **Social:** Self-hosted n8n (workflows ready to import)
