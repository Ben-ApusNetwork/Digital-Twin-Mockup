# OpenClaw MemoryLoop Demo Release

This package contains the files needed to move the `openclaw-memoryloop-demo`
skill and the `telegram-memory-sidecar` hook into another OpenClaw instance.

## What This Project Does

This project adds an audited memory sidecar to OpenClaw.

It does not replace the main agent.
It watches user inputs such as chats, articles, and images, then decides whether
the new signal should be:

- `PROMOTED`: deployed to long-term memory
- `ACCEPTED`: held for more evidence
- `REJECTED`: blocked by policy

The sidecar can also send a compact follow-up summary after Telegram replies and
supports a `/memory` command for viewing stored memory state.

## Release Contents

- `skills/openclaw-memoryloop-demo/`
  The skill itself, including the core audit logic, demo runner, and seed config.
- `openclaw-hooks/telegram-memory-sidecar/`
  The Telegram hook that calls the memory observer after replies.
- `dist/openclaw-memoryloop-demo-export-20260328.tar.gz`
  A packed export bundle for quick transfer or archival.
- `TECH_STACK.md`
  One-page technical framework for PRD or demo explanation.

## Install Targets

Copy these folders to the target OpenClaw machine:

- `skills/openclaw-memoryloop-demo/` -> `~/.openclaw/skills/openclaw-memoryloop-demo/`
- `openclaw-hooks/telegram-memory-sidecar/` -> `~/.openclaw/hooks/telegram-memory-sidecar/`

## Requirements

- `python3`
- Telegram enabled in `~/.openclaw/openclaw.json`
- `channels.telegram.botToken` configured
- Optional `OPENAI_API_KEY` or another vision-capable provider for raw image understanding

## Enable The Hook

```bash
~/.openclaw/bin/openclaw hooks enable telegram-memory-sidecar
```

Then restart the user-mode gateway that serves Telegram.

## Key Files

- `skills/openclaw-memoryloop-demo/SKILL.md`
- `skills/openclaw-memoryloop-demo/EXPORT.md`
- `skills/openclaw-memoryloop-demo/scripts/memoryloop_core.py`
- `skills/openclaw-memoryloop-demo/scripts/instant_memory_feedback.py`
- `skills/openclaw-memoryloop-demo/scripts/vision_caption.py`
- `skills/openclaw-memoryloop-demo/state/role_profile.json`
- `skills/openclaw-memoryloop-demo/state/audit_policy.json`
- `openclaw-hooks/telegram-memory-sidecar/HOOK.md`
- `openclaw-hooks/telegram-memory-sidecar/handler.js`

## Sidecar Output Contract

Each memory observer summary uses the same compact format:

- `SOURCE_ACCEPTED=...`
- `TRACE_STORED=...`
- `SHORT_TERM_SIGNAL=...`
- `PROMOTED=...`
- `ACCEPTED=...`
- `REJECTED=...`
- `PACK_SIZE=...`

`PACK_SIZE` counts unique promoted long-term memory keys.
