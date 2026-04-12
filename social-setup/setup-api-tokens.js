/**
 * ============================================================
 * RICK.AI — SOCIAL API TOKEN SETUP + PINTEREST BOARDS
 * ============================================================
 * Run AFTER setup-orchestrator.js has created the accounts.
 * This script:
 *   1. Creates Pinterest board structure for each brand
 *   2. Generates n8n environment variable template
 *   3. Creates Airtable table structure for Social Runs CRM
 *   4. Outputs a complete .env file template for n8n
 *
 * Usage:
 *   node setup-api-tokens.js --brand all
 *   node setup-api-tokens.js --brand coachmentor
 * ============================================================
 */

import * as fs from 'fs';

// ── PINTEREST BOARD STRUCTURES ──────────────────────────────

const PINTEREST_BOARDS = {
  astra: [
    { name: 'Moving House Tips & Guides', description: 'Expert advice for a stress-free home move from Astra Removals, Bournemouth & Dorset' },
    { name: 'Packing Tips & Hacks', description: 'How to pack efficiently for your house move. Boxes, fragile items, room-by-room guides.' },
    { name: 'Moving Checklists', description: 'Printable moving checklists and timelines. 8 weeks to moving day.' },
    { name: 'Local Moves in Dorset & Bournemouth', description: 'Local removals tips and neighbourhood guides for Bournemouth, Poole, and Dorset.' },
    { name: 'Storage Solutions', description: 'When to use self storage during a move. Tips from Magna Park, Wimborne.' },
  ],

  magna: [
    { name: 'Business Storage Solutions', description: 'How trade businesses and SMEs use flexible storage to manage stock, documents and equipment.' },
    { name: 'Container Storage Ideas', description: 'Creative uses for shipping container storage units for businesses and homeowners.' },
    { name: 'Dorset Business Tips', description: 'Tips and resources for businesses based in Dorset, Wimborne and the Bournemouth area.' },
    { name: 'Moving & Storage Combined', description: 'How to use storage alongside a house move. Worked with Astra Removals.' },
  ],

  primhaul: [
    { name: 'Moving House Checklists', description: 'Free printable moving checklists for your house move. 8 weeks to moving day.' },
    { name: 'How to Save Money Moving House', description: 'Expert tips on getting the best removal quotes and reducing moving costs in the UK.' },
    { name: 'First Time Buyers Moving Tips', description: 'Everything first time buyers need to know about the moving process in the UK.' },
    { name: 'Removal Company Guides', description: 'How to choose a removal company, what to look for, and how to get the best price.' },
    { name: 'House Move Organisation Ideas', description: 'Room labelling, inventory systems, and packing organisation for a stress-free move.' },
    { name: 'Moving With Kids & Pets', description: 'How to manage moving house with children and pets. Tips from real movers.' },
  ],

  coachmentor: [
    { name: 'Grassroots Football Coaching Tips', description: 'Practical coaching tips for FA Level 1 and 2 grassroots football coaches.' },
    { name: 'Football Training Drills', description: 'Original training drills and session plans for youth and grassroots football coaches.' },
    { name: 'Coaching U7-U16 Age Groups', description: 'Age-specific coaching advice for working with junior footballers from U7 to U16.' },
    { name: 'Tactical Football Coaching', description: 'Tactical coaching guides, formation advice, and pressing trigger drills for grassroots.' },
    { name: 'Football Session Planning', description: 'How to plan a great coaching session. Warm ups, main activity, cool downs.' },
    { name: 'Coaching Mindset & Development', description: 'Becoming a better football coach. Communication, player development, and growth mindset.' },
  ],
};

// ── N8N ENVIRONMENT VARIABLE TEMPLATE ───────────────────────

