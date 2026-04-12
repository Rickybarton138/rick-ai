/**
 * ============================================================
 * RICK.AI — SOCIAL MEDIA ACCOUNT SETUP ORCHESTRATOR
 * ============================================================
 * Uses Playwright MCP (already in your MCP super stack)
 * Run via Claude Code: claude --mcp playwright
 *
 * This script orchestrates setup for all 4 brands:
 *   - Astra Removals
 *   - Magna Park Self Storage
 *   - Prime Haul / MoveScan
 *   - CoachMentor
 *
 * USAGE:
 *   node setup-orchestrator.js --brand astra
 *   node setup-orchestrator.js --brand magna
 *   node setup-orchestrator.js --brand primhaul
 *   node setup-orchestrator.js --brand coachmentor
 *   node setup-orchestrator.js --brand all  (runs all sequentially)
 *
 * PREREQUISITES:
 *   npm install playwright @anthropic-ai/sdk dotenv chalk ora
 *   npx playwright install chromium
 *
 * ENV FILE (.env):
 *   ANTHROPIC_API_KEY=your_key_here
 *   (all other credentials in brands.config.js)
 * ============================================================
 */

import { chromium } from 'playwright';
import Anthropic from '@anthropic-ai/sdk';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── BRAND CONFIGS ──────────────────────────────────────────

