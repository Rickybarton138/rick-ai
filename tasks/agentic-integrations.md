# Agentic AI API Integrations — rick-ai

Priority: **P1 — Live revenue project** (portfolio + video ad agent)
Master plan: `~/agentic-ai-apis/INTEGRATION_PLAN.md`

## Prerequisite
Apify MCP must be connected. See master plan.

## Video generation stack (core of video ad agent)

| Agent | Role in pipeline |
|---|---|
| [YouTube Autopilot: LangGraph Video Generation Agent](https://apify.com/wedo_software/wedo-ai-video) | **Primary end-to-end generator** — replaces chunks of current HeyGen+ElevenLabs pipeline |
| [Veo3 Video Generator](https://apify.com/powerai/veo3-video-generator) | Fallback engine — cheaper for short-form text-to-video |
| [Video Script Generator](https://apify.com/powerai/video-script-generator) | Pre-production — generate scripts before voice/video stage |
| [Video Dubbing & Translation](https://apify.com/zhanji/video-dubbing-translation) | Post-production — 32+ language dubbing with voice cloning, instant multi-brand rollout |
| [AI Video Meme Maker](https://apify.com/prodmarkllc/ai-video-maker) | Reels/TikTok short-form pipeline |

## Social intelligence stack (augments existing `social-media` MCP)

| Agent | Purpose |
|---|---|
| [Advanced Social Media Agent](https://apify.com/fiery_dream/advanced-social-media-agent) | Production-grade social analysis |
| [Comments Analyzer Agent](https://apify.com/apify/comments-analyzer-agent) | Cross-platform sentiment alerts (all brands) |
| [Influencer Discovery Agent (Instagram + TikTok)](https://apify.com/hypebridge/influencer-discovery-agent-instagram-tiktok) | Scout collab candidates per brand |
| [Influencer Evaluation Agent (Instagram + TikTok)](https://apify.com/hypebridge/influencer-evaluation-agent-instagram-tiktok) | Score shortlisted influencers |
| [Transcript to LinkedIn Posts Converter](https://apify.com/powerai/transcript-to-linkedin-posts-converter) | Repurpose video transcripts → 10 LinkedIn posts |
| [Meta Ad Library Scraper](https://apify.com/agenscrape/facebook-ad-library-scraper) | Competitive ad-copy intel |
| [AI Brand Visibility](https://apify.com/adityalingwal/ai-brand-visibility) | Weekly GEO tracking per brand |

## What's built (YouTube Autopilot drop-in)

- `video-agent/apify_client.py` — minimal Apify v2 Actor Run client (start → poll → fetch dataset). Standalone, same pattern as the astra-removals version.
- `video-agent/apify_video_generator.py` — **drop-in replacement for `video_generator.py`**. Exposes the same four functions: `generate_video`, `check_video_status`, `poll_video_completion`, `download_video`. Signatures match, so switching engines is a one-line import change.

## How to switch engines

In `video-agent/agent.py`, replace:

```python
from video_generator import (
    generate_video, poll_video_completion, download_video,
)
```

with:

```python
from apify_video_generator import (
    generate_video, poll_video_completion, download_video,
)
```

The ElevenLabs voice-generation step is unnecessary with YouTube Autopilot (the actor is end-to-end), so you can either skip the `[2/4] Generating voiceover` stage or keep it for A/B comparison purposes.

## Environment vars
```
APIFY_TOKEN=           # NEW — from https://console.apify.com/settings/integrations
ELEVENLABS_API_KEY=    # existing (still needed if running both engines)
HEYGEN_API_KEY=        # existing
OPENAI_API_KEY=        # existing (used by script_generator)
```

## Known unknowns

1. **Actor input schema:** Apify's page for `wedo_software~wedo-ai-video` is JS-rendered so WebFetch couldn't read the real input fields. The `generate_video()` function passes a best-effort superset (`topic`, `script`, `duration`, `style`, `language`). First real test will confirm the correct shape — if the run fails with a schema error, check the actor's Input tab on Apify and adjust the `input_payload` dict in `apify_video_generator.py::generate_video`.

2. **Pricing:** Video generation actors can be expensive per run. Set a monthly cap in the Apify console before hitting this in any cron job.

## IMPORTANT — uncommitted WIP in rick-ai

As of 2026-04-10, this repo has significant uncommitted work (CLAUDE.md, video-agent/, several src/ modifications). I did not commit the new Apify files — Ricky should review and commit them alongside his other WIP when ready.

## Next action
1. Get Apify API token from https://console.apify.com/settings/integrations
2. Subscribe to `wedo_software/wedo-ai-video` on Apify
3. Add `APIFY_TOKEN=...` to `video-agent/.env`
4. Run a test comparison:
   ```bash
   # Current HeyGen pipeline
   python agent.py --brand rickai --topic "AI automation for small business" --duration 45
   # Switch the import in agent.py to apify_video_generator, then:
   python agent.py --brand rickai --topic "AI automation for small business" --duration 45
   ```
5. Compare: cost, quality, turnaround, brand-fit. Decide primary engine.
6. Consider adding an `--engine heygen|apify` CLI flag to `agent.py` instead of swapping imports — that's the long-term clean design.
