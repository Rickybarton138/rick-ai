"""
Alternative video generator using Apify's YouTube Autopilot
(LangGraph-Powered Video Generation Agent) actor.

Drop-in replacement for video_generator.py. Exposes the same function names
(generate_video, check_video_status, poll_video_completion, download_video)
so agent.py can switch between engines with a single import change.

Unlike HeyGen, YouTube Autopilot is an end-to-end generator: it takes a
topic/script and produces a complete video — no avatar, no separate voice
step. This means the existing voice_generator step can be skipped when
using this engine (set --voice-only=False and call generate_video directly).

Env:
    APIFY_TOKEN — from https://console.apify.com/settings/integrations
"""

import logging
from pathlib import Path
from typing import Optional

import requests

from apify_client import start_run, get_run, poll_run, get_dataset_items, ApifyError

logger = logging.getLogger(__name__)

ACTOR_ID = "wedo_software~wedo-ai-video"


def generate_video(
    script_text: str,
    avatar_id: Optional[str] = None,  # ignored — kept for interface parity with HeyGen
    voice_id: Optional[str] = None,   # ignored — kept for interface parity with HeyGen
    voice_audio_url: Optional[str] = None,  # ignored
    topic: Optional[str] = None,
    duration: int = 60,
    style: str = "modern",
    api_key: Optional[str] = None,  # ignored — Apify client reads APIFY_TOKEN from env
    test: bool = False,
) -> dict:
    """
    Kick off a video generation run on YouTube Autopilot.

    The HeyGen signature expects script_text + avatar_id + voice_id. This
    engine uses script_text as the video narration/brief and ignores the
    avatar/voice args (YouTube Autopilot chooses its own visuals and voice).

    Returns:
        dict with video_id (Apify run id) and status.
    """
    # Input is a best-effort superset of common fields. The actor ignores
    # unknown fields, and the exact schema isn't documented on the public
    # page (JS-rendered). Adjust after the first successful run.
    # Actor only requires "topic" — confirmed via input schema probe.
    # All other fields are ignored.
    input_payload = {
        "topic": topic or script_text[:200],
    }

    try:
        handle = start_run(ACTOR_ID, input_payload)
    except ApifyError as e:
        logger.error("YouTube Autopilot run start failed: %s", e)
        raise RuntimeError(f"Apify video generation failed: {e}") from e

    logger.info("YouTube Autopilot run started: %s", handle["run_id"])
    return {
        "video_id": handle["run_id"],
        "dataset_id": handle["dataset_id"],
        "status": "processing",
        "engine": "apify-youtube-autopilot",
    }


def check_video_status(video_id: str, api_key: Optional[str] = None) -> dict:
    """
    Check status of a YouTube Autopilot run. video_id is the Apify run id.

    Returns:
        dict with status, video_url (if complete), and metadata.
    """
    try:
        run = get_run(video_id)
    except ApifyError as e:
        raise RuntimeError(f"Apify status check failed: {e}") from e

    status = run.get("status", "unknown").lower()
    # Map Apify statuses to the HeyGen-style vocabulary agent.py expects
    status_map = {
        "ready": "pending",
        "running": "processing",
        "succeeded": "completed",
        "failed": "failed",
        "aborted": "failed",
        "timed-out": "failed",
    }
    mapped = status_map.get(status, "processing")

    result = {
        "video_id": video_id,
        "status": mapped,
        "raw_status": run.get("status"),
        "dataset_id": run.get("defaultDatasetId"),
    }

    if mapped == "completed":
        # Fetch dataset and extract the video URL from the first item
        try:
            items = get_dataset_items(run.get("defaultDatasetId"))
            if items:
                first = items[0] if isinstance(items[0], dict) else {}
                # Try common field names for video URL
                video_url = (
                    first.get("videoUrl")
                    or first.get("video_url")
                    or first.get("url")
                    or first.get("output")
                )
                if video_url:
                    result["video_url"] = video_url
                result["raw_output"] = first
        except ApifyError as e:
            logger.warning("Could not fetch dataset items: %s", e)

    if mapped == "failed":
        result["error"] = run.get("statusMessage") or run.get("status")

    return result


def poll_video_completion(
    video_id: str,
    api_key: Optional[str] = None,
    poll_interval: int = 15,
    max_wait: int = 1200,
) -> dict:
    """
    Poll the Apify run until the video is ready or failed.

    Same interface as video_generator.poll_video_completion.
    """
    logger.info(
        "Polling YouTube Autopilot run %s (every %ds, max %ds)",
        video_id, poll_interval, max_wait,
    )

    try:
        poll_run(video_id, max_wait_seconds=max_wait, poll_interval=poll_interval)
    except ApifyError as e:
        raise RuntimeError(f"Video generation failed: {e}") from e

    # Run succeeded — fetch the final status + dataset
    status = check_video_status(video_id)
    if status["status"] != "completed":
        raise RuntimeError(f"Video finished with unexpected status: {status}")

    return status


def download_video(video_url: str, output_path: str) -> str:
    """Download a completed video. Same as HeyGen version."""
    logger.info("Downloading video from %s", video_url)
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)

    response = requests.get(video_url, stream=True, timeout=300)
    response.raise_for_status()

    with open(output_path, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)

    size = Path(output_path).stat().st_size
    logger.info("Downloaded video to %s (%d bytes)", output_path, size)
    return output_path


if __name__ == "__main__":
    import logging as _log
    _log.basicConfig(level=_log.INFO)
    print("Apify YouTube Autopilot video generator loaded.")
    print("Drop-in replacement for video_generator.py — same function signatures.")
    print("Env: APIFY_TOKEN required")