function generateN8nEnvTemplate(brand) {
  const templates = {
    astra: `
# ── ASTRA REMOVALS — n8n Environment Variables ──────────────
# Copy these into n8n: Settings > Environment Variables

# Facebook / Instagram (Meta Graph API)
FB_PAGE_ID_ASTRA=                          # Your Astra FB Page ID (from page URL)
FB_PAGE_ACCESS_TOKEN_ASTRA=                # Long-lived Page Access Token (never expires with refresh)
IG_ACCOUNT_ID_ASTRA=                       # IG Business Account ID (linked to FB page)
IG_ACCESS_TOKEN_ASTRA=                     # Same as FB token (Meta unified)

# Google My Business
GMB_LOCATION_ID_ASTRA=                     # Format: accounts/{accountId}/locations/{locationId}
GOOGLE_OAUTH_TOKEN_ASTRA=                  # OAuth 2.0 token from Google Cloud Console

# Twilio (Review SMS)
TWILIO_ACCOUNT_SID=                        # From twilio.com/console
TWILIO_AUTH_TOKEN=                         # From twilio.com/console
TWILIO_FROM_NUMBER_ASTRA=                  # +44 format

# Anthropic
ANTHROPIC_API_KEY=                         # From console.anthropic.com

# Airtable CRM
AIRTABLE_BASE_ID_ASTRA=                    # From Airtable URL: airtable.com/appXXXXXX
AIRTABLE_API_TOKEN=                        # From airtable.com/create/tokens

# MoveScan Webhook
MOVESCAN_WEBHOOK_SECRET=                   # Shared secret between MoveScan and n8n

# fal.ai (Image generation)
FAL_AI_API_KEY=                            # From fal.ai/dashboard

# Canva API
CANVA_CLIENT_ID_ASTRA=                     # From Canva Developer Portal
CANVA_ACCESS_TOKEN_ASTRA=                  # OAuth token for Astra brand kit
`,

    magna: `
# ── MAGNA PARK — n8n Environment Variables ───────────────────

# Facebook / Instagram
FB_PAGE_ID_MAGNA=
FB_PAGE_ACCESS_TOKEN_MAGNA=
IG_ACCOUNT_ID_MAGNA=
IG_ACCESS_TOKEN_MAGNA=

# LinkedIn Company Page
LINKEDIN_COMPANY_ID_MAGNA=                 # From LinkedIn URL: /company/{id}/admin
LINKEDIN_ACCESS_TOKEN_MAGNA=               # OAuth 2.0 from LinkedIn Developer Portal
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=

# Google My Business
GMB_LOCATION_ID_MAGNA=
GOOGLE_OAUTH_TOKEN_MAGNA=

# Airtable CRM
AIRTABLE_BASE_ID_MAGNA=

# Availability table (for DM bot)
AIRTABLE_AVAILABILITY_TABLE_MAGNA=         # Table name: "Unit Availability"

# Calendly (site visit booking)
CALENDLY_MAGNA_LINK=                       # Direct Calendly link for site visits

# Slack (escalation)
SLACK_BOT_TOKEN=                           # For review routing
SLACK_CHANNEL_SOCIAL_REVIEW=               # e.g. #social-review
SLACK_CHANNEL_MAGNA_ENQUIRIES=             # e.g. #magna-enquiries
`,

    primhaul: `
# ── PRIME HAUL / MOVESCAN — n8n Environment Variables ────────

# Facebook / Instagram
FB_PAGE_ID_PRIMHAUL=
FB_PAGE_ACCESS_TOKEN_PRIMHAUL=
IG_ACCOUNT_ID_PRIMHAUL=
IG_ACCESS_TOKEN_PRIMHAUL=

# TikTok Business API
TIKTOK_ACCESS_TOKEN_PRIMHAUL=              # From TikTok Developer Portal (requires app approval)
TIKTOK_ADVERTISER_ID_PRIMHAUL=

# Pinterest
PINTEREST_ACCESS_TOKEN_PRIMHAUL=           # OAuth from Pinterest Developer Portal
PINTEREST_AD_ACCOUNT_ID_PRIMHAUL=

# Meta Custom Audiences (Retargeting)
META_AD_ACCOUNT_ID_PRIMHAUL=               # Ads Manager account ID
META_PIXEL_ID_PRIMHAUL=                    # MoveScan website pixel ID

# Predis.ai (Carousel/Video generation)
PREDIS_AI_API_KEY=

# Supabase (Media storage)
SUPABASE_URL_PRIMHAUL=
SUPABASE_SERVICE_ROLE_KEY_PRIMHAUL=

# Airtable CRM
AIRTABLE_BASE_ID_PRIMHAUL=
`,

    coachmentor: `
# ── COACHMENTOR — n8n Environment Variables ──────────────────

# Facebook / Instagram
FB_PAGE_ID_COACHMENTOR=
FB_PAGE_ACCESS_TOKEN_COACHMENTOR=
IG_ACCOUNT_ID_COACHMENTOR=
IG_ACCESS_TOKEN_COACHMENTOR=

# TikTok
TIKTOK_ACCESS_TOKEN_COACHMENTOR=
TIKTOK_OPEN_ID_COACHMENTOR=                # From TikTok OAuth

# YouTube Data API v3
YOUTUBE_CHANNEL_ID_COACHMENTOR=            # From YouTube Studio URL
YOUTUBE_OAUTH_CLIENT_ID=                   # Google Cloud Console
YOUTUBE_OAUTH_CLIENT_SECRET=
YOUTUBE_REFRESH_TOKEN_COACHMENTOR=         # From OAuth flow

# X / Twitter API v2
TWITTER_BEARER_TOKEN_COACHMENTOR=
TWITTER_API_KEY_COACHMENTOR=
TWITTER_API_SECRET_COACHMENTOR=
TWITTER_ACCESS_TOKEN_COACHMENTOR=
TWITTER_ACCESS_SECRET_COACHMENTOR=

# ManyChat (IG DM automation)
MANYCHAT_API_KEY=
MANYCHAT_FLOW_ID_TRIAL_OFFER=              # 7-day trial DM flow ID

# CoachMentor App Webhook (subscriber events)
COACHMENTOR_WEBHOOK_SECRET=                # Shared with CoachMentor app backend

# Subscriber CRM
AIRTABLE_BASE_ID_COACHMENTOR=
AIRTABLE_SUBSCRIBERS_TABLE=               # Table: "Subscribers"
AIRTABLE_CONTENT_RUNS_TABLE=              # Table: "Content Automation Runs"

# Notion (Recording queue)
NOTION_API_KEY=
NOTION_RECORDING_QUEUE_DB=                # Database ID for video recording queue
`,
  };

  return templates[brand] || '';
}

