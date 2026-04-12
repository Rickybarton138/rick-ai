# Rick.AI Social Automation Stack — Conversation Summary
> Built in Claude.ai · March 2026 · Full session reference

---

## What Was Built

This project was designed and built across a single Claude conversation. It covers the complete social media automation ecosystem for four businesses:

| Brand | Type | Key Platforms |
|---|---|---|
| **Astra Removals** | Removals company, Bournemouth | FB, IG, Google Business |
| **Magna Park Self Storage** | Container storage, Wimborne/Dorset | FB, IG, LinkedIn, GMB |
| **Prime Haul / MoveScan** | Removal leads marketplace | FB, IG, TikTok, Pinterest |
| **CoachMentor** | AI football coaching app £7.99/mo | TikTok, YouTube, IG, X/Twitter |

---

## Research Conducted

1. **AI agentic social media tools 2026** — surveyed Sprout Social, Hootsuite, Beam AI, Opencord AI, ManyChat, Predis.ai, Ocoya, Highperformr, NoimosAI, Soshie
2. **n8n + automation platforms** — compared n8n, Make.com, Zapier, Gumloop, CrewAI, Relay.app, LangChain Social Media Agent
3. **Browser automation agents 2026** — benchmarked Browser Use (50k⭐, 89.1% WebVoyager), Stagehand v3 (Feb 2026 rewrite, 44% faster), Skyvern (vision LLM), Playwright MCP (in Ricky's existing stack), Claude Computer Use
4. **Social platform account setup automation** — mapped what each platform allows via API vs requires browser agent vs requires manual steps

---

## Files Built

### Dashboards & Visualisers
| File | Description |
|---|---|
| `social-agent-hub.html` | Master 4-brand command centre — content queue, metrics, agent log |
| `astra-workflow-viz.html` | Interactive Astra n8n workflow — click nodes, run simulation |
| `magna-movescan-setup-hub.html` | 3-tab hub: Magna workflows, MoveScan TikTok engine, account setup intel |
| `coachmentor-workflow.html` | CoachMentor workflow — football pitch aesthetic, 3 tabbed flows |
| `master-setup-guide.html` | Complete interactive setup guide with clickable checklists |

### n8n Importable Workflows
| File | Workflows Inside |
|---|---|
| `astra-magna-workflow.n8n.json` | MoveScan lead → Claude social post → FB/IG publish → review SMS. Includes Dorset postcode check → Magna upsell cross-brand node |
| `coachmentor-workflow.n8n.json` | **Workflow A:** Mon 07:00 cron → Brave Search → Claude weekly plan → originality gate ≥0.80 → publish all platforms. **Workflow B:** 6h engagement poll → threshold check → Claude intent classify → DM funnel. **Workflow C:** Fri 15:00 fixture check → match-day content |
| `primehaul-workflow.n8n.json` | MoveScan survey complete → Claude social proof content → confidence gate → publish to FB/IG/Pinterest + TikTok placeholder → Airtable CRM log |
| `rickai-workflow.n8n.json` | **Workflow A:** Mon 06:00 cron → Brave Search (AI trends + Claude news) → Claude weekly plan → publish X/LinkedIn/IG/FB/Pinterest + TikTok placeholder. **Workflow B:** 8h engagement poll → X mentions → Claude classify → lead capture → Airtable + Slack alert |

### Email Sequences
| File | Emails | Purpose |
|---|---|---|
| `coachmentor-emails.html` | 6 emails · Days 0,1,3,5,6,7 | Trial onboarding → £7.99/mo conversion |
| `coachmentor-welcome-sequence.html` | 4 emails · Days 0,2,7,30 | Post-conversion activation → retention |

### Airtable Schemas (in `/social-setup/airtable-schemas/`)
| File | Description |
|---|---|
| `airtable-schema-astra.json` | Astra Removals CRM — Social Automation Runs table |
| `airtable-schema-magna.json` | Magna Park Self Storage CRM table |
| `airtable-schema-coachmentor.json` | CoachMentor CRM — Content Automation Runs + Subscribers |
| `airtable-schema-primhaul.json` | Prime Haul CRM — Social Automation Runs (FB/IG/Pinterest/TikTok) |
| `airtable-schema-rickai.json` | Rick.AI CRM — Content Automation Runs + Leads |

### Setup Scripts (in `/social-setup/`)
| File | Purpose |
|---|---|
| `setup-orchestrator.js` | Playwright MCP browser automation — fills all profile fields across FB, IG, LinkedIn, X, YouTube, Pinterest, GMB for all 4 brands |
| `setup-api-tokens.js` | Pinterest board creation via API + env template generator + Airtable schema exporter |
| `package.json` | npm scripts: `setup:astra`, `tokens:all`, `boards:coachmentor` etc. |
| `README.md` | Full setup docs with token guides and run order |
| `.env.example` | All environment variables needed |

---

## Architecture Overview

```
MoveScan survey
      │
      ▼
n8n Webhook ──► Extract lead vars ──► Postcode IF (BH/DT/SP?)
                                              │
                              ┌───────────────┴───────────────┐
                           YES (Magna)                       NO
                           magnaCTA = true             magnaCTA = false
                              └───────────────┬───────────────┘
                                              │
                                      Claude claude-sonnet-4-6
                                    (generates FB + IG post)
                                              │
                                    Confidence gate ≥0.75
                                              │
                                       Smart Scheduler
                                    (Tue-Thu 7:30pm / Sat 10am)
                                              │
                               ┌──────────────┴──────────────┐
                          FB Graph API                  IG Graph API
                               └──────────────┬──────────────┘
                                              │
                                      Wait 48h post-move
                                              │
                                       Twilio review SMS
                                              │
                                    Airtable CRM log
```

---

## Key Design Decisions

- **Cross-brand node**: Astra lead in Dorset → automatically triggers Magna Park storage upsell in FB post. No manual action needed.
- **Confidence/originality gate**: All content scored by Claude (0–1). Below threshold → Slack alert → human review before publish. For CoachMentor specifically, this is a copyright guard against accidentally reproducing FA/UEFA licensed materials.
- **Coach intent gate**: CoachMentor subscriber funnel only sends DMs to users Claude classifies as actual football coaches. Parent and player engagers are tagged for lookalike audiences only.
- **n8n self-hosted recommendation**: Your existing MCP super stack (Playwright, Sequential Thinking, Filesystem, Memory, Context7, Brave Search, GitHub) integrates naturally with n8n self-hosted. Data sovereignty, no per-task fees.

---

## Your Existing Stack (Already Set Up)

- **MCP Servers**: Playwright, Sequential Thinking, Filesystem, Memory, Context7, Brave Search, GitHub
- **Dev environment**: VS Code, React/Vite, GitHub (Rickybarton138), Netlify
- **Projects folder**: `C:/Users/info/rick-ai`
- **CoachMentor**: coachmentor.co.uk · £7.99/mo subscription · Claude API integration
- **Magna Park**: magnaparkselfstore.co.uk · GitHub/Netlify · FormSubmit.co
- **Astra CRM**: React component, Kanban pipeline, dark/orange design (in progress)

---

## Next Steps (Recommended Order)

1. Open `master-setup-guide.html` — work through Phase 1–5 in order
2. Run `npm run tokens:all` in `/social-setup/` to generate all env templates
3. Start with Astra setup (simplest — 3 platforms, workflow already built and tested)
4. Import `astra-magna-workflow.n8n.json` into n8n first to verify the pipeline works
5. Build Airtable bases using schemas in `/social-setup/airtable-schemas/`
6. Set up CoachMentor email sequences in Mailchimp or SendGrid — copy from HTML files
7. Apply for TikTok Business API early (takes 1–2 weeks to approve)

---

## Platforms — Automation Status

| Platform | Method | Auto % | Notes |
|---|---|---|---|
| Facebook Page | Graph API | 90% | Personal admin account required first |
| Instagram Business | Hybrid | 85% | 2 manual steps to link to FB |
| LinkedIn Company | Hybrid | 80% | Arcade auth or manual OAuth |
| X/Twitter | Browser + API | 75% | Phone verify manual; API v2 handles posting |
| YouTube | Hybrid | 85% | Excellent Data API v3 |
| TikTok Business | Browser agent | 60% | Phone verify + API approval (slow) |
| Pinterest | Full API | 95% | Best API of all platforms |
| Google Business | Hybrid | 90% | One-time postcard/phone verify |

---

*All files built and ready. Total estimated setup time: ~12 hours (most of which is waiting for verifications and API approvals rather than active work).*
