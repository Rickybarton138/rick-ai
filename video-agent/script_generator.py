"""
Script generator for video ads.
Uses OpenAI to generate structured ad scripts based on brand persona and topic.
"""

import json
import logging
import math

from openai import OpenAI

from config import get_brand

logger = logging.getLogger(__name__)


def _build_prompt(brand: dict, topic: str, duration_seconds: int) -> str:
    """Build the system + user prompt for script generation."""
    num_scenes = max(2, math.ceil(duration_seconds / 7))
    avg_scene_duration = round(duration_seconds / num_scenes)

    system = (
        "You are an expert video ad scriptwriter. You write short, punchy scripts "
        "for talking-head avatar videos. The avatar speaks directly to camera.\n\n"
        "Rules:\n"
        "- Write in a conversational, spoken style (no stage directions)\n"
        "- Each scene is a continuous block of speech (5-10 seconds)\n"
        "- The final scene MUST include the call to action\n"
        "- Keep sentences short. One idea per scene.\n"
        "- Match the brand tone exactly\n"
        "- Naturally weave in key messages without listing them\n"
        "- Return valid JSON only, no markdown\n"
    )

    user = (
        f"Brand: {brand['name']}\n"
        f"Tagline: {brand['tagline']}\n"
        f"Tone: {brand['tone']}\n"
        f"Target audience: {brand['target_audience']}\n"
        f"Key messages: {', '.join(brand['key_messages'])}\n"
        f"Call to action: {brand['cta']}\n"
        f"\nTopic/angle for this ad: {topic}\n"
        f"Target duration: {duration_seconds} seconds\n"
        f"Number of scenes: {num_scenes} (approx {avg_scene_duration}s each)\n"
        f"\nReturn JSON in this exact format:\n"
        f'{{\n'
        f'  "title": "Short descriptive title for this ad",\n'
        f'  "script": "The full script as one continuous text",\n'
        f'  "scenes": [\n'
        f'    {{"text": "What the avatar says in scene 1", "duration": 7}},\n'
        f'    {{"text": "What the avatar says in scene 2", "duration": 7}}\n'
        f'  ]\n'
        f'}}\n'
    )

    return system, user


def generate_script(
    brand_key: str,
    topic: str,
    duration_seconds: int = 60,
    client: OpenAI | None = None,
) -> dict:
    """
    Generate a video ad script for the given brand and topic.

    Args:
        brand_key: Key from BRANDS config (e.g. "astra", "magna")
        topic: The ad topic/angle (e.g. "spring moving season")
        duration_seconds: Target duration in seconds
        client: Optional OpenAI client (created if not provided)

    Returns:
        dict with keys: title, script, scenes
    """
    brand = get_brand(brand_key)
    system_prompt, user_prompt = _build_prompt(brand, topic, duration_seconds)

    if client is None:
        client = OpenAI()

    logger.info(
        "Generating script for %s | topic: %s | target: %ds",
        brand["name"],
        topic,
        duration_seconds,
    )

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.8,
        max_tokens=1500,
        response_format={"type": "json_object"},
    )

    raw = response.choices[0].message.content
    logger.debug("Raw OpenAI response: %s", raw)

    try:
        result = json.loads(raw)
    except json.JSONDecodeError as e:
        logger.error("Failed to parse script JSON: %s", e)
        raise ValueError(f"OpenAI returned invalid JSON: {e}") from e

    # Validate structure
    for key in ("title", "script", "scenes"):
        if key not in result:
            raise ValueError(f"Script missing required key: {key}")

    if not isinstance(result["scenes"], list) or len(result["scenes"]) == 0:
        raise ValueError("Script must have at least one scene")

    for i, scene in enumerate(result["scenes"]):
        if "text" not in scene or "duration" not in scene:
            raise ValueError(f"Scene {i} missing 'text' or 'duration'")

    total_duration = sum(s["duration"] for s in result["scenes"])
    logger.info(
        "Generated script '%s' with %d scenes (%ds total)",
        result["title"],
        len(result["scenes"]),
        total_duration,
    )

    return result


if __name__ == "__main__":
    import os
    from pathlib import Path
    from dotenv import load_dotenv

    # Load .env files
    load_dotenv(Path(__file__).parent / ".env")
    social_env = Path.home() / "social-media-agent" / ".env"
    if social_env.exists():
        load_dotenv(social_env)

    logging.basicConfig(level=logging.INFO)

    # Quick test
    script = generate_script("astra", "spring moving season", duration_seconds=30)
    print(json.dumps(script, indent=2))