// ── AIRTABLE TABLE SCHEMAS ───────────────────────────────────

const AIRTABLE_SCHEMAS = {
  astra: {
    bases: [
      {
        name: 'Astra CRM',
        tables: [
          {
            name: 'Social Automation Runs',
            description: 'Logs every n8n workflow execution',
            fields: [
              'survey_id (Text) — MoveScan survey ID',
              'customer_name (Text)',
              'origin_postcode (Text)',
              'dest_postcode (Text)',
              'volume_category (Single select: small/medium/large)',
              'move_date (Date)',
              'magna_upsell (Checkbox) — Was Magna Park CTA included?',
              'confidence_score (Number) — Claude confidence 0-1',
              'fb_post_content (Long text)',
              'ig_post_content (Long text)',
              'fb_post_id (Text)',
              'ig_media_id (Text)',
              'published_at (Date & time)',
              'review_sms_sent (Checkbox)',
              'review_sms_sent_at (Date & time)',
              'workflow_version (Text)',
            ]
          },
          {
            name: 'Leads',
            description: 'All MoveScan leads',
            fields: [
              'survey_id (Text)',
              'lead_source (Single select: MoveScan/Direct/Referral)',
              'status (Single select: New/Quoted/Booked/Complete/Lost)',
              'origin_postcode (Text)',
              'dest_postcode (Text)',
              'move_date (Date)',
              'bedrooms (Number)',
              'contact_name (Text)',
              'contact_phone (Phone)',
              'contact_email (Email)',
              'magna_upsell_flag (Checkbox)',
              'social_post_created (Checkbox)',
              'review_sent (Checkbox)',
              'notes (Long text)',
            ]
          }
        ]
      }
    ]
  },

  coachmentor: {
    bases: [
      {
        name: 'CoachMentor CRM',
        tables: [
          {
            name: 'Subscribers',
            fields: [
              'platform_user_id (Text) — TikTok/IG/YT/X user ID',
              'platform (Single select: TikTok/Instagram/YouTube/X)',
              'username (Text)',
              'trial_started (Checkbox)',
              'trial_started_at (Date)',
              'converted_to_paid (Checkbox)',
              'converted_at (Date)',
              'intent_score (Number) — Claude classification 0-1',
              'intent_type (Single select: Coach/Parent/Player)',
              'dm_sent (Checkbox)',
              'dm_sent_at (Date)',
              'dm_followup_sent (Checkbox)',
              'source_content_id (Text) — Which post triggered the funnel',
            ]
          },
          {
            name: 'Content Automation Runs',
            fields: [
              'week_of (Date)',
              'workflow_name (Text)',
              'platform (Text)',
              'content_type (Single select: Short/Reel/Thread/Post)',
              'post_title (Text)',
              'originality_score (Number)',
              'confidence_score (Number)',
              'published_at (Date & time)',
              'views_48h (Number)',
              'engagements_48h (Number)',
              'funnel_triggered (Checkbox)',
              'trials_generated (Number)',
            ]
          }
        ]
      }
    ]
  },

  magna: {
    bases: [
      {
        name: 'Magna Park CRM',
        tables: [
          {
            name: 'Social Automation Runs',
            description: 'Logs every n8n workflow execution for Magna Park social posts',
            fields: [
              'run_id (Text)',
              'content_type (Single select: Availability Update/Seasonal Campaign/Testimonial/Tips & Guides/Cross-Promo Astra)',
              'platform (Single select: Facebook/Instagram/LinkedIn/Google My Business)',
              'post_content (Long text)',
              'unit_type_featured (Single select: 10ft/20ft/40ft/Custom)',
              'location_targeting (Text)',
              'seasonal_tag (Single select: New Year Declutter/Spring Clean/Summer Holiday/Student Storage/Christmas/None)',
              'confidence_score (Number)',
              'published_at (Date & time)',
              'impressions_48h (Number)',
              'engagements_48h (Number)',
              'enquiries_generated (Number)',
              'workflow_version (Text)',
            ]
          },
          {
            name: 'Unit Availability',
            description: 'Container unit inventory and status',
            fields: [
              'unit_id (Text)',
              'unit_type (Single select: 10ft/20ft/40ft/Custom)',
              'status (Single select: Available/Reserved/Occupied/Maintenance)',
              'monthly_rate (Currency)',
              'tenant_name (Text)',
              'lease_start (Date)',
              'lease_end (Date)',
              'use_type (Single select: Trade/Personal/Student/Seasonal)',
              'notes (Long text)',
            ]
          },
          {
            name: 'Enquiries',
            description: 'All storage enquiries',
            fields: [
              'enquiry_id (Text)',
              'source (Single select: Facebook/Instagram/LinkedIn/Google My Business/Website/Phone/Astra Referral)',
              'status (Single select: New/Contacted/Site Visit Booked/Quoted/Won/Lost)',
              'contact_name (Text)',
              'contact_email (Email)',
              'contact_phone (Phone)',
              'unit_type_requested (Single select: 10ft/20ft/40ft/Any)',
              'use_type (Single select: Trade/Personal/Student/Seasonal)',
              'postcode (Text)',
              'astra_referral (Checkbox)',
              'created_at (Date & time)',
              'notes (Long text)',
            ]
          }
        ]
      }
    ]
  },

  primhaul: {
    bases: [
      {
        name: 'Prime Haul CRM',
        tables: [
          {
            name: 'Social Automation Runs',
            description: 'Logs every n8n workflow execution for Prime Haul social proof posts',
            fields: [
              'survey_id (Text)',
              'customer_first_name (Text)',
              'origin_postcode (Text)',
              'dest_postcode (Text)',
              'volume_category (Single select: small/medium/large)',
              'bedrooms (Number)',
              'move_date (Date)',
              'quotes_sent (Number)',
              'matched_companies (Text)',
              'confidence_score (Number)',
              'fb_post_content (Long text)',
              'ig_post_content (Long text)',
              'pinterest_desc (Long text)',
              'tiktok_caption (Long text)',
              'fb_post_id (Text)',
              'ig_media_id (Text)',
              'pinterest_pin_id (Text)',
              'tiktok_status (Text)',
              'published_at (Date & time)',
              'workflow_version (Text)',
            ]
          },
          {
            name: 'Surveys',
            description: 'All MoveScan survey completions',
            fields: [
              'survey_id (Text)',
              'customer_name (Text)',
              'customer_email (Email)',
              'origin_postcode (Text)',
              'dest_postcode (Text)',
              'move_date (Date)',
              'bedrooms (Number)',
              'cbm_volume (Number)',
              'quotes_sent (Number)',
              'matched_companies (Text)',
              'status (Single select: Survey Complete/Quotes Sent/Booked/Complete/Cancelled)',
              'social_post_created (Checkbox)',
              'created_at (Date & time)',
            ]
          },
          {
            name: 'Removal Companies',
            description: 'Vetted removal companies in the marketplace',
            fields: [
              'company_name (Text)',
              'contact_email (Email)',
              'coverage_postcodes (Text)',
              'status (Single select: Active/Paused/Removed)',
              'leads_received (Number)',
              'leads_converted (Number)',
              'avg_rating (Number)',
              'joined_at (Date)',
            ]
          }
        ]
      }
    ]
  }
};

