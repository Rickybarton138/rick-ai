# Rick.AI — Master Task List
> Last updated: 2026-03-19

---

## PRIORITY 1 — Security & Housekeeping

- [x] **Add `.gitignore`** for `social-setup/.env`, `social-setup/node_modules/`, `rick-ai-social-stack.zip` ✅
- [x] **Clean exposed API key** from `social-setup/.env` (replaced with placeholder) ✅
- [x] **Create `tasks/lessons.md`** ✅
- [ ] **Rotate Anthropic API key** — old key was in plaintext, now removed but should be rotated on Anthropic dashboard ⚠️ NEEDS RICKY
- [ ] **Commit all work** — everything is ready to commit
- [ ] **Remove `rick-ai-social-stack.zip`** from repo root (or leave gitignored)

---

## PRIORITY 2 — Portfolio Site (rick-ai)

- [x] **Review & finalize Pricing section** — clean, follows design system ✅
- [x] **Review & finalize Testimonials section** — clean, follows design system ✅
- [x] **Update portfolio data** — added Magna Park, Transport Manager, MoveScan; removed StorySync. All 10 projects now listed ✅
- [x] **Update Navbar** — added Pricing link (replaced Process) for better conversion flow ✅
- [x] **Check Contact form** — Formspree integration solid, error handling good ✅
- [x] **Build passes** — zero TS/lint errors ✅
- [ ] **Build & deploy to Vercel** — verify live site is working ⚠️ NEEDS RICKY (may need auth)
- [ ] **Custom domain** — connect rick.ai or similar if purchased ⚠️ NEEDS RICKY

---

## PRIORITY 3 — Social Stack: Build Phase (COMPLETED)

- [x] **Airtable schema: Astra** — existed ✅
- [x] **Airtable schema: CoachMentor** — existed ✅
- [x] **Airtable schema: Rick.AI** — existed ✅
- [x] **Airtable schema: Magna Park** — BUILT. Storage-specific: unit availability, enquiries, seasonal campaigns ✅
- [x] **Airtable schema: Prime Haul** — BUILT. Marketplace-specific: surveys, removal companies, social runs ✅
- [x] **n8n workflow: Astra/Magna** — existed ✅
- [x] **n8n workflow: CoachMentor** — existed (3 sub-workflows) ✅
- [x] **n8n workflow: Prime Haul** — BUILT. Webhook → Claude → FB/IG/Pinterest + TikTok placeholder → Airtable. Fixed merge node for dedup ✅
- [x] **n8n workflow: Rick.AI** — BUILT. Weekly content engine + engagement monitor. Fixed invalid JSON, added missing posting nodes (Wed-Sat), updated LinkedIn API ✅
- [x] **Setup scripts** — `setup-orchestrator.js` + `setup-api-tokens.js` reviewed ✅

---

## PRIORITY 4 — Social Stack: Astra Removals (Start Here)
> Simplest brand — 3 platforms, workflow already built. ALL NEED RICKY.

### Phase 1: Account Setup
- [ ] Confirm personal Facebook account exists as admin
- [ ] Create/verify Facebook Business Page (Page ID already captured: `342442165626635`)
- [ ] Create Instagram Business account + link to FB Page
- [ ] Create Google account for Google My Business
- [ ] Claim & verify Google My Business listing (postcard/phone — takes days)

### Phase 2: API Access
- [ ] Create Meta Developer App at developers.facebook.com
- [ ] Generate long-lived FB Page Access Token (60-day → exchange for permanent)
- [ ] Enable Instagram Graph API
- [ ] Set up Google Cloud Console project + Business Profile API
- [ ] Set up Twilio account + buy number (for review SMS)
- [ ] Create Airtable base using `airtable-schemas/airtable-schema-astra.json`

### Phase 3: n8n Setup
- [ ] Self-host n8n (or use n8n cloud)
- [ ] Add all Astra env variables to n8n
- [ ] Create Anthropic, Airtable, Twilio credentials in n8n
- [ ] Import `astra-magna-workflow.n8n.json`
- [ ] Configure MoveScan webhook URL
- [ ] Test run with sample lead payload