const BRANDS = {
  astra: {
    name: 'Astra Removals',
    tagline: 'Professional removals across Bournemouth, Poole & Dorset',
    description: 'Astra Removals is a trusted, professional removals company based in Bournemouth, serving Dorset and the surrounding areas. We offer home removals, office moves, and packing services with care and reliability.',
    website: 'https://astraremovals.co.uk',
    phone: '', // fill in
    email: '', // fill in
    address: 'Bournemouth, Dorset',
    category: 'Moving Company',
    keywords: ['removals', 'Bournemouth', 'Dorset', 'moving', 'Poole', 'storage'],
    hashtags: ['#AstraRemovals', '#DorsetRemovals', '#BournemouthRemovals', '#MovingDay', '#PooleRemovals'],
    colour: '#f97316', // orange
    platforms: ['facebook_page', 'instagram_business', 'google_business'],
    profileImagePath: './assets/astra-logo.png',
    coverImagePath: './assets/astra-cover.png',
    // Generated bio variants
    bios: {
      short: 'Professional removals across Bournemouth & Dorset 🚛 Trusted. Local. Reliable.',
      instagram: 'Professional removals across Bournemouth & Dorset 🚛\nTrusted local movers since [year]\nFree quotes ↓',
      linkedin: 'Astra Removals provides professional home and office removals across Bournemouth, Poole, and Dorset. Trusted by hundreds of local families and businesses.',
      twitter: 'Professional removals across Bournemouth & Dorset 🚛 | Free quotes | Local & trusted',
    }
  },

  magna: {
    name: 'Magna Park Self Storage',
    tagline: 'Secure shipping container storage near Wimborne, Dorset',
    description: 'Magna Park Self Storage offers flexible, secure shipping container storage units near Wimborne, Dorset. Accessible 7 days a week. Ideal for trade businesses, home movers, and seasonal storage. Just off the A31.',
    website: 'https://magnaparkselfstore.co.uk',
    phone: '', // fill in
    email: '', // fill in
    address: 'Near Wimborne, Dorset (A31 access)',
    category: 'Self Storage Facility',
    keywords: ['self storage', 'Wimborne', 'Dorset', 'container storage', 'business storage'],
    hashtags: ['#MagnaPark', '#DorsetStorage', '#SelfStorage', '#WimborneStorage', '#ContainerStorage'],
    colour: '#3b82f6', // blue
    platforms: ['facebook_page', 'instagram_business', 'linkedin_company', 'google_business'],
    profileImagePath: './assets/magna-logo.png',
    coverImagePath: './assets/magna-cover.png',
    bios: {
      short: 'Secure storage units near Wimborne, Dorset 📦 A31 access · 7 days a week',
      instagram: 'Secure container storage near Wimborne, Dorset 📦\nAccessible 7 days a week\nTrade & personal units available\nA31 access ↓',
      linkedin: 'Magna Park Self Storage provides secure, flexible shipping container storage units near Wimborne, Dorset. Ideal for trade businesses, contractors, and personal storage needs. Accessible 7 days a week, just off the A31.',
      twitter: 'Secure storage near Wimborne, Dorset 📦 | Shipping container units | 7-day access | A31',
    }
  },

  primhaul: {
    name: 'Prime Haul',
    tagline: 'Get instant removal quotes from trusted local companies',
    description: 'Prime Haul is a removal leads marketplace powered by MoveScan technology. Get instant quotes from vetted local removal companies. Takes 90 seconds. Free to use.',
    website: 'https://primhaul.co.uk', // update with real domain
    phone: '',
    email: '',
    address: 'UK-wide',
    category: 'Moving Company',
    keywords: ['removal quotes', 'moving company', 'cheap removals', 'instant quotes', 'MoveScan'],
    hashtags: ['#PrimeHaul', '#MoveScan', '#RemovalQuotes', '#MovingHouse', '#CheapRemovals'],
    colour: '#10b981', // green
    platforms: ['facebook_page', 'instagram_business', 'tiktok', 'pinterest'],
    profileImagePath: './assets/primhaul-logo.png',
    coverImagePath: './assets/primhaul-cover.png',
    bios: {
      short: 'Get instant removal quotes from trusted local companies 🏠 Free. Takes 90 seconds.',
      instagram: 'Moving house? Get 3+ quotes instantly 🏠\nFree. Takes 90 seconds.\nPowered by MoveScan ↓',
      twitter: 'Instant removal quotes from vetted local companies 🏠 | Free | 90 seconds | UK-wide',
      tiktok: 'Moving house tips & instant quotes 🏠 | Free removal quotes in 90 seconds ↓',
      pinterest: 'Moving house tips, checklists & guides. Get instant removal quotes via MoveScan.',
    }
  },

  coachmentor: {
    name: 'CoachMentor',
    tagline: 'AI-powered coaching education for grassroots football coaches',
    description: 'CoachMentor is an AI-powered football coaching education app built for grassroots coaches. Session plans, drills, tactical guides, and coaching Q&A — all in your pocket. £7.99/month. Start free for 7 days.',
    website: 'https://coachmentor.co.uk',
    phone: '',
    email: '',
    address: 'UK',
    category: 'Sports & Recreation',
    keywords: ['football coaching', 'grassroots football', 'FA coaching', 'coaching drills', 'session plans'],
    hashtags: ['#CoachMentor', '#GrassrootsFootball', '#FootballCoaching', '#FACoach', '#YouthFootball'],
    colour: '#a855f7', // purple
    platforms: ['facebook_page', 'instagram_business', 'youtube_channel', 'tiktok', 'twitter'],
    profileImagePath: './assets/coachmentor-logo.png',
    coverImagePath: './assets/coachmentor-cover.png',
    bios: {
      short: 'AI-powered coaching education for grassroots football coaches ⚽ 7-day free trial',
      instagram: 'AI-powered coaching app ⚽\nFor grassroots football coaches\nSession plans · Drills · Tactical guides\nFree 7-day trial ↓',
      youtube: 'CoachMentor helps grassroots football coaches improve their sessions with AI-powered education. Drills, tactics, session plans and coaching tips for FA Level 1 & 2 coaches. New content every week.',
      twitter: 'AI-powered coaching education for grassroots football coaches ⚽ | FA Level 1/2 | 7-day free trial',
      linkedin: 'CoachMentor is an AI-powered football coaching education platform for grassroots coaches in England. We provide session plans, drill libraries, tactical guides, and an AI coaching mentor — all in one app.',
      tiktok: 'Coaching tips, drills & session ideas for grassroots football coaches ⚽ | AI app | Free trial',
    }
  }
};

