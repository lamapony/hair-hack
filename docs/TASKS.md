# Tasks: Hair Hack

**Backlog for Phase 1.** Living status → [STATUS.md](./STATUS.md).

Format: one task = one branch = one PR. Follow `incremental-implementation`: implement → test → verify → commit.

Status: `done` | `partial` | `pending`

---

## Phase 1.0 — Team setup

### T1.0.1 Git + GitHub — `done`

**Acceptance:**
- Remote `origin` → `https://github.com/lamapony/hair-hack.git`
- Initial commit pushed to `main`
- Collaborators invited on GitHub
- [COLLABORATION.md](./COLLABORATION.md) linked from README

---

## Phase 1.1 — Testing foundation

### T1.1.1 Add Vitest — `done`

### T1.1.2 Unit tests for validation helpers — `done`

### T1.1.3 Unit tests for prompts — `done`

### T1.1.4 API route tests (mocked OpenAI) — `done`

**Shipped:** `tests/unit/generate-route.test.ts` — 7 cases (500/400/200/429 provider + rate limit + 501 Hairgen).

---

## Phase 1.2 — API hardening

### T1.2.1 Shared validation module — `done`

### T1.2.2 User-safe error mapping — `done`

### T1.2.3 Client image resize — `done`

**Shipped:** `src/lib/client-image.ts` — downscale to 2048px max edge + re-encode before upload; accepts inputs up to 25 MB.

---

## Phase 1.3 — Rate limiting

### T1.3.1 IP rate limit middleware — `done`

### T1.3.2 Document env vars — `done`

---

## Phase 1.4 — Clinic demo UX

### T1.4.1 Before/after slider — `done`

**Skill:** `frontend-ui-engineering`

### T1.4.2 Consent + disclaimer (clinic) — `done`

**Skill:** `frontend-ui-engineering` + `security-and-hardening`  
**Legal:** [COMPLIANCE.md](./legal/COMPLIANCE.md) TL.1

### T1.4.3 Clinic-oriented copy pass — `done`

### T1.4.4 Loading UX — `done`

**Shipped:** `AbortController` on generate fetch; cancel button in loading panel; in-flight request aborted on goal change or new upload.

---

## Phase 1.5 — CI

### T1.5.1 GitHub Actions — `done`

---

## Phase 1.6 — OpenAI preview quality

### T1.6.1 Prompt tuning + image quality env — `done`

**Shipped:** Stronger per-goal prompts in `src/lib/prompts.ts`; `OPENAI_IMAGE_QUALITY` (default `medium`) in OpenAI provider.

**Remaining:** Visual QA on real clinic photos (hairline + full goals).

### T1.7.1 Fixture QA rubric — `done`

**Shipped:** [QA-RUBRIC.md](./QA-RUBRIC.md), [public/fixtures/README.md](../public/fixtures/README.md) (local-only clinic photos).

**Remaining:** Execute rubric on 3 fixtures × 3 goals; log results.

---

## Track 3D

### T3D.1 Hairgen.ai spike — `done` (no-go)

**Outcome (2026-06-15):** Do not integrate Hairgen — cost, mask complexity, limited 2.5D value vs OpenAI. No live trial. See [3D-API-EVAL.md](./3D-API-EVAL.md) decision log.

### T3D.2 Provider adapter design — `done`

OpenAI is the production provider. Hairgen spike code remains in `src/lib/providers/hairgen*.ts` but is **not supported** for clinics.

### T3D.3 Force HT outreach — `pending` (optional)

---

## Track LEGAL

### TL.1 Consent UI — `done` (→ T1.4.2)

### TL.2 Policy pages — `done`

### TL.3 Counsel review package — `partial`

**Shipped:** [legal/COUNSEL-PACKAGE.md](./legal/COUNSEL-PACKAGE.md) — briefing, doc index, counsel questions, sign-off gate, §10 handoff checklist.  
**Remaining:** **Send to counsel** — [COUNSEL-SEND.md](./legal/COUNSEL-SEND.md) (copy-paste email) → approved Privacy/Terms + sign-off in COMPLIANCE.md.

### TL.4 Deploy gate — `done`

**Shipped:** `LEGAL_PAGES_REQUIRED` + `COUNSEL_LEGAL_APPROVED` block `/api/generate` on Vercel production; `GET /api/health` for canary; [OPENAI-ENGINEERING-CHECKLIST.md](./legal/OPENAI-ENGINEERING-CHECKLIST.md).

**Acceptance:**
- [x] Production gate off by default (dev/preview unchanged)
- [x] 503 user-safe message when gated
- [x] Unit tests for gate + health route
- [x] Env documented in `.env.example`

**Before prod:** Complete OpenAI checklist; set `COUNSEL_LEGAL_APPROVED=true` only after counsel sign-off.

## Suggested order (agent-skills BUILD)

1. Push foundation commit (T1.0.1 + T1.1.x + T1.2.x + T1.5.1)
2. T1.4.2 / TL.1 — consent
3. T1.4.1 — slider
4. T1.4.3 — clinic copy
5. T1.3.1 — rate limits
6. T1.1.4 — route tests
7. ~~T3D.1 Hairgen~~ — closed no-go; focus on OpenAI quality

---

## Definition of done (per task)

- [ ] Acceptance criteria met
- [ ] `npm run check` passes
- [ ] Tests added/updated
- [ ] No secrets in diff
- [ ] [STATUS.md](./STATUS.md) updated
