# Hair Hack — Clinic Demo MVP

In-clinic demo: upload a photo → AI preview of hair restoration via **OpenAI Images API** (`gpt-image-2`).

## Docs

| File | Description |
|------|-------------|
| [docs/SPEC.md](docs/SPEC.md) | Product & technical spec |
| [docs/PLAN.md](docs/PLAN.md) | Phases & architecture |
| [docs/TASKS.md](docs/TASKS.md) | Phase 1 task backlog |
| [docs/COLLABORATION.md](docs/COLLABORATION.md) | Team workflow & GitHub |
| [docs/legal/COMPLIANCE.md](docs/legal/COMPLIANCE.md) | Legal risk register & gates |
| [AGENTS.md](AGENTS.md) | AI agent instructions |

## Quick start

```bash
cp .env.example .env.local
# Add OPENAI_API_KEY to .env.local

npm install
./scripts/install-agent-skills.sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Team setup

```bash
git clone git@github.com:lamapony/hair-hack.git
cp .env.example .env.local   # get OPENAI_API_KEY from team lead
npm install
./scripts/install-agent-skills.sh
npm run dev
```

See [docs/COLLABORATION.md](docs/COLLABORATION.md) for branch workflow and secrets.

## Agent Skills

Uses [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) for spec → plan → build → test → review → ship workflows.

## How it works

1. Consultant uploads prospect photo (face / crown).
2. `POST /api/generate` calls `openai.images.edit` with a goal-specific prompt.
3. Result shown next to original (slider compare in Phase 1).

## Environment

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key with image access |
| `OPENAI_IMAGE_MODEL` | Optional: `gpt-image-2` (default), `gpt-image-1`, … |

## Stack

- Next.js 15 (App Router)
- OpenAI SDK
- Tailwind CSS 4

## Status

- **Phase 0 (MVP):** done
- **Phase 1 (Foundation):** planned — see [docs/TASKS.md](docs/TASKS.md)
- **Next for team:** invite collaborators on [lamapony/hair-hack](https://github.com/lamapony/hair-hack)
- **Parallel tracks:** 3D API spike ([docs/3D-API-EVAL.md](docs/3D-API-EVAL.md)), legal ([docs/legal/COMPLIANCE.md](docs/legal/COMPLIANCE.md))