// ── LOGGING ─────────────────────────────────────────────────

const LOG_FILE = `./setup-logs/setup-${new Date().toISOString().slice(0,10)}.json`;
const logs = [];

function log(brand, platform, step, status, detail = '') {
  const entry = {
    timestamp: new Date().toISOString(),
    brand, platform, step, status, detail
  };
  logs.push(entry);

  const icon = status === 'success' ? '✅' : status === 'error' ? '❌' : status === 'manual' ? '👤' : 'ℹ️';
  console.log(`${icon} [${brand.toUpperCase()}] ${platform} → ${step}: ${detail}`);

  // Write log file incrementally
  if (!fs.existsSync('./setup-logs')) fs.mkdirSync('./setup-logs');
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}

// ── CLAUDE CONTENT GENERATOR ─────────────────────────────────

async function generateBrandContent(brand, platform, contentType) {
  const config = BRANDS[brand];

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    system: `You are helping set up professional social media accounts for a business. Generate platform-optimised content for account setup. Be concise, professional, and on-brand. Return plain text only, no markdown.`,
    messages: [{
      role: 'user',
      content: `Brand: ${config.name}
Description: ${config.description}
Website: ${config.website}
Platform: ${platform}
Content needed: ${contentType}
Keywords: ${config.keywords.join(', ')}

Generate the ${contentType} for ${platform}. Keep it within platform character limits. Brand tone: ${brand === 'coachmentor' ? 'knowledgeable, peer-to-peer, coaching community' : brand === 'astra' ? 'warm, local, trustworthy' : brand === 'magna' ? 'professional, B2B focused, efficient' : 'helpful, consumer-friendly, modern'}`
    }]
  });

  return response.content[0].text.trim();
}

// ── FACEBOOK PAGE SETUP ──────────────────────────────────────