### Phase 4: Content Assets
- [ ] Upload profile/cover photos (FB, IG, GMB)
- [ ] Populate all bios (or run `setup-orchestrator.js --brand astra`)
- [ ] Create pinned welcome post on Facebook

---

## PRIORITY 5 — Social Stack: Magna Park Self Storage

### Phase 1: Account Setup
- [ ] Facebook Business Page
- [ ] Instagram Business + link to FB
- [ ] LinkedIn Company Page
- [ ] Google My Business listing (verify)

### Phase 2: API Access
- [ ] Meta Developer App tokens (FB + IG)
- [ ] LinkedIn OAuth credentials
- [ ] GMB API credentials
- [ ] Airtable base from `airtable-schema-magna.json`

### Phase 3: n8n Setup
- [ ] Magna workflows are inside `astra-magna-workflow.n8n.json` (cross-brand Dorset upsell node)
- [ ] Add Magna env variables
- [ ] Test Dorset postcode → Magna upsell flow

### Phase 4: Content Assets
- [ ] Profile/cover photos for all platforms
- [ ] Bios populated

---

## PRIORITY 6 — Social Stack: CoachMentor

### Phase 1: Account Setup
- [ ] Facebook Business Page
- [ ] Instagram Business
- [ ] TikTok Business account (phone verify — manual)
- [ ] YouTube channel
- [ ] X/Twitter account (phone verify — manual)
- [ ] Pinterest Business account

### Phase 2: API Access
- [ ] Meta tokens (FB + IG)
- [ ] **Apply for TikTok Business API early** (1-2 week approval)
- [ ] YouTube Data API v3 + OAuth
- [ ] Twitter API v2 credentials (5 keys needed)
- [ ] Pinterest API token
- [ ] Airtable base from `airtable-schema-coachmentor.json`

### Phase 3: n8n Setup
- [ ] Import `coachmentor-workflow.n8n.json` (3 workflows: weekly content, engagement DMs, match-day)
- [ ] Add all CoachMentor env variables
- [ ] Test Workflow A (Mon 07:00 cron → content generation → originality gate)
- [ ] Test Workflow B (engagement poll → intent classify → DM funnel)
- [ ] Test Workflow C (Fri fixture check → match-day content)

### Phase 4: Email Sequences
- [ ] Set up Mailchimp or SendGrid
- [ ] Import trial onboarding sequence (6 emails, `coachmentor-emails.html`)
- [ ] Import welcome/retention sequence (4 emails, `coachmentor-welcome-sequence.html`)
- [ ] Connect to CoachMentor signup webhook

### Phase 5: Content Assets
- [ ] Profile/cover photos + bios across all 6 platforms
- [ ] Pinterest boards created (run `npm run boards:coachmentor`)

---

## PRIORITY 7 — Social Stack: Prime Haul / MoveScan

### Phase 1: Account Setup
- [ ] Facebook Business Page
- [ ] Instagram Business
- [ ] TikTok Business (phone verify — manual)
- [ ] Pinterest Business

### Phase 2: API Access
- [ ] Meta tokens
- [ ] TikTok Business API (apply early)
- [ ] Pinterest API token
- [ ] Supabase connection configured

### Phase 3: n8n Setup
- [ ] Import `primehaul-workflow.n8n.json`
- [ ] Add env variables
- [ ] Test lead → social post pipeline

---

## PRIORITY 8 — Rick.AI Brand Social Presence

- [ ] Set up Rick.AI social accounts (portfolio brand)
- [ ] Use `setup-checklist-rickai.txt` and `airtable-schema-rickai.json`
- [ ] Import `rickai-workflow.n8n.json` (weekly content engine + engagement monitor)
- [ ] Automate dev/AI content posting (showcase projects, behind-the-scenes)

---

## ONGOING / NICE-TO-HAVE

- [ ] **Slack integration** — set up `#social-review` and `#coach-content-review` channels for human review alerts
- [ ] **ManyChat** — chatbot automation for FB Messenger (CoachMentor funnel)
- [ ] **Predis.ai / Fal.ai** — AI image generation for social posts
- [ ] **Analytics dashboard** — build or connect social metrics tracking
- [ ] **Token refresh automation** — Meta tokens expire; build auto-refresh flow in n8n