// ── SETUP CHECKLIST GENERATOR ────────────────────────────────

function generateSetupChecklist(brand) {
  const checklists = {
    astra: `
╔══════════════════════════════════════════════════════════════╗
║  ASTRA REMOVALS — Complete Setup Checklist                   ║
╚══════════════════════════════════════════════════════════════╝

PHASE 1 — Account Creation (Manual + Playwright MCP)
─────────────────────────────────────────────────────
□ Personal Facebook account exists as admin
□ Facebook Business Page created (run: setup-orchestrator.js --brand astra)
□ Instagram Business account created + linked to FB Page
□ Google account created for GMB
□ Google My Business listing claimed and verified (postcard/phone)

PHASE 2 — API Access Setup
──────────────────────────
□ Meta Developer App created at developers.facebook.com
□ Long-lived FB Page Access Token generated (60-day → then exchange for never-expiring)
□ Instagram Basic Display API or Graph API enabled
□ Google Cloud Console project created
□ Google Business Profile API enabled
□ GMB OAuth credentials configured
□ Twilio account funded + number purchased
□ Airtable base created with Social Automation Runs + Leads tables

PHASE 3 — n8n Configuration
─────────────────────────────
□ All env variables added (see: env-template-astra.env)
□ Anthropic credential created in n8n
□ Airtable credential created in n8n  
□ Twilio credential created in n8n
□ Astra lead workflow imported (astra-magna-workflow.n8n.json)
□ MoveScan webhook URL configured in MoveScan settings
□ Test run executed with sample lead payload

PHASE 4 — Content Assets
─────────────────────────
□ Profile photo uploaded (1:1 ratio, 170x170px minimum)
□ Facebook cover photo uploaded (851x315px)
□ Instagram profile photo uploaded (110x110px display)
□ Google Business cover photo uploaded
□ All bios populated (auto-generated by setup-orchestrator.js)
□ Pinned welcome post created on Facebook

ESTIMATED TIME: ~3 hours total (including verification wait)
`,

    coachmentor: `
╔══════════════════════════════════════════════════════════════╗
║  COACHMENTOR — Complete Setup Checklist                      ║
╚══════════════════════════════════════════════════════════════╝

PHASE 1 — Account Creation
───────────────────────────
□ TikTok account created (manual — phone verify required)
□ TikTok switched to Business account (in-app)
□ Instagram Business account created + linked to FB Page
□ YouTube Brand Channel created (Google account)
□ X/Twitter account created (manual — phone verify)
□ Facebook Page created

PHASE 2 — API Access
─────────────────────
□ TikTok Developer App created + Business API access applied for
□ TikTok posting API approved (can take 1-2 weeks)
□ YouTube Data API v3 enabled in Google Cloud Console
□ YouTube OAuth refresh token obtained
□ Twitter Developer App created at developer.twitter.com
□ Twitter API v2 access (Free tier = 1500 posts/month — sufficient)
□ ManyChat account created + IG connected for DM automation
□ CoachMentor app webhook configured for subscriber events

PHASE 3 — Pinterest Boards (run setup-api-tokens.js)
──────────────────────────────────────────────────────
□ Pinterest Business account created
□ Pinterest Developer App created
□ Access token obtained
□ run: node setup-api-tokens.js --brand coachmentor --create-boards
   Creates: Grassroots Coaching Tips, Training Drills, U7-U16 Tips,
            Tactical Coaching, Session Planning, Coaching Mindset

PHASE 4 — n8n Workflows
─────────────────────────
□ All env variables added (env-template-coachmentor.env)
□ CoachMentor content engine workflow imported
□ Subscriber funnel workflow imported
□ Fixture hooks workflow imported
□ Copyright guard IF node tested
□ Test run with sample content

ESTIMATED TIME: ~4 hours (TikTok API approval may add 1-2 weeks)
`,
  };

    magna: `
╔══════════════════════════════════════════════════════════════╗
║  MAGNA PARK SELF STORAGE — Complete Setup Checklist          ║
╚══════════════════════════════════════════════════════════════╝

PHASE 1 — Account Creation (Manual + Playwright MCP)
─────────────────────────────────────────────────────
□ Personal Facebook account exists as admin
□ Facebook Business Page created (run: setup-orchestrator.js --brand magna)
□ Instagram Business account created + linked to FB Page
□ LinkedIn Company Page created
□ Google account created for GMB
□ Google My Business listing claimed and verified (postcard/phone)

PHASE 2 — API Access Setup
──────────────────────────
□ Meta Developer App created at developers.facebook.com
□ Long-lived FB Page Access Token generated
□ Instagram Graph API enabled
□ LinkedIn Developer App created at developer.linkedin.com
□ LinkedIn OAuth credentials configured
□ Google Cloud Console project created
□ Google Business Profile API enabled
□ GMB OAuth credentials configured
□ Airtable base created with Social Automation Runs + Unit Availability + Enquiries tables

PHASE 3 — n8n Configuration
─────────────────────────────
□ All env variables added (see: env-template-magna.env)
□ Anthropic credential created in n8n
□ Airtable credential created in n8n
□ LinkedIn credential created in n8n
□ Magna Park workflow imported (astra-magna-workflow.n8n.json — shared workflow)
□ Test run executed with sample data

PHASE 4 — Content Assets
─────────────────────────
□ Profile photo uploaded (1:1 ratio, 170x170px minimum)
□ Facebook cover photo uploaded (851x315px)
□ Instagram profile photo uploaded
□ LinkedIn company logo + banner uploaded
□ Google Business cover photo uploaded
□ All bios populated

ESTIMATED TIME: ~3 hours total (including verification wait)
`,

    primhaul: `
╔══════════════════════════════════════════════════════════════╗
║  PRIME HAUL / MOVESCAN — Complete Setup Checklist            ║
╚══════════════════════════════════════════════════════════════╝

PHASE 1 — Account Creation
───────────────────────────
□ Facebook Business Page created (run: setup-orchestrator.js --brand primhaul)
□ Instagram Business account created + linked to FB Page
□ TikTok account created (manual — phone verify required)
□ TikTok switched to Business account (in-app)
□ Pinterest Business account created

PHASE 2 — API Access
─────────────────────
□ Meta Developer App created at developers.facebook.com
□ Long-lived FB Page Access Token generated
□ Instagram Graph API enabled
□ TikTok Developer App created + Business API access applied for
□ TikTok posting API approved (can take 1-2 weeks)
□ Pinterest Developer App created at developers.pinterest.com
□ Pinterest OAuth access token obtained
□ Airtable base created with Social Automation Runs + Surveys + Removal Companies tables

PHASE 3 — Pinterest Boards (run setup-api-tokens.js)
──────────────────────────────────────────────────────
□ run: node setup-api-tokens.js --brand primhaul --create-boards
  Creates: Moving House Checklists, Save Money Moving, First Time Buyers,
           Removal Company Guides, House Move Organisation, Moving With Kids & Pets

PHASE 4 — n8n Configuration
─────────────────────────────
□ All env variables added (see: env-template-primhaul.env)
□ Anthropic credential created in n8n
□ Airtable credential created in n8n
□ Pinterest credential created in n8n
□ Prime Haul workflow imported (primehaul-workflow.n8n.json)
□ MoveScan completion webhook URL configured
□ Default branded images uploaded to CDN for IG and Pinterest
□ Test run executed with sample survey payload

PHASE 5 — Content Assets
─────────────────────────
□ Profile photos uploaded across all platforms
□ Facebook cover photo uploaded
□ Pinterest profile completed with bio
□ Default IG post image created (branded template)
□ Default Pinterest pin image created (2:3 ratio)

ESTIMATED TIME: ~3 hours (TikTok API approval may add 1-2 weeks)
`,
  };

  return checklists[brand] || `Setup checklist for ${brand} — see setup-orchestrator.js`;
}