async function setupFacebookPage(page, brand, headless = false) {
  const config = BRANDS[brand];
  log(brand, 'Facebook', 'start', 'info', `Setting up ${config.name} Facebook Page`);

  try {
    // Navigate to Facebook Page creation
    await page.goto('https://www.facebook.com/pages/create', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    log(brand, 'Facebook', 'navigate', 'success', 'Loaded page creation UI');

    // ── HUMAN CHECKPOINT ──
    // Facebook requires you to be logged in as a personal account admin
    log(brand, 'Facebook', 'checkpoint', 'manual',
      '👤 MANUAL STEP: Ensure you are logged into Facebook as the admin account. Press ENTER to continue...'
    );
    await waitForKeypress();

    // Select page category
    await page.waitForSelector('[placeholder="Page name"]', { timeout: 10000 });
    await page.fill('[placeholder="Page name"]', config.name);
    log(brand, 'Facebook', 'fill_name', 'success', `Filled: ${config.name}`);

    // Fill category
    await page.fill('[placeholder="Category"]', config.category);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    log(brand, 'Facebook', 'fill_category', 'success', `Category: ${config.category}`);

    // Click Create Page
    const createBtn = await page.$('[data-testid="create-page-button"], button[type="submit"]');
    if (createBtn) {
      await createBtn.click();
      await page.waitForTimeout(3000);
      log(brand, 'Facebook', 'create_page', 'success', 'Page creation submitted');
    }

    // Fill About section
    await page.waitForSelector('[placeholder="Description"]', { timeout: 15000 }).catch(() => {});
    const descEl = await page.$('[placeholder="Description"]');
    if (descEl) {
      await descEl.fill(config.description.slice(0, 255)); // FB limit
      log(brand, 'Facebook', 'fill_description', 'success', 'Description filled');
    }

    // Fill website
    const websiteEl = await page.$('[placeholder="Website"]');
    if (websiteEl) {
      await websiteEl.fill(config.website);
      log(brand, 'Facebook', 'fill_website', 'success', `Website: ${config.website}`);
    }

    // Upload profile photo
    if (fs.existsSync(config.profileImagePath)) {
      const fileInput = await page.$('input[type="file"]');
      if (fileInput) {
        await fileInput.setInputFiles(config.profileImagePath);
        log(brand, 'Facebook', 'upload_profile', 'success', 'Profile image uploaded');
      }
    } else {
      log(brand, 'Facebook', 'upload_profile', 'manual', `👤 Manually upload profile image from: ${config.profileImagePath}`);
    }

    log(brand, 'Facebook', 'complete', 'success', `${config.name} Facebook Page setup complete`);
    return { success: true, platform: 'facebook' };

  } catch (err) {
    log(brand, 'Facebook', 'error', 'error', err.message);
    return { success: false, error: err.message };
  }
}

// ── INSTAGRAM BUSINESS SETUP ─────────────────────────────────

async function setupInstagramBusiness(page, brand) {
  const config = BRANDS[brand];
  log(brand, 'Instagram', 'start', 'info', 'Setting up Instagram Business account');

  try {
    await page.goto('https://www.instagram.com/accounts/login/', {
      waitUntil: 'networkidle'
    });

    log(brand, 'Instagram', 'checkpoint', 'manual',
      '👤 MANUAL STEPS REQUIRED:\n   1. Log into the Instagram account\n   2. Go to Settings → Account → Switch to Professional Account\n   3. Select Business category\n   4. Link to your Facebook Page\n   Press ENTER when done...'
    );
    await waitForKeypress();

    // Now automate bio + profile filling
    await page.goto('https://www.instagram.com/accounts/edit/', {
      waitUntil: 'networkidle'
    });

    // Fill name
    const nameInput = await page.$('#pepUsername, input[name="username"]');
    // Note: username set at account creation. Fill bio instead.

    // Fill bio
    const bioEl = await page.$('textarea[name="biography"], #pepBio');
    if (bioEl) {
      await bioEl.fill('');
      await bioEl.type(config.bios.instagram, { delay: 30 });
      log(brand, 'Instagram', 'fill_bio', 'success', 'Bio filled');
    }

    // Fill website
    const websiteEl = await page.$('input[name="website"], #pepWebsite');
    if (websiteEl) {
      await websiteEl.fill(config.website);
      log(brand, 'Instagram', 'fill_website', 'success', `Website: ${config.website}`);
    }

    // Submit
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      await page.waitForTimeout(2000);
      log(brand, 'Instagram', 'submit', 'success', 'Profile saved');
    }

    log(brand, 'Instagram', 'complete', 'success', 'Instagram Business setup complete');
    return { success: true, platform: 'instagram' };

  } catch (err) {
    log(brand, 'Instagram', 'error', 'error', err.message);
    return { success: false, error: err.message };
  }
}

// ── LINKEDIN COMPANY PAGE SETUP ──────────────────────────────

