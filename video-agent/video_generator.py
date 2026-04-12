"""
Video generator using HeyGen API.
Creates talking-head avatar videos with either HeyGen TTS or custom ElevenLabs audio.
"""

import logging
import os
import time
from pathlib import Path

import requests

logger = logging.getLogger(__name__)

HEYGEN_BASE_URL = "https://api.heygen.com"


def _get_api_key() -> str:
    """Get HeyGen API key from environment."""
    key = os.environ.get("HEYGEN_API_KEY")
    if not key:
        raise ValueError("HEYGEN_API_KEY not set. Provide it or set in .env")
    return key


def _headers(api_key: str | None = None) -> dict:
    """Build request headers."""
    key = api_key or _get_api_key()
    return {
        "X-Api-Key": key,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }


def generate_video(
    script_text: str,
    avatar_id: str,
    voice_id: str | None = None,
    voice_audio_url: str | None = None,
    api_key: str | None = None,
    test: bool = False,
) -> dict:
    """
    Generate an avatar video via HeyGen API.

    Two modes:
    a) HeyGen TTS mode: pass script_text + avatar, HeyGen handles voice
       (requires voice_id for HeyGen's voice selection)
    b) Custom audio mode: pass voice_audio_url, HeyGen lip-syncs avatar to it

    Args:
        script_text: The script for the avatar to speak
        avatar_id: HeyGen avatar ID
        voice_id: HeyGen voice ID (for TTS mode)
        voice_audio_url: URL to pre-generated audio (for custom audio mode)
        api_key: HeyGen API key (loaded from env if not provided)
        test: If True, use test mode (lower quality, doesn't count against quota)

    Returns:
        dict with video_id and status
    """
    url = f"{HEYGEN_BASE_URL}/v2/video/generate"
    hdrs = _headers(api_key)

    # Build the voice/audio input
    if voice_audio_url:
        voice_input = {
            "type": "audio",
            "audio_url": voice_audio_url,
        }
        logger.info("Using custom audio mode: %s", voice_audio_url)
    elif voice_id:
        voice_input = {
            "type": "text",
            "input_text": script_text,
            "voice_id": voice_id,
        }
        logger.info("Using HeyGen TTS mode with voice: %s", voice_id)
    else:
        raise ValueError("Must provide either voice_id or voice_audio_url")

    payload = {
        "video_inputs": [
            {
                "character": {
                    "type": "avatar",
                    "avatar_id": avatar_id,
                    "avatar_style": "normal",
                },
                "voice": voice_input,
            }
        ],
        "dimension": {"width": 1920, "height": 1080},
        "test": test,
    }

    logger.info(
        "Creating video with avatar %s (%d char script)",
        avatar_id,
        len(script_text),
    )

    response = requests.post(url, json=payload, headers=hdrs, timeout=60)

    if response.status_code != 200:
        logger.error(
            "HeyGen API error %d: %s",
            response.status_code,
            response.text[:500],
        )
        raise RuntimeError(
            f"HeyGen API error {response.status_code}: {response.text[:200]}"
        )

    data = response.json()

    if data.get("error"):
        raise RuntimeError(f"HeyGen error: {data['error']}")

    video_id = data.get("data", {}).get("video_id")
    if not video_id:
        raise RuntimeError(f"No video_id in HeyGen response: {data}")

    logger.info("Video creation started: %s", video_id)
    return {"video_id": video_id, "status": "processing"}


def check_video_status(video_id: str, api_key: str | None = None) -> dict:
    """
    Check the status of a HeyGen video generation job.

    Args:
        video_id: The HeyGen video ID
        api_key: HeyGen API key

    Returns:
        dict with status, video_url (if complete), and other metadata
    """
    url = f"{HEYGEN_BASE_URL}/v1/video_status.get"
    hdrs = _headers(api_key)

    response = requests.get(
        url, params={"video_id": video_id}, headers=hdrs, timeout=30
    )

    if response.status_code != 200:
        logger.error(
            "HeyGen status check error %d: %s",
            response.status_code,
            response.text[:500],
        )
        raise RuntimeError(
            f"HeyGen status error {response.status_code}: {response.text[:200]}"
        )

    data = response.json().get("data", {})

    result = {
        "video_id": video_id,
        "status": data.get("status", "unknown"),
    }

    if data.get("video_url"):
        result["video_url"] = data["video_url"]
    if data.get("duration"):
        result["duration"] = data["duration"]
    if data.get("error"):
        result["error"] = data["error"]

    logger.info("Video %s status: %s", video_id, result["status"])
    return result


def poll_video_completion(
    video_id: str,
    api_key: str | None = None,
    poll_interval: int = 15,
    max_wait: int = 600,
) -> dict:
    """
    Poll HeyGen until video is complete or failed.

    Args:
        video_id: The HeyGen video ID
        api_key: HeyGen API key
        poll_interval: Seconds between status checks
        max_wait: Maximum seconds to wait before giving up

    Returns:
        Final status dict with video_url if successful
    """
    logger.info(
        "Polling video %s (every %ds, max %ds)", video_id, poll_interval, max_wait
    )

    elapsed = 0
    while elapsed < max_wait:
        status = check_video_status(video_id, api_key)

        if status["status"] == "completed":
            logger.info("Video %s completed!", video_id)
            return status
        elif status["status"] == "failed":
            error_msg = status.get("error", "Unknown error")
            raise RuntimeError(f"Video generation failed: {error_msg}")
        elif status["status"] in ("processing", "pending"):
            logger.info(
                "Video %s still %s (%ds elapsed)...",
                video_id,
                status["status"],
                elapsed,
            )
            time.sleep(poll_interval)
            elapsed += poll_interval
        else:
            logger.warning("Unknown status: %s", status["status"])
            time.sleep(poll_interval)
            elapsed += poll_interval

    raise TimeoutError(
        f"Video {video_id} did not complete within {max_wait}s"
    )


def download_video(video_url: str, output_path: str) -> str:
    """
    Download a completed video from HeyGen.

    Args:
        video_url: URL of the completed video
        output_path: Local path to save the video

    Returns:
        The output file path
    """
    logger.info("Downloading video from %s", video_url)

    Path(output_path).parent.mkdir(parents=True, exist_ok=True)

    response = requests.get(video_url, stream=True, timeout=120)
    response.raise_for_status()

    with open(output_path, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)

    file_size = Path(output_path).stat().st_size
    logger.info("Downloaded video to %s (%d bytes)", output_path, file_size)
    return output_path


if __name__ == "__main__":
    from pathlib import Path as P
    from dotenv import load_dotenv

    load_dotenv(P(__file__).parent / ".env")

    logging.basicConfig(level=logging.INFO)

    # Quick test: check a video status (replace with real ID)
    print("Video generator module loaded successfully.")
    print("Available functions: generate_video, check_video_status, poll_video_completion, download_video")
