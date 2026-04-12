"""
Voice generator using ElevenLabs API.
Converts script text to spoken audio (MP3) using Ricky's cloned voice.
"""

import logging
import os
from pathlib import Path

import requests

logger = logging.getLogger(__name__)

ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1"


def generate_voice(
    text: str,
    voice_id: str,
    output_path: str,
    api_key: str | None = None,
    model_id: str = "eleven_multilingual_v2",
    stability: float = 0.5,
    similarity_boost: float = 0.75,
) -> str:
    """
    Generate voice audio from text using ElevenLabs.

    Args:
        text: The script text to convert to speech
        voice_id: ElevenLabs voice ID
        output_path: Where to save the MP3 file
        api_key: ElevenLabs API key (loaded from env if not provided)
        model_id: ElevenLabs model to use
        stability: Voice stability (0-1)
        similarity_boost: Voice similarity boost (0-1)

    Returns:
        The output file path
    """
    if api_key is None:
        api_key = os.environ.get("ELEVENLABS_API_KEY")
        if not api_key:
            raise ValueError(
                "ELEVENLABS_API_KEY not set. Provide it or set in .env"
            )

    url = f"{ELEVENLABS_BASE_URL}/text-to-speech/{voice_id}"

    headers = {
        "xi-api-key": api_key,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
    }

    payload = {
        "text": text,
        "model_id": model_id,
        "voice_settings": {
            "stability": stability,
            "similarity_boost": similarity_boost,
        },
    }

    logger.info(
        "Generating voice for %d chars with voice %s", len(text), voice_id
    )

    response = requests.post(url, json=payload, headers=headers, timeout=120)

    if response.status_code != 200:
        logger.error(
            "ElevenLabs API error %d: %s",
            response.status_code,
            response.text[:500],
        )
        raise RuntimeError(
            f"ElevenLabs API error {response.status_code}: {response.text[:200]}"
        )

    # Ensure output directory exists
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "wb") as f:
        f.write(response.content)

    file_size = Path(output_path).stat().st_size
    logger.info("Saved audio to %s (%d bytes)", output_path, file_size)

    return output_path


if __name__ == "__main__":
    from pathlib import Path as P
    from dotenv import load_dotenv

    load_dotenv(P(__file__).parent / ".env")

    logging.basicConfig(level=logging.INFO)

    out = generate_voice(
        text="Hello, this is a test of the voice generation system.",
        voice_id="SJybVYNKbV5QKpeuh75j",
        output_path=str(P(__file__).parent / "output" / "test-voice.mp3"),
    )
    print(f"Generated: {out}")