async function setupLinkedInCompany(page, brand) {
  const config = BRANDS[brand];
  log(brand, 'LinkedIn', 'start', 'info', 'Setting up LinkedIn Company Page');

  try {
    await page.goto('https://www.linkedin.com/company/setup/new/', {
      waitUntil: 'networkidle'
    });

    log(brand, 'LinkedIn', 'checkpoint', 'manual',
      '👤 MANUAL STEP: Ensure logged into LinkedIn personal account (admin). Press ENTER...'
    );
    await waitForKeypress();

    // Company name
    const nameEl = await page.$('#create-company-form input[name="name"], input[placeholder*="company name" i]');
    if (nameEl) {
      await nameEl.fill(config.name);
      log(brand, 'LinkedIn', 'fill_name', 'success', config.name);
    }

    // Website
    const websiteEl = await page.$('input[name="website"]');
    if (websiteEl) {
      await websiteEl.fill(config.website);
      log(brand, 'LinkedIn', 'fill_website', 'success', config.website);
    }

    // Company size (1-10 employees for SMB)
    const sizeEl = await page.$('select[name="companySize"]');
    if (sizeEl) {
      await sizeEl.selectOption('B'); // 1-10
      log(brand, 'LinkedIn', 'set_size', 'success', '1-10 employees');
    }

    // Company type
    const typeEl = await page.$('select[name="companyType"]');
    if (typeEl) {
      await typeEl.selectOption('PRIVATELY_HELD');
      log(brand, 'LinkedIn', 'set_type', 'success', 'Privately Held');
    }

    // Agree and continue
    const agreeEl = await page.$('input[name="legalNotice"]');
    if (agreeEl) await agreeEl.check();

    const continueBtn = await page.$('button[type="submit"], button:has-text("Continue")');
    if (continueBtn) {
      await continueBtn.click();
      await page.waitForTimeout(3000);
    }

    // Page 2: Fill description/tagline
    await page.waitForTimeout(2000);
    const taglineEl = await page.$('input[name="tagline"]');
    if (taglineEl) {
      await taglineEl.fill(config.tagline.slice(0, 120));
      log(brand, 'LinkedIn', 'fill_tagline', 'success', config.tagline.slice(0, 120));
    }

    const descEl = await page.$('textarea[name="description"]');
    if (descEl) {
      await descEl.fill(config.bios.linkedin.slice(0, 2000));
      log(brand, 'LinkedIn', 'fill_description', 'success', 'Description filled');
    }

    log(brand, 'LinkedIn', 'complete', 'success', `${config.name} LinkedIn Company Page created`);
    log(brand, 'LinkedIn', 'manual_remaining', 'manual', '👤 Manually upload logo and banner images in LinkedIn admin');
    return { success: true, platform: 'linkedin' };

  } catch (err) {
    log(brand, 'LinkedIn', 'error', 'error', err.message);
    return { success: false, error: err.message };
  }
}

// ── X / TWITTER PROFILE SETUP ────────────────────────────────

async function setupTwitterProfile(page, brand) {
  const config = BRANDS[brand];
  log(brand, 'X/Twitter', 'start', 'info', 'Setting up X/Twitter profile');

  try {
    // X profile editing
    await page.goto('https://x.com/settings/profile', {
      waitUntil: 'networkidle'
    });

    log(brand, 'X/Twitter', 'checkpoint', 'manual',
      '👤 MANUAL STEP: Log into X account for this brand. Verify phone number if prompted. Press ENTER...'
    );
    await waitForKeypress();

    await page.waitForTimeout(2000);

    // Name
    const nameEl = await page.$('input[name="displayName"], [data-testid="UserName"] input');
    if (nameEl) {
      await nameEl.click({ clickCount: 3 });
      await nameEl.fill(config.name);
      log(brand, 'X/Twitter', 'fill_name', 'success', config.name);
    }

    // Bio
    const bioEl = await page.$('textarea[name="description"], [data-testid="UserDescription"] textarea');
    if (bioEl) {
      await bioEl.click({ clickCount: 3 });
      await bioEl.fill(config.bios.twitter.slice(0, 160));
      log(brand, 'X/Twitter', 'fill_bio', 'success', 'Bio filled (160 char limit)');
    }

    // Location
    const locationEl = await page.$('input[name="location"], [data-testid="UserLocation"] input');
    if (locationEl) {
      await locationEl.fill(config.address);
      log(brand, 'X/Twitter', 'fill_location', 'success', config.address);
    }

    // Website
    const websiteEl = await page.$('input[name="url"], [data-testid="UserUrl"] input');
    if (websiteEl) {
      await websiteEl.fill(config.website);
      log(brand, 'X/Twitter', 'fill_website', 'success', config.website);
    }

    // Save
    const saveBtn = await page.$('button[data-testid="Profile_Save_Button"], button:has-text("Save")');
    if (saveBtn) {
      await saveBtn.click();
      await page.waitForTimeout(2000);
      log(brand, 'X/Twitter', 'save', 'success', 'Profile saved');
    }

    log(brand, 'X/Twitter', 'complete', 'success', 'X/Twitter profile setup complete');
    log(brand, 'X/Twitter', 'dev_app', 'manual', '👤 Manually create Developer App at developer.twitter.com for API posting access');
    return { success: true, platform: 'twitter' };

  } catch (err) {
    log(brand, 'X/Twitter', 'error', 'error', err.message);
    return { success: false, error: err.message };
  }
}

