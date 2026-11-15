# Full Optimization Workflow with Grok

This document captures the system for getting the best possible voice results from Grok.

## 1. Create a Strong Voice Profile

Write a detailed description covering:

- Gender + approximate age
- Accent / region
- Pitch range
- Timbre / texture
- Default emotion / energy
- Speaking style

Save it as a JSON profile and also keep a short “grok_prompt” version.

## 2. First Generation

Always start short (one or two sentences). Use the exact prompt template in `/prompts/base-template.md`.

## 3. Tight Iteration Loop

- Change only one or two parameters at a time
- Reference the previous successful description explicitly
- Ask for comparative versions when deciding between two directions

## 4. Lock & Document

Once satisfied:

1. Update the profile JSON with the winning description
2. Update the `grok_prompt` field
3. Commit the change so the team (or future you) has the locked version

## 5. Production Use

For any future request, begin with:

> Use the [Profile Name] voice profile exactly as defined.

Then add the specific text and any temporary adjustments.

This dramatically reduces drift and improves consistency across sessions.
