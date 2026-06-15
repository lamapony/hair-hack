# Spec: Hair Hack

**Status:** v0.5 — ship 2D on OpenAI; Hairgen no-go; 3D deferred  
**Last updated:** 2026-06-15

---

## Decisions (locked)

| Topic | Decision |
|-------|----------|
| **Audience** | **Clinic sales demo** — staff uses it with prospects during consultation |
| **Language** | **English only** |
| **Team** | ~3 devs; repo **https://github.com/lamapony/hair-hack** |
| **Compare UI** | **Before/after slider** |
| **2D provider (production)** | **OpenAI `gpt-image-2`** — sole provider for clinic demo ([eval](./3D-API-EVAL.md)) |
| **3D vision** | **Deferred** — Hairgen.ai **no-go** (cost, fit); revisit Force HT or research APIs only if product requires rotatable 3D |
| **Budget** | **Moderate** — `quality: medium` default; rate limits + daily cap |
| **Legal** | **Separate track** — full compliance before paying clinics → [legal/COMPLIANCE.md](./legal/COMPLIANCE.md) |

---

## Parallel tracks

```
Track SHIP (Phase 1)     Track 3D (deferred)        Track LEGAL (parallel)
─────────────────        ─────────────────          ────────────────────
gpt-image-2 + slider     Hairgen no-go (2026-06)    COMPLIANCE.md
tests + CI               OpenAI prompts + quality   consent UI + /privacy
rate limits              Force HT optional later    counsel sign-off gate
```

## Assumptions

1. **2D provider:** OpenAI `gpt-image-2` via `images.edit` — production default; no alternate vendor planned for MVP.
2. **3D provider:** Not integrating Hairgen.ai (team decision: cost vs value, mask complexity, 2.5D not rotatable 3D). Code spike remains in repo but unused.
3. **Privacy (MVP):** Photos processed in-memory per request, not stored on our servers; sent to provider APIs per their policies.
4. **No auth in MVP:** Clinic staff use shared demo URL; per-user accounts deferred.
5. **Not medical software:** Illustrative sales tool, not clinical prediction or treatment planning.
6. **Deploy target:** Vercel (Next.js App Router, serverless API route).
7. **Cost guardrails:** Shared dev API key; production key in Vercel; env-based daily/hourly caps (Phase 1).
8. **Legal gate:** No paid clinic pilots until [legal/COMPLIANCE.md](./legal/COMPLIANCE.md) sign-off items complete.

---

## Objective

### Problem

People considering hair restoration struggle to imagine post-treatment appearance. Clinics use before/after albums, but prospects want *their own face* in the preview.

### Solution

Hair Hack: upload a photo → pick a goal → receive an AI preview (2D now; 3D when provider integrated). Slider compare for in-clinic demos.

### Users

| Persona | Goal |
|---------|------|
| **Clinic consultant** | Show prospect a believable "after" on their own photo during the visit |
| **Prospect** | See themselves with fuller hair — builds confidence to book |
| **Clinic owner** (later) | Branded demo, optional lead capture |
| **Developer** | Shared repo, tested codebase, safe API costs |

### Success criteria (product)

| # | Criterion | Measurable |
|---|-----------|------------|
| P1 | User can upload JPEG/PNG/WebP ≤8 MB and get a preview | E2E happy path < 2 min |
| P2 | Three distinct goals produce visibly different edits | Manual QA on 3 fixture photos |
| P3 | Face identity preserved (no face swap artifacts) | Prompt + manual review checklist |
| P4 | Clear disclaimer: not medical advice | Visible on every screen |
| P5 | Graceful errors (bad file, API down, timeout) | User sees actionable message, no stack traces |
| P6 | Works on clinic tablet/laptop | 768px+ primary; usable at 375px |
| P7 | Before/after **slider** compare | Drag handle moves reveal line |
| P8 | Consent checkbox before API call | Cannot generate without explicit ack |

### Out of scope (for now)

- User accounts, payment, booking
- Storing generation history server-side
- Multi-angle / video input
- Trichologist-grade measurements (graft count, Norwood scale automation)
- Native mobile apps

---

## Tech stack

| Layer | Choice | Version |
|-------|--------|---------|
| Framework | Next.js (App Router) | 15.x |
| UI | React + Tailwind CSS | 19 / 4 |
| Language | TypeScript | 5.7+ |
| Image AI | OpenAI SDK `images.edit` | openai ^4.77 |
| Runtime | Node.js (Vercel serverless) | 20+ |
| Testing (planned) | Vitest + Playwright | TBD Phase 1 |

---

## Commands

```bash
# Setup
cp .env.example .env.local   # add OPENAI_API_KEY
npm install
./scripts/install-agent-skills.sh

# Development
npm run dev                  # http://localhost:3000

# Quality gates
npm run build                # must pass before merge
npm run lint                 # ESLint (add in Phase 1)

# Tests (Phase 1)
npm test                     # unit — to be added
npm run test:e2e             # Playwright — to be added
```

---

## Project structure

```
hair-hack/
├── .cursor/
│   ├── rules/               # Cursor always-on workflow rules
│   └── skills/              # Symlinks → agent-skills
├── .vendor/agent-skills/    # Cloned addyosmani/agent-skills (gitignored)
├── docs/
│   ├── SPEC.md              # This file
│   ├── PLAN.md              # Phased roadmap
│   └── TASKS.md             # Task backlog
├── scripts/
│   └── install-agent-skills.sh
├── src/
│   ├── app/
│   │   ├── api/generate/    # POST image generation
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/          # React UI
│   └── lib/                 # types, prompts, validators (Phase 1)
├── AGENTS.md                # Agent instructions
└── README.md                # Human quick start
```