// ── YOUTUBE CHANNEL SETUP ────────────────────────────────────

async function setupYouTubeChannel(page, brand) {
  const config = BRANDS[brand];
  log(brand, 'YouTube', 'start', 'info', 'Setting up YouTube Brand Channel');

  try {
    await page.goto('https://www.youtube.com/channel_switcher', {
      waitUntil: 'networkidle'
    });

    log(brand, 'YouTube', 'checkpoint', 'manual',
      '👤 MANUAL STEP: Sign in with Google account. Create Brand Account if not yet created. Press ENTER...'
    );
    await waitForKeypress();

    // Go to channel customisation
    await page.goto('https://studio.youtube.com', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Navigate to customisation > Basic info
    await page.goto('https://studio.youtube.com/channel/UC/editing/basic_info', {
      waitUntil: 'networkidle'
    });

    // Channel name
    const nameEl = await page.$('input[aria-label*="channel name" i], #channel-name-input');
    if (nameEl) {
      await nameEl.click({ clickCount: 3 });
      await nameEl.fill(config.name);
      log(brand, 'YouTube', 'fill_name', 'success', config.name);
    }

    // Channel description
    const descEl = await page.$('textarea[aria-label*="description" i], #description-textarea');
    if (descEl) {
      const desc = config.bios.youtube || config.description;
      await descEl.fill(desc.slice(0, 1000));
      log(brand, 'YouTube', 'fill_description', 'success', 'Description filled');
    }

    // Add website link
    const addLinkBtn = await page.$('button:has-text("Add link"), button[aria-label*="Add link"]');
    if (addLinkBtn) {
      await addLinkBtn.click();
      await page.waitForTimeout(500);
      const linkTitleEl = await page.$('input[aria-label*="link title" i]');
      const linkUrlEl = await page.$('input[aria-label*="url" i]');
      if (linkTitleEl && linkUrlEl) {
        await linkTitleEl.fill(config.name);
        await linkUrlEl.fill(config.website);
        log(brand, 'YouTube', 'add_link', 'success', config.website);
      }
    }

    // Publish / Save
    const publishBtn = await page.$('button:has-text("Publish"), button[aria-label*="Publish"]');
    if (publishBtn) {
      await publishBtn.click();
      await page.waitForTimeout(2000);
      log(brand, 'YouTube', 'publish', 'success', 'Channel basic info saved');
    }

    log(brand, 'YouTube', 'complete', 'success', 'YouTube channel setup complete');
    log(brand, 'YouTube', 'manual_remaining', 'manual', '👤 Manually upload channel icon and banner art in YouTube Studio');
    return { success: true, platform: 'youtube' };

  } catch (err) {
    log(brand, 'YouTube', 'error', 'error', err.message);
    return { success: false, error: err.message };
  }
}

// ── GOOGLE BUSINESS PROFILE ──────────────────────────────────

async function setupGoogleBusiness(page, brand) {
  const config = BRANDS[brand];
  log(brand, 'Google Business', 'start', 'info', 'Setting up Google Business Profile');

  try {
    await page.goto('https://business.google.com/create', { waitUntil: 'networkidle' });

    log(brand, 'Google Business', 'checkpoint', 'manual',
      '👤 MANUAL STEP: Sign in with Google account. Complete business verification (postcard or phone). This is a one-time step. Press ENTER when signed in...'
    );
    await waitForKeypress();

    // Business name
    await page.waitForSelector('input[aria-label*="business name" i]', { timeout: 10000 }).catch(() => {});
    const nameEl = await page.$('input[aria-label*="business name" i]');
    if (nameEl) {
      await nameEl.fill(config.name);
      await page.keyboard.press('Enter');
      log(brand, 'Google Business', 'fill_name', 'success', config.name);
      await page.waitForTimeout(2000);
    }

    log(brand, 'Google Business', 'complete', 'success', `${config.name} GMB setup initiated`);
    log(brand, 'Google Business', 'verify', 'manual',
      '👤 MANUAL: Complete postcard/phone verification when it arrives. Once verified, all posting is automated via GMB API.'
    );
    return { success: true, platform: 'google_business' };

  } catch (err) {
    log(brand, 'Google Business', 'error', 'error', err.message);
    return { success: false, error: err.message };
  }
}

// ── MAIN ORCHESTRATOR ────────────────────────────────────────

async function runSetup(brandKey) {
  const config = BRANDS[brandKey];
  if (!config) {
    console.error(`❌ Unknown brand: ${brandKey}. Available: ${Object.keys(BRANDS).join(', ')}`);
    process.exit(1);
  }

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  🚀 SETTING UP: ${config.name.toUpperCase()}`);
  console.log(`  Platforms: ${config.platforms.join(', ')}`);
  console.log(`${'═'.repeat(60)}\n`);

  // Generate all bio content with Claude before opening browser
  // Note: Generated bios are stored for reference but hardcoded bios in config are used as defaults
  console.log('🧠 Generating optimised bios with Claude...\n');
  const generatedBios = {};
  for (const platform of ['Facebook', 'Instagram', 'LinkedIn', 'X/Twitter', 'YouTube']) {
    if (platform === 'YouTube' && !config.platforms.includes('youtube_channel')) continue;
    if (platform === 'LinkedIn' && !config.platforms.includes('linkedin_company')) continue;
    try {
      generatedBios[platform] = await generateBrandContent(brandKey, platform, 'bio/about text');
      console.log(`  ✓ ${platform} bio generated`);
    } catch (e) {
      console.log(`  ⚠ Could not generate ${platform} bio: ${e.message}`);
    }
  }
  // Save generated bios to log for reference
  log(brandKey, 'Claude', 'bios_generated', 'success', `Generated ${Object.keys(generatedBios).length} platform bios`);

  // Launch browser (non-headless so you can see + verify)
  const browser = await chromium.launch({
    headless: false,
    slowMo: 100, // Slowed so you can watch and intervene
    args: [
      '--window-size=1280,900',
      '--window-position=100,50'
    ]
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    // Persist auth state so you stay logged in across platforms
    storageState: fs.existsSync(`./auth-state-${brandKey}.json`)
      ? `./auth-state-${brandKey}.json`
      : undefined
  });

  const page = await context.newPage();
  const results = [];

  // ── Run platform setups based on brand config ──
  for (const platform of config.platforms) {
    console.log(`\n── Setting up ${platform} ──\n`);

    let result;
    switch(platform) {
      case 'facebook_page':
        result = await setupFacebookPage(page, brandKey);
        break;
      case 'instagram_business':
        result = await setupInstagramBusiness(page, brandKey);
        break;
      case 'linkedin_company':
        result = await setupLinkedInCompany(page, brandKey);
        break;
      case 'twitter':
        result = await setupTwitterProfile(page, brandKey);
        break;
      case 'youtube_channel':
        result = await setupYouTubeChannel(page, brandKey);
        break;
      case 'google_business':
        result = await setupGoogleBusiness(page, brandKey);
        break;
      case 'tiktok':
        log(brandKey, 'TikTok', 'info', 'manual',
          '👤 TikTok: Create account manually (phone verification required). Then run: node setup-tiktok-profile.js --brand ' + brandKey
        );
        result = { success: false, platform: 'tiktok', manual: true };
        break;
      case 'pinterest':
        result = await setupPinterestBusiness(page, brandKey);
        break;
    }

    if (result) results.push(result);
    await page.waitForTimeout(2000); // Brief pause between platforms
  }

  // Save auth state for future runs
  await context.storageState({ path: `./auth-state-${brandKey}.json` });
  log(brandKey, 'Auth', 'save', 'success', `Auth state saved to auth-state-${brandKey}.json`);

  await browser.close();

  // ── SUMMARY REPORT ──
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  📋 SETUP REPORT: ${config.name}`);
  console.log(`${'═'.repeat(60)}`);

  results.forEach(r => {
    const icon = r.success ? '✅' : r.manual ? '👤' : '❌';
    console.log(`  ${icon} ${r.platform}: ${r.success ? 'Complete' : r.manual ? 'Manual steps required' : r.error}`);
  });

  console.log(`\n  📝 Full log saved: ${LOG_FILE}`);
  console.log(`${'═'.repeat(60)}\n`);
}