// ── PINTEREST BOARD CREATOR (via API) ────────────────────────

async function createPinterestBoards(brand) {
  const boards = PINTEREST_BOARDS[brand];
  if (!boards) {
    console.log(`No Pinterest board config for brand: ${brand}`);
    return;
  }

  const tokenEnvKey = `PINTEREST_ACCESS_TOKEN_${brand.toUpperCase()}`;
  const token = process.env[tokenEnvKey];

  if (!token) {
    console.log(`⚠️  ${tokenEnvKey} not set in .env — skipping board creation`);
    console.log(`   Set token then run: node setup-api-tokens.js --brand ${brand} --create-boards`);
    return;
  }

  console.log(`\n📌 Creating Pinterest boards for ${brand}...\n`);

  for (const board of boards) {
    try {
      const response = await fetch('https://api.pinterest.com/v5/boards', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: board.name,
          description: board.description,
          privacy: 'PUBLIC',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`  ✅ Created board: "${board.name}" (ID: ${data.id})`);
      } else {
        const err = await response.json();
        console.log(`  ❌ Failed: "${board.name}" — ${err.message}`);
      }

      // Rate limit respect
      await new Promise(r => setTimeout(r, 500));

    } catch (err) {
      console.log(`  ❌ Error creating "${board.name}": ${err.message}`);
    }
  }
}

