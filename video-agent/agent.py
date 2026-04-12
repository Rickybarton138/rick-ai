"""
Video Ad Generation Agent — main orchestrator.

Generates video ads for brands using:
  - OpenAI (script generation)
  - ElevenLabs (voice synthesis)
  - HeyGen (avatar video)

Usage:
  python agent.py --brand astra --topic "spring moving season" --duration 60
  python agent.py --brand all --topic "spring campaign" --duration 45
  python agent.py --brand magna --topic "student storage summer" --duration 30 --script-only
  python agent.py --brand rickai --topic "AI for small business" --dry-run
"""

import argparse
import json
import logging
import os
import re
import sys
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv

# Load environment variables
_env_path = Path(__file__).parent / ".env"
load_dotenv(_env_path)

# Also load OpenAI key from social-media-agent if not already set
_social_env = Path.home() / "social-media-agent" / ".env"
if _social_env.exists():
    load_dotenv(_social_env, override=False)

from config import get_brand, list_brands, BRANDS
from script_generator import generate_script
from voice_generator import generate_voice
from video_generator import (
    generate_video,
    poll_video_completion,
    download_video,
)

logger = logging.getLogger(__name__)

OUTPUT_DIR = Path(__file__).parent / "output"
LOG_FILE = OUTPUT_DIR / "generation-log.json"