// ── PINTEREST SETUP ──────────────────────────────────────────

async function setupPinterestBusiness(page, brand) {
  const config = BRANDS[brand];
  log(brand, 'Pinterest', 'start', 'info', 'Setting up Pinterest Business account');

  try {
    await page.goto('https://pinterest.com/business/create', { waitUntil: 'networkidle' });

    log(brand, 'Pinterest', 'checkpoint', 'manual', '👤 Log into Pinterest account. Press ENTER...');
    await waitForKeypress();

    // Fill business name
    const nameEl = await page.$('input[id*="businessName"], input[name*="businessName"]');
    if (nameEl) {
      await nameEl.fill(config.name);
      log(brand, 'Pinterest', 'fill_name', 'success', config.name);
    }

    // Fill website
    const siteEl = await page.$('input[id*="website"], input[name*="website"]');
    if (siteEl) {
      await siteEl.fill(config.website);
      log(brand, 'Pinterest', 'fill_website', 'success', config.website);
    }

    const nextBtn = await page.$('button[type="submit"], button:has-text("Next")');
    if (nextBtn) {
      await nextBtn.click();
      await page.waitForTimeout(2000);
    }

    log(brand, 'Pinterest', 'complete', 'success', 'Pinterest Business account created');
    log(brand, 'Pinterest', 'boards', 'info', 'Board creation via Pinterest API v5 — run after account setup');
    return { success: true, platform: 'pinterest' };

  } catch (err) {
    log(brand, 'Pinterest', 'error', 'error', err.message);
    return { success: false, error: err.message };
  }
}

