# Rick.AI — Social Media Account Setup Scripts

Playwright MCP + Claude API automation for setting up all 4 brand social accounts.

## Brands
- **Astra Removals** — FB Page, Instagram Business, Google Business
- **Magna Park** — FB Page, Instagram, LinkedIn Company, Google Business
- **Prime Haul / MoveScan** — FB Page, Instagram, TikTok, Pinterest
- **CoachMentor** — FB Page, Instagram, YouTube, TikTok, X/Twitter

---

## Prerequisites

```bash
# Install dependencies
npm install

# Install Chromium browser
npx playwright install chromium

# Create .env file
cp .env.example .env
# Add your ANTHROPIC_API_KEY
```

---

## Quick Start

### 1. Generate all config files first (no browser needed)
```bash
npm run tokens:all
```
This creates:
- `env-templates/env-template-{brand}.env` — paste into n8n
- `checklists/setup-checklist-{brand}.txt` — tick-box guide
- `airtable-schemas/` — Airtable table structures
- `pinterest-boards/` — Board configs

### 2. Run setup for each brand
```bash
npm run setup:astra
npm run setup:magna
npm run setup:primhaul
npm run setup:coachmentor
```

The browser opens in **non-headless mode** — you can watch, verify, and complete manual steps (phone verification, password entry) when prompted. Press ENTER to proceed past each checkpoint.

### 3. Create Pinterest boards (after getting Pinterest access token)
```bash
# Add PINTEREST_ACCESS_TOKEN_PRIMHAUL= to your .env first
npm run boards:primhaul

# Same for CoachMentor
npm run boards:coachmentor
```

---

## What Each Script Automates

| Platform | Automated | Manual Required |
|---|---|---|
| Facebook Page | Name, category, description, website, CTA | Personal account login (one-time) |
| Instagram Business | Bio, website, profile save | Switch to Business + FB link (one-time) |
| LinkedIn Company | Name, tagline, description, website, size | Personal account login (one-time) |
| X / Twitter | Name, bio, location, website | Account creation + phone verify |
| YouTube Channel | Name, description, website link | Google account + Brand Account creation |
| TikTok | Bio fill (Stagehand) | Account creation + phone verify + API approval |
| Pinterest | Account setup, board creation via API | Email verify |
| Google Business | Business name, initiate claim | Postcard/phone verification |

---

## After Setup — Get Your n8n Tokens

### Facebook Long-Lived Token
```
1. Go to: developers.facebook.com/tools/explorer
2. Generate User Token with pages_manage_posts, pages_read_engagement
3. Exchange for Long-Lived Token:
   GET https://graph.facebook.com/oauth/access_token
     ?grant_type=fb_exchange_token
     &client_id={APP_ID}
     &client_secret={APP_SECRET}
     &fb_exchange_token={SHORT_LIVED_TOKEN}
4. Get Page Token from User Token:
   GET https://graph.facebook.com/{PAGE_ID}?fields=access_token&access_token={LONG_LIVED_USER_TOKEN}
```

### Instagram Account ID
```
GET https://graph.facebook.com/v19.0/me/accounts?access_token={PAGE_TOKEN}
# Find 'instagram_business_account' > 'id'
```

### YouTube Refresh Token
```
1. Google Cloud Console → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Add redirect URI: http://localhost:3000/callback
4. Run OAuth flow to get refresh token
5. Store as YOUTUBE_REFRESH_TOKEN_COACHMENTOR
```

### Twitter/X API v2
```
1. developer.twitter.com → Create App
2. Free tier: 1,500 post/month (sufficient for CoachMentor)
3. Generate Access Token + Secret from app settings
```

---

## File Structure

```
social-setup/
├── setup-orchestrator.js     # Main browser automation script
├── setup-api-tokens.js       # Token config + Pinterest boards
├── package.json
├── .env                      # Your secrets (git-ignored)
├── auth-state-{brand}.json   # Saved browser sessions (git-ignored)
├── setup-logs/               # JSON run logs
├── env-templates/            # n8n env var templates (generated)
├── checklists/               # Setup checklists (generated)
├── airtable-schemas/         # Airtable table structures (generated)
└── pinterest-boards/         # Pinterest board configs (generated)
```

---

## Tips

- Run one brand at a time — don't rush
- Keep the browser window visible during setup
- Auth state is saved after each run — reopening browser keeps you logged in
- All logs are in `setup-logs/setup-{date}.json`
- If a step fails, check the log and resume manually from that point

---

## Your MCP Stack Integration

Since you already have **Playwright MCP** in your VS Code + Claude Code setup, you can also run these steps interactively:

```bash
# In Claude Code terminal (with MCP servers active):
claude --mcp playwright

# Then describe what you want:
# "Go to facebook.com/pages/create and fill in Astra Removals page details"
# Claude will use Playwright MCP to control the browser directly
```

This is the most flexible approach for one-off setup tasks.