**Planned additions (Phase 1+):**

```
src/lib/validate.ts          # shared client/server validation
tests/unit/                  # Vitest
tests/e2e/                   # Playwright
public/fixtures/             # sample photos for QA (no real PII)
```

---

## Code style

- TypeScript strict; explicit types for API request/response bodies in `src/lib/types.ts`
- Server validation mirrors client rules (never trust client-only checks)
- Prompts live in `src/lib/prompts.ts` — single source of truth
- Components: one primary screen component (`HairPreviewApp`) until routing grows
- CSS: design tokens in `:root`; Tailwind utility classes; no inline styles for layout

Example API handler pattern:

```typescript
export async function POST(req: NextRequest) {
  // 1. env check
  // 2. parse + validate body
  // 3. call external service
  // 4. map errors to user-safe messages
  return NextResponse.json<GenerateResponse>({ image, goal });
}
```

---

## API contract

### `POST /api/generate`

**Request**

```json
{
  "image": "data:image/jpeg;base64,...",
  "goal": "density" | "hairline" | "full"
}
```

**Response 200**

```json
{
  "image": "data:image/png;base64,...",
  "goal": "full"
}
```

**Response 4xx/5xx**

```json
{ "error": "Human-readable message" }
```

**Server constraints**

- Max body size: 8 MB decoded image
- MIME: `image/jpeg`, `image/png`, `image/webp`
- Timeout: 120s (`maxDuration`)
- Model: `process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-2"`
- Quality: `process.env.OPENAI_IMAGE_QUALITY ?? "medium"` (`low` | `medium` | `high` | `auto`)

---

## Testing strategy

| Level | Tool | Covers |
|-------|------|--------|
| Unit | Vitest | `parseDataUrl`, `buildPrompt`, validators |
| API | Vitest + mock OpenAI | route validation, error mapping |
| E2E | Playwright | upload → generate (mocked API in CI) |
| Manual | Browser + fixture set | visual quality of AI output |

**Coverage target (Phase 1):** ≥80% on `src/lib/*` and API route validation paths.

**CI gate:** `npm run build` + `npm test` on every PR.

---

## Security & compliance

- API key only server-side (`OPENAI_API_KEY`)
- Rate limit per IP before clinic rollout (Phase 1)
- Moderate budget: `DAILY_GENERATION_CAP` + cheaper model fallback documented in `.env.example`
- No logging of base64 image data
- Disclaimer + link to privacy policy (Phase 1)
- GDPR: document subprocessors (OpenAI); data retention = none on our side for MVP

---

## Boundaries

### Always

- Run `npm run build` before considering a task done
- Validate uploads on server
- User-safe error messages (no raw OpenAI errors in UI)
- Keep medical disclaimer visible

### Ask first

- Adding npm dependencies
- Persisting user images or PII
- Changing OpenAI model or adding providers
- Auth, payments, analytics with identifiers
- Deploying to production / custom domain

### Never

- Commit secrets or `.env.local`
- Edit `.vendor/agent-skills` (vendor copy)
- Remove validation to unblock a demo
- Claim clinical accuracy in copy

---

## Phases (summary)

See [PLAN.md](./PLAN.md) for detail.

| Phase | Name | Outcome |
|-------|------|---------|
| 0 | MVP scaffold | ✅ Upload + 3 goals + OpenAI edit |
| 1 | Foundation | Tests, CI, rate limit, slider, consent, team repo |
| 2 | Clinic product | Branding, embed, share/download, prompt tuning, QA rubric |
| 3 | Scale | Analytics, multi-clinic config, lead capture |
| 4 | Ship | Vercel prod, monitoring, cost alerts |

---

## Open questions

_None blocking Phase 1 — all resolved 2026-06-13._

| # | Was | Resolution |
|---|-----|------------|
| Q1 | Language | English only |
| Q2 | Preview history | Not a priority; no server storage |
| Q3 | Audience | Clinic demo |
| Q4 | Budget | Moderate + caps in Phase 1 |
| Q5 | Compare UI | Slider (see glossary below) |
| Q6 | Consent | Checkbox before generate |

### Glossary (for the team)

**Slider compare** — one image area with a vertical drag handle. Left = before, right = after. Common in plastic surgery / hair clinic marketing. More dramatic than two separate thumbnails side by side.

**Consent checkbox** — before "Generate", staff checks: *"Prospect agreed this photo is sent to OpenAI for an illustrative preview only; not medical advice."* Protects clinic and sets expectations.

---

## Current state audit (2026-06-13)

| Area | Status | Notes |
|------|--------|-------|
| Upload UI | ✅ | Drag-drop, 8 MB limit client-side |
| Goal picker | ✅ | 3 goals with labels |
| API route | ✅ | Validation, OpenAI edit |
| Error handling | ⚠️ | Raw OpenAI message may leak to UI |
| Tests | ❌ | None |
| i18n | ❌ | English only |
| Rate limiting | ❌ | None |
| Disclaimer | ⚠️ | Footer only, small text |
| Compare UX | ✅ | Before/after drag slider with keyboard support |
| CI | ❌ | No GitHub Actions |