// ── OUTPUT ALL FILES ─────────────────────────────────────────

function outputAll(brand) {
  const brands = brand === 'all' ? Object.keys(PINTEREST_BOARDS) : [brand];

  for (const b of brands) {
    // Write env template
    const envContent = generateN8nEnvTemplate(b);
    if (envContent) {
      fs.writeFileSync(`./env-templates/env-template-${b}.env`, envContent);
      console.log(`✅ Written: env-template-${b}.env`);
    }

    // Write checklist
    const checklist = generateSetupChecklist(b);
    fs.writeFileSync(`./checklists/setup-checklist-${b}.txt`, checklist);
    console.log(`✅ Written: setup-checklist-${b}.txt`);

    // Write Airtable schema if exists
    if (AIRTABLE_SCHEMAS[b]) {
      fs.writeFileSync(
        `./airtable-schemas/airtable-schema-${b}.json`,
        JSON.stringify(AIRTABLE_SCHEMAS[b], null, 2)
      );
      console.log(`✅ Written: airtable-schema-${b}.json`);
    }

    // Write Pinterest boards JSON
    if (PINTEREST_BOARDS[b]) {
      fs.writeFileSync(
        `./pinterest-boards/boards-${b}.json`,
        JSON.stringify(PINTEREST_BOARDS[b], null, 2)
      );
      console.log(`✅ Written: boards-${b}.json`);
    }
  }
}

// ── CLI ───────────────────────────────────────────────────────

import * as dotenv from 'dotenv';
dotenv.config();

// Create output dirs
['./env-templates', './checklists', './airtable-schemas', './pinterest-boards', './setup-logs']
  .forEach(dir => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); });

const args = process.argv.slice(2);
const brandFlag = args.indexOf('--brand');
const brandArg = brandFlag !== -1 ? args[brandFlag + 1] : 'all';
const createBoards = args.includes('--create-boards');

console.log(`\n🚀 Rick.AI — Social Setup Token & Config Generator`);
console.log(`   Brand: ${brandArg} | Create boards: ${createBoards}\n`);

outputAll(brandArg);

if (createBoards) {
  const brandsToProcess = brandArg === 'all' ? Object.keys(PINTEREST_BOARDS) : [brandArg];
  (async () => {
    for (const b of brandsToProcess) {
      await createPinterestBoards(b);
    }
  })();
}

console.log(`\n✅ Done. Check output directories for generated files.\n`);
