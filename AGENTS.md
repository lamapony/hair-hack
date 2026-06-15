# AGENTS.md — Hair Hack

Guidance for AI coding agents working in this repository.

## What this is

**Hair Hack** — web app that lets users upload a photo and get an AI preview of hair restoration results (density, hairline, or full). MVP uses Next.js 15 + OpenAI Images API (`images.edit`).

## Source of truth

| Document | Purpose |
|----------|---------|
| [docs/SPEC.md](docs/SPEC.md) | Product + technical spec (read first) |
| [docs/PLAN.md](docs/PLAN.md) | Phased implementation plan |
| [docs/STATUS.md](docs/STATUS.md) | **Track dashboard** — current phase & task status |
| [docs/TASKS.md](docs/TASKS.md) | Actionable task backlog with acceptance criteria |
| [docs/COLLABORATION.md](docs/COLLABORATION.md) | Team workflow, GitHub, secrets |
| [README.md](README.md) | Quick start for humans |

## Agent skills

Skills from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) are installed under `.cursor/skills/`. Vendor copy: `.vendor/agent-skills/`.

Update skills:

```bash
./scripts/install-agent-skills.sh
```

### Intent → skill

| You're doing… | Skill |
|---------------|-------|
| Starting work / picking workflow | `using-agent-skills` |
| New feature or scope change | `spec-driven-development` |
| Breaking work into tasks | `planning-and-task-breakdown` |
| Implementing code | `incremental-implementation` |
| Writing tests | `test-driven-development` |
| UI / UX | `frontend-ui-engineering` |
| API routes / contracts | `api-and-interface-design` |
| Browser QA | `browser-testing-with-devtools` |
| Debugging | `debugging-and-error-recovery` |
| Pre-merge review | `code-review-and-quality` |
| Deploy / launch | `shipping-and-launch` + `security-and-hardening` |

## Architecture (current)

```
src/
  app/
    page.tsx              → renders HairPreviewApp
    api/generate/route.ts → POST: thin handler (validate → provider → response)
  components/
    HairPreviewApp.tsx    → upload, goal picker, before/after
  lib/
    constants.ts          → goals, mime types, size limits
    image.ts              → parseDataUrl, extensionForMime
    validate.ts           → validateGenerateRequest
    errors.ts             → mapGenerationError (user-safe messages)
    prompts.ts            → per-goal edit prompts
    types.ts              → API types
    providers/
      types.ts            → ImageProvider interface
      openai.ts           → OpenAI images.edit implementation
      index.ts            → getImageProvider() factory
tests/unit/               → Vitest (run: npm test)
```

## Environment

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | yes | OpenAI API key |
| `OPENAI_IMAGE_MODEL` | no | Default `gpt-image-2` |
| `IMAGE_PROVIDER` | no | `openai` (default). `hairgen` exists as archived spike — not for production |
| `HAIRGEN_API_KEY` | — | **Not used** — Hairgen integration no-go |

## Anti-patterns

- Implementing features not in `docs/SPEC.md` or `docs/TASKS.md` without updating them first
- Sending full-resolution images without size limits
- Storing user photos without explicit spec + privacy review
- Skipping build verification between tasks
