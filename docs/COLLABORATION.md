# Collaboration — Hair Hack

How the dev team works on this repo.

## Repository access

1. **Host:** [github.com/lamapony/hair-hack](https://github.com/lamapony/hair-hack) (private recommended).
2. **Owner** adds collaborators:
   - GitHub → Settings → Collaborators → Add people
   - Or: GitHub Organization with a `hair-hack` team
3. **Each developer** clones and sets up locally:

```bash
git clone git@github.com:lamapony/hair-hack.git
cd hair-hack
cp .env.example .env.local
# Ask team lead for OPENAI_API_KEY (shared dev key) or use your own
npm install
./scripts/install-agent-skills.sh
npm run dev
```

## Secrets (important)

| File | In git? | Notes |
|------|---------|-------|
| `.env.local` | **Never** | Each dev has their own copy |
| `.env.example` | Yes | Documents variables, no real keys |
| `OPENAI_API_KEY` | Never | Share via 1Password / team vault, not Slack |

For **shared dev API key:** one key in the team password manager; rotate if someone leaves.

For **production:** separate key in Vercel env vars only.

## Branch workflow

```
main          → deployable; protected
feature/*     → your work; PR into main
```

1. `git checkout -b feature/T1.1.1-vitest`
2. Implement one task from [TASKS.md](./TASKS.md)
3. `npm run build` (+ `npm test` when available)
4. Open PR; one reviewer from the team
5. Squash merge to `main`

## What to read first

1. [SPEC.md](./SPEC.md) — product decisions
2. [PLAN.md](./PLAN.md) — phases
3. [TASKS.md](./TASKS.md) — pick an unassigned task
4. [AGENTS.md](../AGENTS.md) — if using Cursor with agent-skills

## Task assignment

Use GitHub Issues or a simple table in TASKS.md:

| Task | Owner | Status |
|------|-------|--------|
| T1.1.1 Vitest | — | pending |

Claim a task in PR description: `Closes #N` or `Task: T1.1.1`.

## Agent skills

Everyone should run once after clone:

```bash
./scripts/install-agent-skills.sh
```

Skills live in `.cursor/skills/` (symlinks). Vendor copy is gitignored; script recreates it.

## Communication

- **Scope changes** → update `docs/SPEC.md` first, then code
- **New env vars** → update `.env.example` + README in same PR
- **Stuck on OpenAI quality** → use fixture photos in `public/fixtures/` (add when created), don't paste patient photos in chat
