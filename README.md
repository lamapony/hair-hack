# Hair Hack — Clinic Demo MVP

In-clinic demo: upload a photo → AI preview of hair restoration via **OpenAI Images API** (`gpt-image-2`).

## Docs

| File | Description |
|------|-------------|
| [docs/SPEC.md](docs/SPEC.md) | Product & technical spec |
| [docs/PLAN.md](docs/PLAN.md) | Phases & architecture |
| [docs/STATUS.md](docs/STATUS.md) | **Track dashboard** — start here |
| [docs/TASKS.md](docs/TASKS.md) | Phase 1 task backlog |
| [docs/DEPLOY.md](docs/DEPLOY.md) | Vercel deploy & live demo URL |
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

Open [http://localhost:3000](http://localhost:3000) or the hosted demo: [hair-hack.vercel.app](https://hair-hack.vercel.app).

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
3. Drag the before/after slider to compare with the AI result.

## Environment

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key with image access |
| `OPENAI_IMAGE_MODEL` | Optional: `gpt-image-2` (default), `gpt-image-1`, … |

## Stack

- Next.js 15 (App Router)
- OpenAI SDK (`gpt-image-2` via provider adapter)
- Tailwind CSS 4
- Vitest (unit tests)
- GitHub Actions CI

## Dev commands

```bash
npm run dev          # local server
npm test             # unit tests
npm run test:watch   # tests in watch mode
npm run typecheck    # tsc --noEmit
npm run check        # typecheck + test + build
npm run test:e2e     # Playwright smoke (mocked API)
```

## Status

- **Phase 1:** complete — see [docs/STATUS.md](docs/STATUS.md)
- **Live demo:** [hair-hack.vercel.app](https://hair-hack.vercel.app)
- **Legal gate:** off until counsel sign-off ([docs/legal/COMPLIANCE.md](docs/legal/COMPLIANCE.md))
