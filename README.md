# Voice Generator

A practical toolkit for creating consistent, high-quality text-to-speech voices — optimized for use with Grok and other AI assistants.

## Features

- **Voice Profiles** — Reusable, detailed voice definitions for consistent results
- **Browser Demo** — Instant TTS using the Web Speech API (no backend required)
- **Grok Optimization System** — Prompt templates and iteration workflow for AI-assisted voice generation
- **Python CLI** — Optional higher-quality generation with `edge-tts`
- **Prompt Library** — Ready-to-use templates for locking in voice characteristics

## Quick Start (Browser)

1. Open `web/index.html` in any modern browser
2. Select or create a voice profile
3. Enter text and generate speech

No installation needed.

## Voice Profiles

See `/profiles/` for example profiles. Copy and customize them.

### Example Profile Format

```json
{
  "id": "harbour",
  "name": "Harbour",
  "description": "Calm, authoritative Canadian male — mid-30s",
  "gender": "male",
  "age": "mid-30s",
  "accent": "Canadian English (soft)",
  "pitch": "medium-low",
  "rate": "moderate",
  "timbre": "warm, slightly gravelly",
  "emotion_baseline": "calm confidence",
  "style": "professional narration / conversational",
  "grok_prompt": "Use the Harbour voice: calm authoritative Canadian male, mid-30s, medium-low pitch, warm slightly gravelly timbre, moderate pace, calm confidence."
}
```

## Optimizing Grok for Voice Generation

### Core Workflow

1. **Define the profile first** (save it in `/profiles`)
2. **Generate short samples** (1–2 sentences) and iterate
3. **Lock the voice** by always referencing the same profile description
4. **Batch test** variations of rate/pitch/emotion while keeping the core identity

### Recommended Prompt Structure

```text
Generate a voice sample with these exact parameters:
- Voice Profile: [name or full description]
- Tone/Emotion: [specific]
- Speaking rate: [slow / normal / fast]
- Pitch: [low / medium / high]
- Style: [narration / conversational / commercial]
- Text: “[exact words]”
```

### Iteration Tips

- Always start with a short sample
- Change only 1–2 variables at a time
- Once you like a voice, paste the exact successful description back into future prompts
- Keep a “locked” version of the profile in the repo

## Python CLI (Optional Higher Quality)

```bash
pip install edge-tts
python cli/generate.py --profile harbour --text "Welcome to Harbourview."
```

Requires internet (uses Microsoft Edge TTS voices).

## Project Structure

```
voice-generator/
├── README.md
├── profiles/           # Voice profile definitions
├── web/                # Browser-based demo
├── cli/                # Python generation script
├── prompts/            # Grok prompt templates
└── docs/               # Additional guides
```

## License

MIT