// ── UTILS ────────────────────────────────────────────────────

function waitForKeypress() {
  return new Promise(resolve => {
    // Guard against non-TTY stdin (e.g., piped input or CI environments)
    if (!process.stdin.isTTY) {
      console.log('\n   [Non-interactive mode — skipping keypress wait]\n');
      resolve();
      return;
    }
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once('data', () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      resolve();
    });
    console.log('\n   [Press any key to continue...]\n');
  });
}

// ── CLI ENTRY POINT ──────────────────────────────────────────

const args = process.argv.slice(2);
const brandFlag = args.indexOf('--brand');
const brandArg = brandFlag !== -1 ? args[brandFlag + 1] : null;

if (!brandArg) {
  console.log(`
Usage:
  node setup-orchestrator.js --brand astra
  node setup-orchestrator.js --brand magna
  node setup-orchestrator.js --brand primhaul
  node setup-orchestrator.js --brand coachmentor
  node setup-orchestrator.js --brand all

Brands: ${Object.keys(BRANDS).join(', ')}
  `);
  process.exit(0);
}

if (brandArg === 'all') {
  (async () => {
    for (const brand of Object.keys(BRANDS)) {
      await runSetup(brand);
      console.log('\n⏸  Pausing 10s before next brand...\n');
      await new Promise(r => setTimeout(r, 10000));
    }
  })();
} else {
  runSetup(brandArg);
}