def slugify(text: str) -> str:
    """Convert text to a URL/filename-safe slug."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[-\s]+", "-", text)
    return text[:60]


def load_log() -> list:
    """Load the generation log."""
    if LOG_FILE.exists():
        try:
            return json.loads(LOG_FILE.read_text())
        except (json.JSONDecodeError, IOError):
            return []
    return []


def save_log(entries: list) -> None:
    """Save the generation log."""
    LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
    LOG_FILE.write_text(json.dumps(entries, indent=2, default=str))


def append_log(entry: dict) -> None:
    """Append an entry to the generation log."""
    entries = load_log()
    entries.append(entry)
    save_log(entries)


def process_brand(
    brand_key: str,
    topic: str,
    duration: int,
    script_only: bool = False,
    voice_only: bool = False,
    dry_run: bool = False,
) -> dict:
    """
    Process a single brand through the full pipeline.

    Returns a log entry dict with all results and paths.
    """
    brand = get_brand(brand_key)
    date_str = datetime.now().strftime("%Y-%m-%d")
    topic_slug = slugify(topic)
    brand_output = OUTPUT_DIR / brand_key

    log_entry = {
        "brand": brand_key,
        "brand_name": brand["name"],
        "topic": topic,
        "duration_target": duration,
        "timestamp": datetime.now().isoformat(),
        "mode": "dry-run" if dry_run else ("script-only" if script_only else ("voice-only" if voice_only else "full")),
    }

    print(f"\n{'='*60}")
    print(f"  {brand['name']} | {topic}")
    print(f"{'='*60}")

    # ── Step 1: Generate Script ──
    if dry_run:
        print(f"\n[DRY RUN] Would generate {duration}s script for '{topic}'")
        print(f"  Brand: {brand['name']}")
        print(f"  Avatar: {brand['avatar_id']}")
        print(f"  Voice: {brand['voice_id']}")
        print(f"  Tone: {brand['tone']}")
        print(f"  CTA: {brand['cta']}")
        log_entry["status"] = "dry-run"
        append_log(log_entry)
        return log_entry

    print("\n[1/4] Generating script...")
    try:
        script = generate_script(brand_key, topic, duration)
    except Exception as e:
        logger.error("Script generation failed: %s", e)
        log_entry["status"] = "failed"
        log_entry["error"] = f"Script generation: {e}"
        append_log(log_entry)
        print(f"  ERROR: {e}")
        return log_entry

    log_entry["script"] = script
    total_duration = sum(s["duration"] for s in script["scenes"])
    print(f"  Title: {script['title']}")
    print(f"  Scenes: {len(script['scenes'])} ({total_duration}s total)")
    print(f"\n  --- Script ---")
    print(f"  {script['script']}")
    print(f"  --- End ---\n")

    # Save script to file
    brand_output.mkdir(parents=True, exist_ok=True)
    script_path = brand_output / f"{date_str}-{topic_slug}-script.json"
    script_path.write_text(json.dumps(script, indent=2))
    log_entry["script_path"] = str(script_path)

    if script_only:
        log_entry["status"] = "script-only"
        append_log(log_entry)
        print("[DONE] Script saved to:", script_path)
        return log_entry

    # ── Step 2: Generate Voiceover ──
    print("[2/4] Generating voiceover via ElevenLabs...")
    audio_path = str(brand_output / f"{date_str}-{topic_slug}.mp3")
    try:
        generate_voice(
            text=script["script"],
            voice_id=brand["voice_id"],
            output_path=audio_path,
        )
    except Exception as e:
        logger.error("Voice generation failed: %s", e)
        log_entry["status"] = "failed"
        log_entry["error"] = f"Voice generation: {e}"
        append_log(log_entry)
        print(f"  ERROR: {e}")
        return log_entry

    log_entry["audio_path"] = audio_path
    print(f"  Audio saved: {audio_path}")

    if voice_only:
        log_entry["status"] = "voice-only"
        append_log(log_entry)
        print("[DONE] Script + voiceover generated.")
        return log_entry

    # ── Step 3: Generate Video via HeyGen ──
    print("[3/4] Creating video via HeyGen...")
    try:
        # Use HeyGen TTS mode (simpler, works with free tier)
        # For custom audio, you'd need to host the MP3 and pass voice_audio_url
        video_result = generate_video(
            script_text=script["script"],
            avatar_id=brand["avatar_id"],
            voice_id=brand["voice_id"],
        )
    except Exception as e:
        logger.error("Video generation failed: %s", e)
        log_entry["status"] = "failed"
        log_entry["error"] = f"Video generation: {e}"
        append_log(log_entry)
        print(f"  ERROR: {e}")
        return log_entry

    video_id = video_result["video_id"]
    log_entry["video_id"] = video_id
    print(f"  Video ID: {video_id}")

    # ── Step 4: Poll and Download ──
    print("[4/4] Waiting for video to render...")
    try:
        status = poll_video_completion(video_id, poll_interval=15, max_wait=600)
    except (RuntimeError, TimeoutError) as e:
        logger.error("Video polling failed: %s", e)
        log_entry["status"] = "failed"
        log_entry["error"] = f"Video polling: {e}"
        append_log(log_entry)
        print(f"  ERROR: {e}")
        return log_entry

    video_url = status.get("video_url")
    if not video_url:
        log_entry["status"] = "failed"
        log_entry["error"] = "No video URL in completed status"
        append_log(log_entry)
        print("  ERROR: Video completed but no URL returned")
        return log_entry

    video_path = str(brand_output / f"{date_str}-{topic_slug}.mp4")
    try:
        download_video(video_url, video_path)
    except Exception as e:
        logger.error("Video download failed: %s", e)
        log_entry["status"] = "failed"
        log_entry["error"] = f"Download: {e}"
        log_entry["video_url"] = video_url
        append_log(log_entry)
        print(f"  ERROR downloading: {e}")
        print(f"  Video URL (manual download): {video_url}")
        return log_entry

    log_entry["video_path"] = video_path
    log_entry["video_url"] = video_url
    log_entry["status"] = "completed"
    append_log(log_entry)

    print(f"\n  Video saved: {video_path}")
    print(f"  Video URL: {video_url}")
    print("[DONE] Full pipeline complete!")

    return log_entry


def main():
    parser = argparse.ArgumentParser(
        description="Video Ad Generation Agent",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Examples:\n"
            '  python agent.py --brand astra --topic "spring moving season" --duration 60\n'
            '  python agent.py --brand all --topic "spring campaign" --duration 45\n'
            '  python agent.py --brand magna --topic "student storage" --script-only\n'
            '  python agent.py --brand rickai --topic "AI solutions" --dry-run\n'
        ),
    )
    parser.add_argument(
        "--brand",
        required=True,
        help='Brand key (astra, magna, coachmentor, primehaul, rickai) or "all"',
    )
    parser.add_argument(
        "--topic",
        required=True,
        help="The ad topic/angle",
    )
    parser.add_argument(
        "--duration",
        type=int,
        default=60,
        help="Target duration in seconds (default: 60)",
    )
    parser.add_argument(
        "--script-only",
        action="store_true",
        help="Generate script only, no voice or video",
    )
    parser.add_argument(
        "--voice-only",
        action="store_true",
        help="Generate script + voiceover, no video",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be generated without calling APIs",
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Enable debug logging",
    )

    args = parser.parse_args()

    # Configure logging
    log_level = logging.DEBUG if args.verbose else logging.INFO
    logging.basicConfig(
        level=log_level,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        datefmt="%H:%M:%S",
    )

    # Validate environment
    if not args.dry_run and not args.script_only:
        missing = []
        if not os.environ.get("ELEVENLABS_API_KEY"):
            missing.append("ELEVENLABS_API_KEY")
        if not os.environ.get("OPENAI_API_KEY"):
            missing.append("OPENAI_API_KEY")
        if not args.voice_only and not os.environ.get("HEYGEN_API_KEY"):
            missing.append("HEYGEN_API_KEY")
        if missing:
            print(f"ERROR: Missing environment variables: {', '.join(missing)}")
            print("Set them in .env or export them.")
            sys.exit(1)

    if not args.dry_run and not os.environ.get("OPENAI_API_KEY"):
        print("ERROR: OPENAI_API_KEY not set (needed for script generation)")
        sys.exit(1)

    # Determine brands to process
    if args.brand.lower() == "all":
        brand_keys = list_brands()
    else:
        brand_keys = [args.brand.lower()]
        # Validate brand exists
        try:
            get_brand(brand_keys[0])
        except KeyError as e:
            print(f"ERROR: {e}")
            sys.exit(1)

    print(f"\nVideo Ad Agent")
    print(f"Brands: {', '.join(brand_keys)}")
    print(f"Topic: {args.topic}")
    print(f"Duration: {args.duration}s")
    mode = "dry-run" if args.dry_run else ("script-only" if args.script_only else ("voice-only" if args.voice_only else "full"))
    print(f"Mode: {mode}")

    # Process each brand
    results = []
    for key in brand_keys:
        try:
            result = process_brand(
                brand_key=key,
                topic=args.topic,
                duration=args.duration,
                script_only=args.script_only,
                voice_only=args.voice_only,
                dry_run=args.dry_run,
            )
            results.append(result)
        except Exception as e:
            logger.error("Unexpected error processing %s: %s", key, e)
            results.append({"brand": key, "status": "error", "error": str(e)})

    # Summary
    print(f"\n{'='*60}")
    print("  SUMMARY")
    print(f"{'='*60}")
    for r in results:
        status = r.get("status", "unknown")
        icon = "OK" if status in ("completed", "script-only", "voice-only", "dry-run") else "FAIL"
        print(f"  [{icon}] {r.get('brand_name', r['brand'])}: {status}")
    print()


if __name__ == "__main__":
    main()
