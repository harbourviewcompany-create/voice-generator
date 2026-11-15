#!/usr/bin/env python3
"""
Simple CLI voice generator using edge-tts.
Install: pip install edge-tts
"""

import argparse
import asyncio
import json
from pathlib import Path

try:
    import edge_tts
except ImportError:
    print("Please install edge-tts: pip install edge-tts")
    raise SystemExit(1)


PROFILES_DIR = Path(__file__).parent.parent / "profiles"

# Common high-quality Edge voices
VOICE_MAP = {
    "harbour": "en-CA-LiamNeural",      # Canadian male
    "nova": "en-US-JennyNeural",        # Clear female
    "default": "en-US-GuyNeural",
}


def load_profile(profile_id: str) -> dict:
    path = PROFILES_DIR / f"{profile_id}.json"
    if path.exists():
        with open(path) as f:
            return json.load(f)
    return {}


async def generate(text: str, voice: str, rate: str, pitch: str, output: str):
    communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
    await communicate.save(output)
    print(f"Saved → {output}")


def main():
    parser = argparse.ArgumentParser(description="Generate voice samples with edge-tts")
    parser.add_argument("--profile", default="harbour", help="Profile ID (harbour, nova, etc.)")
    parser.add_argument("--text", required=True, help="Text to speak")
    parser.add_argument("--voice", help="Override Edge voice name")
    parser.add_argument("--rate", default="+0%", help="Rate adjustment, e.g. -10% or +5%")
    parser.add_argument("--pitch", default="+0Hz", help="Pitch adjustment, e.g. -5Hz")
    parser.add_argument("--output", default="output.mp3", help="Output filename")
    args = parser.parse_args()

    profile = load_profile(args.profile)
    voice = args.voice or VOICE_MAP.get(args.profile, VOICE_MAP["default"])

    print(f"Profile : {args.profile}")
    print(f"Voice   : {voice}")
    print(f"Text    : {args.text[:60]}{'...' if len(args.text) > 60 else ''}")

    asyncio.run(generate(args.text, voice, args.rate, args.pitch, args.output))


if __name__ == "__main__":
    main()
